import { showNotification } from '../utils/notifications.js';

/**
 * Initialize form functionality
 */
export function initForms() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
}

/**
 * Handle form submission
 * @param {Event} e - The submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Basic validation
    if (!validateForm(this)) {
        return;
    }
    
    // In a real application, you would send the form data to a server here
    // For this example, we'll just show a success notification
    
    showNotification('Thank you for your message. We will get back to you soon!');
    
    // Reset form
    this.reset();
}

/**
 * Validate form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - True if form is valid
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            highlightError(field, 'This field is required');
        } else {
            clearError(field);
        }
    });
    
    // Validate email format
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            highlightError(emailField, 'Please enter a valid email address');
        } else {
            clearError(emailField);
        }
    }
    
    return isValid;
}

/**
 * Highlight field with error
 * @param {Element} field - The field with error
 * @param {string} message - The error message
 */
function highlightError(field, message) {
    // Add error class
    field.classList.add('error');
    
    // Create or update error message
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

/**
 * Clear field error
 * @param {Element} field - The field to clear error from
 */
function clearError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}