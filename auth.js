const API_BASE_URL = 'http://localhost:8000/api'; // Adjust to your backend URL

// Selectors
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');

// ==========================================================================
// 🔄 TAB TOGGLE LOGIC
// ==========================================================================
tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
});

tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
});

// ==========================================================================
// 🔐 LOGIN SUBMISSION
// ==========================================================================
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('login-error');
    errorEl.classList.add('hidden');

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        // FastAPI OAuth2 specifies standard form-data format for authentication routes
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Authentication failed');
        }

        // Save JWT access token locally in browser storage
        localStorage.setItem('access_token', data.access_token);

        // Redirect to your main library page
        window.location.href = 'index.html';

    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
    }
});

// ==========================================================================
// 🔐 LOGIN SUBMISSION (Updated for Raw JSON Body Data)
// ==========================================================================
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('login-error');
    errorEl.classList.add('hidden');

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        // Send a clean, raw JSON payload to match your FastAPI Pydantic schema
        const response = await fetch(`${API_BASE_URL}/token`, { // Change '/token' to '/login' if your route path is different
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Catches invalid password/username details sent by your backend
            throw new Error(data.detail || 'Authentication failed');
        }

        // Save your JWT access token locally in browser storage
        localStorage.setItem('access_token', data.access_token);

        // Redirect directly to your main media tracker dashboard
        window.location.href = 'index.html';

    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
    }
});