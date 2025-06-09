// src/js/auth.js
import { login, register } from './api.js';
import { showError } from './dom.js';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

if (loginForm) {
    const container = loginForm.parentElement;
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        try {
            const response = await login(email, password);
            // Assuming the backend returns a token
            localStorage.setItem('token', response.token);
            window.location.href = 'index.html';
        } catch (error) {
            showError(error.message, container);
        }
    };
}

if (registerForm) {
    const container = registerForm.parentElement;
    registerForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = registerForm.name.value;
        const email = registerForm.email.value;
        const password = registerForm.password.value;
        try {
            await register(name, email, password);
            window.location.href = 'login.html';
        } catch (error) {
            showError(error.message, container);
        }
    };
}