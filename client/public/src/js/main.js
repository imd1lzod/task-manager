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

// Modal logic for Add Task
const addTaskBtn = document.querySelector('.menu-item.add-task');
const modal = document.getElementById('add-task-modal');
const addTaskForm = document.getElementById('add-task-form');
const cancelTaskBtn = document.getElementById('cancel-task-btn');

if (addTaskBtn && modal && addTaskForm && cancelTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        // Optionally set userId from localStorage or context
        const userId = localStorage.getItem('userId') || 1;
        document.getElementById('task-userId').value = userId;
    });
    cancelTaskBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        addTaskForm.reset();
    });
    addTaskForm.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;
        const status = document.getElementById('task-status').value;
        const deadline = document.getElementById('task-deadline').value;
        const userId = parseInt(document.getElementById('task-userId').value, 10);
        try {
            await createTask({ title, description, status, deadline, userId });
            modal.style.display = 'none';
            addTaskForm.reset();
            loadAndRender();
        } catch (error) {
            showError(error.message, addTaskForm);
        }
    };
}

loadAndRender();