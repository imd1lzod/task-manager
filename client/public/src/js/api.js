// src/js/api.js
const API_URL = 'http://localhost:4000/api';

function getTokenFromCookie() {
    const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export async function getTasks() {
    const token = getTokenFromCookie();
    const res = await fetch(`${API_URL}/tasks`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
    return data
}

export async function createTask(task) {
    const token = getTokenFromCookie();
    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(task)
    });
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to create tasks');
    return data
}

export async function deleteTask(id) {
    const token = getTokenFromCookie();
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to delete tasks')
}

export async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Llogin failed');
    return data
}

export async function register(name, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data
}

export async function updateTask(id, task) {
    const token = getTokenFromCookie();
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(task)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update task');
    return data;
}