<?php
// =============================================================================
// Email Service Class
// =============================================================================

require_once 'config.php';

class EmailService {
    private $host;
    private $username;
    private $password;
    private $port;
    private $encryption;
    
    public function __construct() {
        $this->host = SMTP_HOST;
        $this->username = SMTP_USERNAME;
        $this->password = SMTP_PASSWORD;
        $this->port = SMTP_PORT;
        $this->encryption = 'tls';
    }
    
    /**
     * Send email using SMTP
     */
    public function sendEmail($to, $subject, $body, $replyTo = null, $replyToName = null, $isHTML = true) {
        try {
            // Create message headers
            $headers = $this->createHeaders($to, $subject, $replyTo, $replyToName, $isHTML);
            
            // Prepare email content
            $emailContent = $this->prepareEmailContent($headers, $body, $isHTML);
            
            // Send email using SMTP
            return $this->sendSMTP($to, $subject, $emailContent);
            
        } catch (Exception $e) {
            error_log('Email sending error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Create email headers
     */
    private function createHeaders($to, $subject, $replyTo, $replyToName, $isHTML) {
        $headers = [];
        
        // Basic headers
        $headers['From'] = $this->formatEmailAddress(SITE_EMAIL, SITE_NAME);
        $headers['To'] = $to;
        $headers['Subject'] = $subject;
        $headers['Date'] = date('r');
        $headers['Message-ID'] = '<' . uniqid() . '@' . parse_url(SITE_EMAIL, PHP_URL_HOST) . '>';
        
        // Reply-to header
        if ($replyTo) {
            $headers['Reply-To'] = $this->formatEmailAddress($replyTo, $replyToName);
        }
        
        // Content type
        if ($isHTML) {
            $headers['MIME-Version'] = '1.0';
            $headers['Content-Type'] = 'text/html; charset=UTF-8';
        } else {
            $headers['Content-Type'] = 'text/plain; charset=UTF-8';
        }
        
        // Additional headers
        $headers['X-Mailer'] = 'Portfolio Contact Form';
        $headers['X-Priority'] = '3';
        
        return $headers;
    }
    
    /**
     * Format email address with name
     */
    private function formatEmailAddress($email, $name = null) {
        if ($name) {
            return "\"$name\" <$email>";
        }
        return $email;
    }
    
    /**
     * Prepare email content
     */
    private function prepareEmailContent($headers, $body, $isHTML) {
        $content = '';
        
        // Add headers
        foreach ($headers as $key => $value) {
            if ($key !== 'Subject') {
                $content .= "$key: $value\r\n";
            }
        }
        
        $content .= "\r\n";
        
        // Add body
        if ($isHTML) {
            $content .= $this->addHTMLWrapper($body);
        } else {
            $content .= $body;
        }
        
        return $content;
    }
    
    /**
     * Add HTML wrapper for better email client compatibility
     */
    private function addHTMLWrapper($body) {
        return "<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>Email</title>
</head>
<body style=\"margin: 0; padding: 0; font-family: Arial, sans-serif;\">
    $body
</body>
</html>";
    }
    
    /**
     * Send email via SMTP
     */
    private function sendSMTP($to, $subject, $content) {
        // For this example, we'll use PHP's mail() function
        // In production, you should use a library like PHPMailer or SwiftMailer
        
        $headers = $this->extractHeadersForMail($content);
        $body = $this->extractBodyFromContent($content);
        
        return mail($to, $subject, $body, $headers);
    }
    
    /**
     * Extract headers for mail() function
     */
    private function extractHeadersForMail($content) {
        $parts = explode("\r\n\r\n", $content, 2);
        $headerLines = explode("\r\n", $parts[0]);
        
        $headers = [];
        foreach ($headerLines as $line) {
            if (strpos($line, ':') !== false) {
                list($key, $value) = explode(':', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Skip To and Subject headers (handled by mail() function)
                if (!in_array($key, ['To', 'Subject'])) {
                    $headers[] = "$key: $value";
                }
            }
        }
        
        return implode("\r\n", $headers);
    }
    
    /**
     * Extract body from email content
     */
    private function extractBodyFromContent($content) {
        $parts = explode("\r\n\r\n", $content, 2);
        return isset($parts[1]) ? $parts[1] : '';
    }
    
    /**
     * Send email using PHPMailer (alternative implementation)
     * Uncomment and use this if you have PHPMailer installed
     */
    /*
    public function sendEmailWithPHPMailer($to, $subject, $body, $replyTo = null, $replyToName = null, $isHTML = true) {
        require_once 'vendor/autoload.php'; // If using Composer
        // require_once 'path/to/PHPMailer/src/PHPMailer.php'; // If not using Composer
        // require_once 'path/to/PHPMailer/src/SMTP.php';
        // require_once 'path/to/PHPMailer/src/Exception.php';
        
        use PHPMailer\PHPMailer\PHPMailer;
        use PHPMailer\PHPMailer\SMTP;
        use PHPMailer\PHPMailer\Exception;
        
        try {
            $mail = new PHPMailer(true);
            
            // Server settings
            $mail->isSMTP();
            $mail->Host = $this->host;
            $mail->SMTPAuth = true;
            $mail->Username = $this->username;
            $mail->Password = $this->password;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = $this->port;
            
            // Recipients
            $mail->setFrom(SITE_EMAIL, SITE_NAME);
            $mail->addAddress($to);
            
            if ($replyTo) {
                $mail->addReplyTo($replyTo, $replyToName);
            }
            
            // Content
            $mail->isHTML($isHTML);
            $mail->Subject = $subject;
            $mail->Body = $isHTML ? $this->addHTMLWrapper($body) : $body;
            
            if ($isHTML) {
                $mail->AltBody = strip_tags($body);
            }
            
            $mail->send();
            return true;
            
        } catch (Exception $e) {
            error_log("PHPMailer Error: {$mail->ErrorInfo}");
            return false;
        }
    }
    */
    
    /**
     * Validate email address
     */
    public function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    /**
     * Create email template
     */
    public function createTemplate($templateName, $variables = []) {
        $templatePath = __DIR__ . "/templates/{$templateName}.html";
        
        if (!file_exists($templatePath)) {
            throw new Exception("Email template not found: $templateName");
        }
        
        $template = file_get_contents($templatePath);
        
        // Replace variables in template
        foreach ($variables as $key => $value) {
            $template = str_replace("{{$key}}", $value, $template);
        }
        
        return $template;
    }
    
    /**
     * Send email using template
     */
    public function sendTemplateEmail($to, $subject, $templateName, $variables = [], $replyTo = null, $replyToName = null) {
        try {
            $body = $this->createTemplate($templateName, $variables);
            return $this->sendEmail($to, $subject, $body, $replyTo, $replyToName, true);
        } catch (Exception $e) {
            error_log('Template email error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Send bulk emails
     */
    public function sendBulkEmails($recipients, $subject, $body, $replyTo = null, $replyToName = null, $isHTML = true) {
        $results = [];
        
        foreach ($recipients as $recipient) {
            $email = is_array($recipient) ? $recipient['email'] : $recipient;
            $name = is_array($recipient) ? ($recipient['name'] ?? '') : '';
            
            // Personalize body if name is provided
            $personalizedBody = $body;
            if ($name && strpos($body, '{{name}}') !== false) {
                $personalizedBody = str_replace('{{name}}', $name, $body);
            }
            
            $result = $this->sendEmail($email, $subject, $personalizedBody, $replyTo, $replyToName, $isHTML);
            $results[$email] = $result;
            
            // Small delay to avoid overwhelming the SMTP server
            usleep(100000); // 0.1 seconds
        }
        
        return $results;
    }
    
    /**
     * Create unsubscribe link
     */
    public function createUnsubscribeLink($email, $token = null) {
        if (!$token) {
            $token = $this->generateUnsubscribeToken($email);
        }
        
        $baseUrl = 'https://' . $_SERVER['HTTP_HOST'];
        return $baseUrl . "/unsubscribe.php?email=" . urlencode($email) . "&token=" . urlencode($token);
    }
    
    /**
     * Generate unsubscribe token
     */
    private function generateUnsubscribeToken($email) {
        return hash_hmac('sha256', $email, ENCRYPTION_KEY);
    }
    
    /**
     * Verify unsubscribe token
     */
    public function verifyUnsubscribeToken($email, $token) {
        $expectedToken = $this->generateUnsubscribeToken($email);
        return hash_equals($expectedToken, $token);
    }
    
    /**
     * Log email activity
     */
    public function logEmailActivity($to, $subject, $status, $errorMessage = null) {
        try {
            $db = Database::getInstance();
            
            $logData = [
                'recipient' => $to,
                'subject' => $subject,
                'status' => $status, // 'sent', 'failed'
                'error_message' => $errorMessage,
                'sent_at' => date('Y-m-d H:i:s')
            ];
            
            $db->insert('email_logs', $logData);
        } catch (Exception $e) {
            error_log('Email logging error: ' . $e->getMessage());
        }
    }
    
    /**
     * Get email statistics
     */
    public function getEmailStats($days = 30) {
        try {
            $db = Database::getInstance();
            
            $stats = [
                'total_sent' => 0,
                'total_failed' => 0,
                'success_rate' => 0,
                'daily_stats' => []
            ];
            
            // Total sent in the last X days
            $result = $db->fetch(
                "SELECT COUNT(*) as count FROM email_logs WHERE status = 'sent' AND sent_at >= DATE_SUB(NOW(), INTERVAL ? DAY)",
                [$days]
            );
            $stats['total_sent'] = $result['count'];
            
            // Total failed in the last X days
            $result = $db->fetch(
                "SELECT COUNT(*) as count FROM email_logs WHERE status = 'failed' AND sent_at >= DATE_SUB(NOW(), INTERVAL ? DAY)",
                [$days]
            );
            $stats['total_failed'] = $result['count'];
            
            // Calculate success rate
            $total = $stats['total_sent'] + $stats['total_failed'];
            if ($total > 0) {
                $stats['success_rate'] = round(($stats['total_sent'] / $total) * 100, 2);
            }
            
            // Daily stats
            $dailyStats = $db->fetchAll(
                "SELECT DATE(sent_at) as date, 
                        COUNT(*) as total,
                        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
                        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
                 FROM email_logs 
                 WHERE sent_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
                 GROUP BY DATE(sent_at)
                 ORDER BY date DESC",
                [$days]
            );
            
            $stats['daily_stats'] = $dailyStats;
            
            return $stats;
            
        } catch (Exception $e) {
            error_log('Email stats error: ' . $e->getMessage());
            return null;
        }
    }
}

// =============================================================================
// Email Queue System (for handling large volumes)
// =============================================================================

class EmailQueue {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    /**
     * Add email to queue
     */
    public function addToQueue($to, $subject, $body, $replyTo = null, $replyToName = null, $priority = 'normal', $sendAt = null) {
        $queueData = [
            'recipient' => $to,
            'subject' => $subject,
            'body' => $body,
            'reply_to' => $replyTo,
            'reply_to_name' => $replyToName,
            'priority' => $priority, // 'high', 'normal', 'low'
            'status' => 'pending',
            'send_at' => $sendAt ?: date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        return $this->db->insert('email_queue', $queueData);
    }
    
    /**
     * Process email queue
     */
    public function processQueue($limit = 50) {
        $emails = $this->db->fetchAll(
            "SELECT * FROM email_queue 
             WHERE status = 'pending' AND send_at <= NOW() 
             ORDER BY priority = 'high' DESC, created_at ASC 
             LIMIT ?",
            [$limit]
        );
        
        $emailService = new EmailService();
        $processed = 0;
        
        foreach ($emails as $email) {
            // Mark as processing
            $this->db->update(
                'email_queue',
                ['status' => 'processing'],
                'id = ?',
                [$email['id']]
            );
            
            // Send email
            $success = $emailService->sendEmail(
                $email['recipient'],
                $email['subject'],
                $email['body'],
                $email['reply_to'],
                $email['reply_to_name']
            );
            
            // Update status
            $newStatus = $success ? 'sent' : 'failed';
            $this->db->update(
                'email_queue',
                [
                    'status' => $newStatus,
                    'sent_at' => date('Y-m-d H:i:s'),
                    'attempts' => $email['attempts'] + 1
                ],
                'id = ?',
                [$email['id']]
            );
            
            $processed++;
            
            // Small delay to avoid overwhelming the SMTP server
            usleep(100000); // 0.1 seconds
        }
        
        return $processed;
    }
    
    /**
     * Retry failed emails
     */
    public function retryFailedEmails($maxAttempts = 3) {
        $failedEmails = $this->db->fetchAll(
            "SELECT * FROM email_queue 
             WHERE status = 'failed' AND attempts < ? 
             ORDER BY created_at ASC",
            [$maxAttempts]
        );
        
        foreach ($failedEmails as $email) {
            // Reset to pending for retry
            $this->db->update(
                'email_queue',
                ['status' => 'pending'],
                'id = ?',
                [$email['id']]
            );
        }
        
        return count($failedEmails);
    }
    
    /**
     * Clean old queue items
     */
    public function cleanOldItems($days = 30) {
        return $this->db->query(
            "DELETE FROM email_queue WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)",
            [$days]
        );
    }
}
?>
