# Product Carousel Visual Structure

## HTML Structure

```
.project-one (section)
├── .container
│   ├── .project-one__top
│   │   ├── .section-title (heading)
│   │   └── .project-one__btn-box (More button)
│   │
│   └── .project-carousel-wrapper
│       ├── .carousel-nav.carousel-prev (#prevBtn)
│       │   └── <i class="fa fa-chevron-left"></i>
│       │
│       ├── .carousel-container
│       │   └── .product-carousel (#productCarousel)
│       │       ├── .product-carousel-item
│       │       │   └── .project-one__single
│       │       │       └── <a> (product link)
│       │       │           ├── .project-one__img-box
│       │       │           │   └── .project-one__img
│       │       │           │       ├── <img> (product image)
│       │       │           │       └── .project-one__arrow
│       │       │           │
│       │       │           └── .project-one__content
│       │       │               ├── .project-one__title (product name)
│       │       │               ├── .product-price (price)
│       │       │               └── .thm-btn (Buy Now button)
│       │       │
│       │       ├── .product-carousel-item
│       │       │   └── ... (next product)
│       │       │
│       │       └── ... (more products)
│       │
│       └── .carousel-nav.carousel-next (#nextBtn)
│           └── <i class="fa fa-chevron-right"></i>
```

---

## CSS Class Hierarchy

### Container Classes

- `.project-carousel-wrapper` - Main flex container
  - `display: flex`
  - `gap: 20px`
  - `align-items: center`

- `.carousel-container` - Overflow hidden wrapper
  - `flex: 1`
  - `overflow: hidden`
  - `border-radius: 8px`

### Carousel Classes

- `.product-carousel` - Horizontal scroll container
  - `display: flex`
  - `scroll-behavior: smooth`
  - `overflow-x: auto`
  - `scroll-snap-type: x mandatory`

- `.product-carousel-item` - Individual product wrapper
  - `flex: 0 0 calc(33.333% - 14px)` (desktop)
  - `scroll-snap-align: start`
  - `scroll-snap-stop: always`

### Navigation Classes

- `.carousel-nav` - Button base styling
  - `width: 50px`
  - `height: 50px`
  - `background: #9dc33b`
  - `border-radius: 50%`
  - `cursor: pointer`

- `.carousel-nav.carousel-prev` - Previous button
- `.carousel-nav.carousel-next` - Next button

### Product Card Classes (reused from existing design)

- `.project-one__single` - Card container
  - `border: 1px solid #e0e0e0`
  - `border-radius: 8px`
  - `display: flex`
  - `flex-direction: column`
  - `height: 100%`

- `.project-one__img-box` - Image container
  - `flex-shrink: 0`

- `.project-one__img` - Image wrapper
  - `height: 220px`
  - `overflow: hidden`
  - `display: flex`
  - `align-items: center`
  - `justify-content: center`

- `.project-one__content` - Content wrapper
  - `padding: 15px`
  - `flex-grow: 1`
  - `display: flex`
  - `flex-direction: column`

- `.project-one__title` - Product name
  - `font-size: 15px`
  - `font-weight: 600`
  - `line-height: 1.4`

- `.project-one__sub-title` - Category/subtitle
  - `font-size: 12px`
  - `color: #9dc33b`

- `.product-price` - Price display
  - `color: #9dc33b`
  - `font-weight: 700`
  - `font-size: 16px`

- `.product-price-original` - Strikethrough original price
  - `color: #999`
  - `text-decoration: line-through`
  - `font-size: 13px`

- `.thm-btn` - Buy Now button
  - `background: #9dc33b`
  - `color: white`
  - `padding: 8px 20px`
  - `border-radius: 30px`
  - `font-size: 12px`
  - `font-weight: 600`

---

## JavaScript Class Structure

```
ProductCarousel
├── Properties
│   ├── carousel (DOM element)
│   ├── prevBtn (DOM element)
│   ├── nextBtn (DOM element)
│   ├── products (array)
│   └── isLoading (boolean)
│
├── Methods
│   ├── constructor(carouselSelector, prevBtnSelector, nextBtnSelector)
│   ├── init() → async
│   ├── loadProducts() → async
│   ├── renderCarousel()
│   ├── createProductCardHtml(product) → string
│   ├── formatPrice(price) → string
│   ├── setupEventListeners()
│   └── updateButtonStates()
│
└── Event Listeners
    ├── prevBtn.click → carousel.scrollBy(left: -320)
    ├── nextBtn.click → carousel.scrollBy(left: 320)
    ├── carousel.scroll → updateButtonStates()
    └── window.resize → updateButtonStates()
```

---

## Data Flow Diagram

```
┌─────────────────────────────────┐
│    Page Load (DOM Ready)        │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   ProductCarousel instantiated  │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   loadProducts() called          │
│   Shows loading spinner          │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ window.ProductAPI.fetchProducts()│
│ (API call to yesshop.ae)        │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ WooCommerce API Response        │
│ (array of product objects)      │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   renderCarousel()              │
│   Maps products → HTML cards    │
│   Appends to #productCarousel   │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  setupEventListeners()          │
│  Attaches click handlers        │
│  updateButtonStates()           │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   Carousel Ready!               │
│   User can click prev/next      │
│   Buttons scroll carousel       │
└─────────────────────────────────┘
```

---

## Responsive Layout

### Desktop (>1200px)

```
┌────────────────────────────────────────────┐
│  < |  Product1  | Product2  | Product3  | > │
└────────────────────────────────────────────┘
   ^                                          ^
   └─ Visible: 3 items
```

### Tablet (768-1200px)

```
┌──────────────────────────────┐
│  < |  Product1  | Product2  | > │
└──────────────────────────────┘
   ^                         ^
   └─ Visible: 2 items
```

### Mobile (<768px)

```
┌───────────────────┐
│  < | Product1  | > │
└───────────────────┘
   ^               ^
   └─ Visible: 1 item
```

---

## API Response Structure

```javascript
{
  "products": [
    {
      "id": 123,
      "name": "Product Name",
      "permalink": "https://yesshop.ae/product-name",
      "price": "1299.99",
      "regular_price": "1599.99",
      "sale_price": "1299.99",
      "images": [
        {
          "id": 456,
          "src": "https://yesshop.ae/image.jpg",
          "alt": "Product Image"
        }
      ]
    },
    // ... more products
  ],
  "totalPages": 5
}
```

---

## Event Flow

```
User Opens Page
      │
      ↓
ProductCarousel.init()
      │
      ├─→ loadProducts() ────→ Fetch API ────→ renderCarousel()
      │
      └─→ setupEventListeners()
            │
            ├─→ prevBtn.click ──→ carousel.scrollBy(-320)
            │                          │
            │                          ↓
            │                    updateButtonStates()
            │
            ├─→ nextBtn.click ──→ carousel.scrollBy(+320)
            │                          │
            │                          ↓
            │                    updateButtonStates()
            │
            └─→ carousel.scroll ──→ updateButtonStates()


User Interaction Examples:
─────────────────────────

1. Click Next Button:
   carousel.scrollBy({left: 320, behavior: 'smooth'})
   ↓
   Carousel smoothly scrolls to the right
   ↓
   updateButtonStates() checks scroll position
   ↓
   If can't scroll more, disable next button

2. Click Previous Button:
   carousel.scrollBy({left: -320, behavior: 'smooth'})
   ↓
   Carousel smoothly scrolls to the left
   ↓
   updateButtonStates() checks scroll position
   ↓
   If at start, disable previous button
```

---

## Styling Cascade

```
Base Styles (in product-carousel.css)
        │
        ├─→ .project-carousel-wrapper
        │   └─→ .carousel-nav
        │   └─→ .carousel-container
        │       └─→ .product-carousel
        │           └─→ .product-carousel-item
        │               └─→ .project-one__single
        │
        ├─→ Hover States (:hover)
        │   └─→ .carousel-nav:hover
        │   └─→ .project-one__single:hover
        │       └─→ .project-one__arrow:hover
        │
        ├─→ Active States (:active)
        │   └─→ .carousel-nav:active
        │
        ├─→ Disabled States (:[disabled])
        │   └─→ opacity: 0.5
        │   └─→ pointer-events: none
        │
        └─→ Animations (@keyframes)
            └─→ spin (loading spinner)
                └─→ 0% rotate(0deg)
                └─→ 100% rotate(360deg)
```

---

## Color Scheme

| Element            | Color     | Usage                               |
| ------------------ | --------- | ----------------------------------- |
| Primary Button     | `#9dc33b` | Navigation buttons, price, accents  |
| Hover Button       | `#8cb330` | Button hover state (darker green)   |
| Border             | `#e0e0e0` | Product card border                 |
| Text Primary       | `#222`    | Product titles                      |
| Text Secondary     | `#666`    | Loading text                        |
| Text Tertiary      | `#999`    | Original price, disabled state      |
| Background Light   | `#f9f9f9` | Button background, image background |
| Background Lighter | `#f0f8f0` | Button hover background             |

---

## Responsive Breakpoints

```css
/* Desktop (default) */
Desktop (>1200px): 3 items, 280px min-width

/* Tablet */
@media (max-width: 1200px)
Tablet (768-1200px): 2 items, 250px min-width

/* Mobile */
@media (max-width: 768px)
Mobile (<768px): 1 item, 220px min-width

/* Small Mobile */
@media (max-width: 480px)
Extra Small (<480px): 1 item, condensed buttons
```

---

## Performance Optimizations

✅ **Image Optimization**

- `loading="lazy"` attribute for deferred loading
- `object-fit: contain` for responsive sizing

✅ **CSS Performance**

- GPU-accelerated transitions
- `will-change` not needed for smooth scroll
- Minimal repaints with scroll-behavior: smooth

✅ **JavaScript Performance**

- Single class instantiation
- Event delegation where possible
- Debounced resize listener (via scroll event)

✅ **Browser Features**

- CSS scroll-snap for better mobile UX
- Native smooth scrolling
- Hardware-accelerated animations
