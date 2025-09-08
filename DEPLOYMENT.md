# Deployment Guide

## Live Site

🌐 **[View Live Portfolio](https://your-site-name.onrender.com)**

## Quick Deploy to Render

### Prerequisites

- GitHub account
- Render account (free)

### Steps

1. **GitHub Repository** ✅

   - Repository: `https://github.com/Zerocode-sean/Portfolio`
   - Code is already pushed and ready

2. **Deploy on Render**

   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click "New +" → "Static Site"
   - Connect repository: `Zerocode-sean/Portfolio`
   - Settings:
     - **Branch**: `main`
     - **Root Directory**: (leave empty)
     - **Build Command**: (leave empty)
     - **Publish Directory**: `.`
   - Click "Create Static Site"

3. **Optional: Custom Domain**
   - After deployment, you can add a custom domain
   - Go to Settings → Custom Domains

## Contact Form Setup (Optional)

Currently the contact form uses a demo mode. To enable real form submissions:

### Option 1: Formspree (Recommended)

1. Go to [formspree.io](https://formspree.io)
2. Create free account
3. Create new form
4. Replace `YOUR_FORM_ID` in `assets/js/contact.js` line 365
5. Redeploy site

### Option 2: EmailJS

1. Go to [emailjs.com](https://emailjs.com)
2. Set up email service
3. Update contact.js with EmailJS configuration

### Option 3: Netlify Forms

If you prefer Netlify over Render:

1. Deploy to Netlify instead
2. Add `netlify` attribute to form in HTML
3. Forms will work automatically

## Features Included

✅ **Responsive Design** - Mobile, tablet, desktop  
✅ **Dark/Light Theme** - Toggle in navigation  
✅ **Smooth Animations** - AOS library  
✅ **Project Filtering** - Dynamic JavaScript  
✅ **Contact Form** - Ready for form services  
✅ **SEO Optimized** - Meta tags, semantic HTML  
✅ **Fast Loading** - Optimized assets

## File Structure

```
/
├── index.html              # Main page
├── assets/
│   ├── css/
│   │   ├── style.css       # Main styles
│   │   └── responsive.css  # Mobile responsive
│   ├── js/
│   │   ├── main.js         # Core functionality
│   │   ├── projects.js     # Projects data & filtering
│   │   └── contact.js      # Contact form & testimonials
│   └── images/             # Add your images here
├── backend/                # PHP files (not used in static)
├── database/               # SQL schema (not used in static)
└── README.md               # This file
```

## Adding Your Content

### 1. Personal Information

- Edit `index.html` - Update name, description, links
- Replace `assets/images/profile.jpg` with your photo

### 2. Projects

- Edit `assets/js/projects.js` - Update `projectsData` array
- Add project images to `assets/images/projects/`

### 3. Testimonials

- Edit `assets/js/contact.js` - Update `testimonialsData` array
- Add client photos to `assets/images/testimonials/`

### 4. Resume/CV

- Add your resume PDF to `assets/files/resume.pdf`
- Update download link in navigation

## Support

For issues or questions:

- Check Render documentation
- GitHub Issues in this repository
- Contact form services documentation

---

**Next Steps**: Deploy to Render and add your personal content!
