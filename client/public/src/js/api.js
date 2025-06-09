// src/js/api.js
const API_URL = 'http://localhost:4000';

export async function getTasks() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/tasks`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
}

export async function createTask(title) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ title })
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
}

export async function deleteTask(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Failed to delete task');
}

export async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
}

export async function register(name, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
}