// ===== SELECT ROUTING INTERFACE ELEMENTS =====
const sidebarButtons = document.querySelectorAll('#sidebar button[data-section]');
const pageTitle = document.getElementById('page-title');
const headerControls = document.getElementById('header-controls');
const allViews = document.querySelectorAll('.content-view');

// ===== VIEW CONTROLLER LOGIC =====
sidebarButtons.forEach(button => {
    button.addEventListener('click', () => {
        const section = button.getAttribute('data-section');

        // 1. Sync Highlight States across Sidebar
        document.querySelector('#sidebar button.active')?.classList.remove('active');
        button.classList.add('active');

        // 2. Update Application Top Header Text
        const sectionText = button.querySelector('.sidebar-text').textContent;
        if (pageTitle) pageTitle.textContent = sectionText;

        // 3. Clear All Content Views out of layout viewports
        allViews.forEach(view => view.setAttribute('hidden', ''));

        // 4. Group your media dashboard components logically
        const mediaSections = ['movies', 'tv-series', 'anime', 'games', 'books', 'manga'];

        if (mediaSections.includes(section)) {
            // Uncover standard search grids and sorting widgets
            document.getElementById('view-media').removeAttribute('hidden');
            headerControls.style.display = 'flex';
            
            /* Future note: Call your rendering function here to filter content 
            by data-type to separate Movies, Games, Anime from each other.
            */
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





// ===== SELECT TARGET COMPONENT INTERFACES =====
const viewToggleBtn = document.getElementById('view-toggle-btn');
const mediaGrid = document.getElementById('media-grid');

// ===== VIEW TOGGLE EVENT LISTENER =====
if (viewToggleBtn && mediaGrid) {
    viewToggleBtn.addEventListener('click', () => {
        // 1. Check what the current layout status is
        const currentView = viewToggleBtn.getAttribute('data-view');
        
        if (currentView === 'grid') {
            // SWITCH TO LIST VIEW
            viewToggleBtn.setAttribute('data-view', 'list');
            viewToggleBtn.title = 'Switch to Grid View';
            viewToggleBtn.textContent = '☰'; // Changes icon to List Symbol
            
            mediaGrid.classList.add('list-view'); // Triggers our new CSS rules
        } else {
            // SWITCH BACK TO GRID VIEW
            viewToggleBtn.setAttribute('data-view', 'grid');
            viewToggleBtn.title = 'Switch to List View';
            viewToggleBtn.textContent = '⊞'; // Changes icon back to Grid Symbol
            
            mediaGrid.classList.remove('list-view'); // Restores base grid layout
        }
    });
}






// ===== SELECT FILTER ELEMENTS =====
const statusTabs = document.querySelectorAll('#status-tabs button[data-status]');
const typeTabs = document.querySelectorAll('nav button[data-section]'); // 🎬 Matches your sidebar buttons!
const emptyState = document.getElementById('empty-state');

// ==========================================================================
// THE UNIFIED FILTER ENGINE
// ==========================================================================
function applyFilters() {
    // 1. Grab the currently active status and type buttons
    const activeStatusTab = document.querySelector('#status-tabs button.active');
    const activeTypeTab = document.querySelector('nav button[data-section].active');

    const currentStatus = activeStatusTab ? activeStatusTab.getAttribute('data-status') : 'all';
    const currentSection = activeTypeTab ? activeTypeTab.getAttribute('data-section') : 'all';

    const currentCards = document.querySelectorAll('.media-card');
    let visibleCardsCount = 0;

    // 2. Loop through the cards and evaluate
    currentCards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        const cardType = card.getAttribute('data-type'); // e.g., "movie", "game"

        // Condition A: Status Check
        const statusMatches = (currentStatus === 'all' || cardStatus === currentStatus);

        // Condition B: Type Check (Handles your plural section names vs singular data types)
        let typeMatches = false;
        if (currentSection === 'all') {
            typeMatches = true;
        } else if (currentSection === 'movies' && cardType === 'movie') {
            typeMatches = true;
        } else if (currentSection === 'games' && cardType === 'game') {
            typeMatches = true;
        } else if (currentSection === 'books' && cardType === 'book') {
            typeMatches = true;
        } else if (currentSection === cardType) {
            // This safely catches "tv-series", "anime", and "manga" since they match exactly
            typeMatches = true;
        }

        // 🌟 Show the card ONLY if it checks out on both fronts!
        if (statusMatches && typeMatches) {
            card.style.display = ''; 
            visibleCardsCount++;
        } else {
            card.style.display = 'none'; 
        }
    });

    // 3. Toggle Empty State Message
    if (visibleCardsCount === 0) {
        emptyState.removeAttribute('hidden');
        emptyState.style.display = 'flex';
    } else {
        emptyState.setAttribute('hidden', '');
        emptyState.style.display = 'none';
    }
}

// ==========================================================================
// EVENT LISTENERS
// ==========================================================================

// Handle Status Tabs (Watching, Want to Watch, etc.)
statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelector('#status-tabs button.active')?.classList.remove('active');
        tab.classList.add('active');
        applyFilters();
    });
});

// Handle Sidebar Type Buttons (Movies, TV Series, Games, etc.)
typeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active styling from the previous sidebar button and add to this one
        document.querySelector('nav button[data-section].active')?.classList.remove('active');
        tab.classList.add('active');
        applyFilters();
    });
});

// ==========================================================================
// NATIVE MODALS CONTROLLER PIPELINE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const itemModal = document.getElementById('item-modal');
    const searchModal = document.getElementById('search-modal');
    const mainSearchBtn = document.getElementById("add-btn");
    const mediaGrid = document.getElementById('media-grid');

    // ─────────────────────────────────────────────────────────────────
    // 1. MODAL OPENING DISPATCHERS
    // ─────────────────────────────────────────────────────────────────

    // Trigger global search overlay popup
    if (mainSearchBtn && searchModal) {
        mainSearchBtn.addEventListener('click', () => searchModal.showModal());
    }

    // Delegation tracking layout inside media-grid catalog cards


    document.body.addEventListener('click', (e) => {
        // 1. Check if the click happened on or inside a media card
        const card = e.target.closest('.media-card');
        
        // 2. If it wasn't a card, stop right here
        if (!card) return;

        // 3. Extract the data
        const targetTitle = card.querySelector('.media-card-title').textContent;
        const targetYear = card.querySelector('.media-card-year').textContent;
        const srcImage = card.querySelector('img').src;

        // 4. Update the item modal
        document.getElementById('modal-item-title').textContent = targetTitle;
        document.getElementById('modal-item-year').textContent = targetYear;
        document.getElementById('modal-poster-img').src = srcImage;

        // 5. Reset tabs and open
        resetItemModalTabs();
        document.getElementById('item-modal').showModal();
    });


    // ─────────────────────────────────────────────────────────────────
    // 2. INNER MODAL INTERNAL SUB-TABS MANAGEMENT
    // ─────────────────────────────────────────────────────────────────
    const modalTabButtons = document.querySelectorAll('#modal-tabs button[data-modal-tab]');
    const modalPanels = document.querySelectorAll('.modal-tab-panel');

    modalTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTarget = btn.getAttribute('data-modal-tab');

            // Swap button active highlighted parameters state
            modalTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update panel panels visibility layer settings
            modalPanels.forEach(panel => {
                if (panel.id === `modal-tab-${selectedTarget}`) {
                    panel.removeAttribute('hidden');
                } else {
                    panel.setAttribute('hidden', '');
                }
            });
        });
    });

    function resetItemModalTabs() {
        modalTabButtons.forEach((b, idx) => {
            if (idx === 0) b.classList.add('active');
            else b.classList.remove('active');
        });
        modalPanels.forEach((panel, idx) => {
            if (idx === 0) panel.removeAttribute('hidden');
            else panel.setAttribute('hidden', '');
        });
    }

    // ─────────────────────────────────────────────────────────────────
    // 3. INTERACTIVE 10-STAR SELECTION CALCULATION
    // ─────────────────────────────────────────────────────────────────
    const starButtons = document.querySelectorAll('#star-rating .star');
    const ratingLabelValue = document.getElementById('rating-value');

    starButtons.forEach(star => {
        star.addEventListener('click', () => {
            const targetRatingValue = parseInt(star.getAttribute('data-value'), 10);
            ratingLabelValue.textContent = targetRatingValue;
            updateStarDisplay(targetRatingValue);
        });
    });

    function updateStarDisplay(scoreValue) {
        starButtons.forEach(star => {
            const currentStarWeight = parseInt(star.getAttribute('data-value'), 10);
            if (currentStarWeight <= scoreValue) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }

    // Initialize display layout with default values on layout loads
    if (ratingLabelValue) {
        updateStarDisplay(parseInt(ratingLabelValue.textContent, 10) || 5);
    }

    // ─────────────────────────────────────────────────────────────────
    // 4. CLOSING BOUNDARY DETECTION MECHANICS
    // ─────────────────────────────────────────────────────────────────
    const allNativeModals = document.querySelectorAll('dialog');

    allNativeModals.forEach(modal => {
        // Find explicit target closing elements inside parents wrappers structures
        const closeTrigger = modal.querySelector('#modal-close-btn, #search-modal-close-btn, #modal-ok-btn');
        if (closeTrigger) {
            closeTrigger.addEventListener('click', () => modal.close());
        }

        // Close naturally if backdrop is clicked
        modal.addEventListener('click', (e) => {
            // Because our <dialog> has 0 padding, the only way the e.target 
            // is the modal itself is if the user clicked the ::backdrop overlay.
            // Clicking anything inside (like a select or div) will target that specific element instead.
            if (e.target === modal) {
                modal.close();
            }
        });
    });
});



// ==========================================================================
// DUMMY DATA & RENDERING ENGINE
// ==========================================================================

// 1. Your mock database (simulating a backend JSON response)
const dummyLibraryData = [
    { id: 101, type: "movies", status: "want-to-watch", title: "Avatar Aang: The Last Airbender", year: "2026", img: "https://image.tmdb.org/t/p/w500/29Jdsak3SrwGds5k1t43kH6Khed.jpg" },
    { id: 102, type: "movies", status: "watching", title: "Dune: Part Two", year: "2024", img: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjcNsV.jpg" },
    { id: 103, type: "tv-series", status: "completed", title: "Breaking Bad", year: "2008", img: "https://image.tmdb.org/t/p/w500/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg" },
    { id: 104, type: "anime", status: "watching", title: "Jujutsu Kaisen", year: "2020", img: "https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40hrXnghKUjK3ZFA.jpg" },
    { id: 105, type: "games", status: "on-hold", title: "Elden Ring", year: "2022", img: "https://image.tmdb.org/t/p/w500/vDCcwG0WvE7cTee12R1P8K0lE6p.jpg" },
    { id: 106, type: "movies", status: "want-to-watch", title: "Spider-Man: Beyond the Spider-Verse", year: "2025", img: "https://image.tmdb.org/t/p/w500/8cdWjvZQUrmU1NbgvKsnA9KxWvP.jpg" },
    { id: 107, type: "movies", status: "completed", title: "Interstellar", year: "2014", img: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
    { id: 108, type: "tv-series", status: "dropped", title: "Game of Thrones", year: "2011", img: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg" },
    { id: 109, type: "movies", status: "want-to-watch", title: "Avatar Aang: The Last Airbender", year: "2026", img: "https://image.tmdb.org/t/p/w500/29Jdsak3SrwGds5k1t43kH6Khed.jpg" },
    { id: 110, type: "movies", status: "watching", title: "Dune: Part Two", year: "2024", img: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjcNsV.jpg" },
    { id: 111, type: "tv-series", status: "completed", title: "Breaking Bad", year: "2008", img: "https://image.tmdb.org/t/p/w500/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg" },
    { id: 112, type: "anime", status: "watching", title: "Jujutsu Kaisen", year: "2020", img: "https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40hrXnghKUjK3ZFA.jpg" },
    { id: 113, type: "games", status: "on-hold", title: "Elden Ring", year: "2022", img: "https://image.tmdb.org/t/p/w500/vDCcwG0WvE7cTee12R1P8K0lE6p.jpg" },
    { id: 114, type: "movies", status: "want-to-watch", title: "Spider-Man: Beyond the Spider-Verse", year: "2025", img: "https://image.tmdb.org/t/p/w500/8cdWjvZQUrmU1NbgvKsnA9KxWvP.jpg" },
    { id: 115, type: "movies", status: "completed", title: "Interstellar", year: "2014", img: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
    { id: 116, type: "tv-series", status: "dropped", title: "Game of Thrones", year: "2011", img: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg" },
];

// 2. The function to build and inject the HTML
function renderLibrary(dataArray) {
    const gridTarget = document.getElementById('media-grid');
    
    // Clear out any existing HTML before rendering new data
    gridTarget.innerHTML = ''; 

    // 🌟 Define your default fallback poster here
    // You can use a local path (e.g., 'assets/no-poster.png') or a clean placeholder URL like below:
// A pure SVG fallback encoded as text. Zero network requests, zero SSL errors!
const DEFAULT_POSTER = 'https://placehold.co/150x220/2a2a2a/ffffff?text=No+Poster';

    dataArray.forEach(item => {
        // Create the card container
        const card = document.createElement('article');
        card.className = 'media-card';
        
        // Attach the data attributes used by your filters
        card.setAttribute('data-id', item.id);
        card.setAttribute('data-type', item.type);
        card.setAttribute('data-status', item.status);

        // DEFENSE 1: Fallback if the database/array has a blank or missing image field
        const posterSrc = item.img ? item.img : DEFAULT_POSTER;

        // Build the internal HTML structure
        // DEFENSE 2: 'onerror' catches broken links or 404 network errors at runtime
        card.innerHTML = `
            <div class="media-card-poster">
                <img 
                    src="${posterSrc}" 
                    onerror="this.onerror=null; this.src='${DEFAULT_POSTER}';" 
                    alt="${item.title} poster" 
                    width="150" 
                    height="220"
                >
            </div>
            <div class="media-card-info">
                <h3 class="media-card-title">${item.title}</h3>
                <span class="media-card-year">${item.year}</span>
            </div>
        `;

        // Inject the finished card into the grid
        gridTarget.appendChild(card);
    });
}

// 3. Fire the render function when the page loads
renderLibrary(dummyLibraryData);
















// Add this line at the very bottom of your JavaScript file: (remove when we remove the dummy card in index.html)
document.querySelector('#status-tabs button[data-status="want-to-watch"]')?.click();