// Import components
import { initNavigation } from './components/navigation.js';
import { initCharts, animateChartBars } from './components/charts.js';
import { initLightbox } from './components/lightbox.js';
import { initForms } from './components/forms.js';

// Import utilities
import { isInViewport } from './utils/helpers.js';
import { showNotification } from './utils/notifications.js';

/**
 * Initialize page-specific functionality
 */
function initPage() {
    // Initialize navigation
    initNavigation();
    
    // Initialize charts
    initCharts();
    
    // Initialize lightbox if on gallery pages
    if (document.querySelector('.gallery-item')) {
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

/**
 * Handle form submission with notification
 * @param {Event} e - The submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Show notification
    showNotification('Thank you for your message. We will get back to you soon!');
    
    // Reset form
    this.reset();
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
window.handleFormSubmit = handleFormSubmit;