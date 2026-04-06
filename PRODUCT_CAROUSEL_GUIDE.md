# Product Carousel Implementation Guide

## Overview

The product carousel displays products from your WooCommerce API (yesshop.ae) in a smooth horizontal scrolling carousel on the homepage's "Re conditional Machinery" section.

## Features

✅ **Horizontal Scrolling Carousel** - Products scroll smoothly left/right  
✅ **API Integration** - Fetches products from yesshop.ae WooCommerce API  
✅ **Navigation Buttons** - Previous/Next buttons with smart enable/disable  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Price Display** - Shows current price and strikethrough original price if on sale  
✅ **Product Links** - Links to product page on yesshop.ae  
✅ **Smooth Animations** - Nice hover effects and transitions  
✅ **Loading State** - Shows loading spinner while fetching products

## Files Modified/Created

### 1. **index.html**

- **Modified**: Updated the "Re conditional Machinery" section
- **Added**: Product carousel container with prev/next buttons
- **Added**: CSS and JS script references

```html
<!-- Product Carousel Container -->
<div class="project-carousel-wrapper">
  <div class="carousel-nav carousel-prev" id="prevBtn">
    <i class="fa fa-chevron-left"></i>
  </div>
  <div class="carousel-container">
    <div class="product-carousel" id="productCarousel">
      <!-- Products will be loaded here dynamically -->
    </div>
  </div>
  <div class="carousel-nav carousel-next" id="nextBtn">
    <i class="fa fa-chevron-right"></i>
  </div>
</div>
```

### 2. **assets/css/module-css/product-carousel.css** (NEW)

Complete styling for the carousel:

- `.project-carousel-wrapper` - Container with flex layout
- `.carousel-nav` - Navigation button styling (green circular buttons)
- `.product-carousel` - Horizontal scrollable container
- `.product-carousel-item` - Individual product card sizing
- Responsive breakpoints for mobile, tablet, desktop
- Hover effects and animations

### 3. **assets/js/product-carousel.js** (NEW)

JavaScript class handling carousel functionality:

- **ProductCarousel class** - Main carousel controller
- `init()` - Initializes carousel and event listeners
- `loadProducts()` - Fetches products from API
- `renderCarousel()` - Renders product cards
- `setupEventListeners()` - Attaches click handlers to navigation buttons
- `updateButtonStates()` - Enables/disables buttons based on scroll position

### 4. **assets/js/product-api.js** (EXISTING)

Already in your project - provides API integration:

- `fetchProducts()` - Fetches products from WooCommerce API
- `buildApiUrl()` - Constructs API URL with authentication
- Authentication uses consumer key/secret for WooCommerce API access

## How It Works

### 1. **Page Load**

```javascript
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector("#productCarousel")) {
    setTimeout(() => {
      new ProductCarousel("#productCarousel", "#prevBtn", "#nextBtn");
    }, 100);
  }
});
```

### 2. **Product Fetching**

The carousel loads products using the existing `ProductAPI.fetchProducts()` function which calls the WooCommerce API at `https://www.yesshop.ae/wp-json/wc/v3/products`

### 3. **Rendering**

Products are rendered as cards with:

- Product image (with lazy loading)
- Product name
- Price (with sale price support)
- "Buy Now" button linking to product page

### 4. **Navigation**

Users can click Previous/Next buttons to scroll the carousel:

```javascript
this.prevBtn.addEventListener("click", () => {
  this.carousel.scrollBy({
    left: -scrollAmount,
    behavior: "smooth",
  });
});
```

### 5. **Button States**

Buttons are automatically disabled when reaching carousel ends:

```javascript
const canScrollLeft = this.carousel.scrollLeft > 0;
const canScrollRight =
  this.carousel.scrollLeft <
  this.carousel.scrollWidth - this.carousel.clientWidth - 10;
```

## Responsive Breakpoints

| Device              | Items Visible | Min Width |
| ------------------- | ------------- | --------- |
| Desktop (>1200px)   | 3 items       | 280px     |
| Tablet (768-1200px) | 2 items       | 250px     |
| Mobile (<768px)     | 1 item        | 220px     |

## Customization

### Change Scroll Amount

Edit in `product-carousel.js`:

```javascript
const scrollAmount = 320; // pixels per click
```

### Change Button Color

Edit in `product-carousel.css`:

```css
.carousel-nav {
  background: #9dc33b; /* Change this color */
}
```

### Change Items Per Page

The carousel shows all products and users scroll through them. To limit initial items, modify `product-api.js`:

```javascript
productsPerPage: 12; // Change to desired number
```

### Change Button Size

Edit in `product-carousel.css`:

```css
.carousel-nav {
  width: 50px;
  height: 50px;
}
```

## API Information

The carousel uses your existing API configuration from `product-api.js`:

- **API URL**: `https://www.yesshop.ae/wp-json/wc/v3/products`
- **Method**: WooCommerce REST API v3
- **Authentication**: Basic Auth with Consumer Key/Secret
- **Products Per Page**: 12 (configurable)

## Browser Support

✅ Chrome/Edge (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- Products are lazy-loaded with `loading="lazy"` attribute
- Smooth scroll behavior is hardware-accelerated
- CSS transitions use GPU acceleration
- Navigation buttons have pointer-events management for better performance

## Troubleshooting

### Products Not Loading

1. Check browser console for errors
2. Verify `product-api.js` is loaded before `product-carousel.js`
3. Ensure WooCommerce API credentials are correct in `product-api.js`
4. Check network tab to see API response

### Carousel Not Scrolling

1. Ensure CSS file is loaded: check `<link rel="stylesheet" href="assets/css/module-css/product-carousel.css">`
2. Verify JavaScript file is loaded: check `<script src="assets/js/product-carousel.js"></script>`
3. Check browser console for JavaScript errors

### Buttons Not Working

1. Verify IDs match: `#prevBtn` and `#nextBtn` in HTML
2. Check if JavaScript is enabled
3. Look for console errors

## Future Enhancements

- Add category filter dropdown
- Add keyboard navigation (arrow keys)
- Add touch swipe support for mobile
- Add autoplay carousel option
- Add product quick view modal
- Add "Add to Cart" functionality if integrated with WooCommerce
