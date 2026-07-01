// Import components
import { initNavigation } from './components/navigation.js';
import { initCharts, animateChartBars } from './components/charts.js';
import { initLightbox } from './components/lightbox.js';
import { initForms } from './components/forms.js';

// Import utilities
import { isInViewport } from './utils/helpers.js';

/**
 * Initialize page-specific functionality
 */
function initPage() {
    // Keep footer year current automatically
    updateCurrentYear();

    // Initialize navigation
    initNavigation();
    
    // Initialize charts
    initCharts();
    
    // Initialize lightbox only on full gallery pages (not index preview links)
    if (document.getElementById('lightbox')) {
        initLightbox();
    }
    
    // Initialize forms if on contact page
    if (document.getElementById('contactForm')) {
        initForms();
    }
    
    // Initialize scroll animations
    initScrollAnimations();
}

/**
 * Set all current-year placeholders in the page.
 */
function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('[data-current-year]').forEach((el) => {
        el.textContent = currentYear;
    });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize the page when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}

// Make functions available globally for legacy scripts
window.initPage = initPage;
window.animateChartBars = animateChartBars;