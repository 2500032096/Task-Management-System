const USERS_KEY = 'taskflow_users_v3';
const SESSION_KEY = 'taskflow_session';
const LOGS_KEY = 'taskflow_login_logs';

const defaultUsers = [
    {
        username: 'vishnu',
        email: 'vishnu@taskflow.local',
        password: '1234',
        role: 'user'
    },
    {
        username: 'admin',
        email: 'admin@email.com',
        password: 'vishnu07',
        role: 'admin'
    }
];

function getUsers() {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        if (!raw) {
            localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
            return [...defaultUsers];
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
            return [...defaultUsers];
        }
        const hasAdmin = parsed.some((u) => u.role === 'admin');
        if (!hasAdmin) {
            parsed.push(defaultUsers[1]);
            localStorage.setItem(USERS_KEY, JSON.stringify(parsed));
        }
        return parsed;
    } catch {
        localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
        return [...defaultUsers];
    }
}

function recordLoginHistory(user) {
    const logs = JSON.parse(localStorage.getItem(LOGS_KEY)) || [];
    const now = new Date();
    logs.unshift({
        id: Date.now().toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        loginDate: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        loginTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

if (document.getElementById('auth-form')) {
    let selectedRole = 'user';
    let authMode = 'register'; // 'register' or 'login'

    const roleTabs = document.querySelectorAll('.role-tab');
    const userModeBar = document.getElementById('user-mode-bar');
    const modeStatusText = document.getElementById('mode-status-text');
    const switchModeBtn = document.getElementById('switch-mode-btn');
    const usernameGroup = document.getElementById('username-group');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password-btn');
    const eyeOpenIcon = document.getElementById('eye-open-icon');
    const eyeClosedIcon = document.getElementById('eye-closed-icon');
    const submitBtn = document.getElementById('submit-btn');
    const subtitle = document.getElementById('auth-subtitle');
    const errorBox = document.getElementById('error-box');
    const successBox = document.getElementById('success-box');

    function setPasswordVisibility(visible) {
        passwordInput.type = visible ? 'text' : 'password';
        eyeOpenIcon.style.display = visible ? 'none' : 'block';
        eyeClosedIcon.style.display = visible ? 'block' : 'none';
        togglePasswordBtn.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
        togglePasswordBtn.setAttribute('title', visible ? 'Hide password' : 'Show password');
    }

    togglePasswordBtn.addEventListener('click', () => {
        const isVisible = passwordInput.type === 'text';
        setPasswordVisibility(!isVisible);
    });

    function showError(msg) {
        successBox.style.display = 'none';
        errorBox.textContent = msg;
        errorBox.style.display = 'block';
    }

    function showSuccess(msg) {
        errorBox.style.display = 'none';
        successBox.textContent = msg;
        successBox.style.display = 'block';
    }

    function clearMessages() {
        errorBox.style.display = 'none';
        successBox.style.display = 'none';
    }

    function refreshAuthUI() {
        setPasswordVisibility(false);
        if (selectedRole === 'admin') {
            userModeBar.style.display = 'none';
            usernameGroup.style.display = 'none';
            usernameInput.required = false;
            emailInput.placeholder = 'admin@email.com';
            subtitle.textContent = 'Admin Login with Email & Password';
            submitBtn.textContent = 'Login as Admin';
        } else {
            userModeBar.style.display = 'flex';
            if (authMode === 'register') {
                usernameGroup.style.display = 'block';
                usernameInput.required = true;
                emailInput.placeholder = 'Enter your email address';
                modeStatusText.textContent = 'Already registered a user?';
                switchModeBtn.textContent = 'User Login';
                subtitle.textContent = 'Step 1: Register User Account before Login';
                submitBtn.textContent = 'Register User';
            } else {
                usernameGroup.style.display = 'none';
                usernameInput.required = false;
                emailInput.placeholder = 'Enter registered user email';
                modeStatusText.textContent = 'Need to register a user first?';
                switchModeBtn.textContent = 'Register User';
                subtitle.textContent = 'Step 2: User Login with Email & Password';
                submitBtn.textContent = 'Login as User';
            }
        }
    }

    roleTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            roleTabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            selectedRole = tab.getAttribute('data-role');
            clearMessages();
            refreshAuthUI();
        });
    });

    switchModeBtn.addEventListener('click', () => {
        authMode = authMode === 'register' ? 'login' : 'register';
        clearMessages();
        refreshAuthUI();
    });

    document.getElementById('auth-form').addEventListener('submit', (e) => {
        e.preventDefault();
        clearMessages();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();
        const users = getUsers();

        if (!email || !password) {
            showError('Please enter both email and password.');
            return;
        }

        if (selectedRole === 'user' && authMode === 'register') {
            const username = usernameInput.value.trim();
            if (!username) {
                showError('Please enter a username to register.');
                return;
            }

            const emailTaken = users.some((u) => u.email.toLowerCase() === email);
            if (emailTaken) {
                showError('This email is already registered. Switch to User Login.');
                return;
            }

            const newUser = {
                username,
                email,
                password,
                role: 'user'
            };
            users.push(newUser);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));

            authMode = 'login';
            refreshAuthUI();
            emailInput.value = email;
            passwordInput.value = '';
            showSuccess(`User "${username}" registered! Now enter password and click Login as User.`);
            return;
        }

        const matchedUser = users.find(
            (u) =>
                u.role === selectedRole &&
                u.email.toLowerCase() === email &&
                u.password === password
        );

        if (!matchedUser) {
            showError(
                selectedRole === 'user'
                    ? 'User not found or wrong password. Register user first if new.'
                    : 'Invalid Admin email or password.'
            );
            return;
        }

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
                username: matchedUser.username,
                email: matchedUser.email,
                role: matchedUser.role
            })
        );
        recordLoginHistory(matchedUser);
        window.location.href = 'index.html';
    });

    refreshAuthUI();
} else {
    const rawSession = localStorage.getItem(SESSION_KEY);
    if (!rawSession) {
        window.location.href = 'auth.html';
    }
}
