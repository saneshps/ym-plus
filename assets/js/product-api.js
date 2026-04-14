/**
 * Product API Integration
 * Fetches products and categories from yesshop.ae WooCommerce API
 */

const API_CONFIG = {
    baseUrl: 'https://www.yesshop.ae',
    productsPath: '/wp-json/wc/v3/products',
    categoriesPath: '/wp-json/wc/v3/products/categories',
    consumerKey: 'ck_c6692dd069593bcb20c3a99e1d0fbfa64f2c0250',
    consumerSecret: 'cs_7ae7ed8855d4d065cdfd0e3b40576af3df5fc530',
    productsPerPage: 12,
    timeout: 5000 // 5 second timeout
};

// Pagination state
let paginationState = {
    currentPage: 1,
    totalPages: 1,
    categoryId: null
};

/**
 * Generate Basic Auth header
 */
function generateAuthHeader() {
    const credentials = API_CONFIG.consumerKey + ':' + API_CONFIG.consumerSecret;
    return 'Basic ' + btoa(credentials);
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Build API URL with parameters
 */
function buildApiUrl(endpoint, params = {}) {
    const baseUrl = `${API_CONFIG.baseUrl}${endpoint}`;
    const defaultParams = {
        consumer_key: API_CONFIG.consumerKey,
        consumer_secret: API_CONFIG.consumerSecret,
        per_page: API_CONFIG.productsPerPage
    };
    
    const allParams = { ...defaultParams, ...params };
    const queryString = Object.entries(allParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    
    return `${baseUrl}?${queryString}`;
}

/**
 * Fetch products from WooCommerce API
 * @param {number} page - Page number
 * @param {number} categoryId - Optional category ID filter
 */
async function fetchProducts(page = 1, categoryId = null) {
    try {
        const params = {
            page: page,
            per_page: API_CONFIG.productsPerPage
        };
        
        if (categoryId) {
            params.category = categoryId;
        }
        
        const url = buildApiUrl(API_CONFIG.productsPath, params);
        
        const response = await fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': generateAuthHeader()
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const products = await response.json();
        
        // Get total pages from response headers
        const totalPages = response.headers.get('x-wp-totalpages') || 1;
        
        return {
            products: products,
            totalPages: parseInt(totalPages)
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        // Return empty state instead of null
        return {
            products: [],
            totalPages: 1
        };
    }
}

/**
 * Fetch product categories from WooCommerce API
 */
async function fetchCategories() {
    try {
        const url = buildApiUrl(API_CONFIG.categoriesPath, { per_page: 100 });
        
        const response = await fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': generateAuthHeader()
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

/**
 * Create pagination HTML
 */
function createPaginationHtml(currentPage, totalPages) {
    if (totalPages <= 1) return '';
    
    let paginationHtml = '<div class="pagination-wrapper" style="display:flex;justify-content:center;align-items:center;gap:8px;margin-top:0px;margin-bottom:80px;">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHtml += `
            <button class="pagination-btn pagination-prev" data-page="${currentPage - 1}" 
                    style="padding:8px 12px;border:1px solid #ddd;background:#f9f9f9;cursor:pointer;border-radius:4px;transition:all 0.3s;">
                <i class="fa fa-chevron-left"></i>  
            </button>
        `;
    } else {
        paginationHtml += `
            <button class="pagination-btn" disabled 
                    style="padding:8px 12px;border:1px solid #ddd;background:#f0f0f0;color:#999;cursor:not-allowed;border-radius:4px;">
                <i class="fa fa-chevron-left"></i>  
            </button>
        `;
    }
    
    // Page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHtml += `<button class="pagination-btn" data-page="1" style="padding:8px 12px;border:1px solid #ddd;background:#f9f9f9;cursor:pointer;border-radius:4px;transition:all 0.3s;">1</button>`;
        if (startPage > 2) {
            paginationHtml += `<span style="color:#999;">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHtml += `<button class="pagination-btn active" data-page="${i}" style="padding:8px 12px;border:1px solid #9dc33b;background:#9dc33b;color:white;cursor:pointer;border-radius:4px;font-weight:bold;">${i}</button>`;
        } else {
            paginationHtml += `<button class="pagination-btn" data-page="${i}" style="padding:8px 12px;border:1px solid #ddd;background:#f9f9f9;cursor:pointer;border-radius:4px;transition:all 0.3s;">${i}</button>`;
        }
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHtml += `<span style="color:#999;">...</span>`;
        }
        paginationHtml += `<button class="pagination-btn" data-page="${totalPages}" style="padding:8px 12px;border:1px solid #ddd;background:#f9f9f9;cursor:pointer;border-radius:4px;transition:all 0.3s;">${totalPages}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHtml += `
            <button class="pagination-btn pagination-next" data-page="${currentPage + 1}" 
                    style="padding:8px 12px;border:1px solid #ddd;background:#f9f9f9;cursor:pointer;border-radius:4px;transition:all 0.3s;">
                 <i class="fa fa-chevron-right"></i>
            </button>
        `;
    } else {
        paginationHtml += `
            <button class="pagination-btn" disabled 
                    style="padding:8px 12px;border:1px solid #ddd;background:#f0f0f0;color:#999;cursor:not-allowed;border-radius:4px;">
                  <i class="fa fa-chevron-right"></i>
            </button>
        `;
    }
    
    paginationHtml += '</div>';
    return paginationHtml;
}

/**
 * Add pagination event listeners
 */
function addPaginationListeners() {
    const paginationBtns = document.querySelectorAll('.pagination-btn:not([disabled])');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const page = parseInt(btn.dataset.page);
            paginationState.currentPage = page;
            // Scroll to top
            document.querySelector('.api-list').scrollIntoView({ behavior: 'smooth' });
            await displayProducts(page, paginationState.categoryId);
        });
        
        // Add hover effects
        btn.addEventListener('mouseenter', function() {
            if (!this.disabled && !this.classList.contains('active')) {
                this.style.borderColor = '#9dc33b';
                this.style.background = '#f0f8f0';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.disabled && !this.classList.contains('active')) {
                this.style.borderColor = '#ddd';
                this.style.background = '#f9f9f9';
            }
        });
    });
}

/**
 * Format price display
 */
function formatPrice(price) {
    if (!price) return 'Contact for price';
    const numPrice = parseFloat(price);
    return numPrice > 0 ? `AED ${numPrice.toFixed(2)}` : 'Contact for price';
}

/**
 * Create product card HTML
 */
function createProductCard(product) {
    const image = product.images && product.images.length > 0 ? product.images[0].src : 'assets/images/placeholder.png';
    const title = product.name || 'Product';
    const price = product.price ? formatPrice(product.price) : formatPrice(product.sale_price);
    const originalPrice = product.regular_price ? formatPrice(product.regular_price) : '';
    const link = product.permalink || '#';
    const description = product.short_description || 'Professional machinery with advanced features and reliable performance.';
    
    let priceDisplay = price;
    let originalPriceDisplay = originalPrice;
    
    return `
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 product-card-wrapper" data-wow-delay="100ms">
            <div class="product-card" style="border-radius:8px;overflow:hidden;transition:all 0.3s ease;display:flex;flex-direction:column;height:100%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <!-- Image Section -->
                <div class="product-card__img-section" style="background:#fff;padding:0px;text-align:center;flex-shrink:0;min-height:240px;display:flex;align-items:center;justify-content:center;">
                    <a href="${link}" target="_blank" style="text-decoration:none;display:inline-block;max-width:100%;">
                        <img src="${image}" alt="${title}" style="">
                    </a>
                </div>
                
                <!-- Content Section -->
                <div class="product-card__content" style="padding:16px;flex-grow:1;display:flex;flex-direction:column;justify-content:space-between;">
                    <!-- Title -->
                    <a href="${link}" target="_blank" style="text-decoration:none;color:inherit;">
                        <h3 class="product-card__title">${title}</h3>
                    </a>
                    
                    <!-- Short Description - very small -->
                    <!-- <p class="product-card__description" >${description.substring(0, 50)}...</p> -->

                    <!-- Price & Button Section in One Row -->
                    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px;"
                        <!-- Price Section -->
                        <div class="product-card__price">
                            ${originalPrice && originalPrice !== price ? 
                                `<p class="product-card__original-price">${originalPriceDisplay}</p>` 
                                : ''}
                            <p class="product-card__current-price">${priceDisplay}</p>
                        </div>
                        
                        <!-- Button Section -->
                        <a href="${link}" target="_blank" class="product-card__link thm-btn">
                           Buy Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Display category filter dropdown
 */
async function displayCategoryFilter(containerId = '.api-list .container') {
    try {
        const categories = await fetchCategories();
        
        if (!categories || categories.length === 0) return;
        
        const container = document.querySelector(containerId);
        if (!container) return;
        
        // Create filter section
        const filterHtml = `
            <div class="category-filter" style="margin-bottom:30px;text-align:right;">
                <label style="font-weight:600;margin-right:12px;font-size:12px; color:#333;">Filter by Category:</label>
                <select id="categorySelect" style="padding:8px 12px;border:1px solid #ddd;border-radius:4px;font-size:13px;cursor:pointer;">
                    <option value="">All Products</option>
                    ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                </select>
            </div>
        `;
        
        // Insert before .row
        const row = container.querySelector('.row');
        if (row) {
            row.insertAdjacentHTML('beforebegin', filterHtml);
        }
        
        // Add event listener
        const select = document.getElementById('categorySelect');
        if (select) {
            select.addEventListener('change', async (e) => {
                const categoryId = e.target.value ? parseInt(e.target.value) : null;
                paginationState.currentPage = 1; // Reset to first page
                await displayProducts(1, categoryId);
            });
        }
    } catch (error) {
        console.error('Error displaying categories:', error);
    }
}

/**
 * Display products in the API list section
 * @param {number} page - Page number
 * @param {number} categoryId - Optional category ID filter
 */
async function displayProducts(page = 1, categoryId = null) {
    const apiListSection = document.querySelector('.api-list .container .row');
    
    if (!apiListSection) {
        console.error('API list section not found');
        return;
    }

    // Show loading message
    apiListSection.innerHTML = `
        <div class="col-12" style="text-align:center;padding:40px;font-size:16px;color:#666;">
            <div style="display:inline-block;">
                <div class="spinner" style="border:3px solid #f3f3f3;border-top:3px solid #9dc33b;border-radius:50%;width:30px;height:30px;animation:spin 1s linear infinite;margin-bottom:10px;"></div>
                <p>Loading products...</p>
            </div>
        </div>
    `;

    // Fetch products
    const response = await fetchProducts(page, categoryId);
    let products = response.products;
    const totalPages = response.totalPages;

    // Update pagination state
    paginationState.currentPage = page;
    paginationState.totalPages = totalPages;
    paginationState.categoryId = categoryId;

    if (!products || products.length === 0) {
        apiListSection.innerHTML = `
            <div class="col-12" style="text-align:center;padding:40px;font-size:16px;color:#999;">
                <p>No products found. Please try again later.</p>
            </div>
        `;
        return;
    }

    // Strict filter: Only products with BOTH valid image AND valid price
    products = products.filter(product => {
        // Check for valid image
        const hasValidImage = product.images && 
                             product.images.length > 0 && 
                             product.images[0].src && 
                             !product.images[0].src.includes('placeholder');
        
        // Check for valid price (must be a number greater than 0)
        const hasValidPrice = (product.price && parseFloat(product.price) > 0) || 
                             (product.sale_price && parseFloat(product.sale_price) > 0);
        
        // Must have both
        return hasValidImage && hasValidPrice;
    });

    if (products.length === 0) {
        // Still show pagination even if no products on this page, so user can navigate
        const paginationHtml = createPaginationHtml(page, totalPages);
        const noProductsMsg = `
            <div class="col-12" style="text-align:center;padding:40px;font-size:16px;color:#999;">
                <p>No valid products available on this page. Try another page or category.</p>
            </div>
        `;
        apiListSection.innerHTML = noProductsMsg + paginationHtml;
        addPaginationListeners();
        return;
    }

    // Generate product cards
    const productHtml = products.map(product => createProductCard(product)).join('');
    
    // Create pagination HTML
    const paginationHtml = createPaginationHtml(page, totalPages);
    
    // Add CSS animation and styles
    if (!document.querySelector('#product-api-styles')) {
        const style = document.createElement('style');
        style.id = 'product-api-styles';
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .project-one__single {
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                transition: all 0.3s ease;
            }
            .project-one__single:hover {
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                transform: translateY(-4px);
            }
            .pagination-wrapper {
                margin-top: 40px;
                margin-bottom: 40px;
            }
        `;
        document.head.appendChild(style);
    }

    // Update section with products and pagination
    apiListSection.innerHTML = productHtml + paginationHtml;

    // Add pagination event listeners
    addPaginationListeners();

    // Re-initialize animations if WOW.js is available
    if (window.WOW) {
        new WOW().init();
    }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the re-conditional machinery page
    if (document.querySelector('.api-list')) {
        // Use Promise.allSettled to prevent one failure from blocking the other
        Promise.allSettled([
            displayCategoryFilter(),
            displayProducts()
        ]).catch(error => {
            console.error('Error initializing product API:', error);
            // Page will still be functional even if API fails
        });
    }
});

// Export for manual initialization if needed
window.ProductAPI = {
    fetchProducts,
    fetchCategories,
    displayProducts,
    displayCategoryFilter,
    formatPrice
};
