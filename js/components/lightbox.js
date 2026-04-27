/**
 * Lightbox functionality
 */
export function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let galleryItems = [];
    let currentIndex = 0;
    
    // Get gallery items
    galleryItems = document.querySelectorAll('.gallery-item');
    if (!lightbox || !lightboxImg || !lightboxCaption || galleryItems.length === 0) return;
    
    // Add event listeners to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
    
    // Add event listeners to lightbox controls
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);
    
    // Close lightbox when clicking outside image
    if (lightbox) lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    /**
     * Open lightbox
     * @param {number} index - Index of the image to show
     */
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    /**
     * Update lightbox content
     */
    function updateLightbox() {
        const item = galleryItems[currentIndex];
        const img = item.querySelector('.gallery-img, .gallery-item__image, img');
        const caption = item.querySelector('.gallery-caption, .gallery-item__caption');
        if (!img) return;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Gallery image';
        lightboxCaption.textContent = caption ? caption.textContent : '';
    }
    
    /**
     * Close lightbox
     */
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    /**
     * Navigate to next image
     */
    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightbox();
    }
    
    /**
     * Navigate to previous image
     */
    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightbox();
    }
    
    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - The keyboard event
     */
    function handleKeydown(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
    }
}