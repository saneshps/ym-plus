// Application Industries Carousel Script

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.app-industries-carousel');
    const items = document.querySelectorAll('.app-industries-carousel-item');
    const prevBtn = document.querySelector('.app-industries-nav-prev');
    const nextBtn = document.querySelector('.app-industries-nav-next');
    const dotsContainer = document.querySelector('.app-industries-dots');

    let currentIndex = 0;
    let autoPlayTimer = null;
    const autoPlayDelay = 2000; // 5 seconds

    // Initialize carousel
    function init() {
        if (items.length === 0) return;

        // Create dots
        items.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `app-industries-dot${index === 0 ? ' active' : ''}`;
            dot.setAttribute('data-index', index);
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        // Set initial active item
        updateCarousel();

        // Add event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Click on any item to activate it
        items.forEach((item, index) => {
            item.addEventListener('click', () => goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Start auto-play
        startAutoPlay();

        // Pause auto-play on hover
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        // Add touch support
        addTouchSupport();
    }

    // Update carousel display
    function updateCarousel() {
        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });

        // Update dots
        document.querySelectorAll('.app-industries-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Smooth scroll to active item
        scrollToActive();
    }

    // Scroll carousel to show active item properly
    function scrollToActive() {
        if (!carousel) return;

        const activeItem = items[currentIndex];
        const carouselRect = carousel.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();

        // Calculate scroll position
        const scrollLeft = activeItem.offsetLeft - carousel.offsetLeft - (carousel.clientWidth / 2) + (activeItem.clientWidth / 2);
        
        carousel.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: 'smooth'
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = (index + items.length) % items.length;
        updateCarousel();
        stopAutoPlay();
        startAutoPlay();
    }

    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
        stopAutoPlay();
        startAutoPlay();
    }

    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
        stopAutoPlay();
        startAutoPlay();
    }

    // Keyboard navigation
    function handleKeyboard(e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    }

    // Auto-play functionality
    function startAutoPlay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            nextSlide();
        }, autoPlayDelay);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    function addTouchSupport() {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, false);

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay();
        }, false);
    }

    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for a swipe
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swiped left
            } else {
                prevSlide(); // Swiped right
            }
        }
    }

    // Debounce resize handler
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            scrollToActive();
        }, 250);
    });

    // Initialize on DOM ready
    init();
});

// Helper function to reinitialize if new items are added dynamically
window.reinitializeAppIndustriesCarousel = function() {
    location.reload(); // Simple solution - reload the page
    // For more advanced use, you can manually trigger init() again
};
