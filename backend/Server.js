const API_URL = 'http://localhost:3000/api';
let tasks = [];

// Fetch tasks from backend on load
async function loadTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks/${activeUser.email}`);
    tasks = await response.json();
    renderTasks();
    renderSchedule();
  } catch (error) {
    console.error('Failed to load tasks:', error);
  }
}

// Save/Add task to backend
async function saveTaskToServer(newTask) {
  try {
    await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, userEmail: activeUser.email })
    });
    loadTasks();
  } catch (error) {
    console.error('Failed to save task:', error);
  }
}

// Update task status on drag-and-drop
async function updateTaskStatusOnServer(taskId, newStatus) {
  try {
    await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (error) {
    console.error('Failed to update status:', error);
  }
}

// Delete task from backend
async function deleteTaskFromServer(taskId) {
  try {
    await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE' });
    loadTasks();
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
}