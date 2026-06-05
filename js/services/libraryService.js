// ==========================================================================
// LIBRARY SERVICE - Business Logic Layer
// ==========================================================================

// Dummy data for development (remove when backend is ready)
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

// Cache for library data
let cachedLibraryData = null;

/**
 * Library Service - Manages all library-related business logic
 */
export const libraryService = {
    /**
     * Load library data (from API or dummy data for development)
     * @returns {Promise<array>} Array of media items
     */
    async loadLibrary() {
        // Using dummy data (TODO: Connect to API when backend is ready)
        cachedLibraryData = [...dummyLibraryData];
        return cachedLibraryData;
    },

    /**
     * Get cached library data
     * @returns {array} Current cached data
     */
    getCachedData() {
        return cachedLibraryData || [];
    },

    /**
     * Apply filters to media cards in the DOM
     * @param {string} status - Filter by status (e.g., 'watching', 'want-to-watch')
     * @param {string} section - Filter by media type (e.g., 'movies', 'games')
     * @returns {number} Count of visible cards
     */
    applyFilters(status = 'all', section = 'all') {
        const currentCards = document.querySelectorAll('.media-card');
        let visibleCardsCount = 0;

        currentCards.forEach(card => {
            const cardStatus = card.getAttribute('data-status');
            const cardType = card.getAttribute('data-type');

            // Condition A: Status Check
            const statusMatches = (status === 'all' || cardStatus === status);

            // Condition B: Type Check (Handles plural section names vs singular data types)
            let typeMatches = false;
            if (section === 'all') {
                typeMatches = true;
            } else if (section === 'movies' && cardType === 'movie') {
                typeMatches = true;
            } else if (section === 'games' && cardType === 'game') {
                typeMatches = true;
            } else if (section === 'books' && cardType === 'book') {
                typeMatches = true;
            } else if (section === cardType) {
                // Catches "tv-series", "anime", "manga"
                typeMatches = true;
            }

            // Show card ONLY if both conditions match
            if (statusMatches && typeMatches) {
                card.style.display = '';
                visibleCardsCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Toggle empty state
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            if (visibleCardsCount === 0) {
                emptyState.removeAttribute('hidden');
                emptyState.style.display = 'flex';
            } else {
                emptyState.setAttribute('hidden', '');
                emptyState.style.display = 'none';
            }
        }

        return visibleCardsCount;
    },


};
