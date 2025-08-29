// =============================================================================
// Projects JavaScript - Portfolio Website
// =============================================================================

// Sample projects data (this would typically come from a database or API)
const projectsData = [
  {
    id: 1,
    title: "🚛 DRMS - Digital Request Waste Management System",
    description:
      "A full-featured waste management  platform with user authentication, waste submission features , payment integration,map integration , driver dashboard, scheduling algorithm  and admin dashboard. Implemented based on RBCA <i>role based access control standards</i>.",
    image: "assets/images/ewaste.jpg",
    category: "web",
    technologies: ["PHP", "MySQL", "JavaScript", "CSS", "HTML", "Docker"],
    liveUrl: "https://drms-app.onrender.com",
    githubUrl: "https://github.com/Zerocode-sean/drms",
    featured: true,
  },
  {
    id: 2,
    title: " 🏀 NBA Prediction Model",
    description: `Professional NBA game predictions powered by machine learning. Achieve 60%+ accuracy on real NBA games with our advanced prediction system.`,
    image: "assets/images/nba.jpg",
    category: "web",
    technologies: [
      "Python",
      "Machine Learning",
      "TensorFlow",
      "Pandas",
      "Scikit-learn",
    ],
    liveUrl: "https://nba-prediction-system-sean.streamlit.app/",
    githubUrl: "https://github.com/Zerocode-sean/nba-prediction-system",
    featured: true,
  },
  {
    id: 3,
    title: "🎯 User Sentiment Tracking System",
    description:
      "A comprehensive, production-ready sentiment analysis platform for tracking and analyzing user feedback across multiple platforms with role-based dashboards and automated insights.",
    image: "assets/images/sentiment.jpg",
    category: "web",
    technologies: [
      "Streamlit 1.28.0",
      "Python 3.9",
      "SQLite",
      "Scikit-learn",
      "Matplotlib, Plotly, Seaborn",
      "Bcrypt + Streamlit-Authenticator",
      "Docker",
      "GitHub Actions",
      "Streamlit Cloud",
    ],
    liveUrl:
      "https://sentiment-tracking-system-kdbpunesxqqmszpyghbrlu.streamlit.app/",
    githubUrl: "https://github.com/Zerocode-sean/Sentiment-Tracking-System",
    featured: false,
  },
  {
    id: 4,
    title: "OpenVPN Configuration",
    description:
      "A beautiful weather application with location-based forecasts, interactive maps, and detailed weather information.",
    image: "assets/images/Ovpn.png",
    category: "mobile",
    technologies: [
      "SSL/TLS Protocol",
      "OpenSSL Library",
      "Pre-shared Keys",
      "Certificate-based Authentication",
      "Firewall and NAT Traversal",
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/username/weather",
    featured: true,
  },
];

// Global variables
let currentFilter = "all";
let currentPage = 1;
const projectsPerPage = 6;
let filteredProjects = [...projectsData];

// =============================================================================
// Initialize Projects
// =============================================================================
document.addEventListener("DOMContentLoaded", function () {
  initializeProjects();
  initializeProjectFilters();
  initializeLoadMore();
});

// =============================================================================
// Initialize Projects
// =============================================================================
function initializeProjects() {
  renderProjects();
  updateLoadMoreButton();
}

// =============================================================================
// Render Projects
// =============================================================================
function renderProjects() {
  const projectsGrid = document.getElementById("projects-grid");
  if (!projectsGrid) return;

  const startIndex = 0;
  const endIndex = currentPage * projectsPerPage;
  const projectsToShow = filteredProjects.slice(startIndex, endIndex);

  // Clear existing projects if it's a new filter
  if (currentPage === 1) {
    projectsGrid.innerHTML = "";
  }

  projectsToShow.forEach((project, index) => {
    if (index >= (currentPage - 1) * projectsPerPage) {
      const projectCard = createProjectCard(project);
      projectsGrid.appendChild(projectCard);
    }
  });

  // Initialize AOS for new elements
  if (typeof AOS !== "undefined") {
    AOS.refresh();
  }
}

// =============================================================================
// Create Project Card
// =============================================================================
function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.setAttribute("data-category", project.category);
  card.setAttribute("data-aos", "fade-up");
  card.setAttribute("data-aos-delay", "100");

  const techTags = project.technologies
    .map((tech) => `<span class="tech-tag">${tech}</span>`)
    .join("");

  card.innerHTML = `
        <div class="project-image">
            <img src="${project.image}" alt="${project.title}" loading="lazy">
            <div class="project-overlay">
                <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link" title="View Live Demo">
                    <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link" title="View Source Code">
                    <i class="fab fa-github"></i>
                </a>
            </div>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${techTags}
            </div>
        </div>
    `;

  // Add click event for project details
  card.addEventListener("click", (e) => {
    // Don't open modal if clicking on links
    if (e.target.closest(".project-link")) return;

    openProjectModal(project);
  });

  return card;
}

// =============================================================================
// Project Filters
// =============================================================================
function initializeProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");
      setActiveFilter(button, filter);
    });
  });
}

function setActiveFilter(activeButton, filter) {
  // Update active button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  activeButton.classList.add("active");

  // Filter projects
  currentFilter = filter;
  currentPage = 1;

  if (filter === "all") {
    filteredProjects = [...projectsData];
  } else {
    filteredProjects = projectsData.filter(
      (project) => project.category === filter
    );
  }

  // Re-render projects with animation
  animateProjectsChange();
}

// =============================================================================
// Animate Projects Change
// =============================================================================
function animateProjectsChange() {
  const projectsGrid = document.getElementById("projects-grid");
  const currentCards = projectsGrid.querySelectorAll(".project-card");

  // Fade out current cards
  currentCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
    }, index * 50);
  });

  // Clear and render new cards after animation
  setTimeout(() => {
    renderProjects();
    updateLoadMoreButton();

    // Animate new cards in
    const newCards = projectsGrid.querySelectorAll(".project-card");
    newCards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";

      setTimeout(() => {
        card.style.transition = "all 0.5s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100);
    });
  }, currentCards.length * 50 + 200);
}

// =============================================================================
// Load More Functionality
// =============================================================================
function initializeLoadMore() {
  const loadMoreBtn = document.getElementById("load-more");

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      currentPage++;
      renderProjects();
      updateLoadMoreButton();

      // Smooth scroll to new content
      setTimeout(() => {
        const newCards = document.querySelectorAll(".project-card");
        const targetCard = newCards[(currentPage - 2) * projectsPerPage];
        if (targetCard) {
          targetCard.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    });
  }
}

function updateLoadMoreButton() {
  const loadMoreBtn = document.getElementById("load-more");
  const loadMoreContainer = document.querySelector(".load-more-container");

  if (loadMoreBtn && loadMoreContainer) {
    const totalProjects = filteredProjects.length;
    const shownProjects = currentPage * projectsPerPage;

    if (shownProjects >= totalProjects) {
      loadMoreContainer.style.display = "none";
    } else {
      loadMoreContainer.style.display = "block";
      const remainingProjects = totalProjects - shownProjects;
      loadMoreBtn.innerHTML = `Load More Projects (${remainingProjects} remaining)`;
    }
  }
}

// =============================================================================
// Project Modal
// =============================================================================
function openProjectModal(project) {
  const modal = createProjectModal(project);
  document.body.appendChild(modal);

  // Animate modal in
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);

  // Close modal functionality
  const closeBtn = modal.querySelector(".modal-close");
  const modalOverlay = modal.querySelector(".modal-overlay");

  closeBtn.addEventListener("click", () => closeProjectModal(modal));
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeProjectModal(modal);
    }
  });

  // ESC key to close
  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") {
      closeProjectModal(modal);
      document.removeEventListener("keydown", escHandler);
    }
  });
}

function createProjectModal(project) {
  const modal = document.createElement("div");
  modal.className = "project-modal";

  const techTags = project.technologies
    .map((tech) => `<span class="tech-tag">${tech}</span>`)
    .join("");

  modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <img src="${project.image}" alt="${project.title}" class="modal-image">
                    <div class="modal-info">
                        <h2 class="modal-title">${project.title}</h2>
                        <p class="modal-description">${project.description}</p>
                        <div class="modal-tech">
                            <h3>Technologies Used:</h3>
                            <div class="tech-tags">
                                ${techTags}
                            </div>
                        </div>
                        <div class="modal-links">
                            <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                                <i class="fab fa-github"></i> Source Code
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  return modal;
}

function closeProjectModal(modal) {
  modal.classList.remove("show");
  setTimeout(() => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }, 300);
}

// =============================================================================
// Project Search
// =============================================================================
function initializeProjectSearch() {
  const searchInput = document.getElementById("project-search");

  if (searchInput) {
    searchInput.addEventListener("input", debounceSearch);
  }
}

const debounceSearch = debounce((e) => {
  const searchTerm = e.target.value.toLowerCase();

  if (searchTerm === "") {
    filteredProjects = projectsData.filter(
      (project) => currentFilter === "all" || project.category === currentFilter
    );
  } else {
    filteredProjects = projectsData.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(searchTerm)
        );

      const matchesFilter =
        currentFilter === "all" || project.category === currentFilter;

      return matchesSearch && matchesFilter;
    });
  }

  currentPage = 1;
  renderProjects();
  updateLoadMoreButton();
}, 300);

// =============================================================================
// Project Modal Styles
// =============================================================================
const modalStyles = document.createElement("style");
modalStyles.textContent = `
    .project-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .project-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    
    .modal-content {
        background: var(--bg-card);
        border-radius: var(--radius-xl);
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .project-modal.show .modal-content {
        transform: scale(1);
    }
    
    .modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        z-index: 10;
        transition: background 0.3s ease;
    }
    
    .modal-close:hover {
        background: rgba(0, 0, 0, 0.7);
    }
    
    .modal-header {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        padding: 30px;
    }
    
    .modal-image {
        width: 100%;
        height: 250px;
        object-fit: cover;
        border-radius: var(--radius-lg);
    }
    
    .modal-title {
        font-size: var(--font-size-2xl);
        margin-bottom: 15px;
        color: var(--primary-color);
    }
    
    .modal-description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 20px;
    }
    
    .modal-tech h3 {
        font-size: var(--font-size-lg);
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
    }
    
    .modal-links {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }
    
    @media (max-width: 768px) {
        .modal-header {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px;
        }
        
        .modal-content {
            margin: 10px;
            max-height: 95vh;
        }
        
        .modal-close {
            top: 15px;
            right: 15px;
        }
    }
`;
document.head.appendChild(modalStyles);

// =============================================================================
// Utility Functions
// =============================================================================
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

// =============================================================================
// Project Analytics (Optional)
// =============================================================================
function trackProjectView(projectId) {
  // This would typically send analytics data to your backend
  console.log(`Project viewed: ${projectId}`);

  // Example: Send to analytics service
  // analytics.track('project_viewed', {
  //     project_id: projectId,
  //     timestamp: new Date().toISOString()
  // });
}

function trackProjectClick(projectId, action) {
  // Track clicks on project links
  console.log(`Project ${action}: ${projectId}`);

  // Example: Send to analytics service
  // analytics.track('project_clicked', {
  //     project_id: projectId,
  //     action: action, // 'demo' or 'github'
  //     timestamp: new Date().toISOString()
  // });
}

// =============================================================================
// Error Handling
// =============================================================================
window.addEventListener("error", (e) => {
  if (e.filename && e.filename.includes("projects.js")) {
    console.error("Projects JavaScript Error:", e.error);
    // Fallback: Show basic project list without animations
    showProjectsErrorFallback();
  }
});

function showProjectsErrorFallback() {
  const projectsGrid = document.getElementById("projects-grid");
  if (projectsGrid && projectsGrid.children.length === 0) {
    projectsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>Sorry, there was an error loading the projects. Please refresh the page.</p>
            </div>
        `;
  }
}
