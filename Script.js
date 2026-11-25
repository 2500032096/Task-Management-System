const currentSession = JSON.parse(localStorage.getItem('taskflow_session')) || {
    username: 'vishnu',
    email: 'vishnu@taskflow.local',
    role: 'user'
};

// Update Sidebar User Info & Admin Access
document.getElementById('logged-in-user').textContent = currentSession.username;
const emailEl = document.getElementById('logged-in-email');
if (emailEl && currentSession.email) {
    emailEl.textContent = currentSession.email;
}

const roleBadge = document.getElementById('logged-in-role');
roleBadge.textContent = currentSession.role.toUpperCase();
if (currentSession.role === 'admin') {
    roleBadge.classList.add('admin');
    document.getElementById('admin-nav-tab').style.display = 'flex';
}

// Logout Handler
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('taskflow_session');
    window.location.href = 'auth.html';
});

const defaultTasks = [
    {
        id: '1',
        title: 'Design CSS Grid Wireframe Layout',
        topic: 'Work',
        status: 'todo',
        date: '2026-11-30',
        day: 'Monday',
        time: '10:00',
        priority: 'red',
        createdBy: 'vishnu',
        createdByEmail: 'vishnu@taskflow.local'
    },
    {
        id: '2',
        title: 'Write API Documentation Report',
        topic: 'Work',
        status: 'todo',
        date: '2026-12-02',
        day: 'Wednesday',
        time: '14:30',
        priority: 'amber',
        createdBy: 'vishnu',
        createdByEmail: 'vishnu@taskflow.local'
    },
    {
        id: '3',
        title: 'Schedule Annual Health Checkup',
        topic: 'Personal',
        status: 'todo',
        date: '2026-12-02',
        day: 'Wednesday',
        time: '11:00',
        priority: 'amber',
        createdBy: 'vishnu',
        createdByEmail: 'vishnu@taskflow.local'
    },
    {
        id: '4',
        title: 'Pay Home Internet and Energy Bills',
        topic: 'Personal',
        status: 'todo',
        date: '2026-12-04',
        day: 'Friday',
        time: '17:00',
        priority: 'red',
        createdBy: 'vishnu',
        createdByEmail: 'vishnu@taskflow.local'
    },
    {
        id: '5',
        title: 'Organize Study Desk and Bookshelf',
        topic: 'Personal',
        status: 'todo',
        date: '2026-12-06',
        day: 'Sunday',
        time: '16:00',
        priority: 'green',
        createdBy: 'vishnu',
        createdByEmail: 'vishnu@taskflow.local'
    },
    {
        id: '6',
        title: 'Fix Authentication LocalStorage Bug',
        topic: 'Work',
        status: 'inprogress',
        date: '2026-12-01',
        day: 'Tuesday',
        time: '11:30',
        priority: 'red',
        createdBy: 'vishnu',
        createdByEmail: 'vishnu@taskflow.local'
    },
    {
        id: '7',
        title: 'Conduct Sprint Planning Meeting',
        topic: 'Work',
        status: 'inprogress',
        date: '2026-12-03',
        day: 'Thursday',
        time: '09:30',
        priority: 'amber',
        createdBy: 'vishnu',
        createdByEmail: 'vishnu@taskflow.local'
    },
    {
        id: '8',
        title: 'Order Fitness Training Equipment',
        topic: 'Personal',
        status: 'inprogress',
        date: '2026-12-05',
        day: 'Saturday',
        time: '15:00',
        priority: 'green',
        createdBy: 'vishnu',
        createdByEmail: 'vishnu@taskflow.local'
    },
    {
        id: '9',
        title: 'Prepare Presentation Slides for Class',
        topic: 'Study',
        status: 'inprogress',
        date: '2026-12-02',
        day: 'Wednesday',
        time: '18:00',
        priority: 'amber',
        createdBy: 'vishnu',
        createdByEmail: 'vishnu@taskflow.local'
    },
    {
        id: '10',
        title: 'Deploy Production Web App Build',
        topic: 'Work',
        status: 'completed',
        date: '2026-11-30',
        day: 'Monday',
        time: '17:30',
        priority: 'red',
        createdBy: 'vishnu',
        createdByEmail: 'vishnu@taskflow.local'
    },
    {
        id: '11',
        title: 'Buy Weekly Grocery Items and Supplies',
        topic: 'Personal',
        status: 'completed',
        date: '2026-11-30',
        day: 'Monday',
        time: '19:00',
        priority: 'green',
        createdBy: 'vishnu',
        createdByEmail: 'vishnu@taskflow.local'
    },
    {
        id: '12',
        title: 'Test Unit Test Cases for JS Project',
        topic: 'Study',
        status: 'completed',
        date: '2026-12-03',
        day: 'Thursday',
        time: '20:00',
        priority: 'red',
        createdBy: 'vishnu',
        createdByEmail: 'vishnu@taskflow.local'
    }
];

let tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || defaultTasks;
let selectedTopic = 'All Projects';
let selectedView = 'kanban';
let searchQuery = '';

function saveTasks() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

function formatTime(timeStr) {
    if (!timeStr) return '';
    const [hourStr, min] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${min} ${ampm}`;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr + 'T00:00:00');
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Auto-update Day dropdown when Date changes
const dateInput = document.getElementById('task-date');
const daySelect = document.getElementById('task-day');

dateInput.addEventListener('change', () => {
    if (!dateInput.value) return;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const pickedDate = new Date(dateInput.value + 'T00:00:00');
    daySelect.value = days[pickedDate.getDay()];
});

// Priority pill selection
const priorityInput = document.getElementById('task-priority');
const priorityPills = document.querySelectorAll('.priority-pill');

function setPriority(val) {
    priorityInput.value = val;
    priorityPills.forEach((pill) => {
        pill.classList.toggle('active', pill.getAttribute('data-priority') === val);
    });
}

priorityPills.forEach((pill) => {
    pill.addEventListener('click', () => {
        setPriority(pill.getAttribute('data-priority'));
    });
});

// Search input
document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderBoard();
});

// Users see their own tasks; Admin sees all users' tasks
function getVisibleTasksByRole() {
    if (currentSession.role === 'admin') return tasks;
    return tasks.filter(
        (t) =>
            (t.createdBy || 'vishnu').toLowerCase() === currentSession.username.toLowerCase() ||
            (t.createdByEmail || '').toLowerCase() === (currentSession.email || '').toLowerCase()
    );
}

function updateCounts() {
    const roleTasks = getVisibleTasksByRole();
    document.getElementById('count-all').textContent = roleTasks.length;
    document.getElementById('count-work').textContent = roleTasks.filter((t) => t.topic === 'Work').length;
    document.getElementById('count-personal').textContent = roleTasks.filter((t) => t.topic === 'Personal').length;
    document.getElementById('count-study').textContent = roleTasks.filter((t) => t.topic === 'Study').length;
}

function getFilteredTasks() {
    return getVisibleTasksByRole().filter((task) => {
        const topicMatch = selectedTopic === 'All Projects' || task.topic === selectedTopic;
        const searchMatch =
            !searchQuery ||
            task.title.toLowerCase().includes(searchQuery) ||
            task.topic.toLowerCase().includes(searchQuery) ||
            task.day.toLowerCase().includes(searchQuery) ||
            (task.createdBy || '').toLowerCase().includes(searchQuery);
        return topicMatch && searchMatch;
    });
}

function renderBoard() {
    const filtered = getFilteredTasks();
    const todoList = document.getElementById('todo-list');
    const inprogressList = document.getElementById('inprogress-list');
    const completedList = document.getElementById('completed-list');

    todoList.innerHTML = '';
    inprogressList.innerHTML = '';
    completedList.innerHTML = '';

    const todoTasks = filtered.filter((t) => t.status === 'todo');
    const inprogressTasks = filtered.filter((t) => t.status === 'inprogress');
    const completedTasks = filtered.filter((t) => t.status === 'completed');

    document.getElementById('todo-count').textContent = todoTasks.length;
    document.getElementById('inprogress-count').textContent = inprogressTasks.length;
    document.getElementById('completed-count').textContent = completedTasks.length;

    todoTasks.forEach((task) => todoList.appendChild(createTaskCard(task)));
    inprogressTasks.forEach((task) => inprogressList.appendChild(createTaskCard(task)));
    completedTasks.forEach((task) => completedList.appendChild(createTaskCard(task)));

    updateCounts();
    renderSchedule();
    renderWorkflow();
    if (currentSession.role === 'admin') {
        renderAdminDashboard();
    }
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card priority-${task.priority}`;
    card.draggable = true;
    card.id = `task-${task.id}`;

    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', task.id);
    });

    const authorBadge =
        currentSession.role === 'admin'
            ? `<span class="author-tag">@${task.createdBy || 'vishnu'}</span>`
            : '';

    card.innerHTML = `
      <div class="card-top">
        <div class="card-title">${task.title}</div>
        <button type="button" class="delete-btn" title="Delete Task" onclick="deleteTask('${task.id}')">&times;</button>
      </div>
      <div class="card-bottom">
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="topic-tag">${task.topic}</span>
          ${authorBadge}
        </div>
        <div class="schedule-meta">
          <span>${task.day}, ${formatDate(task.date)}</span>
          <span>${formatTime(task.time)}</span>
        </div>
      </div>
      <div class="card-move-controls">
        ${task.status !== 'todo' ? `<button type="button" class="move-btn" onclick="moveTask('${task.id}', 'todo')">← To Do</button>` : ''}
        ${task.status !== 'inprogress' ? `<button type="button" class="move-btn" onclick="moveTask('${task.id}', 'inprogress')">In Progress</button>` : ''}
        ${task.status !== 'completed' ? `<button type="button" class="move-btn" onclick="moveTask('${task.id}', 'completed')">Completed →</button>` : ''}
      </div>
    `;

    return card;
}

function allowDrop(e) {
    e.preventDefault();
}

function dropTask(e, newStatus) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    moveTask(taskId, newStatus);
}

function moveTask(id, newStatus) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    saveTasks();
    renderBoard();
}

function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderBoard();
}

function renderSchedule() {
    const container = document.getElementById('schedule-container');
    const filtered = getFilteredTasks().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

    if (filtered.length === 0) {
        container.innerHTML = `<p>No tasks found for <strong>${selectedTopic}</strong>.</p>`;
        return;
    }

    const groupedByDay = {};
    filtered.forEach((t) => {
        const key = `${t.day} — ${formatDate(t.date)}`;
        if (!groupedByDay[key]) groupedByDay[key] = [];
        groupedByDay[key].push(t);
    });

    let html = '';
    for (const [dayLabel, dayTasks] of Object.entries(groupedByDay)) {
        html += `<div class="schedule-day-group"><div class="schedule-day-title">${dayLabel}</div>`;
        dayTasks.forEach((t) => {
            html += `
          <div class="schedule-row">
            <div>
              <strong>${t.title}</strong>
              <span class="topic-tag" style="margin-left:10px;">${t.topic}</span>
            </div>
            <div class="schedule-meta">
              <span>${formatTime(t.time)}</span>
              <span>(${t.status.toUpperCase()})</span>
            </div>
          </div>
        `;
        });
        html += `</div>`;
    }
    container.innerHTML = html;
}

function renderWorkflow() {
    const container = document.getElementById('workflow-container');
    const filtered = getFilteredTasks();
    const total = filtered.length;
    const todo = filtered.filter((t) => t.status === 'todo').length;
    const inprog = filtered.filter((t) => t.status === 'inprogress').length;
    const done = filtered.filter((t) => t.status === 'completed').length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    container.innerHTML = `
      <h2 style="margin-bottom: 18px;">Workflow Progress (${selectedTopic})</h2>
      <div class="workflow-stats">
        <div class="stat-box"><h3>${todo}</h3><p>To Do Tasks</p></div>
        <div class="stat-box"><h3>${inprog}</h3><p>In Progress</p></div>
        <div class="stat-box"><h3>${done}</h3><p>Completed</p></div>
      </div>
      <div>
        <div style="display:flex; justify-content:space-between; font-weight:600;">
          <span>Overall Completion Rate</span>
          <span>${percent}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
}

// Admin Dashboard: Who Logged In & What Tasks Users Added
function renderAdminDashboard() {
    const container = document.getElementById('admin-container');
    const loginLogs = JSON.parse(localStorage.getItem('taskflow_login_logs')) || [];

    const loginRows =
        loginLogs.length === 0
            ? `<tr><td colspan="5">No login activity recorded yet.</td></tr>`
            : loginLogs
                .map(
                    (log) => `
          <tr>
            <td><strong>${log.username}</strong></td>
            <td>${log.email || '-'}</td>
            <td><span class="topic-tag">${log.role.toUpperCase()}</span></td>
            <td>${log.loginDate}</td>
            <td>${log.loginTime}</td>
          </tr>`
                )
                .join('');

    const taskRows =
        tasks.length === 0
            ? `<tr><td colspan="6">No tasks created yet.</td></tr>`
            : tasks
                .map(
                    (t) => `
          <tr>
            <td><span class="author-tag">@${t.createdBy || 'vishnu'}</span></td>
            <td><strong>${t.title}</strong></td>
            <td><span class="topic-tag">${t.topic}</span></td>
            <td>${t.day}, ${formatDate(t.date)}</td>
            <td>${formatTime(t.time)}</td>
            <td>${t.status.toUpperCase()}</td>
          </tr>`
                )
                .join('');

    container.innerHTML = `
      <div class="admin-section">
        <h2>1. Who Logged In (User & Admin Login Logs)</h2>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Login Date</th>
              <th>Login Time</th>
            </tr>
          </thead>
          <tbody>${loginRows}</tbody>
        </table>
      </div>
  
      <div class="admin-section" style="margin-bottom:0;">
        <h2>2. All Tasks Added by Users (${tasks.length} Total)</h2>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Added By</th>
              <th>Task Title</th>
              <th>Project Topic</th>
              <th>Date & Day</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${taskRows}</tbody>
        </table>
      </div>
    `;
}

// Sidebar Topic Filter
document.querySelectorAll('#project-nav .nav-item').forEach((item) => {
    item.addEventListener('click', () => {
        document.querySelectorAll('#project-nav .nav-item').forEach((el) => el.classList.remove('active'));
        item.classList.add('active');

        selectedTopic = item.getAttribute('data-topic');
        document.getElementById('board-title').textContent =
            selectedTopic === 'All Projects' ? 'Task Board' : `${selectedTopic} Tasks`;
        document.getElementById('board-subtitle').textContent =
            selectedTopic === 'All Projects'
                ? 'Showing all tasks across Work, Personal, and Study'
                : `Showing tasks in ${selectedTopic}`;

        if (selectedTopic !== 'All Projects') {
            document.getElementById('task-topic').value = selectedTopic;
        }

        renderBoard();
    });
});

// Sidebar View Switcher
document.querySelectorAll('#view-nav .nav-item').forEach((item) => {
    item.addEventListener('click', () => {
        document.querySelectorAll('#view-nav .nav-item').forEach((el) => el.classList.remove('active'));
        item.classList.add('active');

        selectedView = item.getAttribute('data-view');
        document.querySelectorAll('.view-container').forEach((view) => view.classList.remove('active'));
        document.getElementById(`${selectedView}-view`).classList.add('active');
    });
});

// Modal Controls
const modal = document.getElementById('task-modal');
document.getElementById('open-modal-btn').addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.dispatchEvent(new Event('change'));
    document.getElementById('task-time').value = '10:00';
    setPriority('red');
    modal.classList.add('open');
    document.getElementById('task-title').focus();
});

function closeModal() {
    modal.classList.remove('open');
}

document.getElementById('close-modal-btn').addEventListener('click', closeModal);
document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);

// Save New Task
document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('task-title').value.trim();
    const topic = document.getElementById('task-topic').value;
    const status = document.getElementById('task-status').value;
    const date = document.getElementById('task-date').value;
    const day = document.getElementById('task-day').value;
    const time = document.getElementById('task-time').value;
    const priority = priorityInput.value;

    tasks.push({
        id: Date.now().toString(),
        title,
        topic,
        status,
        date,
        day,
        time,
        priority,
        createdBy: currentSession.username,
        createdByEmail: currentSession.email
    });

    saveTasks();
    renderBoard();
    document.getElementById('task-form').reset();
    setPriority('red');
    closeModal();
});

renderBoard();