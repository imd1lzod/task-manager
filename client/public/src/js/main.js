// src/js/main.js
import { getTasks, createTask, deleteTask } from './api.js';
import { renderTasks, renderAuthLinks, showError } from './dom.js';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const authLinks = document.getElementById('auth-links');
const signInBtn = document.getElementById('sign-in-btn')

if (signInBtn) {
    signInBtn.addEventListener('click', () => {
        window.location.href = 'login.html'
    })
}

// Check authentication status
const isAuthenticated = !!localStorage.getItem('token');

// Render navigation links
if (authLinks) {
    renderAuthLinks(authLinks, isAuthenticated);
}

// Optionally redirect to login if not authenticated
if (!isAuthenticated) {
    window.location.href = 'login.html';
    // Note: Comment out the above line if you want the Task Manager to be accessible without login
}

async function loadAndRender() {
    try {
        const tasks = await getTasks();
        renderTasks(tasks, list, async (id) => {
            await deleteTask(id);
            loadAndRender();
        });
    } catch (error) {
        showError(error.message, list.parentElement);
    }
}

form.onsubmit = async (e) => {
    e.preventDefault();
    try {
        await createTask(input.value);
        input.value = '';
        loadAndRender();
    } catch (error) {
        showError(error.message, form);
    }
};

loadAndRender();