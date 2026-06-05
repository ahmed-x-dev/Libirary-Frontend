// ==========================================================================
// RENDERER - Handles all DOM rendering logic
// ==========================================================================

const DEFAULT_POSTER = 'https://placehold.co/150x220/2a2a2a/ffffff?text=No+Poster';

/**
 * Render library items to the media grid
 * @param {array} dataArray - Array of media items to render
 */
export function renderLibrary(dataArray) {
    const gridTarget = document.getElementById('media-grid');
    
    if (!gridTarget) {
        console.error('Media grid container not found');
        return;
    }

    // Clear existing HTML
    gridTarget.innerHTML = '';

    dataArray.forEach(item => {
        // Create card container
        const card = document.createElement('article');
        card.className = 'media-card';
        
        // Set data attributes for filtering
        card.setAttribute('data-id', item.id);
        card.setAttribute('data-type', item.type);
        card.setAttribute('data-status', item.status);

        // Use fallback poster if image is missing
        const posterSrc = item.img ? item.img : DEFAULT_POSTER;

        // Build card HTML with error handling
        card.innerHTML = `
            <div class="media-card-poster">
                <img 
                    src="${posterSrc}" 
                    onerror="this.onerror=null; this.src='${DEFAULT_POSTER}';" 
                    alt="${sanitizeHTML(item.title)} poster" 
                    width="150" 
                    height="220"
                >
            </div>
            <div class="media-card-info">
                <h3 class="media-card-title">${sanitizeHTML(item.title)}</h3>
                <span class="media-card-year">${sanitizeHTML(item.year)}</span>
            </div>
        `;

        gridTarget.appendChild(card);
    });
}

/**
 * Basic HTML sanitization to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show modal with media item details
 * @param {HTMLElement} card - The media card element
 */
export function showItemModal(card) {
    const modal = document.getElementById('item-modal');
    if (!modal) return;

    // Extract data from card
    const title = card.querySelector('.media-card-title')?.textContent || '';
    const year = card.querySelector('.media-card-year')?.textContent || '';
    const image = card.querySelector('img')?.src || DEFAULT_POSTER;

    // Update modal content
    const modalTitle = document.getElementById('modal-item-title');
    const modalYear = document.getElementById('modal-item-year');
    const modalImage = document.getElementById('modal-poster-img');

    if (modalTitle) modalTitle.textContent = title;
    if (modalYear) modalYear.textContent = year;
    if (modalImage) modalImage.src = image;

    // Reset and show modal
    resetItemModalTabs();
    modal.showModal();
}

/**
 * Reset modal tabs to initial state
 */
export function resetItemModalTabs() {
    const modalTabButtons = document.querySelectorAll('#modal-tabs button[data-modal-tab]');
    const modalPanels = document.querySelectorAll('.modal-tab-panel');

    modalTabButtons.forEach((b, idx) => {
        if (idx === 0) b.classList.add('active');
        else b.classList.remove('active');
    });

    modalPanels.forEach((panel, idx) => {
        if (idx === 0) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
    });
}

/**
 * Update star display based on rating value
 * @param {number} scoreValue - Rating value (1-10)
 */
export function updateStarDisplay(scoreValue) {
    const starButtons = document.querySelectorAll('#star-rating .star');
    
    starButtons.forEach(star => {
        const currentStarWeight = parseInt(star.getAttribute('data-value'), 10);
        if (currentStarWeight <= scoreValue) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

/**
 * Open search modal
 */
export function openSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (searchModal) {
        searchModal.showModal();
    }
}

/**
 * Close any open dialog
 * @param {HTMLDialogElement} modal - The modal to close
 */
export function closeModal(modal) {
    if (modal && modal.tagName === 'DIALOG') {
        modal.close();
    }
}
