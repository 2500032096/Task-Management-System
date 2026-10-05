// 1. Session Guard Check
const activeUser = JSON.parse(localStorage.getItem('active_session'));
if (!activeUser) {
    window.location.href = 'auth.html';
} else {
    document.getElementById('user-display-name').textContent = activeUser.name;
}

// 2. Default Seed Tasks (5 Work, 5 Personal, 5 Study)
const defaultTasks = [
    // --- WORK TASKS (5) ---
    {
        id: 'w1',
        title: 'Design CSS Grid Wireframe Layout',
        project: 'Work',
        priority: 'high',
        day: 'Monday',
        deadline: '2026-09-28',
        status: 'todo'
    },
    {
        id: 'w2',
        title: 'Fix Authentication LocalStorage Bug',
        project: 'Work',
        priority: 'high',
        day: 'Tuesday',
        deadline: '2026-09-29',
        status: 'in-progress'
    },
    {
        id: 'w3',
        title: 'Write API Documentation Report',
        project: 'Work',
        priority: 'medium',
        day: 'Wednesday',
        deadline: '2026-09-30',
        status: 'todo'
    },
    {
        id: 'w4',
        title: 'Conduct Sprint Planning Meeting',
        project: 'Work',
        priority: 'medium',
        day: 'Thursday',
        deadline: '2026-10-01',
        status: 'in-progress'
    },
    {
        id: 'w5',
        title: 'Deploy Production Web App Build',
        project: 'Work',
        priority: 'high',
        day: 'Friday',
        deadline: '2026-10-02',
        status: 'completed'
    },

    // --- PERSONAL TASKS (5) ---
    {
        id: 'p1',
        title: 'Buy Weekly Grocery Items and Supplies',
        project: 'Personal',
        priority: 'low',
        day: 'Monday',
        deadline: '2026-09-28',
        status: 'completed'
    },
    {
        id: 'p2',
        title: 'Schedule Annual Health Checkup',
        project: 'Personal',
        priority: 'medium',
        day: 'Wednesday',
        deadline: '2026-09-30',
        status: 'todo'
    },
    {
        id: 'p3',
        title: 'Pay Home Internet and Energy Bills',
        project: 'Personal',
        priority: 'high',
        day: 'Friday',
        deadline: '2026-10-02',
        status: 'todo'
    },
    {
        id: 'p4',
        title: 'Order Fitness Training Equipment',
        project: 'Personal',
        priority: 'low',
        day: 'Saturday',
        deadline: '2026-10-03',
        status: 'in-progress'
    },
    {
        id: 'p5',
        title: 'Organize Study Desk and Bookshelf',
        project: 'Personal',
        priority: 'low',
        day: 'Sunday',
        deadline: '2026-10-04',
        status: 'todo'
    },

    // --- STUDY TASKS (5) ---
    {
        id: 's1',
        title: 'Study Data Structures and Algorithms',
        project: 'Study',
        priority: 'high',
        day: 'Tuesday',
        deadline: '2026-09-29',
        status: 'todo'
    },
    {
        id: 's2',
        title: 'Prepare Presentation Slides for Class',
        project: 'Study',
        priority: 'medium',
        day: 'Wednesday',
        deadline: '2026-09-30',
        status: 'in-progress'
    },
    {
        id: 's3',
        title: 'Test Unit Test Cases for JS Project',
        project: 'Study',
        priority: 'high',
        day: 'Thursday',
        deadline: '2026-10-01',
        status: 'completed'
    },
    {
        id: 's4',
        title: 'Read Operating System Design Chapter',
        project: 'Study',
        priority: 'medium',
        day: 'Saturday',
        deadline: '2026-10-03',
        status: 'todo'
    },
    {
        id: 's5',
        title: 'Review Machine Learning Notes',
        project: 'Study',
        priority: 'low',
        day: 'Sunday',
        deadline: '2026-10-04',
        status: 'todo'
    }
];

// Active State Trackers
let tasks = JSON.parse(localStorage.getItem(`tasks_${activeUser.email}`)) || defaultTasks;
let selectedProject = 'All';
let currentView = 'board';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Modal DOM Elements
const modal = document.getElementById('task-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const taskForm = document.getElementById('task-form');
const logoutBtn = document.getElementById('logout-btn');

const detailsModal = document.getElementById('details-modal');
const closeDetailsBtn = document.getElementById('close-details-btn');
const closeDetailsBottomBtn = document.getElementById('close-details-bottom-btn');

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem(`tasks_${activeUser.email}`)) {
        saveTasks();
    }
    renderTasks();
    renderSchedule();
    setupSidebarFilters();
    setupViewSwitcher();
    setupDragAndDrop();
    setupDetailsModalListeners();
});

function saveTasks() {
    localStorage.setItem(`tasks_${activeUser.email}`, JSON.stringify(tasks));
}

// DYNAMIC HINT ENGINE: Title-based hints matching title keywords
function getTaskHint(title, project) {
    const t = title.toLowerCase().trim();

    if (t.includes('css') || t.includes('grid') || t.includes('style')) {
        return `Strategy for "${title}": Define CSS layout grid columns, set gap spacing, and test responsive design across mobile/desktop screen widths.`;
    }
    if (t.includes('bug') || t.includes('fix') || t.includes('auth')) {
        return `Strategy for "${title}": Isolate reproducing steps, inspect local storage keys in Browser Developer Tools, and verify correct user session parsing.`;
    }
    if (t.includes('report') || t.includes('document') || t.includes('api')) {
        return `Strategy for "${title}": Create a structured outline using bullet points, detail all request/response schemas, and include practical code samples.`;
    }
    if (t.includes('meeting') || t.includes('planning')) {
        return `Strategy for "${title}": Prepare key agenda points beforehand, set explicit time slots for discussion topics, and outline actionable deliverables.`;
    }
    if (t.includes('deploy') || t.includes('build')) {
        return `Strategy for "${title}": Run all unit tests locally, check environmental variables, compile production assets, and test live deployment links.`;
    }
    if (t.includes('buy') || t.includes('grocery') || t.includes('order')) {
        return `Strategy for "${title}": Draft an essential item checklist, cross-check current stock at home, and compare prices prior to checking out.`;
    }
    if (t.includes('health') || t.includes('pay') || t.includes('bill')) {
        return `Strategy for "${title}": Double-check due dates/schedules, collect required receipts or documents, and log the completion in your personal journal.`;
    }
    if (t.includes('study') || t.includes('read') || t.includes('notes') || t.includes('learning')) {
        return `Strategy for "${title}": Utilize 25-minute Pomodoro focus intervals. Write summary notes for each chapter and test retention with practice questions.`;
    }
    if (t.includes('slides') || t.includes('presentation')) {
        return `Strategy for "${title}": Draft visual slide cards, outline key discussion points, and execute a timed practice run to ensure clean delivery.`;
    }
    if (t.includes('test')) {
        return `Strategy for "${title}": Define assertion conditions, test both positive inputs and unexpected edge cases, and ensure clean execution output.`;
    }

    // Fallback hint for custom title entries
    return `Execution Strategy for "${title}": Divide this ${project} task into 2-3 step-by-step milestones. Focus on completing core tasks first before finalizing.`;
}

// Render Kanban Board
function renderTasks() {
    document.getElementById('list-todo').innerHTML = '';
    document.getElementById('list-in-progress').innerHTML = '';
    document.getElementById('list-completed').innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        return selectedProject === 'All' || task.project === selectedProject;
    });

    filteredTasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `task-card priority-${task.priority}`;
        card.draggable = true;
        card.dataset.id = task.id;
        card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <h4 style="font-size:0.95rem; font-weight:600;">${task.title}</h4>
        <button onclick="deleteTask(event, '${task.id}')" style="border:none; background:none; color:#ef4444; cursor:pointer; font-size:1.1rem; line-height:1;">&times;</button>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; font-size:0.75rem; color:#64748b;">
        <span style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-weight:600;">${task.project}</span>
        <span>🗓️ ${task.day || 'Unscheduled'}</span>
      </div>
    `;

        // Drag start listener
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
        });

        // Click card to open Details Modal
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            openTaskDetails(task);
        });

        const targetList = document.getElementById(`list-${task.status}`);
        if (targetList) targetList.appendChild(card);
    });
}

// Open Task Details Modal
function openTaskDetails(task) {
    document.getElementById('details-title').textContent = task.title;
    document.getElementById('details-project').textContent = task.project;

    const priorityBadge = document.getElementById('details-priority');
    priorityBadge.textContent = task.priority.toUpperCase();
    priorityBadge.style.background = task.priority === 'high' ? '#fee2e2' : task.priority === 'medium' ? '#fef3c7' : '#d1fae5';
    priorityBadge.style.color = task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#d97706' : '#059669';

    document.getElementById('details-deadline').textContent = `${task.day || 'Any Day'} | Due Date: ${task.deadline}`;
    document.getElementById('details-hint').textContent = getTaskHint(task.title, task.project);

    detailsModal.classList.add('active');
}

function setupDetailsModalListeners() {
    closeDetailsBtn.addEventListener('click', () => detailsModal.classList.remove('active'));
    closeDetailsBottomBtn.addEventListener('click', () => detailsModal.classList.remove('active'));
}

// Render Day-by-Day Schedule Grid
function renderSchedule() {
    const scheduleGrid = document.getElementById('schedule-grid');
    scheduleGrid.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        return selectedProject === 'All' || task.project === selectedProject;
    });

    daysOfWeek.forEach(day => {
        const dayCol = document.createElement('div');
        dayCol.className = 'schedule-day-col';

        const dayTasks = filteredTasks.filter(t => t.day === day);

        let tasksHTML = dayTasks.map(t => `
      <div class="schedule-item" onclick="openTaskDetailsById('${t.id}')" style="cursor:pointer;">
        <strong>${t.title}</strong>
        <span style="color:#64748b; font-size:0.7rem;">${t.project} | ${t.status.toUpperCase()}</span>
      </div>
    `).join('');

        if (dayTasks.length === 0) {
            tasksHTML = `<p style="font-size:0.75rem; color:#94a3b8; text-align:center;">No tasks</p>`;
        }

        dayCol.innerHTML = `
      <div class="schedule-day-header">${day}</div>
      <div class="schedule-day-tasks">${tasksHTML}</div>
    `;

        scheduleGrid.appendChild(dayCol);
    });
}

window.openTaskDetailsById = function (id) {
    const task = tasks.find(t => t.id === id);
    if (task) openTaskDetails(task);
};

// Global Delete Task
window.deleteTask = function (event, id) {
    event.stopPropagation();
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    renderSchedule();
};

// Sidebar Project Filter Listener
function setupSidebarFilters() {
    const projectItems = document.querySelectorAll('#project-list li');
    const boardHeader = document.getElementById('board-header');

    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            projectItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');

            selectedProject = item.dataset.project;
            if (boardHeader) {
                boardHeader.textContent = selectedProject === 'All' ? 'Task Board' : `${selectedProject} Tasks`;
            }

            renderTasks();
            renderSchedule();
        });
    });
}

// Switch between Board, Schedule, and Workflow Views
function setupViewSwitcher() {
    const viewItems = document.querySelectorAll('#view-list li');
    const kanbanView = document.getElementById('view-kanban-board');
    const scheduleView = document.getElementById('view-schedule');
    const workflowView = document.getElementById('view-workflow');

    viewItems.forEach(item => {
        item.addEventListener('click', () => {
            viewItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');

            currentView = item.dataset.view;

            kanbanView.classList.add('hidden');
            scheduleView.classList.add('hidden');
            workflowView.classList.add('hidden');

            if (currentView === 'board') kanbanView.classList.remove('hidden');
            if (currentView === 'schedule') scheduleView.classList.remove('hidden');
            if (currentView === 'workflow') workflowView.classList.remove('hidden');
        });
    });
}

// Modal Listeners
openModalBtn.addEventListener('click', () => modal.classList.add('active'));
closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
        id: Date.now().toString(),
        title: document.getElementById('task-title').value,
        project: document.getElementById('task-project').value,
        priority: document.getElementById('task-priority').value,
        day: document.getElementById('task-day').value,
        deadline: document.getElementById('task-deadline').value,
        status: 'todo'
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    renderSchedule();
    taskForm.reset();
    modal.classList.remove('active');
});

// Drag and Drop Logic
function setupDragAndDrop() {
    const columns = document.querySelectorAll('.kanban-column');

    columns.forEach(column => {
        column.addEventListener('dragover', (e) => e.preventDefault());
        column.addEventListener('drop', (e) => {
            e.preventDefault();
            const taskId = e.dataTransfer.getData('text/plain');
            const newStatus = column.dataset.status;

            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.status = newStatus;
                saveTasks();
                renderTasks();
                renderSchedule();
            }
        });
    });
}

// Logout Listener
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('active_session');
    window.location.href = 'auth.html';
});  script.js