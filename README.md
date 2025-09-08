# 🚀 Personal Portfolio Website

A modern, responsive personal portfolio website built with HTML, CSS, JavaScript, PHP, and MySQL. Features a beautiful design, smooth animations, contact form with backend processing, and a comprehensive admin system.

![Portfolio Preview](assets/images/portfolio-preview.jpg)

## ✨ Features

### Frontend

- **Modern Design**: Clean, professional design with appealing color schemes
- **Fully Responsive**: Works perfectly on all devices and screen sizes
- **Interactive Animations**: Smooth scrolling, fade-in effects, and micro-interactions
- **Dark/Light Theme**: Toggle between themes with preference persistence
- **Typed Text Animation**: Dynamic text animation in hero section
- **Project Filtering**: Filter projects by category with smooth transitions
- **Skills Visualization**: Animated progress bars and skill categories
- **Contact Form**: Comprehensive form with real-time validation
- **Testimonials Slider**: Automatic testimonial rotation with manual controls
- **SEO Optimized**: Meta tags, structured data, and semantic markup

### Backend

- **PHP Backend**: Clean, object-oriented PHP architecture
- **MySQL Database**: Comprehensive database schema with relationships
- **Email System**: SMTP email sending with templates and queue system
- **Contact Management**: Store and manage contact form submissions
- **Rate Limiting**: Prevent spam and abuse
- **Security Features**: Input sanitization, CSRF protection, SQL injection prevention
- **Analytics**: Track page views, user interactions, and form submissions
- **Admin Dashboard**: Manage content, view analytics, and handle contacts

### Technical Features

- **Progressive Web App**: Offline support and installable
- **Performance Optimized**: Lazy loading, minified assets, optimized images
- **Accessibility**: WCAG 2.1 AA compliant, keyboard navigation, screen reader support
- **Cross-browser Compatible**: Works on all modern browsers
- **Mobile-first Design**: Optimized for mobile devices
- **Loading Animations**: Beautiful loading screens and skeleton states

## 🛠️ Technology Stack

### Frontend

- **HTML5**: Semantic markup with modern features
- **CSS3**: Advanced styling with Flexbox, Grid, and animations
- **JavaScript (ES6+)**: Modern JavaScript with modules and async/await
- **Font Awesome**: Comprehensive icon library
- **Google Fonts**: Professional typography
- **AOS Library**: Animate On Scroll effects

### Backend

- **PHP 7.4+**: Server-side logic and API endpoints
- **MySQL 8.0+**: Relational database management
- **PDO**: Secure database interactions
- **SMTP**: Email delivery system
- **JSON APIs**: RESTful API endpoints

### Tools & Libraries

- **Git**: Version control
- **Composer**: PHP dependency management (optional)
- **npm**: JavaScript package management (optional)
- **Figma/Adobe XD**: Design and prototyping

## 📋 Requirements

- **Web Server**: Apache 2.4+ or Nginx 1.14+
- **PHP**: 7.4 or higher
- **MySQL**: 8.0 or higher (or MariaDB 10.3+)
- **Extensions**: PDO, PDO_MySQL, OpenSSL, JSON, mbstring
- **Optional**: Composer for PHP dependencies

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website
```

### 2. Database Setup

```bash
# Create database and import schema
mysql -u root -p < database/schema.sql

# Or import via phpMyAdmin
# Navigate to phpMyAdmin > Import > Choose database/schema.sql
```

### 3. Configure Database Connection

Edit `backend/config.php` and update database credentials:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'portfolio_db');
```

### 4. Configure Email Settings

Update email configuration in `backend/config.php`:

```php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('SMTP_PORT', 587);
```

### 5. Set Permissions

```bash
# Make upload directory writable
chmod 755 assets/uploads/
chown www-data:www-data assets/uploads/

# Set proper permissions for backend files
chmod 644 backend/*.php
```

### 6. Update Content

1. Replace placeholder images in `assets/images/`
2. Update personal information in `index.html`
3. Modify project data in `assets/js/projects.js`
4. Customize colors and styles in `assets/css/style.css`

## 📁 Project Structure

```
portfolio-website/
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   ├── style.css          # Main stylesheet
│   │   └── responsive.css     # Responsive design rules
│   ├── js/
│   │   ├── main.js           # Core JavaScript functionality
│   │   ├── projects.js       # Projects management
│   │   └── contact.js        # Contact form and testimonials
│   ├── images/
│   │   ├── profile.jpg       # Profile picture
│   │   ├── projects/         # Project screenshots
│   │   └── testimonials/     # Client photos
│   └── uploads/              # File upload directory
├── backend/
│   ├── config.php            # Database and site configuration
│   ├── contact.php           # Contact form handler
│   └── email.php             # Email service class
├── database/
│   └── schema.sql            # Database schema and sample data
├── admin/                    # Admin dashboard (optional)
├── docs/                     # Documentation
└── README.md                 # This file
```

## 🎨 Customization

### Colors and Branding

Update CSS custom properties in `assets/css/style.css`:

```css
:root {
  --primary-color: #6366f1; /* Main brand color */
  --secondary-color: #06b6d4; /* Secondary color */
  --accent-color: #f59e0b; /* Accent color */
  /* Add your custom colors */
}
```

### Content Sections

1. **Hero Section**: Update in `index.html` lines 50-85
2. **About Section**: Modify in `index.html` lines 90-140
3. **Skills**: Edit skills data in `assets/js/main.js`
4. **Projects**: Update project data in `assets/js/projects.js`
5. **Experience**: Modify timeline in `index.html` lines 250-300

### Adding New Sections

1. Add HTML structure in `index.html`
2. Add corresponding CSS in `assets/css/style.css`
3. Add JavaScript functionality if needed
4. Update navigation menu

## 📧 Contact Form Setup

### Email Configuration

1. **Gmail SMTP**: Use App Passwords for authentication
2. **SendGrid**: For high-volume email sending
3. **Amazon SES**: For AWS-hosted applications
4. **Mailgun**: Alternative email service

### Testing Contact Form

```bash
# Test with curl
curl -X POST http://your-domain.com/backend/contact.php \
  -d "name=John Doe" \
  -d "email=john@example.com" \
  -d "subject=Test Message" \
  -d "message=This is a test message"
```

## 🔒 Security Features

- **Input Sanitization**: All user inputs are sanitized
- **SQL Injection Prevention**: Using prepared statements
- **CSRF Protection**: Token-based CSRF prevention
- **Rate Limiting**: Prevent spam and abuse
- **XSS Prevention**: Output encoding and CSP headers
- **File Upload Security**: Type and size validation
- **Email Validation**: Server-side email verification

## 📈 Analytics and SEO

### Built-in Analytics

- Page views tracking
- Contact form submissions
- Project interactions
- User engagement metrics

### SEO Features

- Semantic HTML structure
- Meta tags optimization
- Open Graph tags
- Schema.org structured data
- Sitemap generation
- Clean URL structure

### Google Analytics Integration

Add your tracking code to `index.html`:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_TRACKING_ID");
</script>
```

## 🚀 Deployment

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /path/to/portfolio-website

    <Directory /path/to/portfolio-website>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/portfolio_error.log
    CustomLog ${APACHE_LOG_DIR}/portfolio_access.log combined
</VirtualHost>
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/portfolio-website;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache

# Get certificate
sudo certbot --apache -d yourdomain.com
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Responsive design on all devices
- [ ] Contact form submission and validation
- [ ] Email notifications working
- [ ] Dark/light theme toggle
- [ ] Navigation and smooth scrolling
- [ ] Project filtering and modal
- [ ] Skills animations
- [ ] Testimonials slider
- [ ] Cross-browser compatibility

### Automated Testing

Consider adding:

- **Unit Tests**: PHP unit tests for backend functions
- **Integration Tests**: Test API endpoints
- **E2E Tests**: Selenium or Cypress for frontend testing
- **Performance Tests**: Lighthouse CI integration

## 🔧 Maintenance

### Regular Tasks

1. **Database Cleanup**: Run cleanup procedures monthly
2. **Security Updates**: Keep PHP and dependencies updated
3. **Backup**: Regular database and file backups
4. **Monitoring**: Check error logs and performance metrics
5. **Content Updates**: Keep projects and skills current

### Backup Strategy

```bash
# Database backup
mysqldump -u username -p portfolio_db > backup_$(date +%Y%m%d).sql

# File backup
tar -czf files_backup_$(date +%Y%m%d).tar.gz assets/uploads/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- **Font Awesome**: Icons
- **Google Fonts**: Typography
- **AOS Library**: Scroll animations
- **Unsplash**: Stock photos (replace with your own)

## 📞 Support

If you need help or have questions:

1. Check the [Documentation](docs/)
2. Open an [Issue](https://github.com/yourusername/portfolio-website/issues)
3. Contact: your.email@example.com

## 🔄 Version History

### v1.0.0 (Current)

- Initial release
- Complete portfolio functionality
- Contact form with backend
- Responsive design
- Dark/light theme
- Project management
- Email notifications

### Planned Features

- [ ] Admin dashboard
- [ ] Blog system
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Social media integration
- [ ] Newsletter system
- [ ] PWA features
- [ ] Performance optimizations

---

⭐ **Star this repository if you found it helpful!**

Built with ❤️ by [Your Name](https://yourwebsite.com)
