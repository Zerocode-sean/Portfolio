// =============================================================================
// Main JavaScript File - Portfolio Website
// =============================================================================

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  initializeWebsite();
});

// =============================================================================
// Initialize Website
// =============================================================================
function initializeWebsite() {
  // Show loading screen
  showLoadingScreen();

  // Initialize all components
  initializeNavigation();
  initializeThemeToggle();
  initializeTypedText();
  initializeScrollAnimations();
  initializeSkillProgressBars();
  initializeCounterAnimation();
  initializeScrollIndicator();
  initializeSmoothScrolling();
  initializeContactForm();
  initializeParticles();

  // Hide loading screen after everything is loaded
  setTimeout(() => {
    hideLoadingScreen();
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, 1500);
}

// =============================================================================
// Loading Screen
// =============================================================================
function showLoadingScreen() {
  const loadingHTML = `
        <div class="loading" id="loading">
            <div class="loader"></div>
        </div>
    `;
  document.body.insertAdjacentHTML("afterbegin", loadingHTML);
}

function hideLoadingScreen() {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.classList.add("hidden");
    setTimeout(() => {
      loading.remove();
    }, 500);
  }
}

// =============================================================================
// Navigation
// =============================================================================
function initializeNavigation() {
  const navbar = document.getElementById("navbar");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "none";
    }
  });

  // Mobile menu toggle
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      mobileMenuToggle.classList.toggle("active");
    });
  }

  // Active nav link highlighting
  window.addEventListener("scroll", () => {
    let current = "";
    const sections = document.querySelectorAll("section[id]");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        mobileMenuToggle.classList.remove("active");
      }
    });
  });
}

// =============================================================================
// Theme Toggle
// =============================================================================
function initializeThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Check for saved theme preference or default to light
  const currentTheme = localStorage.getItem("theme") || "light";
  body.setAttribute("data-theme", currentTheme);

  // Update toggle icon
  updateThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = body.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      body.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById("theme-toggle");
  const icon = themeToggle.querySelector("i");

  if (theme === "dark") {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }
}

// =============================================================================
// Typed Text Animation
// =============================================================================
function initializeTypedText() {
  const typedTextSpan = document.querySelector(".typed-text");
  const cursorSpan = document.querySelector(".cursor");

  // Early return if required DOM elements are not found
  if (!typedTextSpan || !cursorSpan) {
    console.warn("Typed text animation: Required DOM elements (.typed-text, .cursor) not found");
    return;
  }

  // Configuration constants for better maintainability
  const TYPING_DELAY = 100;
  const ERASING_DELAY = 50;
  const NEW_TEXT_DELAY = 2000;
  const INITIAL_DELAY = NEW_TEXT_DELAY + 250;
  const NEXT_WORD_DELAY = TYPING_DELAY + 1100;

  // Text array - can be made configurable via data attributes or external source
  const textArray = [
    "Web Developer",
    "UI/UX Designer",
    "Full Stack Developer",
    "Problem Solver",
    "Creative Thinker",
  ];

  // Early return if no text to animate
  if (!textArray.length) {
    console.warn("Typed text animation: No text provided in textArray");
    return;
  }

  let textArrayIndex = 0;
  let charIndex = 0;

  /**
   * Types the current text character by character
   */
  function type() {
    const currentText = textArray[textArrayIndex];

    // Edge case: skip empty strings
    if (!currentText || currentText.length === 0) {
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      setTimeout(type, TYPING_DELAY);
      return;
    }

    if (charIndex < currentText.length) {
      // Add typing class to cursor if not present
      if (!cursorSpan.classList.contains("typing")) {
        cursorSpan.classList.add("typing");
      }

      // Append next character
      typedTextSpan.textContent += currentText.charAt(charIndex);
      charIndex++;

      // Schedule next character
      setTimeout(type, TYPING_DELAY);
    } else {
      // Finished typing current text
      cursorSpan.classList.remove("typing");

      // Schedule erase after delay
      setTimeout(erase, NEW_TEXT_DELAY);
    }
  }

  /**
   * Erases the current text character by character
   */
  function erase() {
    const currentText = textArray[textArrayIndex];

    if (charIndex > 0) {
      // Add typing class to cursor if not present
      if (!cursorSpan.classList.contains("typing")) {
        cursorSpan.classList.add("typing");
      }

      // Remove last character
      typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;

      // Schedule next erase
      setTimeout(erase, ERASING_DELAY);
    } else {
      // Finished erasing
      cursorSpan.classList.remove("typing");

      // Move to next text in array
      textArrayIndex = (textArrayIndex + 1) % textArray.length;

      // Schedule next type with delay
      setTimeout(type, NEXT_WORD_DELAY);
    }
  }

  // Start the animation after initial delay
  setTimeout(type, INITIAL_DELAY);
}

// =============================================================================
// Scroll Animations
// =============================================================================
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  }, observerOptions);

  // Observe all sections
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    observer.observe(section);
  });
}

// =============================================================================
// Skill Progress Bars
// =============================================================================
function initializeSkillProgressBars() {
  const progressBars = document.querySelectorAll(".progress-bar");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const width = progressBar.getAttribute("data-width");

          setTimeout(() => {
            progressBar.style.width = width + "%";
          }, 300);

          observer.unobserve(progressBar);
        }
      });
    },
    { threshold: 0.5 }
  );

  progressBars.forEach((bar) => {
    observer.observe(bar);
  });
}

// =============================================================================
// Counter Animation
// =============================================================================
function initializeCounterAnimation() {
  const counters = document.querySelectorAll(".stat-number");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute("data-count"));
          const increment = target / 200;
          let current = 0;

          const updateCounter = () => {
            if (current < target) {
              current += increment;
              counter.textContent = Math.ceil(current);
              setTimeout(updateCounter, 10);
            } else {
              counter.textContent = target;
            }
          };

          updateCounter();
          observer.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

// =============================================================================
// Scroll Indicator
// =============================================================================
function initializeScrollIndicator() {
  const scrollIndicator = document.querySelector(".scroll-indicator");

  if (scrollIndicator) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = "0";
      } else {
        scrollIndicator.style.opacity = "1";
      }
    });
  }
}

// =============================================================================
// Smooth Scrolling
// =============================================================================
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// =============================================================================
// Contact Form
// =============================================================================
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactFormSubmit);

    // Floating labels
    const formGroups = document.querySelectorAll(".form-group");
    formGroups.forEach((group) => {
      const input = group.querySelector("input, textarea");
      if (input) {
        input.addEventListener("focus", () => {
          group.classList.add("focused");
        });

        input.addEventListener("blur", () => {
          if (!input.value) {
            group.classList.remove("focused");
          }
        });

        // Check if input has value on page load
        if (input.value) {
          group.classList.add("focused");
        }
      }
    });
  }
}

function handleContactFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  // Send form data
  fetch(form.action, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showNotification("Message sent successfully!", "success");
        form.reset();

        // Remove focused class from form groups
        const formGroups = form.querySelectorAll(".form-group");
        formGroups.forEach((group) => {
          group.classList.remove("focused");
        });
      } else {
        showNotification("Failed to send message. Please try again.", "error");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification("An error occurred. Please try again.", "error");
    })
    .finally(() => {
      // Reset button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
}

// =============================================================================
// Notification System
// =============================================================================
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${
              type === "success"
                ? "check-circle"
                : type === "error"
                ? "exclamation-circle"
                : "info-circle"
            }"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

  // Add notification styles if not already added
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                background: var(--success-color);
            }
            .notification-error {
                background: var(--error-color);
            }
            .notification-info {
                background: var(--primary-color);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
    document.head.appendChild(styles);
  }

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    hideNotification(notification);
  });

  // Auto hide after 5 seconds
  setTimeout(() => {
    hideNotification(notification);
  }, 5000);
}

function hideNotification(notification) {
  notification.classList.remove("show");
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// =============================================================================
// Particles Animation
// =============================================================================
function initializeParticles() {
  const particlesContainer = document.querySelector(".hero-particles");

  if (particlesContainer) {
    // Create additional animated elements
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.width = Math.random() * 4 + "px";
      particle.style.height = particle.style.width;
      particle.style.background = "rgba(255, 255, 255, 0.5)";
      particle.style.borderRadius = "50%";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animation = `floatParticle ${
        Math.random() * 10 + 10
      }s ease-in-out infinite`;
      particle.style.animationDelay = Math.random() * 5 + "s";

      particlesContainer.appendChild(particle);
    }
  }
}

// Add CSS for particle animation
const particleStyles = document.createElement("style");
particleStyles.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.5;
        }
        25% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 1;
        }
        50% {
            transform: translateY(-10px) rotate(180deg);
            opacity: 0.8;
        }
        75% {
            transform: translateY(-30px) rotate(270deg);
            opacity: 0.6;
        }
    }
`;
document.head.appendChild(particleStyles);

// =============================================================================
// Utility Functions
// =============================================================================

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Get CSS custom property value
function getCSSCustomProperty(property) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim();
}

// Set CSS custom property value
function setCSSCustomProperty(property, value) {
  document.documentElement.style.setProperty(property, value);
}

// =============================================================================
// Error Handling
// =============================================================================
window.addEventListener("error", (e) => {
  console.error("JavaScript Error:", e.error);
  // You can add error reporting here if needed
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled Promise Rejection:", e.reason);
  // You can add error reporting here if needed
});

// =============================================================================
// Performance Monitoring
// =============================================================================
if ("performance" in window) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType("navigation")[0];
      console.log(
        "Page Load Time:",
        perfData.loadEventEnd - perfData.loadEventStart,
        "ms"
      );
    }, 0);
  });
}
