/**
 * Show notification
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, warning)
 * @param {number} duration - How long to show the notification in ms
 */
export function showNotification(message, type = 'success', duration = 5000) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message and type
    notification.textContent = message;
    notification.className = `notification notification--${type}`;
    
    // Show notification
    notification.classList.add('notification--show');
    
    // Hide notification after duration
    setTimeout(() => {
        notification.classList.remove('notification--show');
    }, duration);
}