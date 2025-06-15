// src/js/main.js
import { getTasks, createTask, deleteTask, updateTask } from './api.js';
import { renderTasks, renderAuthLinks, showError, showNotification } from './dom.js';

const form = document.getElementById('add-task-form');
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

let allTasks = [];
let currentFilter = 'all';
let searchQuery = '';
let isEditing = false;
let editingTaskId = null;

const sidebarItems = document.querySelectorAll('.menu-item[data-filter]');
const searchInput = document.getElementById('search-tasks');

function filterTasks(tasks) {
    let filtered = tasks;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (currentFilter === 'today') {
        filtered = filtered.filter(t => {
            const d = new Date(t.deadline);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });
    } else if (currentFilter === 'upcoming') {
        filtered = filtered.filter(t => new Date(t.deadline) > today);
    } else if (currentFilter === 'done') {
        filtered = filtered.filter(t => t.status === 'DONE');
    } else if (currentFilter === 'cancelled') {
        filtered = filtered.filter(t => t.status === 'CANCELLED');
    }
    if (searchQuery) {
        filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(searchQuery) ||
            (t.description && t.description.toLowerCase().includes(searchQuery))
        );
    }
    return filtered;
}

sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentFilter = item.getAttribute('data-filter');
        renderTasks(filterTasks(allTasks), list, async (id) => {
            await deleteWithNotification(id);
            await loadAndRender();
        });
    });
});

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderTasks(filterTasks(allTasks), list, async (id) => {
            await deleteWithNotification(id);
            await loadAndRender();
        });
    });
}

async function loadAndRender() {
    try {
        const tasks = await getTasks();
        allTasks = tasks.data || tasks;
        renderTasks(filterTasks(allTasks), list, async (id) => {
            await deleteWithNotification(id);
            await loadAndRender();
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

function openTaskModal(task = null) {
    modal.style.display = 'flex';
    if (task) {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.description;
        document.getElementById('task-status').value = task.status;
        document.getElementById('task-deadline').value = task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '';
        document.getElementById('task-userId').value = task.userId;
        isEditing = true;
        editingTaskId = task.id;
    } else {
        addTaskForm.reset();
        isEditing = false;
        editingTaskId = null;
        // Optionally set userId from localStorage or context
        document.getElementById('task-userId').value = localStorage.getItem('userId') || 1;
    }
}

if (addTaskBtn && modal && addTaskForm && cancelTaskBtn) {
    addTaskBtn.addEventListener('click', () => openTaskModal());
    cancelTaskBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        addTaskForm.reset();
        isEditing = false;
        editingTaskId = null;
    });
    addTaskForm.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;
        const status = document.getElementById('task-status').value;
        const deadline = document.getElementById('task-deadline').value;
        const userId = parseInt(document.getElementById('task-userId').value, 10);
        try {
            if (isEditing && editingTaskId) {
                await updateTask(editingTaskId, { title, description, status, deadline, userId });
                showNotification('Task updated!', 'success');
            } else {
                await createTask({ title, description, status, deadline, userId });
                showNotification('Task added!', 'success');
            }
            modal.style.display = 'none';
            addTaskForm.reset();
            isEditing = false;
            editingTaskId = null;
            loadAndRender();
        } catch (error) {
            showNotification(error.message, 'error');
            showError(error.message, addTaskForm);
        }
    };
}

// Delegate edit button click
list.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const li = e.target.closest('.task-item');
        const idx = Array.from(list.children).indexOf(li);
        const task = filterTasks(allTasks)[idx];
        openTaskModal(task);
    }
});

// Drag-and-drop logic for task reordering within group
let draggedEl = null;
list.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('task-item')) {
        draggedEl = e.target;
        e.target.classList.add('dragging');
    }
});
list.addEventListener('dragend', (e) => {
    if (draggedEl) draggedEl.classList.remove('dragging');
    draggedEl = null;
});
list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterEl = getDragAfterElement(list, e.clientY);
    if (afterEl && afterEl !== draggedEl && afterEl.classList.contains('task-item')) {
        afterEl.classList.add('drag-over');
    }
});
list.addEventListener('dragleave', (e) => {
    if (e.target.classList.contains('task-item')) {
        e.target.classList.remove('drag-over');
    }
});
list.addEventListener('drop', (e) => {
    e.preventDefault();
    const afterEl = getDragAfterElement(list, e.clientY);
    if (draggedEl && afterEl && afterEl !== draggedEl && afterEl.classList.contains('task-item')) {
        afterEl.classList.remove('drag-over');
        list.insertBefore(draggedEl, afterEl);
    } else if (draggedEl && !afterEl) {
        list.appendChild(draggedEl);
    }
});
function getDragAfterElement(container, y) {
    const draggableEls = [...container.querySelectorAll('.task-item:not(.dragging)')];
    return draggableEls.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: -Infinity }).element;
}

function deleteWithNotification(id) {
    return deleteTask(id).then(() => {
        showNotification('Task deleted!', 'success');
    }).catch(err => {
        showNotification(err.message, 'error');
    });
}

loadAndRender();