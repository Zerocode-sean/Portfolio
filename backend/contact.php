<?php
// =============================================================================
// Contact Form Handler
// =============================================================================

require_once 'config.php';
require_once 'email.php';

// Set content type and CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSONResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

try {
    // Rate limiting
    $clientIP = getClientIP();
    if (!checkRateLimit($clientIP)) {
        sendJSONResponse([
            'success' => false, 
            'message' => 'Too many requests. Please try again later.'
        ], 429);
    }

    // Get and sanitize input data
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $subject = sanitizeInput($_POST['subject'] ?? '');
    $message = sanitizeInput($_POST['message'] ?? '');
    
    // Additional data
    $timestamp = $_POST['timestamp'] ?? date('Y-m-d H:i:s');
    $userAgent = $_POST['user_agent'] ?? $_SERVER['HTTP_USER_AGENT'] ?? '';
    $pageUrl = $_POST['page_url'] ?? '';
    
    // Validation
    $errors = validateContactForm($name, $email, $subject, $message);
    
    if (!empty($errors)) {
        sendJSONResponse([
            'success' => false, 
            'message' => 'Validation failed',
            'errors' => $errors
        ], 400);
    }
    
    // Check for spam patterns
    if (isSpamMessage($name, $email, $subject, $message)) {
        logActivity('spam_detected', [
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'ip' => $clientIP
        ]);
        
        // Return success to not reveal spam detection
        sendJSONResponse(['success' => true, 'message' => 'Message sent successfully']);
    }
    
    // Verify reCAPTCHA if provided
    if (isset($_POST['recaptcha_response'])) {
        if (!verifyRecaptcha($_POST['recaptcha_response'])) {
            sendJSONResponse([
                'success' => false, 
                'message' => 'reCAPTCHA verification failed'
            ], 400);
        }
    }
    
    // Prepare data for database
    $contactData = [
        'name' => $name,
        'email' => $email,
        'subject' => $subject,
        'message' => $message,
        'ip_address' => $clientIP,
        'user_agent' => $userAgent,
        'page_url' => $pageUrl,
        'status' => 'new',
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    // Save to database
    $db = Database::getInstance();
    $contactId = $db->insert('contacts', $contactData);
    
    if (!$contactId) {
        throw new Exception('Failed to save contact message');
    }
    
    // Send email notifications
    $emailSent = sendContactNotifications($contactData, $contactId);
    
    if (!$emailSent) {
        // Log the error but don't fail the request
        error_log('Failed to send email notifications for contact ID: ' . $contactId);
    }
    
    // Log successful contact
    logActivity('contact_submitted', [
        'contact_id' => $contactId,
        'name' => $name,
        'email' => $email,
        'subject' => $subject
    ]);
    
    // Send success response
    sendJSONResponse([
        'success' => true, 
        'message' => 'Message sent successfully! I\'ll get back to you soon.',
        'contact_id' => $contactId
    ]);
    
} catch (Exception $e) {
    error_log('Contact form error: ' . $e->getMessage());
    
    sendJSONResponse([
        'success' => false, 
        'message' => 'An error occurred while sending your message. Please try again.'
    ], 500);
}

// =============================================================================
// Validation Functions
// =============================================================================

function validateContactForm($name, $email, $subject, $message) {
    $errors = [];
    
    // Name validation
    if (empty($name)) {
        $errors['name'] = 'Name is required';
    } elseif (strlen($name) < 2) {
        $errors['name'] = 'Name must be at least 2 characters';
    } elseif (strlen($name) > 100) {
        $errors['name'] = 'Name must not exceed 100 characters';
    } elseif (!preg_match('/^[a-zA-Z\s\-\'\.]+$/u', $name)) {
        $errors['name'] = 'Name contains invalid characters';
    }
    
    // Email validation
    if (empty($email)) {
        $errors['email'] = 'Email is required';
    } elseif (!validateEmail($email)) {
        $errors['email'] = 'Please enter a valid email address';
    } elseif (strlen($email) > 255) {
        $errors['email'] = 'Email address is too long';
    }
    
    // Subject validation
    if (empty($subject)) {
        $errors['subject'] = 'Subject is required';
    } elseif (strlen($subject) < 5) {
        $errors['subject'] = 'Subject must be at least 5 characters';
    } elseif (strlen($subject) > 200) {
        $errors['subject'] = 'Subject must not exceed 200 characters';
    }
    
    // Message validation
    if (empty($message)) {
        $errors['message'] = 'Message is required';
    } elseif (strlen($message) < 10) {
        $errors['message'] = 'Message must be at least 10 characters';
    } elseif (strlen($message) > 5000) {
        $errors['message'] = 'Message must not exceed 5000 characters';
    }
    
    return $errors;
}

// =============================================================================
// Spam Detection
// =============================================================================

function isSpamMessage($name, $email, $subject, $message) {
    $spamKeywords = [
        'viagra', 'cialis', 'casino', 'lottery', 'winner', 'congratulations',
        'million dollars', 'inheritance', 'nigerian prince', 'urgent',
        'click here', 'act now', 'limited time', 'free money', 'make money fast',
        'work from home', 'lose weight', 'diet pills', 'enlargement'
    ];
    
    $content = strtolower($name . ' ' . $email . ' ' . $subject . ' ' . $message);
    
    foreach ($spamKeywords as $keyword) {
        if (strpos($content, $keyword) !== false) {
            return true;
        }
    }
    
    // Check for excessive links
    if (preg_match_all('/https?:\/\//', $message) > 3) {
        return true;
    }
    
    // Check for excessive caps
    $capsCount = preg_match_all('/[A-Z]/', $message);
    $totalChars = strlen(preg_replace('/[^A-Za-z]/', '', $message));
    if ($totalChars > 0 && ($capsCount / $totalChars) > 0.5) {
        return true;
    }
    
    // Check for suspicious email patterns
    $suspiciousEmailPatterns = [
        '/.*@.*\.tk$/',
        '/.*@.*\.ml$/',
        '/.*@.*\.ga$/',
        '/.*@.*\.cf$/',
        '/^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}$/i' // Very simple email pattern
    ];
    
    foreach ($suspiciousEmailPatterns as $pattern) {
        if (preg_match($pattern, $email)) {
            return true;
        }
    }
    
    return false;
}

// =============================================================================
// Email Notification Functions
// =============================================================================

function sendContactNotifications($contactData, $contactId) {
    try {
        $emailService = new EmailService();
        
        // Send notification to admin
        $adminEmailSent = sendAdminNotification($emailService, $contactData, $contactId);
        
        // Send auto-reply to user
        $autoReplySent = sendAutoReply($emailService, $contactData);
        
        return $adminEmailSent && $autoReplySent;
        
    } catch (Exception $e) {
        error_log('Email notification error: ' . $e->getMessage());
        return false;
    }
}

function sendAdminNotification($emailService, $contactData, $contactId) {
    $subject = 'New Contact Form Submission - ' . $contactData['subject'];
    
    $body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6366f1; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #374151; }
            .value { background: white; padding: 10px; border-radius: 5px; margin-top: 5px; }
            .footer { background: #e5e7eb; padding: 15px; text-align: center; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Contact ID:</div>
                    <div class='value'>#" . $contactId . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Name:</div>
                    <div class='value'>" . htmlspecialchars($contactData['name']) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Email:</div>
                    <div class='value'>" . htmlspecialchars($contactData['email']) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Subject:</div>
                    <div class='value'>" . htmlspecialchars($contactData['subject']) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Message:</div>
                    <div class='value'>" . nl2br(htmlspecialchars($contactData['message'])) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>IP Address:</div>
                    <div class='value'>" . $contactData['ip_address'] . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Submitted:</div>
                    <div class='value'>" . $contactData['created_at'] . "</div>
                </div>
            </div>
            <div class='footer'>
                <p>This email was sent from your portfolio contact form.</p>
            </div>
        </div>
    </body>
    </html>";
    
    return $emailService->sendEmail(
        ADMIN_EMAIL,
        $subject,
        $body,
        $contactData['email'], // Reply-to
        $contactData['name']
    );
}

function sendAutoReply($emailService, $contactData) {
    $subject = 'Thank you for contacting me - ' . $contactData['subject'];
    
    $body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6366f1; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; }
            .message-box { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { background: #e5e7eb; padding: 15px; text-align: center; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Thank You for Your Message!</h2>
            </div>
            <div class='content'>
                <p>Hi " . htmlspecialchars($contactData['name']) . ",</p>
                
                <p>Thank you for reaching out! I've received your message and I appreciate you taking the time to contact me.</p>
                
                <div class='message-box'>
                    <strong>Your message:</strong><br>
                    <em>Subject: " . htmlspecialchars($contactData['subject']) . "</em><br><br>
                    " . nl2br(htmlspecialchars($contactData['message'])) . "
                </div>
                
                <p>I'll review your message and get back to you as soon as possible, typically within 24-48 hours during business days.</p>
                
                <p>If your message is urgent, you can also reach me directly at " . SITE_EMAIL . ".</p>
                
                <p>Best regards,<br>
                <strong>Your Name</strong></p>
            </div>
            <div class='footer'>
                <p>This is an automated response. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>";
    
    return $emailService->sendEmail(
        $contactData['email'],
        $subject,
        $body,
        SITE_EMAIL,
        SITE_NAME
    );
}

// =============================================================================
// Additional Utility Functions
// =============================================================================

function getContactStats() {
    $db = Database::getInstance();
    
    $stats = [
        'total' => 0,
        'today' => 0,
        'this_week' => 0,
        'this_month' => 0,
        'unread' => 0
    ];
    
    try {
        // Total contacts
        $result = $db->fetch("SELECT COUNT(*) as count FROM contacts");
        $stats['total'] = $result['count'];
        
        // Today's contacts
        $result = $db->fetch("SELECT COUNT(*) as count FROM contacts WHERE DATE(created_at) = CURDATE()");
        $stats['today'] = $result['count'];
        
        // This week's contacts
        $result = $db->fetch("SELECT COUNT(*) as count FROM contacts WHERE YEARWEEK(created_at) = YEARWEEK(NOW())");
        $stats['this_week'] = $result['count'];
        
        // This month's contacts
        $result = $db->fetch("SELECT COUNT(*) as count FROM contacts WHERE YEAR(created_at) = YEAR(NOW()) AND MONTH(created_at) = MONTH(NOW())");
        $stats['this_month'] = $result['count'];
        
        // Unread contacts
        $result = $db->fetch("SELECT COUNT(*) as count FROM contacts WHERE status = 'new'");
        $stats['unread'] = $result['count'];
        
    } catch (Exception $e) {
        error_log('Error fetching contact stats: ' . $e->getMessage());
    }
    
    return $stats;
}

function markContactAsRead($contactId) {
    $db = Database::getInstance();
    
    return $db->update(
        'contacts',
        ['status' => 'read', 'read_at' => date('Y-m-d H:i:s')],
        'id = ?',
        [$contactId]
    );
}

function deleteOldContacts($days = 365) {
    $db = Database::getInstance();
    
    $sql = "DELETE FROM contacts WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)";
    return $db->query($sql, [$days]);
}
?>
