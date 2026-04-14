const API_CONFIG = {
    baseUrl: 'https://www.yesshop.ae',
    productsPath: 'wp-json/wc/v3/products?category=55&consumer_key=ck_c6692dd069593bcb20c3a99e1d0fbfa64f2c0250&consumer_secret=cs_7ae7ed8855d4d065cdfd0e3b40576af3df5fc530',
    perPage: 12 // Products per page (4 columns x 3 rows = 12 products)
};

let allProducts = [];
let currentPage = 1;

// Fetch welding products from yesshop.ae API
async function fetchWeldingProducts() {
    try {
        const url = `${API_CONFIG.baseUrl}/${API_CONFIG.productsPath}&per_page=100`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        allProducts = await response.json();
        currentPage = 1;
        displayWeldingProducts();
        generatePagination();
    } catch (error) {
        console.error('Error fetching welding products:', error);
        displayErrorMessage('Failed to load welding products. Please try again later.');
    }
}

// Display products based on current page
function displayWeldingProducts() {
    const container = document.querySelector('.welding-api-list .row');
    
    if (!container) {
        console.error('Container not found');
        return;
    }
    
    if (!allProducts || allProducts.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">No products available</p></div>';
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * API_CONFIG.perPage;
    const endIndex = startIndex + API_CONFIG.perPage;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    
    let html = '';
    paginatedProducts.forEach(product => {
        html += createProductCard(product);
    });
    
    container.innerHTML = html;
    
    // Hide pagination while loading, show after products load
    const paginationWrapper = document.querySelector('.welding-pagination-wrapper');
    if (paginationWrapper) {
        paginationWrapper.style.display = 'flex';
    }
}

// Create individual product card HTML
function createProductCard(product) {
    const image = product.images && product.images.length > 0 ? product.images[0].src : 'assets/images/placeholder.png';
    
    // Handle pricing - show regular price and sale price if available
    let priceHTML = '';
    if (product.price) {
        if (product.regular_price && product.regular_price !== product.price) {
            // Show both regular and sale price
            priceHTML = `
                <div class="product-card__price-group">
                    <span class="product-card__regular-price">AED ${product.regular_price}</span>
                    <span class="product-card__sale-price">AED ${product.price}</span>
                </div>
            `;
        } else {
            // Show only current price
            priceHTML = `<span class="product-card__price">AED ${product.price}</span>`;
        }
    } else {
        priceHTML = `<span class="product-card__price">Contact for price</span>`;
    }
    
    const rating = product.average_rating ? `${product.average_rating} / 5` : 'No ratings';
    
    return `
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
        <div class="category-list">
            <div class="product-card">
                <div class="product-card__image">
                    <img src="${image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.name}</h3>
                    <div class="product-card__rating">
                        <span class="rating">${rating}</span>
                    </div>
                    <p class="product-card__description">${truncateText(product.description, 100)}</p>
                    <div class="product-card__footer">
                        ${priceHTML}
                        <a href="${product.permalink}" target="_blank" class="product-card__link thm-btn"> Buy Now  </a>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;
}

// Utility function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    const cleanText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
}

// Display error message
function displayErrorMessage(message) {
    const container = document.querySelector('.welding-api-list .row');
    if (container) {
        container.innerHTML = `<div class="col-12"><p class="text-center text-danger">${message}</p></div>`;
    }
}

// Generate pagination buttons
function generatePagination() {
    const totalPages = Math.ceil(allProducts.length / API_CONFIG.perPage);
    const paginationContainer = document.querySelector('.welding-pagination');
    
    if (!paginationContainer) {
        console.error('Pagination container not found');
        return;
    }
    
    let html = '';
    
    // Previous button
    if (currentPage > 1) {
        html += `<a href="#" class="pagination-btn pagination-prev" data-page="${currentPage - 1}">
                    <i class="fa fa-chevron-left"></i> Previous
                </a>`;
    } else {
        html += `<span class="pagination-btn pagination-prev disabled">
                    <i class="fa fa-chevron-left"></i> Previous
                </span>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += `<span class="pagination-btn pagination-page active">${i}</span>`;
        } else {
            html += `<a href="#" class="pagination-btn pagination-page" data-page="${i}">${i}</a>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        html += `<a href="#" class="pagination-btn pagination-next" data-page="${currentPage + 1}">
                    Next <i class="fa fa-chevron-right"></i>
                </a>`;
    } else {
        html += `<span class="pagination-btn pagination-next disabled">
                    Next <i class="fa fa-chevron-right"></i>
                </span>`;
    }
    
    paginationContainer.innerHTML = html;
    
    // Add event listeners
    document.querySelectorAll('.pagination-btn:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            if (page) {
                currentPage = page;
                displayWeldingProducts();
                generatePagination();
                // Scroll to products section
                document.querySelector('.welding-api-list').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Load products when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    fetchWeldingProducts();
});
