# Visual Guide - Product Carousel

## 🎨 Carousel Layout (Desktop View)

```
┌─────────────────────────────────────────────────────────────────────┐
│                   RE CONDITIONAL MACHINERY                          │
│                                                    [More →]          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [<]  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  [>]   │
│       │   Product 1  │  │   Product 2  │  │   Product 3  │         │
│       │              │  │              │  │              │         │
│       │  [IMAGE]     │  │  [IMAGE]     │  │  [IMAGE]     │         │
│       │  Title       │  │  Title       │  │  Title       │         │
│       │  AED 1,299   │  │  AED 2,499   │  │  AED 3,999   │         │
│       │ [Buy Now]    │  │ [Buy Now]    │  │ [Buy Now]    │         │
│       └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                      │
│              ← Carousel scrolls horizontally →                      │
│         (Products 4, 5, 6... are off-screen)                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Carousel Layout (Mobile View)

```
┌──────────────────────────────┐
│ RE CONDITIONAL MACHINERY     │
│                   [More →]   │
├──────────────────────────────┤
│                              │
│  [<] ┌──────────────┐ [>]   │
│      │   Product 1  │        │
│      │   [IMAGE]    │        │
│      │   Title      │        │
│      │   Price      │        │
│      │ [Buy Now]    │        │
│      └──────────────┘        │
│                              │
│   ← Scroll left/right →      │
│   (1 product at a time)      │
│                              │
└──────────────────────────────┘
```

---

## 🎛️ Navigation Button States

### Button Enabled (Can Scroll)

```
┌─────────┐
│  ✓ <   │  Clickable
│ Green  │  Opacity: 100%
│ Button │  Cursor: pointer
└─────────┘
```

### Button Disabled (At End)

```
┌─────────┐
│  ✗ >   │  Not clickable
│ Faded  │  Opacity: 50%
│ Button │  Cursor: not-allowed
└─────────┘
```

---

## 🎭 Product Card Interaction

### Default State

```
┌─────────────────────┐
│                     │
│   [Product Image]   │
│                     │
├─────────────────────┤
│ Product Name        │
│ AED 1,299          │
│ [Buy Now] Button   │
└─────────────────────┘

Subtle shadow
Card is static
```

### Hover State

```
┌─────────────────────┐
│                     │
│   [Product Image]   │    ↗️ Card lifts up
│        [→]          │    ✨ Green arrow appears
│                     │    📦 Shadow gets larger
├─────────────────────┤
│ Product Name        │
│ AED 1,299          │
│ [Buy Now] Button   │
└─────────────────────┘

Larger shadow
Card raised/elevated
Arrow visible
```

### Click to Product Page

```
┌─────────────────────┐
│                     │
│   [Product Image]   │
│        [→] Hover    │
│                     │
├─────────────────────┤
│ Product Name        │
│ AED 1,299          │
│ [Buy Now] ← Click   │
└─────────────────────┘
                          ↓ Opens in new window
                    (yesshop.ae product page)
```

---

## 🎬 Scroll Animation Sequence

### User Clicks "Next" Button

```
Step 1: Initial Position
    │ Product 1 │ Product 2 │ Product 3 │ Product 4 (off-screen)
    ↑ Visible              ↑

Step 2: Smooth Scroll Starts (~300ms animation)
    │ Product 1 │ Product 2 │ Product 3 │ Product 4
         ↓ Moving left

Step 3: Scroll in Progress
         │ Product 2 │ Product 3 │ Product 4 │ Product 5 (off-screen)
              ↓ Half way

Step 4: Final Position
              │ Product 2 │ Product 3 │ Product 4 │
              ↑ Visible              ↑
```

---

## 🎨 Color Scheme

### Primary Colors

```
Green (#9dc33b)
├─ Navigation Buttons
├─ Product Price
├─ Accent Elements
└─ Hover States (Darker: #8cb330)

Text Colors
├─ Primary (#222) - Product Names
├─ Secondary (#666) - Loading Text
├─ Tertiary (#999) - Original Price, Disabled
└─ Alert (#c33) - Errors

Background Colors
├─ Light (#f9f9f9) - Default backgrounds
├─ Lighter (#f0f8f0) - Button hover
├─ White (#fff) - Card backgrounds
└─ Subtle (#e0e0e0) - Borders
```

### Example Card with Colors

```
┌──────────────────────────┐
│      [Product Image]     │  Background: #f9f9f9
│                          │
├──────────────────────────┤
│ Product Name (Text #222) │
│ Original Price  $2,000   │  Color: #999, strikethrough
│ Sale Price $1,299  ✓    │  Color: #9dc33b (green)
│ [Buy Now Button]         │  Background: #9dc33b
│ (Hover: #8cb330)         │  Hover Background: #8cb330
└──────────────────────────┘
Border: 1px solid #e0e0e0
```

---

## 📐 Responsive Sizing

### Desktop (>1200px) - 3 Columns

```
┌──────────────────────────────────────────────────┐
│  [<]  [Card 280px] [Card 280px] [Card 280px] [>]  │
│       └─ 33.333% width ─┘                        │
│       Min width: 280px per card                  │
└──────────────────────────────────────────────────┘
```

### Tablet (768-1200px) - 2 Columns

```
┌──────────────────────────────┐
│  [<]  [Card 250px] [Card 250px]  [>]  │
│       └─ 50% width ─┘              │
│       Min width: 250px per card    │
└──────────────────────────────────────┘
```

### Mobile (<768px) - 1 Column

```
┌────────────────────┐
│ [<] [Card 220px] [>] │
│     └ 100% width ─┘ │
│     Min width: 220px │
└────────────────────┘
```

---

## ⏱️ Animation Timeline

### Button Click to Scroll Complete

```
0ms ─ User clicks button
    │
    ├─ Event fired → JavaScript calculates scroll position
    │
50ms ├─ CSS scroll-behavior: smooth begins animation
    │
150ms ├─ Mid-animation (~50% of scroll)
    │
300ms ├─ Animation completes
    │
    ├─ updateButtonStates() runs
    │
    ├─ Buttons enable/disable based on scroll position
    │
350ms └─ Ready for next click
```

### Hover Effect Timeline

```
0ms ─ Mouse enters card
    │
    ├─ Box-shadow increases
    │
    ├─ Card transforms up (translateY -4px)
    │
50ms ├─ Arrow opacity increases
    │
100ms ├─ Animation completes
    │
    └─ Ready for interaction
```

---

## 🔄 Loading State Sequence

### Page Load Animation

```
1. Page loads
   ↓
2. ProductCarousel class initializes
   ↓
3. loadProducts() called
   ↓
4. Show spinner + "Loading products..."
   ┌──────────────────┐
   │ ⟳ Loading...     │
   └──────────────────┘
   ↓ (while API call is made)
   ↓
5. API response received
   ↓
6. renderCarousel() called
   ↓
7. Hide spinner, show products
   ┌──────────────────────────────────┐
   │ [Product 1] [Product 2] [Product 3] │
   └──────────────────────────────────┘
   ↓
8. setupEventListeners() runs
   ↓
9. Ready for user interaction ✓
```

---

## 🎯 User Interaction Flow

```
User visits page
        │
        ↓
Products automatically load
        │
        ├─→ User clicks [Next Button]
        │   └─→ Carousel scrolls right
        │       └─→ More products appear
        │
        ├─→ User clicks [Product Card]
        │   └─→ Opens product page (new window)
        │
        ├─→ User reaches end of carousel
        │   └─→ [Next] button disables
        │
        └─→ User clicks [Previous Button]
            └─→ Carousel scrolls left
                └─→ Earlier products reappear
```

---

## 📊 File Structure Summary

```
index.html
├─ Head Section
│  └─ <link rel="stylesheet" href="product-carousel.css">
│
├─ Body Section
│  └─ <section class="project-one">
│     └─ <div class="project-carousel-wrapper">
│        ├─ <div class="carousel-nav carousel-prev" id="prevBtn">
│        ├─ <div class="carousel-container">
│        │  └─ <div class="product-carousel" id="productCarousel">
│        │     └─ [Products render here]
│        │
│        └─ <div class="carousel-nav carousel-next" id="nextBtn">
│
└─ End of Body
   ├─ <script src="product-api.js">
   └─ <script src="product-carousel.js">
```

---

## 🔗 Dependency Chain

```
index.html
    ↓
    ├─ product-carousel.css (styling)
    │
    ├─ product-api.js (API calls)
    │   ├─ Uses: yesshop.ae WooCommerce API
    │   └─ Exports: window.ProductAPI
    │
    └─ product-carousel.js (functionality)
        ├─ Depends on: window.ProductAPI
        ├─ Depends on: DOM elements with IDs
        └─ Exports: window.ProductCarousel
```

---

## 📋 Checklist - What Works

✅ **On Load**

- Carousel container renders
- Loading spinner shows
- API call initiates

✅ **During Load**

- Products fetched from API
- Images begin loading (lazy)
- Loading spinner animates

✅ **After Load**

- Products render as cards
- Cards display images, names, prices
- Navigation buttons appear
- Button states update
- Event listeners attached

✅ **On Interaction**

- Click button → Smooth scroll
- Hover card → Lift & shadow
- Click product → New window opens
- Reach end → Button disables

✅ **On Resize**

- Carousel adjusts layout
- Cards resize to breakpoint
- Button states update

---

## 🎓 Legend

| Symbol       | Meaning                |
| ------------ | ---------------------- |
| `[< ]`       | Previous button        |
| `[> ]`       | Next button            |
| `[..text..]` | HTML element           |
| `│`          | Container/nesting      |
| `├─`         | Branch/sibling         |
| `└─`         | Last branch/item       |
| `↓`          | Flow/process direction |
| `↗️`         | Transform/lift         |
| `✨`         | Animation/effect       |
| `✓`          | Complete/active        |
| `✗`          | Disabled/inactive      |

---

**This visual guide helps you understand the carousel layout, colors, interactions, and flow!** 🎨
