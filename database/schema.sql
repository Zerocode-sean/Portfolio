-- =============================================================================
-- Portfolio Website Database Schema
-- =============================================================================

-- Create database
CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- =============================================================================
-- Contacts Table
-- =============================================================================
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    page_url TEXT,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    read_at TIMESTAMP NULL,
    replied_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_ip_address (ip_address)
) ENGINE=InnoDB;

-- =============================================================================
-- Projects Table
-- =============================================================================
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    long_description TEXT,
    image_url VARCHAR(500),
    gallery JSON,
    category VARCHAR(50),
    technologies JSON,
    live_url VARCHAR(500),
    github_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    sort_order INT DEFAULT 0,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_featured (featured),
    INDEX idx_status (status),
    INDEX idx_sort_order (sort_order),
    FULLTEXT KEY ft_search (title, description, long_description)
) ENGINE=InnoDB;

-- =============================================================================
-- Skills Table
-- =============================================================================
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    level INT NOT NULL CHECK (level >= 0 AND level <= 100),
    icon VARCHAR(100),
    description TEXT,
    years_experience DECIMAL(3,1),
    certified BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_level (level),
    INDEX idx_sort_order (sort_order),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- =============================================================================
-- Experience Table
-- =============================================================================
CREATE TABLE experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(200),
    company_url VARCHAR(500),
    location VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    technologies JSON,
    achievements JSON,
    type ENUM('work', 'education', 'volunteer', 'certification') DEFAULT 'work',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_start_date (start_date),
    INDEX idx_is_current (is_current),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB;

-- =============================================================================
-- Testimonials Table
-- =============================================================================
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(200),
    company VARCHAR(200),
    email VARCHAR(255),
    image_url VARCHAR(500),
    testimonial TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    featured BOOLEAN DEFAULT FALSE,
    approved BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_featured (featured),
    INDEX idx_approved (approved),
    INDEX idx_rating (rating),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB;

-- =============================================================================
-- Blog Posts Table
-- =============================================================================
CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    featured_image VARCHAR(500),
    category VARCHAR(50),
    tags JSON,
    status ENUM('draft', 'published', 'scheduled', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    reading_time INT,
    seo_title VARCHAR(200),
    seo_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    FULLTEXT KEY ft_content (title, excerpt, content)
) ENGINE=InnoDB;

-- =============================================================================
-- Newsletter Subscribers Table
-- =============================================================================
CREATE TABLE newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    status ENUM('active', 'unsubscribed', 'bounced') DEFAULT 'active',
    source VARCHAR(100),
    preferences JSON,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_subscribed_at (subscribed_at)
) ENGINE=InnoDB;

-- =============================================================================
-- Activity Logs Table
-- =============================================================================
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_action (action),
    INDEX idx_user_id (user_id),
    INDEX idx_ip_address (ip_address),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =============================================================================
-- Rate Limits Table
-- =============================================================================
CREATE TABLE rate_limits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(100) NOT NULL,
    action VARCHAR(50) DEFAULT 'general',
    requests INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_identifier (identifier),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =============================================================================
-- Email Logs Table
-- =============================================================================
CREATE TABLE email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(200),
    status ENUM('sent', 'failed', 'bounced') NOT NULL,
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_recipient (recipient),
    INDEX idx_status (status),
    INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB;

-- =============================================================================
-- Email Queue Table
-- =============================================================================
CREATE TABLE email_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(200),
    body LONGTEXT,
    reply_to VARCHAR(255),
    reply_to_name VARCHAR(100),
    priority ENUM('high', 'normal', 'low') DEFAULT 'normal',
    status ENUM('pending', 'processing', 'sent', 'failed') DEFAULT 'pending',
    attempts INT DEFAULT 0,
    send_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_send_at (send_at),
    INDEX idx_recipient (recipient)
) ENGINE=InnoDB;

-- =============================================================================
-- Settings Table
-- =============================================================================
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB;

-- =============================================================================
-- Analytics Table
-- =============================================================================
CREATE TABLE analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    user_agent TEXT,
    ip_address VARCHAR(45),
    session_id VARCHAR(100),
    event_type VARCHAR(50),
    event_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_page_url (page_url),
    INDEX idx_event_type (event_type),
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =============================================================================
-- Insert Sample Data
-- =============================================================================

-- Sample Skills
INSERT INTO skills (name, category, level, icon, description, years_experience, sort_order) VALUES
('HTML5', 'Frontend', 95, 'fab fa-html5', 'Semantic markup and modern HTML5 features', 5.0, 1),
('CSS3', 'Frontend', 90, 'fab fa-css3-alt', 'Advanced CSS, Flexbox, Grid, and animations', 5.0, 2),
('JavaScript', 'Frontend', 85, 'fab fa-js-square', 'ES6+, DOM manipulation, and modern JS frameworks', 4.0, 3),
('React', 'Frontend', 80, 'fab fa-react', 'Component-based UI development', 3.0, 4),
('PHP', 'Backend', 85, 'fab fa-php', 'Server-side development and API creation', 4.0, 5),
('MySQL', 'Backend', 80, 'fas fa-database', 'Database design and optimization', 4.0, 6),
('Node.js', 'Backend', 75, 'fab fa-node-js', 'Server-side JavaScript development', 2.5, 7),
('Git', 'Tools', 90, 'fab fa-git-alt', 'Version control and collaboration', 5.0, 8),
('Figma', 'Design', 75, 'fab fa-figma', 'UI/UX design and prototyping', 3.0, 9),
('Docker', 'DevOps', 70, 'fab fa-docker', 'Containerization and deployment', 2.0, 10);

-- Sample Projects
INSERT INTO projects (title, slug, description, long_description, category, technologies, live_url, github_url, featured, status, sort_order) VALUES
('E-Commerce Platform', 'ecommerce-platform', 'A full-featured e-commerce website with modern design and functionality', 'Built a comprehensive e-commerce platform featuring user authentication, product catalog, shopping cart, payment integration with Stripe, order management, and admin dashboard. The project includes inventory management, customer reviews, and email notifications.', 'web', '["PHP", "MySQL", "JavaScript", "CSS", "Bootstrap", "Stripe API"]', 'https://example.com/ecommerce', 'https://github.com/username/ecommerce', true, 'published', 1),

('Task Management App', 'task-management-app', 'React-based task management application with real-time updates', 'Developed a collaborative task management application using React and Node.js. Features include drag-and-drop task organization, real-time updates using Socket.io, team collaboration, file attachments, and project analytics. The app supports multiple project boards and user role management.', 'web', '["React", "Node.js", "MongoDB", "Socket.io", "Express", "JWT"]', 'https://example.com/taskmanager', 'https://github.com/username/taskmanager', true, 'published', 2),

('Restaurant Website', 'restaurant-website', 'Modern restaurant website with online ordering system', 'Created a responsive restaurant website featuring an interactive menu, table reservation system, online ordering with payment integration, and customer review system. The site includes an admin panel for menu management and order tracking.', 'web', '["HTML", "CSS", "JavaScript", "PHP", "MySQL"]', 'https://example.com/restaurant', 'https://github.com/username/restaurant', false, 'published', 3),

('Weather Dashboard', 'weather-dashboard', 'Interactive weather application with detailed forecasts', 'Built a comprehensive weather application that provides current conditions, 7-day forecasts, weather maps, and severe weather alerts. The app uses multiple weather APIs and features location-based services, favorite locations, and weather widgets.', 'mobile', '["React Native", "Weather API", "Maps API", "Redux"]', 'https://example.com/weather', 'https://github.com/username/weather', true, 'published', 4);

-- Sample Experience
INSERT INTO experience (title, company, location, start_date, end_date, is_current, description, type, sort_order) VALUES
('Senior Web Developer', 'Tech Solutions Inc.', 'New York, NY', '2022-01-01', NULL, true, 'Lead development of client web applications using modern technologies. Collaborate with design and product teams to deliver high-quality solutions.', 'work', 1),
('Full Stack Developer', 'Digital Agency', 'San Francisco, CA', '2020-03-01', '2021-12-31', false, 'Developed and maintained multiple client websites and web applications. Worked with PHP, JavaScript, and various CMS platforms.', 'work', 2),
('Bachelor of Computer Science', 'University of Technology', 'Boston, MA', '2016-09-01', '2020-05-31', false, 'Graduated with honors. Focused on web technologies, software engineering, and database systems.', 'education', 3);

-- Sample Testimonials
INSERT INTO testimonials (name, position, company, testimonial, rating, featured, approved, sort_order) VALUES
('Sarah Johnson', 'CEO', 'TechStart Inc.', 'Working with this developer was an absolute pleasure. The attention to detail and quality of work exceeded our expectations. Highly recommended!', 5, true, true, 1),
('Michael Chen', 'Product Manager', 'Digital Solutions', 'Outstanding work! The project was delivered on time and the communication throughout the process was excellent. Looking forward to future collaborations.', 5, true, true, 2),
('Emily Rodriguez', 'Marketing Director', 'Creative Agency', 'The website design and functionality are exactly what we needed. Professional, responsive, and user-friendly. Couldn\'t ask for better service!', 5, true, true, 3),
('David Thompson', 'Founder', 'E-commerce Platform', 'Incredible development skills and creative problem-solving. The final product not only met but exceeded all our requirements. Truly impressed!', 5, false, true, 4);

-- Sample Settings
INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Your Portfolio', 'string', 'Website name'),
('site_email', 'your.email@example.com', 'string', 'Contact email address'),
('admin_email', 'admin@example.com', 'string', 'Admin notification email'),
('contact_form_enabled', 'true', 'boolean', 'Enable/disable contact form'),
('newsletter_enabled', 'true', 'boolean', 'Enable/disable newsletter signup'),
('analytics_enabled', 'true', 'boolean', 'Enable/disable analytics tracking'),
('maintenance_mode', 'false', 'boolean', 'Enable/disable maintenance mode'),
('max_contact_submissions_per_hour', '10', 'number', 'Rate limit for contact form'),
('social_links', '{"linkedin": "https://linkedin.com/in/yourprofile", "github": "https://github.com/yourusername", "twitter": "https://twitter.com/yourhandle"}', 'json', 'Social media links');

-- =============================================================================
-- Create Views for Common Queries
-- =============================================================================

-- Active projects view
CREATE VIEW active_projects AS
SELECT 
    id, title, slug, description, image_url, category, 
    technologies, live_url, github_url, featured, views, likes,
    created_at, updated_at
FROM projects 
WHERE status = 'published'
ORDER BY featured DESC, sort_order ASC, created_at DESC;

-- Contact summary view
CREATE VIEW contact_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_contacts,
    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_contacts,
    COUNT(CASE WHEN status = 'read' THEN 1 END) as read_contacts,
    COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied_contacts
FROM contacts
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Popular projects view
CREATE VIEW popular_projects AS
SELECT 
    p.*, 
    (p.views * 0.7 + p.likes * 0.3) as popularity_score
FROM projects p
WHERE p.status = 'published'
ORDER BY popularity_score DESC, p.created_at DESC;

-- =============================================================================
-- Create Stored Procedures
-- =============================================================================

DELIMITER //

-- Get dashboard statistics
CREATE PROCEDURE GetDashboardStats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM contacts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as contacts_this_month,
        (SELECT COUNT(*) FROM contacts WHERE status = 'new') as unread_contacts,
        (SELECT COUNT(*) FROM projects WHERE status = 'published') as published_projects,
        (SELECT SUM(views) FROM projects) as total_project_views,
        (SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active') as newsletter_subscribers,
        (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') as published_posts;
END //

-- Clean old data
CREATE PROCEDURE CleanOldData()
BEGIN
    -- Clean old activity logs (older than 1 year)
    DELETE FROM activity_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
    
    -- Clean old rate limits (older than 1 day)
    DELETE FROM rate_limits WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 DAY);
    
    -- Clean old email logs (older than 6 months)
    DELETE FROM email_logs WHERE sent_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);
    
    -- Clean old analytics (older than 2 years)
    DELETE FROM analytics WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR);
    
    SELECT ROW_COUNT() as records_deleted;
END //

DELIMITER ;

-- =============================================================================
-- Create Events for Automated Tasks
-- =============================================================================

-- Enable event scheduler
SET GLOBAL event_scheduler = ON;

-- Clean old data daily
CREATE EVENT IF NOT EXISTS clean_old_data
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
  CALL CleanOldData();

-- =============================================================================
-- Create Triggers
-- =============================================================================

-- Update project popularity when views/likes change
DELIMITER //

CREATE TRIGGER update_project_popularity 
AFTER UPDATE ON projects
FOR EACH ROW
BEGIN
    IF OLD.views != NEW.views OR OLD.likes != NEW.likes THEN
        INSERT INTO analytics (event_type, event_data, created_at) 
        VALUES ('project_engagement', JSON_OBJECT('project_id', NEW.id, 'views', NEW.views, 'likes', NEW.likes), NOW());
    END IF;
END //

DELIMITER ;

-- =============================================================================
-- Grant Permissions (adjust as needed)
-- =============================================================================

-- Create a dedicated user for the application
-- CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON portfolio_db.* TO 'portfolio_user'@'localhost';
-- FLUSH PRIVILEGES;
