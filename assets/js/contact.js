// =============================================================================
// Contact JavaScript - Portfolio Website
// =============================================================================

// Contact form configuration
const contactConfig = {
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phoneRegex: /^[\+]?[1-9][\d]{0,15}$/,
    minNameLength: 2,
    minMessageLength: 10,
    maxMessageLength: 1000
};

// Social links configuration
const socialLinksConfig = {
    whatsapp: {
        baseUrl: 'https://wa.me/',
        message: 'Hi%20John,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!',
        phone: '254723396228',
        icon: 'fab fa-whatsapp',
        label: 'Contact via WhatsApp',
        title: 'Chat on WhatsApp'
    },
    github: {
        baseUrl: 'https://github.com/',
        username: 'Zerocode-sean',
        icon: 'fab fa-github',
        label: 'Visit GitHub profile',
        title: 'View GitHub Profile'
    },
    twitter: {
        baseUrl: 'https://x.com/',
        username: '_mutua1',
        icon: 'fab fa-twitter',
        label: 'Follow on X (Twitter)',
        title: 'Follow on X'
    },
    instagram: {
        baseUrl: 'https://www.instagram.com/',
        username: 'browshawnmutua',
        icon: 'fab fa-instagram',
        label: 'Follow on Instagram',
        title: 'Follow on Instagram'
    },
    tiktok: {
        baseUrl: 'https://www.tiktok.com/@',
        username: 'tech_hub599',
        icon: 'fab fa-tiktok',
        label: 'Follow on TikTok',
        title: 'Follow on TikTok'
    }
};

// Testimonials data
const testimonialsData = [
    {
        id: 1,
        name: "Sarah Johnson",
        position: "CEO, TechStart Inc.",
        image: "assets/images/image4.jpg",
        text: "Working with this developer was an absolute pleasure. The attention to detail and quality of work exceeded our expectations. Highly recommended!"
    },
    {
        id: 2,
        name: "Michael Chen",
        position: "Product Manager, Digital Solutions",
        image: "assets/images/image3.jpg",
        text: "Outstanding work! The project was delivered on time and the communication throughout the process was excellent. Looking forward to future collaborations."
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        position: "Marketing Director, Creative Agency",
        image: "assets/images/image1.jpg",
        text: "The website design and functionality are exactly what we needed. Professional, responsive, and user-friendly. Couldn't ask for better service!"
    },
    {
        id: 4,
        name: "David Thompson",
        position: "Founder, E-commerce Platform",
        image: "assets/images/image2.jpg",
        text: "Incredible development skills and creative problem-solving. The final product not only met but exceeded all our requirements. Truly impressed!"
    }
];

// Global variables
let currentTestimonial = 0;
let testimonialInterval;

// =============================================================================
// Initialize Contact Features
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeTestimonials();
    initializeFormValidation();
    initializeContactAnimations();
});

// =============================================================================
// Contact Form Initialization
// =============================================================================
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Form submission handler
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        // Floating labels
        initializeFloatingLabels();
    }
}

// =============================================================================
// Floating Labels
// =============================================================================
function initializeFloatingLabels() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            // Check initial state
            updateLabelPosition(input, label);
            
            // Focus events
            input.addEventListener('focus', () => {
                label.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                updateLabelPosition(input, label);
            });
            
            // Input events
            input.addEventListener('input', () => {
                updateLabelPosition(input, label);
            });
        }
    });
}

function updateLabelPosition(input, label) {
    if (input.value.length > 0 || input === document.activeElement) {
        label.classList.add('focused');
    } else {
        label.classList.remove('focused');
    }
}

// =============================================================================
// Form Validation
// =============================================================================
function initializeFormValidation() {
    // Add custom validation styles
    const validationStyles = document.createElement('style');
    validationStyles.textContent = `
        .form-group.error input,
        .form-group.error textarea {
            border-color: var(--error-color);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .form-group.success input,
        .form-group.success textarea {
            border-color: var(--success-color);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        
        .field-error {
            color: var(--error-color);
            font-size: var(--font-size-sm);
            margin-top: 5px;
            display: none;
        }
        
        .form-group.error .field-error {
            display: block;
        }
        
        .field-success {
            color: var(--success-color);
            font-size: var(--font-size-sm);
            margin-top: 5px;
            display: none;
        }
        
        .form-group.success .field-success {
            display: block;
        }
    `;
    document.head.appendChild(validationStyles);
    
    // Add error message elements
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        if (!group.querySelector('.field-error')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'field-error';
            group.appendChild(errorMsg);
        }
        
        if (!group.querySelector('.field-success')) {
            const successMsg = document.createElement('div');
            successMsg.className = 'field-success';
            successMsg.textContent = '✓ Looks good!';
            group.appendChild(successMsg);
        }
    });
}

function validateField(input) {
    const formGroup = input.closest('.form-group');
    const fieldName = input.name;
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous states
    formGroup.classList.remove('error', 'success');
    
    // Validation rules
    switch (fieldName) {
        case 'name':
            if (value.length === 0) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (value.length < contactConfig.minNameLength) {
                isValid = false;
                errorMessage = `Name must be at least ${contactConfig.minNameLength} characters`;
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Name can only contain letters and spaces';
            }
            break;
            
        case 'email':
            if (value.length === 0) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!contactConfig.emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'subject':
            if (value.length === 0) {
                isValid = false;
                errorMessage = 'Subject is required';
            } else if (value.length < 5) {
                isValid = false;
                errorMessage = 'Subject must be at least 5 characters';
            }
            break;
            
        case 'message':
            if (value.length === 0) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (value.length < contactConfig.minMessageLength) {
                isValid = false;
                errorMessage = `Message must be at least ${contactConfig.minMessageLength} characters`;
            } else if (value.length > contactConfig.maxMessageLength) {
                isValid = false;
                errorMessage = `Message must not exceed ${contactConfig.maxMessageLength} characters`;
            }
            break;
    }
    
    // Update UI based on validation result
    if (isValid) {
        formGroup.classList.add('success');
    } else {
        formGroup.classList.add('error');
        const errorElement = formGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    }
    
    return isValid;
}

function clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

// =============================================================================
// Form Submission
// =============================================================================
function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateForm(form)) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Prepare form data
    const formData = new FormData(form);
    
    // Add additional data
    formData.append('timestamp', new Date().toISOString());
    formData.append('user_agent', navigator.userAgent);
    formData.append('page_url', window.location.href);
    
    // Send form data
    submitContactForm(formData)
        .then(response => {
            if (response.success) {
                handleFormSuccess(form);
            } else {
                handleFormError(response.message || 'Failed to send message');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            handleFormError('An unexpected error occurred. Please try again.');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
        });
}

async function submitContactForm(formData) {
    try {
        // For static hosting, we'll use Formspree (free form handling service)
        // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
        // Or use other services like EmailJS, Netlify Forms, etc.
        
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            return { success: true, message: 'Message sent successfully!' };
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        // Fallback: For demo purposes, simulate success
        // In production, you'd want to show an error or use mailto: fallback
        console.log('Form data that would be sent:', Object.fromEntries(formData));
        return { success: true, message: 'Message received! (Demo mode - form data logged to console)' };
    }
}

function handleFormSuccess(form) {
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    
    // Reset form
    form.reset();
    
    // Remove validation classes
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('success', 'error', 'focused');
    });
    
    // Update floating labels
    const labels = form.querySelectorAll('label');
    labels.forEach(label => {
        label.classList.remove('focused');
    });
    
    // Trigger success animation
    triggerSuccessAnimation();
}

function handleFormError(message) {
    showNotification(message, 'error');
}

function triggerSuccessAnimation() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            contactSection.style.animation = '';
        }, 600);
    }
}

// =============================================================================
// Testimonials Slider
// =============================================================================
function initializeTestimonials() {
    renderTestimonials();
    startTestimonialSlider();
    initializeTestimonialControls();
}

function renderTestimonials() {
    const testimonialSlider = document.getElementById('testimonials-slider');
    if (!testimonialSlider) return;
    
    testimonialSlider.innerHTML = '';
    
    testimonialsData.forEach((testimonial, index) => {
        const testimonialCard = createTestimonialCard(testimonial, index);
        testimonialSlider.appendChild(testimonialCard);
    });
    
    // Show first testimonial
    showTestimonial(0);
}

function createTestimonialCard(testimonial, index) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('data-index', index);
    
    card.innerHTML = `
        <div class="testimonial-text">
            ${testimonial.text}
        </div>
        <div class="testimonial-author">
            <div class="author-image">
                <img src="${testimonial.image}" alt="${testimonial.name}" loading="lazy">
            </div>
            <div class="author-info">
                <h4>${testimonial.name}</h4>
                <p>${testimonial.position}</p>
            </div>
        </div>
    `;
    
    return card;
}

function showTestimonial(index) {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    testimonialCards.forEach((card, i) => {
        if (i === index) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    
    currentTestimonial = index;
    updateTestimonialIndicators();
}

function nextTestimonial() {
    const nextIndex = (currentTestimonial + 1) % testimonialsData.length;
    showTestimonial(nextIndex);
}

function prevTestimonial() {
    const prevIndex = currentTestimonial === 0 ? testimonialsData.length - 1 : currentTestimonial - 1;
    showTestimonial(prevIndex);
}

function startTestimonialSlider() {
    testimonialInterval = setInterval(nextTestimonial, 6000);
}

function stopTestimonialSlider() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
}

function initializeTestimonialControls() {
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevTestimonial();
            stopTestimonialSlider();
            startTestimonialSlider(); // Restart interval
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextTestimonial();
            stopTestimonialSlider();
            startTestimonialSlider(); // Restart interval
        });
    }
    
    // Pause on hover
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', stopTestimonialSlider);
        testimonialsSection.addEventListener('mouseleave', startTestimonialSlider);
    }
}

function updateTestimonialIndicators() {
    // Add indicators if they don't exist
    let indicatorsContainer = document.querySelector('.testimonial-indicators');
    
    if (!indicatorsContainer) {
        indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'testimonial-indicators';
        
        const sliderControls = document.querySelector('.slider-controls');
        if (sliderControls) {
            sliderControls.appendChild(indicatorsContainer);
        }
        
        // Create indicators
        testimonialsData.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'testimonial-indicator';
            indicator.setAttribute('data-index', index);
            indicator.addEventListener('click', () => {
                showTestimonial(index);
                stopTestimonialSlider();
                startTestimonialSlider();
            });
            indicatorsContainer.appendChild(indicator);
        });
        
        // Add indicator styles
        const indicatorStyles = document.createElement('style');
        indicatorStyles.textContent = `
            .testimonial-indicators {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-top: 20px;
            }
            
            .testimonial-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid var(--primary-color);
                background: transparent;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .testimonial-indicator.active {
                background: var(--primary-color);
            }
            
            .testimonial-indicator:hover {
                transform: scale(1.2);
            }
        `;
        document.head.appendChild(indicatorStyles);
    }
    
    // Update active indicator
    const indicators = document.querySelectorAll('.testimonial-indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentTestimonial) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// =============================================================================
// Contact Animations
// =============================================================================
function initializeContactAnimations() {
    // Animate contact items on scroll
    const contactItems = document.querySelectorAll('.contact-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    contactItems.forEach(item => {
        item.style.transform = 'translateY(30px)';
        item.style.opacity = '0';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
    
    // Social links hover effect
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-5px) rotate(5deg)';
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) rotate(0deg)';
        });
    });

    // Initialize social links functionality
    initializeSocialLinks();
}

// =============================================================================
// Social Links Functionality
// =============================================================================
function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach(link => {
        // Add click tracking and validation
        link.addEventListener('click', handleSocialLinkClick);

        // Add keyboard navigation support
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSocialLinkClick(e);
            }
        });

        // Preload link validation
        validateSocialLink(link);
    });

    // Add offline/online detection
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
}

function handleSocialLinkClick(event) {
    const link = event.currentTarget;
    const platform = link.dataset.platform;
    const href = link.href;

    // Add loading state
    link.classList.add('loading');

    // Track click analytics (if analytics is available)
    trackSocialLinkClick(platform, href);

    // Validate link before navigation
    if (!isValidUrl(href)) {
        event.preventDefault();
        handleSocialLinkError(link, 'Invalid link URL');
        return;
    }

    // Check if link is accessible (basic check)
    checkLinkAccessibility(href)
        .then(() => {
            link.classList.remove('loading');
            link.classList.add('success');

            // Remove success class after animation
            setTimeout(() => {
                link.classList.remove('success');
            }, 600);
        })
        .catch(() => {
            // Don't prevent navigation, but show warning
            link.classList.remove('loading');
            console.warn(`Link to ${platform} may not be accessible`);
        });
}

function validateSocialLink(link) {
    const platform = link.dataset.platform;
    const href = link.href;

    if (!href || href === '#') {
        handleSocialLinkError(link, `Invalid ${platform} link`);
        return false;
    }

    // Platform-specific validation
    const config = socialLinksConfig[platform];
    if (config) {
        const expectedUrl = buildSocialUrl(platform);
        if (href !== expectedUrl) {
            console.warn(`Social link URL mismatch for ${platform}. Expected: ${expectedUrl}, Got: ${href}`);
        }
    }

    return true;
}

function buildSocialUrl(platform) {
    const config = socialLinksConfig[platform];
    if (!config) return '#';

    switch (platform) {
        case 'whatsapp':
            return `${config.baseUrl}${config.phone}?text=${config.message}`;
        case 'github':
        case 'twitter':
        case 'instagram':
            return `${config.baseUrl}${config.username}`;
        case 'tiktok':
            return `${config.baseUrl}${config.username}`;
        default:
            return '#';
    }
}

function handleSocialLinkError(link, message) {
    link.classList.add('error');
    link.classList.remove('loading');

    // Show error notification
    showNotification(message, 'error', 3000);

    // Remove error class after animation
    setTimeout(() => {
        link.classList.remove('error');
    }, 500);

    console.error(`Social link error: ${message}`);
}

function checkLinkAccessibility(url) {
    // Basic accessibility check using fetch with timeout
    return new Promise((resolve, reject) => {
        // Only check external links
        if (!url.startsWith('http')) {
            resolve();
            return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        fetch(url, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal
        })
        .then(() => {
            clearTimeout(timeoutId);
            resolve();
        })
        .catch(() => {
            clearTimeout(timeoutId);
            reject();
        });
    });
}

function handleNetworkChange(event) {
    const socialLinks = document.querySelectorAll('.social-link');

    if (event.type === 'offline') {
        socialLinks.forEach(link => {
            link.setAttribute('aria-label', link.getAttribute('aria-label') + ' (Offline)');
            link.style.opacity = '0.6';
        });
    } else {
        socialLinks.forEach(link => {
            const originalLabel = link.getAttribute('aria-label').replace(' (Offline)', '');
            link.setAttribute('aria-label', originalLabel);
            link.style.opacity = '1';
        });
    }
}

function trackSocialLinkClick(platform, url) {
    // Basic click tracking - can be extended with analytics
    const trackingData = {
        platform: platform,
        url: url,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };

    // Store in localStorage for basic analytics
    try {
        const existingData = JSON.parse(localStorage.getItem('socialLinkClicks') || '[]');
        existingData.push(trackingData);

        // Keep only last 100 clicks
        if (existingData.length > 100) {
            existingData.shift();
        }

        localStorage.setItem('socialLinkClicks', JSON.stringify(existingData));
    } catch (error) {
        console.warn('Unable to track social link click:', error);
    }

    console.log(`Social link clicked: ${platform}`, trackingData);
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// =============================================================================
// Character Counter for Message Field
// =============================================================================
function initializeCharacterCounter() {
    const messageField = document.getElementById('message');
    if (!messageField) return;
    
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin-top: 5px;
    `;
    
    messageField.parentNode.appendChild(counter);
    
    function updateCounter() {
        const currentLength = messageField.value.length;
        const maxLength = contactConfig.maxMessageLength;
        
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9) {
            counter.style.color = 'var(--warning-color)';
        } else if (currentLength > maxLength) {
            counter.style.color = 'var(--error-color)';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
    }
    
    messageField.addEventListener('input', updateCounter);
    updateCounter(); // Initial count
}

// Initialize character counter when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCharacterCounter);

// =============================================================================
// Notification System (Enhanced)
// =============================================================================
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Auto hide
    setTimeout(() => {
        hideNotification(notification);
    }, duration);
    
    return notification;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// =============================================================================
// Utility Functions
// =============================================================================
function sanitizeInput(input) {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
}

function formatPhoneNumber(phone) {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 11) {
        return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
    }
    
    return phone; // Return original if no formatting rules match
}

// =============================================================================
// Error Handling
// =============================================================================
window.addEventListener('error', (e) => {
    if (e.filename && e.filename.includes('contact.js')) {
        console.error('Contact JavaScript Error:', e.error);
        showNotification('Something went wrong. Please refresh the page and try again.', 'error');
    }
});
