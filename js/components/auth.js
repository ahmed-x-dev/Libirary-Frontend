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
// 🔐 LOGIN SUBMISSION - TODO: Connect to API when backend is ready
// ==========================================================================
formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: Implement authentication with backend API
    // For now, just redirect to main page
    window.location.href = '../index.html';
});

