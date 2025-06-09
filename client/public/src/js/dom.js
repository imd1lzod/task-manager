// src/js/dom.js
export function renderTasks(tasks, container, onDelete) {
    container.innerHTML = '';
    for (const task of tasks) {
        const li = document.createElement('li');
        li.textContent = task.title;
        li.classList.add('task-item');

        const delBtn = document.createElement('button');
        delBtn.textContent = '×';
        delBtn.classList.add('delete-btn');
        delBtn.onclick = () => onDelete(task.id);

        li.appendChild(delBtn);
        container.appendChild(li);
    }
}

export function showError(message, container) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.marginTop = '10px';
    errorDiv.style.textAlign = 'center';
    container.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

export function renderAuthLinks(container, isAuthenticated) {
    container.innerHTML = '';
    if (isAuthenticated) {
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.textContent = 'Logout';
        logoutLink.onclick = () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        };
        container.appendChild(logoutLink);
    } else {
        const loginLink = document.createElement('a');
        loginLink.href = 'login.html';
        loginLink.textContent = 'Login';
        container.appendChild(loginLink);

        const registerLink = document.createElement('a');
        registerLink.href = 'register.html';
        registerLink.textContent = 'Register';
        container.appendChild(registerLink);
    }
}