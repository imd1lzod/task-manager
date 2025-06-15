// src/js/dom.js
export function renderTasks(tasks, container, onDelete) {
    container.innerHTML = '';
    // Update sidebar counts
    const allCount = document.querySelector('.menu-item[data-filter="all"] .task-count');
    const todayCount = document.querySelector('.menu-item[data-filter="today"] .task-count');
    const upcomingCount = document.querySelector('.menu-item[data-filter="upcoming"] .task-count');
    const doneCount = document.querySelector('.menu-item[data-filter="done"] .task-count');
    const cancelledCount = document.querySelector('.menu-item[data-filter="cancelled"] .task-count');
    if (allCount) allCount.textContent = tasks.length;
    if (todayCount) todayCount.textContent = tasks.filter(t => {
        const d = new Date(t.deadline); d.setHours(0, 0, 0, 0);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    }).length;
    if (upcomingCount) upcomingCount.textContent = tasks.filter(t => new Date(t.deadline) > new Date()).length;
    if (doneCount) doneCount.textContent = tasks.filter(t => t.status === 'DONE').length;
    if (cancelledCount) cancelledCount.textContent = tasks.filter(t => t.status === 'CANCELLED').length;

    // Group tasks by status
    const groups = [
        { key: 'IN_PROGRES', label: 'In Progress', class: 'in-progress' },
        { key: 'DONE', label: 'Done', class: 'done' },
        { key: 'CANCELLED', label: 'Cancelled', class: 'cancelled' }
    ];
    for (const group of groups) {
        const groupTasks = tasks.filter(t => t.status === group.key);
        if (groupTasks.length === 0) continue;
        const header = document.createElement('li');
        header.className = `task-group-header ${group.class}`;
        header.textContent = group.label;
        container.appendChild(header);
        for (const task of groupTasks) {
            const li = document.createElement('li');
            li.classList.add('task-item', 'fade-in');
            li.setAttribute('draggable', 'true');
            li.dataset.taskId = task.id;
            li.innerHTML = `
                <div class="task-main">
                    <span class="task-title">${task.title}</span>
                    <span class="task-status badge ${group.class}">
                        ${group.label}
                    </span>
                </div>
                <div class="task-meta">
                    <span>${task.description || ''}</span>
                    <span class="task-deadline">${task.deadline ? 'Due: ' + new Date(task.deadline).toLocaleDateString() : ''}</span>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" title="Edit">✎</button>
                    <button class="delete-btn" title="Delete">🗑</button>
                </div>
            `;
            li.querySelector('.delete-btn').onclick = () => {
                li.classList.add('fade-out');
                setTimeout(() => onDelete(task.id), 300);
            };
            container.appendChild(li);
            setTimeout(() => li.classList.remove('fade-in'), 300);
        }
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

export function showNotification(message, type = 'info') {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    container.appendChild(notif);
    setTimeout(() => {
        notif.classList.add('fade-out');
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}