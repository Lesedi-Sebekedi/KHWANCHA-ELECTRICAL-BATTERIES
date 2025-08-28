import { addDelegateEvent, smoothScrollTo } from '../utils/helpers.js';

/**
 * Initialize navigation functionality
 */
export function initNavigation() {
    // Mobile menu toggle
    addDelegateEvent('click', '.menu-toggle', toggleMobileMenu);
    
    // Smooth scrolling for navigation links
    addDelegateEvent('click', '.nav__link[href^="#"]', handleNavLinkClick);
    
    // Header scroll effect
    initHeaderScroll();
}

/**
 * Toggle mobile menu
 * @param {Event} e - The click event
 */
function toggleMobileMenu(e) {
    const navList = document.querySelector('.nav__list');
    const menuToggle = e.target.closest('.menu-toggle');
    
    if (!navList || !menuToggle) return;
    
    navList.classList.toggle('nav__list--active');
    
    // Update aria-expanded attribute
    const isExpanded = navList.classList.contains('nav__list--active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
}

/**
 * Handle navigation link clicks
 * @param {Event} e - The click event
 */
function handleNavLinkClick(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    // Close mobile menu if open
    const navList = document.querySelector('.nav__list');
    if (navList && navList.classList.contains('nav__list--active')) {
        navList.classList.remove('nav__list--active');
        document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
    }
    
    // Smooth scroll to target
    smoothScrollTo(targetId);
}

/**
 * Initialize header scroll effect
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }
    
    // Initial check
    handleScroll();
    
    // Listen for scroll events with debounce
    window.addEventListener('scroll', debounce(handleScroll, 100));
}