/**
 * Product Carousel - Scrolling Product List
 * Loads products from the API and displays them in a horizontal scrolling carousel
 */

class ProductCarousel {
    constructor(carouselSelector = '#productCarousel', prevBtnSelector = '#prevBtn', nextBtnSelector = '#nextBtn') {
        this.carousel = document.querySelector(carouselSelector);
        this.prevBtn = document.querySelector(prevBtnSelector);
        this.nextBtn = document.querySelector(nextBtnSelector);
        this.products = [];
        this.isLoading = false;

        if (this.carousel && this.prevBtn && this.nextBtn) {
            this.init();
        }
    }

    async init() {
        // Load products from API
        await this.loadProducts();

        // Setup event listeners
        this.setupEventListeners();
    }

    async loadProducts() {
        this.isLoading = true;
        this.carousel.innerHTML = `
            <div style="text-align:center;padding:40px;font-size:16px;color:#666;width:100%;">
                <div style="display:inline-block;">
                    <div class="spinner" style="border:3px solid #f3f3f3;border-top:3px solid #9dc33b;border-radius:50%;width:30px;height:30px;animation:spin 1s linear infinite;margin-bottom:10px;"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        `;

        try {
            // Check if ProductAPI is available
            if (typeof window.ProductAPI === 'undefined' || !window.ProductAPI.fetchProducts) {
                console.error('ProductAPI not loaded. Make sure product-api.js is included before this script.');
                this.carousel.innerHTML = `<p style="color:#999;padding:20px;">Error loading products. Please refresh the page.</p>`;
                return;
            }

            // Fetch first page of products
            const response = await window.ProductAPI.fetchProducts(1, null);
            
            if (response.products && response.products.length > 0) {
                this.products = response.products;
                this.renderCarousel();
            } else {
                this.carousel.innerHTML = `<p style="color:#999;padding:20px;">No products available.</p>`;
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.carousel.innerHTML = `<p style="color:#999;padding:20px;">Error loading products. Please refresh the page.</p>`;
        }

        this.isLoading = false;
    }

    renderCarousel() {
        this.carousel.innerHTML = '';

        this.products.forEach((product, index) => {
            const item = document.createElement('div');
            item.className = 'product-carousel-item';
            item.innerHTML = this.createProductCardHtml(product);
            this.carousel.appendChild(item);
        });
    }

    createProductCardHtml(product) {
        const image = product.images && product.images.length > 0 ? product.images[0].src : 'assets/images/placeholder.png';
        const title = product.name || 'Product';
        const price = product.price ? this.formatPrice(product.price) : this.formatPrice(product.sale_price);
        const originalPrice = product.regular_price ? this.formatPrice(product.regular_price) : '';
        const link = product.permalink || '#';

        let priceHtml = `<span class="product-price">${price}</span>`;

        if (originalPrice && product.sale_price && parseFloat(product.regular_price) > parseFloat(product.sale_price)) {
            priceHtml = `
                <span class="product-price-original">${originalPrice}</span>
                <br>
                <span class="product-price">${price}</span>
            `;
        }

        return `
            <div class="project-one__single">
                <a href="${link}" target="_blank" class="carousel-item-link">
                    <div class="project-one__img-box">
                        <div class="project-one__img">
                            <img src="${image}" alt="${title}" loading="lazy">
                            <div class="project-one__arrow"></div>
                        </div>
                    </div>
                    <div class="project-one__content">
                        <h3 class="project-one__title">${title}</h3>
                        <div style="margin-top:8px;font-size:13px;font-family: sans-serif; margin-bottom: 40px;">
                            ${priceHtml}
                        </div>
                        <button class="thm-btn" style="margin-top: 10px;">Buy Now</button>
                    </div>
                </a>
            </div>
        `;
    }

    formatPrice(price) {
        if (!price) return 'Contact for price';
        const numPrice = parseFloat(price);
        return numPrice > 0 ? `AED ${numPrice.toFixed(2)}` : 'Contact for price';
    }

    setupEventListeners() {
        if (!this.carousel) return;

        // Scroll amount for each click (in pixels)
        const scrollAmount = 320; // Roughly one product card width

        this.prevBtn.addEventListener('click', () => {
            this.carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        this.nextBtn.addEventListener('click', () => {
            this.carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Update button states based on scroll position
        this.updateButtonStates();
        this.carousel.addEventListener('scroll', () => this.updateButtonStates());

        // Update button states on window resize
        window.addEventListener('resize', () => this.updateButtonStates());
    }

    updateButtonStates() {
        if (!this.carousel) return;

        // Check if carousel can scroll left
        const canScrollLeft = this.carousel.scrollLeft > 0;
        
        // Check if carousel can scroll right
        const canScrollRight = 
            this.carousel.scrollLeft < (this.carousel.scrollWidth - this.carousel.clientWidth - 10);

        this.prevBtn.style.opacity = canScrollLeft ? '1' : '0.5';
        this.prevBtn.style.cursor = canScrollLeft ? 'pointer' : 'not-allowed';
        this.prevBtn.style.pointerEvents = canScrollLeft ? 'auto' : 'none';

        this.nextBtn.style.opacity = canScrollRight ? '1' : '0.5';
        this.nextBtn.style.cursor = canScrollRight ? 'pointer' : 'not-allowed';
        this.nextBtn.style.pointerEvents = canScrollRight ? 'auto' : 'none';
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if carousel container exists
    if (document.querySelector('#productCarousel')) {
        // Wait a bit for ProductAPI to load
        setTimeout(() => {
            new ProductCarousel('#productCarousel', '#prevBtn', '#nextBtn');
        }, 100);
    }
});

// Export for manual initialization if needed
window.ProductCarousel = ProductCarousel;
