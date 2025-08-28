/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 * @param {Element} element - The element to check
 * @returns {boolean} - True if element is in viewport
 */
export function isInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Event delegation helper
 * @param {string} event - The event name
 * @param {string} selector - The CSS selector to match
 * @param {Function} callback - The callback function
 * @param {Element} context - The context to listen in (defaults to document)
 */
export function addDelegateEvent(event, selector, callback, context = document) {
    context.addEventListener(event, function(e) {
        if (e.target.matches(selector)) {
            callback(e);
        }
    });
}

/**
 * Smooth scroll to element
 * @param {string} targetId - The ID of the element to scroll to
 * @param {number} offset - Optional offset from the top
 */
export function smoothScrollTo(targetId, offset = 0) {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    const headerHeight = document.getElementById('header')?.offsetHeight || 0;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Format number with commas
 * @param {number} number - The number to format
 * @returns {string} - The formatted number
 */
export function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}