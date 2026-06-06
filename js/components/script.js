// ==========================================================================
// IMPORTS
// ==========================================================================
import { libraryService } from '../services/libraryService.js';
import { renderLibrary, showItemModal, resetItemModalTabs, updateStarDisplay, openSearchModal, closeModal } from './renderer.js';

// ==========================================================================
// INITIALIZE APP
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Load initial library data
    await libraryService.loadLibrary();
    
    // Render to grid
    const data = libraryService.getCachedData();
    renderLibrary(data);
    
    // Apply initial filter
    document.querySelector('#status-tabs button[data-status="want-to-watch"]')?.click();

    // Initialize all event listeners
    initializeSidebarRouting();
    initializeViewToggle();
    initializeFilterTabs();
    initializeModalHandlers();
    initializeStarRating();
    initializeLogout();
    initializeAddItemButton();
    initializeMobileMenu();
});

function initializeAddItemButton() {
    // Use event delegation to handle both add buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="add-item"]')) {
            // This catches both buttons automatically
            console.log("Add item button clicked!");
            openSearchModal();
        }
    });
}

// ==========================================================================
// MOBILE MENU TOGGLE
// ==========================================================================
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    if (!menuToggle) return;

    // Show menu toggle on mobile screens
    function updateMenuToggleVisibility() {
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'flex';
        } else {
            menuToggle.style.display = 'none';
            sidebar.classList.remove('active');
        }
    }

    // Toggle sidebar on button click
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close sidebar when clicking on a sidebar button
    sidebar.querySelectorAll('button[data-section], button[data-action]').forEach(button => {
        button.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });

    // Update visibility on resize
    window.addEventListener('resize', updateMenuToggleVisibility);
    
    // Initial check
    updateMenuToggleVisibility();
}

// ==========================================================================
// SELECT ROUTING INTERFACE ELEMENTS
// ==========================================================================
function initializeSidebarRouting() {
    const sidebarButtons = document.querySelectorAll('#sidebar button[data-section]');
    const pageTitle = document.getElementById('page-title');
    const headerControls = document.getElementById('header-controls');
    const allViews = document.querySelectorAll('.content-view');

    sidebarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.getAttribute('data-section');

            // 1. Sync Highlight States across Sidebar
            document.querySelector('#sidebar button.active')?.classList.remove('active');
            button.classList.add('active');

            // 2. Update Application Top Header Text
            const sectionText = button.querySelector('.app-sidebar__text')?.textContent || '';
            if (pageTitle) pageTitle.textContent = sectionText;

            // 3. Clear All Content Views out of layout viewports
            allViews.forEach(view => view.setAttribute('hidden', ''));

            // 4. Group your media dashboard components logically
            const mediaSections = ['movies', 'tv-series', 'anime', 'games', 'books', 'manga'];

            if (mediaSections.includes(section)) {
                // Uncover standard search grids and sorting widgets
                document.getElementById('view-media').removeAttribute('hidden');
                headerControls.style.display = 'flex';
                
                // Trigger filters for this section
                libraryService.applyFilters('all', section);
            } else {
                // Target isolated components individually while locking administrative grids
                headerControls.style.display = 'none';
                const targetView = document.getElementById(`view-${section}`);
                if (targetView) {
                    targetView.removeAttribute('hidden');
                }
            }
        });
    });
}
// ==========================================================================
// VIEW TOGGLE - Grid/List View Switcher
// ==========================================================================
function initializeViewToggle() {
    const viewToggleBtn = document.getElementById('view-toggle-btn');
    const mediaGrid = document.getElementById('media-grid');

    if (!viewToggleBtn || !mediaGrid) return;
    viewToggleBtn.addEventListener('click', () => {
        // Check what the current layout status is
        const currentView = viewToggleBtn.getAttribute('data-view');
        
        if (currentView === 'grid') {
            // SWITCH TO LIST VIEW
            viewToggleBtn.setAttribute('data-view', 'list');
            viewToggleBtn.title = 'Switch to Grid View';
            viewToggleBtn.textContent = '☰'; // List Symbol
            mediaGrid.classList.add('list-view');
        } else {
            // SWITCH BACK TO GRID VIEW
            viewToggleBtn.setAttribute('data-view', 'grid');
            viewToggleBtn.title = 'Switch to List View';
            viewToggleBtn.textContent = '⊞'; // Grid Symbol
            mediaGrid.classList.remove('list-view');
        }
    });
}

// ==========================================================================
// FILTERS - Status and Type Filtering
// ==========================================================================
function initializeFilterTabs() {
    const statusTabs = document.querySelectorAll('#status-tabs button[data-status]');
    const typeTabs = document.querySelectorAll('nav button[data-section]');

    // Handle Status Tabs (Watching, Want to Watch, etc.)
    statusTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('#status-tabs button.active')?.classList.remove('active');
            tab.classList.add('active');
            
            // Apply filters based on active tabs
            const activeTypeTab = document.querySelector('nav button[data-section].active');
            const currentType = activeTypeTab ? activeTypeTab.getAttribute('data-section') : 'all';
            const currentStatus = tab.getAttribute('data-status');
            
            libraryService.applyFilters(currentStatus, currentType);
        });
    });

    // Handle Sidebar Type Buttons (Movies, TV Series, Games, etc.)
    typeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('nav button[data-section].active')?.classList.remove('active');
            tab.classList.add('active');
            
            // Apply filters based on active tabs
            const activeStatusTab = document.querySelector('#status-tabs button.active');
            const currentStatus = activeStatusTab ? activeStatusTab.getAttribute('data-status') : 'all';
            const currentType = tab.getAttribute('data-section');
            
            libraryService.applyFilters(currentStatus, currentType);
        });
    });
}

// ==========================================================================
// MODALS - Item Modal and Search Modal
// ==========================================================================
function initializeModalHandlers() {
    const itemModal = document.getElementById('item-modal');
    const searchModal = document.getElementById('search-modal');
    const mainSearchBtn = document.getElementById('add-btn');
    const modalTabButtons = document.querySelectorAll('#modal-tabs button[data-modal-tab]');
    const modalPanels = document.querySelectorAll('.modal-tab-panel');

    // Open search modal
    if (mainSearchBtn && searchModal) {
        mainSearchBtn.addEventListener('click', () => openSearchModal());
    }

    // Card click handler - Show item modal
    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.media-card');
        if (!card) return;
        showItemModal(card);
    });

    // Modal tab switching
    modalTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTarget = btn.getAttribute('data-modal-tab');

            // Swap active state
            modalTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update panel visibility
            modalPanels.forEach(panel => {
                if (panel.id === `modal-tab-${selectedTarget}`) {
                    panel.removeAttribute('hidden');
                } else {
                    panel.setAttribute('hidden', '');
                }
            });
        });
    });

    // Close buttons
    const allNativeModals = document.querySelectorAll('dialog');
    allNativeModals.forEach(modal => {
        const closeTrigger = modal.querySelector('#modal-close-btn, #search-modal-close-btn, #modal-ok-btn');
        if (closeTrigger) {
            closeTrigger.addEventListener('click', () => closeModal(modal));
        }

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}// ==========================================================================
// STAR RATING - Interactive 10-Star Selection
// ==========================================================================
function initializeStarRating() {
    const starButtons = document.querySelectorAll('#star-rating .star');
    const ratingLabelValue = document.getElementById('rating-value');

    if (!starButtons.length || !ratingLabelValue) return;

    starButtons.forEach(star => {
        star.addEventListener('click', () => {
            const targetRatingValue = parseInt(star.getAttribute('data-value'), 10);
            ratingLabelValue.textContent = targetRatingValue;
            updateStarDisplay(targetRatingValue);
        });
    });

    // Initialize with default value
    updateStarDisplay(parseInt(ratingLabelValue.textContent, 10) || 5);
}



// ==========================================================================
// LOGOUT - Authentication Handler
// ==========================================================================
function initializeLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
        // Clear the access token from localStorage
        localStorage.removeItem('access_token');
        // Redirect to auth page
        window.location.href = 'pages/auth.html';
    });
}
