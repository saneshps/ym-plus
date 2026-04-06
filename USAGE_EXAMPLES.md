# Usage Examples & Code Snippets

## Basic Implementation (Already Done!)

The product carousel is automatically initialized on the homepage. It:

1. Fetches products from your WooCommerce API
2. Renders them in a scrollable carousel
3. Handles navigation automatically

**No additional setup needed!** Just visit your homepage and it works.

---

## Manual Initialization (Advanced)

If you need to manually initialize the carousel elsewhere:

```javascript
// Make sure both API and carousel scripts are loaded
<script src="assets/js/product-api.js"></script>
<script src="assets/js/product-carousel.js"></script>

// Then manually initialize:
<script>
    document.addEventListener('DOMContentLoaded', function() {
        new ProductCarousel('#productCarousel', '#prevBtn', '#nextBtn');
    });
</script>
```

---

## Custom HTML Container

If you want to add the carousel to another page:

```html
<!-- Add this HTML wherever you want the carousel -->
<section class="project-one">
  <div class="container">
    <h2>My Products</h2>

    <div class="project-carousel-wrapper">
      <div class="carousel-nav carousel-prev" id="prevBtn">
        <i class="fa fa-chevron-left"></i>
      </div>
      <div class="carousel-container">
        <div class="product-carousel" id="productCarousel">
          <!-- Products loaded here -->
        </div>
      </div>
      <div class="carousel-nav carousel-next" id="nextBtn">
        <i class="fa fa-chevron-right"></i>
      </div>
    </div>
  </div>
</section>

<!-- Include stylesheets -->
<link rel="stylesheet" href="assets/css/module-css/product-carousel.css" />

<!-- Include scripts -->
<script src="assets/js/product-api.js"></script>
<script src="assets/js/product-carousel.js"></script>
```

---

## Access Carousel Programmatically

```javascript
// Get the carousel instance
const carousel = new ProductCarousel();

// Manually load products
carousel.loadProducts();

// Manually render carousel
carousel.renderCarousel();

// Manually update button states
carousel.updateButtonStates();
```

---

## Customize Product Card HTML

Edit in `product-carousel.js`, method `createProductCardHtml()`:

```javascript
// Current card structure:
createProductCardHtml(product) {
    const image = product.images && product.images.length > 0 ? product.images[0].src : 'assets/images/placeholder.png';
    const title = product.name || 'Product';
    const price = product.price ? this.formatPrice(product.price) : this.formatPrice(product.sale_price);

    return `
        <div class="project-one__single">
            <a href="${product.permalink}" target="_blank" class="carousel-item-link">
                <div class="project-one__img-box">
                    <div class="project-one__img">
                        <img src="${image}" alt="${title}" loading="lazy">
                        <div class="project-one__arrow"></div>
                    </div>
                </div>
                <div class="project-one__content">
                    <h3 class="project-one__title">${title}</h3>
                    <div style="margin-top:8px;font-size:13px;">
                        <span class="product-price">${price}</span>
                    </div>
                    <button class="thm-btn" style="margin-top: 10px;">Buy Now</button>
                </div>
            </a>
        </div>
    `;
}

// Example: Add product SKU:
createProductCardHtml(product) {
    // ... existing code ...

    const sku = product.sku || '';

    return `
        <!-- ... existing HTML ... -->
        <div class="project-one__content">
            <h3 class="project-one__title">${title}</h3>
            <p style="font-size:11px;color:#999;">SKU: ${sku}</p>
            <!-- ... rest of content ... -->
        </div>
    `;
}
```

---

## Change Scroll Behavior

### Increase scroll amount (scroll faster):

```javascript
// In product-carousel.js, in setupEventListeners():

// Default: 320px per click
const scrollAmount = 500; // Scroll more distance

this.prevBtn.addEventListener("click", () => {
  this.carousel.scrollBy({
    left: -scrollAmount,
    behavior: "smooth",
  });
});

this.nextBtn.addEventListener("click", () => {
  this.carousel.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });
});
```

### Change scroll animation (instant vs smooth):

```javascript
// Smooth scroll (current)
this.carousel.scrollBy({
  left: scrollAmount,
  behavior: "smooth", // Takes ~300-500ms
});

// Instant scroll
this.carousel.scrollBy({
  left: scrollAmount,
  behavior: "auto", // Instant jump
});
```

---

## Customize Loading Message

Edit in `product-carousel.js`, method `loadProducts()`:

```javascript
async loadProducts() {
    this.isLoading = true;

    // Custom loading HTML:
    this.carousel.innerHTML = `
        <div style="text-align:center;padding:40px;font-size:16px;color:#666;width:100%;">
            <div style="display:inline-block;">
                <div class="spinner"></div>
                <p>Loading your products...</p>
            </div>
        </div>
    `;

    // ... rest of method ...
}
```

---

## Customize Empty State

Edit in `product-carousel.js`, method `loadProducts()`:

```javascript
async loadProducts() {
    // ... fetch code ...

    if (response.products && response.products.length > 0) {
        this.products = response.products;
        this.renderCarousel();
    } else {
        // Custom empty message:
        this.carousel.innerHTML = `
            <div style="text-align:center;padding:40px;color:#999;">
                <i class="fa fa-inbox" style="font-size:48px;margin-bottom:20px;"></i>
                <p>Sorry, no products available at the moment.</p>
                <p style="font-size:12px;">Please check back soon!</p>
            </div>
        `;
    }
}
```

---

## Add Auto-Scroll Feature

Add this method to ProductCarousel class:

```javascript
class ProductCarousel {
  constructor(
    carouselSelector = "#productCarousel",
    prevBtnSelector = "#prevBtn",
    nextBtnSelector = "#nextBtn",
  ) {
    // ... existing code ...
    this.autoScrollInterval = null;
    this.autoScrollEnabled = false;
  }

  // New method: Start auto-scroll
  startAutoScroll(intervalMs = 5000) {
    if (this.autoScrollEnabled) return;

    this.autoScrollEnabled = true;
    this.autoScrollInterval = setInterval(() => {
      const scrollAmount = 320;
      const maxScroll = this.carousel.scrollWidth - this.carousel.clientWidth;

      if (this.carousel.scrollLeft < maxScroll) {
        this.carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
      } else {
        // Loop back to start
        this.carousel.scrollBy({ left: -maxScroll, behavior: "smooth" });
      }
    }, intervalMs);

    // Pause on hover
    this.carousel.addEventListener("mouseenter", () => this.stopAutoScroll());
    this.carousel.addEventListener("mouseleave", () =>
      this.startAutoScroll(intervalMs),
    );
  }

  // New method: Stop auto-scroll
  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
      this.autoScrollEnabled = false;
    }
  }
}

// Usage:
const carousel = new ProductCarousel(
  "#productCarousel",
  "#prevBtn",
  "#nextBtn",
);
carousel.startAutoScroll(5000); // Auto-scroll every 5 seconds
```

---

## Add Touch Swipe Support

Add this method to ProductCarousel class:

```javascript
class ProductCarousel {
  constructor(...args) {
    // ... existing code ...
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  setupEventListeners() {
    // ... existing event listeners ...

    // Add touch support
    this.carousel.addEventListener(
      "touchstart",
      (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      },
      false,
    );

    this.carousel.addEventListener(
      "touchend",
      (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      },
      false,
    );
  }

  handleSwipe() {
    const swipeThreshold = 50; // pixels
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - scroll right
        this.carousel.scrollBy({ left: 320, behavior: "smooth" });
      } else {
        // Swiped right - scroll left
        this.carousel.scrollBy({ left: -320, behavior: "smooth" });
      }
    }
  }
}
```

---

## Filter Products by Category

Add this to ProductCarousel class:

```javascript
class ProductCarousel {
  async filterByCategory(categoryId) {
    // Fetch products from specific category
    const response = await window.ProductAPI.fetchProducts(1, categoryId);

    if (response.products && response.products.length > 0) {
      this.products = response.products;
      this.renderCarousel();
      this.setupEventListeners();
    }
  }
}

// Usage:
const carousel = new ProductCarousel(
  "#productCarousel",
  "#prevBtn",
  "#nextBtn",
);
carousel.filterByCategory(15); // Filter to category ID 15
```

---

## Load More Products (Pagination)

Add this to ProductCarousel class:

```javascript
class ProductCarousel {
  constructor(...args) {
    // ... existing code ...
    this.currentPage = 1;
    this.totalPages = 1;
  }

  async loadNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      const response = await window.ProductAPI.fetchProducts(this.currentPage);

      if (response.products) {
        this.products = [...this.products, ...response.products];
        this.renderCarousel();
        this.updateButtonStates();

        // Scroll to bottom
        this.carousel.scrollLeft = this.carousel.scrollWidth;
      }
    }
  }

  async loadPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const response = await window.ProductAPI.fetchProducts(this.currentPage);

      if (response.products) {
        this.products = response.products;
        this.renderCarousel();
        this.setupEventListeners();

        // Scroll to top
        this.carousel.scrollLeft = 0;
      }
    }
  }
}
```

---

## Keyboard Navigation

Add this to ProductCarousel class:

```javascript
class ProductCarousel {
  setupEventListeners() {
    // ... existing code ...

    // Add keyboard support
    document.addEventListener("keydown", (e) => {
      if (!this.carousel.matches(":hover")) return;

      if (e.key === "ArrowLeft") {
        this.prevBtn.click();
      } else if (e.key === "ArrowRight") {
        this.nextBtn.click();
      }
    });
  }
}

// Now users can use arrow keys to navigate carousel
```

---

## Change Button Styling

Edit `product-carousel.css`:

```css
/* Make buttons square instead of circular */
.carousel-nav {
  width: 50px;
  height: 50px;
  border-radius: 0; /* Changed from 50% */
}

/* Make buttons rectangular */
.carousel-nav {
  width: 80px;
  height: 50px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Add text to buttons */
.carousel-nav::after {
  content: attr(data-text);
  margin-left: 5px;
}
```

HTML:

```html
<div class="carousel-nav carousel-prev" id="prevBtn" data-text="Back">
  <i class="fa fa-chevron-left"></i>
</div>

<div class="carousel-nav carousel-next" id="nextBtn" data-text="Next">
  <i class="fa fa-chevron-right"></i>
</div>
```

---

## Add Product Ratings

Edit `createProductCardHtml()` in product-carousel.js:

```javascript
createProductCardHtml(product) {
    // ... existing code ...

    const rating = product.average_rating || 0;
    const reviewCount = product.review_count || 0;

    const ratingHtml = rating > 0 ? `
        <div style="margin-top:8px;">
            <span style="color:#f39c12;">
                ${'★'.repeat(Math.round(rating))}${'☆'.repeat(5-Math.round(rating))}
            </span>
            <span style="font-size:12px;color:#999;margin-left:5px;">
                (${reviewCount} reviews)
            </span>
        </div>
    ` : '';

    return `
        <!-- ... existing product HTML ... -->
        <div class="project-one__content">
            <h3 class="project-one__title">${title}</h3>
            ${ratingHtml}
            <!-- ... rest of content ... -->
        </div>
    `;
}
```

---

## Error Handling

```javascript
// Add comprehensive error handling:
class ProductCarousel {
  async loadProducts() {
    try {
      this.isLoading = true;
      this.carousel.innerHTML = "<p>Loading...</p>";

      if (!window.ProductAPI) {
        throw new Error("ProductAPI not loaded");
      }

      const response = await window.ProductAPI.fetchProducts(1, null);

      if (!response) {
        throw new Error("No response from API");
      }

      if (!response.products || response.products.length === 0) {
        throw new Error("No products found");
      }

      this.products = response.products;
      this.renderCarousel();
    } catch (error) {
      console.error("Carousel Error:", error);

      this.carousel.innerHTML = `
                <div style="text-align:center;padding:40px;color:#c33;">
                    <i class="fa fa-exclamation-triangle" style="font-size:32px;margin-bottom:10px;"></i>
                    <p>Error loading products</p>
                    <p style="font-size:12px;color:#999;">${error.message}</p>
                    <button onclick="location.reload()" class="thm-btn">Reload Page</button>
                </div>
            `;
    } finally {
      this.isLoading = false;
    }
  }
}
```

---

## Performance Monitoring

```javascript
// Add performance tracking:
class ProductCarousel {
  constructor(...args) {
    // ... existing code ...
    this.performanceMetrics = {
      loadTime: 0,
      renderTime: 0,
      apiResponseTime: 0,
    };
  }

  async loadProducts() {
    const startTime = performance.now();

    try {
      const apiStart = performance.now();
      const response = await window.ProductAPI.fetchProducts(1, null);
      this.performanceMetrics.apiResponseTime = performance.now() - apiStart;

      const renderStart = performance.now();
      this.renderCarousel();
      this.performanceMetrics.renderTime = performance.now() - renderStart;
    } catch (error) {
      console.error("Error:", error);
    }

    this.performanceMetrics.loadTime = performance.now() - startTime;

    // Log metrics
    console.log("Carousel Performance:", this.performanceMetrics);
  }
}
```

---

## API Response Debugging

```javascript
// Add debugging to see API responses:
async function debugFetchProducts() {
  const response = await window.ProductAPI.fetchProducts(1, null);

  console.log("API Response:", response);
  console.log("Products Count:", response.products?.length);
  console.log("Total Pages:", response.totalPages);
  console.log("Sample Product:", response.products?.[0]);

  return response;
}

// Run in browser console:
// debugFetchProducts().then(data => console.log(data));
```

---

## All Examples in One File

Want to see a complete example with all features? Here's a full-featured carousel:

```javascript
class AdvancedProductCarousel extends ProductCarousel {
  constructor(carouselSelector, prevBtnSelector, nextBtnSelector) {
    super(carouselSelector, prevBtnSelector, nextBtnSelector);
    this.currentPage = 1;
    this.totalPages = 1;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.autoScrollInterval = null;
    this.autoScrollEnabled = false;
  }

  async init() {
    await super.init();
    // Add extra features
    this.addSwipeSupport();
    this.addKeyboardSupport();
    console.log("Advanced carousel initialized");
  }

  addSwipeSupport() {
    this.carousel.addEventListener("touchstart", (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    });

    this.carousel.addEventListener("touchend", (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.carousel.scrollBy({ left: 320, behavior: "smooth" });
      } else {
        this.carousel.scrollBy({ left: -320, behavior: "smooth" });
      }
    }
  }

  addKeyboardSupport() {
    document.addEventListener("keydown", (e) => {
      if (!this.carousel.matches(":hover")) return;

      if (e.key === "ArrowLeft") this.prevBtn.click();
      if (e.key === "ArrowRight") this.nextBtn.click();
    });
  }

  startAutoScroll(intervalMs = 5000) {
    if (this.autoScrollEnabled) return;

    this.autoScrollEnabled = true;
    this.autoScrollInterval = setInterval(() => {
      const maxScroll = this.carousel.scrollWidth - this.carousel.clientWidth;
      if (this.carousel.scrollLeft < maxScroll) {
        this.carousel.scrollBy({ left: 320, behavior: "smooth" });
      } else {
        this.carousel.scrollLeft = 0;
      }
    }, intervalMs);
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
      this.autoScrollEnabled = false;
    }
  }
}

// Usage:
const carousel = new AdvancedProductCarousel(
  "#productCarousel",
  "#prevBtn",
  "#nextBtn",
);
```

---

**Need more examples?** Check the other documentation files:

- `IMPLEMENTATION_SUMMARY.md` - Quick overview
- `PRODUCT_CAROUSEL_GUIDE.md` - Complete guide
- `CAROUSEL_STRUCTURE.md` - Structure and architecture
