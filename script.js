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