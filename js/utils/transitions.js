import { showNotification } from './notifications.js';

/**
 * Page transition management
 */
class PageTransitions {
    constructor() {
        this.init();
    }

    init() {
        // Add transition overlay to body
        this.addTransitionOverlay();
        
        // Handle all link clicks
        this.bindLinkClicks();
        
        // Handle browser navigation (back/forward buttons)
        this.bindNavigation();
        
        // Initialize page animations
        this.animatePageEntrance();
    }

    addTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'transition-overlay';
        overlay.innerHTML = `
            <div class="loader"></div>
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    bindLinkClicks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Ignore if it's not a page navigation link
            if (!href || href.startsWith('#') || href.startsWith('javascript:') || 
                href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) {
                return;
            }
            
            // Ignore if it's an external link or has target="_blank"
            if (link.target === '_blank' || link.hostname !== window.location.hostname) {
                return;
            }
            
            e.preventDefault();
            this.navigateTo(href);
        });
    }

    bindNavigation() {
        window.addEventListener('popstate', () => {
            this.showPage(window.location.href, false);
        });
    }

    navigateTo(url) {
        // Show loading overlay
        this.overlay.classList.add('transition-overlay--active');
        
        // After a brief delay, navigate to the new page
        setTimeout(() => {
            // Update browser history
            window.history.pushState({}, '', url);
            
            // Load and show the new page
            this.showPage(url);
        }, 600);
    }

    async showPage(url, animate = true) {
        try {
            // Add timeout for fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Parse the HTML
            const parser = new DOMParser();
            const newDocument = parser.parseFromString(html, 'text/html');
            
            // Extract the main content
            const newContent = newDocument.querySelector('.main-content') || 
                              newDocument.querySelector('main') || 
                              newDocument.body;
            
            // Update the page title
            document.title = newDocument.title;
            
            // Replace the content with a smooth transition
            const oldContent = document.querySelector('.main-content') || 
                              document.querySelector('main') || 
                              document.body;
            
            if (animate) {
                oldContent.style.opacity = 0;
                oldContent.style.transform = 'translateY(-20px)';
                oldContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                    oldContent.innerHTML = newContent.innerHTML;
                    oldContent.style.opacity = 1;
                    oldContent.style.transform = 'translateY(0)';
                    
                    // Reinitialize scripts and animations
                    this.reinitPage();
                    
                    // Hide the loading overlay
                    this.overlay.classList.remove('transition-overlay--active');
                }, 500);
            } else {
                oldContent.innerHTML = newContent.innerHTML;
                this.reinitPage();
                this.overlay.classList.remove('transition-overlay--active');
            }
            
        } catch (error) {
            console.error('Page transition error:', error);
            // If something goes wrong, do a traditional page load
            window.location.href = url;
        }
    }

    reinitPage() {
        // Reinitialize any scripts that need to run on page load
        if (typeof initPage === 'function') {
            initPage();
        }
        
        // Reanimate elements
        this.animatePageEntrance();
        
        // Rebind events if necessary
        this.bindLinkClicks();
    }

    animatePageEntrance() {
        // Animate elements with the animate-on-scroll class
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        animatedElements.forEach(el => {
            // Reset animation
            el.classList.remove('animated');
            
            // Trigger animation with a slight delay
            setTimeout(() => {
                el.classList.add('animated');
            }, 100);
        });
        
        // Animate gallery items with staggered delays
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(el => {
            // Reset animation
            el.classList.remove('animated');
            
            // Trigger animation with a slight delay
            setTimeout(() => {
                el.classList.add('animated');
            }, 200);
        });
        
        // Animate chart bars if on the main page
        if (typeof animateChartBars === 'function' && document.querySelector('.market-chart')) {
            setTimeout(animateChartBars, 500);
        }
    }
}

// Initialize page transitions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pageTransitions = new PageTransitions();
});