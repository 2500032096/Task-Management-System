
function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
    }
}

// Handle Sign Up
document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const users = JSON.parse(localStorage.getItem('registered_users')) || [];

    // Check if user exists
    if (users.some(user => user.email === email)) {
        alert('User already exists! Please login.');
        return;
    }

    // Save new user to LocalStorage
    users.push({ name, email, password });
    localStorage.setItem('registered_users', JSON.stringify(users));

    alert('Signup successful! Please login.');
    switchTab('login');
});

// Handle Login
document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('registered_users')) || [];

    const validUser = users.find(u => u.email === email && u.password === password);

    if (validUser) {
        // Save Active Session to LocalStorage
        localStorage.setItem('active_session', JSON.stringify(validUser));
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password.');
    }
}); auth.js