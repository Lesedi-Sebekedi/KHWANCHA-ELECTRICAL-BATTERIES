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
 * Handle form submission via Formspree
 * @param {SubmitEvent} e - The submit event
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.currentTarget;

    if (!validateForm(form)) {
        return;
    }

    const endpoint = form.dataset.formEndpoint;
    if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
        showNotification(
            'Contact form is not configured yet. Add your Formspree endpoint to data-form-endpoint on the form.',
            'error'
        );
        return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const payload = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        company: form.elements.company.value.trim(),
        interest: form.elements.interest.value,
        message: form.elements.message.value.trim(),
        _replyto: form.elements.email.value.trim(),
        _subject: 'New inquiry from Khwancha Batteries website'
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || `Request failed (${response.status})`);
        }

        showNotification('Thank you for your message. We will get back to you soon!');
        form.reset();
    } catch (error) {
        console.error('Form submission error:', error);

        const message = error.message === 'Failed to fetch'
            ? 'Could not reach the server. Check your connection and try again.'
            : `Something went wrong sending your message. Please try again or email tmagogodi@gmail.com directly.`;

        showNotification(message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
    }
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
    field.classList.add('error');

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
