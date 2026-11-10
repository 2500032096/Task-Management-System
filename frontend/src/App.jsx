import React, { useState, useEffect } from 'react';
import './App.css'; // Assuming your styles are imported here

export default function App() {
  // Session & User Check
  const [activeUser, setActiveUser] = useState(null);
  
  // App States
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState('All');
  const [currentView, setCurrentView] = useState('board');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState('Work');
  const [newStatus, setNewStatus] = useState('todo');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDay, setNewDay] = useState('Monday');
  const [newDeadline, setNewDeadline] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Initialize Session & Default Seed Tasks
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('active_session'));
    if (!session) {
      window.location.href = 'auth.html';
    } else {
      setActiveUser(session);
    }

    const defaultTasks = [
      { id: 'w1', title: 'Design CSS Grid Wireframe Layout', project: 'Work', priority: 'high', day: 'Monday', deadline: '2026-10-05', status: 'todo' },
      { id: 'w2', title: 'Write API Documentation Report', project: 'Work', priority: 'medium', day: 'Tuesday', deadline: '2026-10-06', status: 'todo' },
      { id: 'w3', title: 'Fix Authentication LocalStorage Bug', project: 'Work', priority: 'high', day: 'Wednesday', deadline: '2026-10-07', status: 'in-progress' },
      { id: 'p1', title: 'Schedule Annual Health Checkup', project: 'Personal', priority: 'medium', day: 'Monday', deadline: '2026-10-05', status: 'todo' },
      { id: 'p3', title: 'Order Fitness Training Equipment', project: 'Personal', priority: 'low', day: 'Wednesday', deadline: '2026-10-07', status: 'in-progress' },
      { id: 's1', title: 'Study Data Structures and Algorithms', project: 'Study', priority: 'high', day: 'Monday', deadline: '2026-10-05', status: 'todo' },
      { id: 's3', title: 'Prepare Presentation Slides for Class', project: 'Study', priority: 'medium', day: 'Wednesday', deadline: '2026-10-07', status: 'in-progress' }
    ];

    const saved = localStorage.getItem(`tasks_${session?.email}`);
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      setTasks(defaultTasks);
      localStorage.setItem(`tasks_${session?.email}`, JSON.stringify(defaultTasks));
    }
  }, []);

  const saveTasksToStorage = (updatedTasks) => {
    setTasks(updatedTasks);
    if (activeUser) {
      localStorage.setItem(`tasks_${activeUser.email}`, JSON.stringify(updatedTasks));
    }
  };

  // Dynamic Hint Engine
  const getTaskHint = (title, project) => {
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
    if (t.includes('study') || t.includes('read') || t.includes('notes') || t.includes('learning')) {
      return `Strategy for "${title}": Utilize 25-minute Pomodoro focus intervals. Write summary notes for each chapter and test retention with practice questions.`;
    }
    return `Execution Strategy for "${title}": Divide this ${project} task into 2-3 step-by-step milestones. Focus on completing core tasks first before finalizing.`;
  };

  // Task Submission Handler
  const handleCreateTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: 't_' + Date.now(),
      title: newTitle,
      project: newProject,
      priority: newPriority,
      day: newDay,
      deadline: newDeadline,
      status: newStatus
    };

    saveTasksToStorage([...tasks, newTask]);
    setNewTitle('');
    setNewDeadline('');
    setIsCreateModalOpen(false);
  };

  // Delete Task
  const handleDeleteTask = (e, id) => {
    e.stopPropagation();
    const updated = tasks.filter(t => t.id !== id);
    saveTasksToStorage(updated);
  };

  // Drag and Drop Handler
  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: targetStatus } : t);
    saveTasksToStorage(updated);
  };

  const filteredTasks = tasks.filter(task => {
    return selectedProject === 'All' || task.project === selectedProject;
  });

  if (!activeUser) return null;

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <h2>TaskFlow</h2>
        </div>
        <nav className="nav-menu">
          <div className="nav-section">
            <h3>VIEWS</h3>
            <ul>
              <li className={currentView === 'board' ? 'active' : ''} onClick={() => setCurrentView('board')}>📋 Kanban Board</li>
              <li className={currentView === 'schedule' ? 'active' : ''} onClick={() => setCurrentView('schedule')}>📅 Weekly Schedule</li>
              <li className={currentView === 'workflow' ? 'active' : ''} onClick={() => setCurrentView('workflow')}>⚡ Workflow Guide</li>
            </ul>
          </div>
          <div className="nav-section">
            <h3>PROJECTS</h3>
            <ul>
              {['All', 'Work', 'Personal', 'Study'].map(proj => (
                <li key={proj} className={selectedProject === proj ? 'active' : ''} onClick={() => setSelectedProject(proj)}>
                  {proj === 'All' ? '📂 All Projects' : proj === 'Work' ? '💼 Work' : proj === 'Personal' ? '👤 Personal' : '🎓 Study'}
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="user-profile">
          <span>{activeUser.name}</span>
          <button onClick={() => { localStorage.removeItem('active_session'); window.location.href = 'auth.html'; }}>Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          <h1>{selectedProject === 'All' ? 'Task Board' : `${selectedProject} Tasks`}</h1>
          <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>+ New Task</button>
        </header>

        {/* View 1: Kanban Board */}
        {currentView === 'board' && (
          <div className="kanban-grid">
            {['todo', 'in-progress', 'completed'].map(status => (
              <div 
                key={status} 
                className="kanban-column" 
                data-status={status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="column-header">
                  <h3>{status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Completed'}</h3>
                </div>
                <div className="task-list">
                  {filteredTasks.filter(t => t.status === status).map(task => (
                    <div 
                      key={task.id} 
                      className={`task-card priority-${task.priority}`} 
                      draggable 
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                      onClick={() => { setSelectedTask(task); setIsDetailsModalOpen(true); }}
                    >
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                        <h4 style={{fontSize:'0.95rem', fontWeight:600}}>{task.title}</h4>
                        <button onClick={(e) => handleDeleteTask(e, task.id)} style={{border:'none', background:'none', color:'#ef4444', cursor:'pointer', fontSize:'1.1rem'}}>&times;</button>
                      </div>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'10px', fontSize:'0.75rem', color:'#64748b'}}>
                        <span style={{background:'#f1f5f9', padding:'2px 6px', borderRadius:'4px', fontWeight:600}}>{task.project}</span>
                        <span>🗓️ {task.day || 'Unscheduled'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View 2: Weekly Schedule */}
        {currentView === 'schedule' && (
          <div className="schedule-grid">
            {daysOfWeek.map(day => {
              const dayTasks = filteredTasks.filter(t => t.day === day);
              return (
                <div key={day} className="schedule-day-col">
                  <div className="schedule-day-header">{day}</div>
                  <div className="schedule-day-tasks">
                    {dayTasks.length === 0 ? (
                      <p style={{fontSize:'0.75rem', color:'#94a3b8', textAlign:'center'}}>No tasks</p>
                    ) : (
                      dayTasks.map(t => (
                        <div key={t.id} className="schedule-item" onClick={() => { setSelectedTask(t); setIsDetailsModalOpen(true); }} style={{cursor:'pointer'}}>
                          <strong>{t.title}</strong>
                          <span style={{color:'#64748b', fontSize:'0.7rem'}}>{t.project} | {t.status.toUpperCase()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View 3: Workflow Guide */}
        {currentView === 'workflow' && (
          <div className="workflow-content">
            <div className="workflow-card">
              <h3>1. Prioritize & Assign</h3>
              <p>Categorize tasks into Work, Personal, or Study projects with custom priority levels and schedules.</p>
            </div>
            <div className="workflow-card">
              <h3>2. Dynamic Execution Strategy</h3>
              <p>Click any task card to inspect algorithmic hints generated based on keyword matching.</p>
            </div>
            <div className="workflow-card">
              <h3>3. Drag & Drop Progression</h3>
              <p>Seamlessly drag tasks across Kanban columns to update progress states in real-time.</p>
            </div>
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Task</h3>
              <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required placeholder="e.g., Fix Bug" />
              </div>
              <div className="form-group">
                <label>Project Category</label>
                <select value={newProject} onChange={(e) => setNewProject(e.target.value)}>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                </select>
              </div>
              <div className="form-group">
                <label>Initial Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Assigned Day</label>
                <select value={newDay} onChange={(e) => setNewDay(e.target.value)}>
                  {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} required />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {isDetailsModalOpen && selectedTask && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedTask.title}</h3>
              <button className="close-btn" onClick={() => setIsDetailsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{display:'flex', gap:'10px', alignItems:'center', marginBottom:'15px'}}>
                <span className="badge">{selectedTask.project}</span>
                <span className="badge" style={{textTransform:'uppercase'}}>{selectedTask.priority}</span>
              </div>
              <p style={{fontSize:'0.85rem', color:'#64748b', marginBottom:'15px'}}>🗓️ {selectedTask.day} | Due: {selectedTask.deadline}</p>
              <div className="hint-box" style={{background:'#f8fafc', borderLeft:'4px solid #3b82f6', padding:'12px', borderRadius:'4px'}}>
                <h4 style={{fontSize:'0.85rem', color:'#1e293b', marginBottom:'6px'}}>💡 Dynamic Execution Strategy</h4>
                <p style={{fontSize:'0.85rem', color:'#475569', lineHeight:1.4}}>{getTaskHint(selectedTask.title, selectedTask.project)}</p>
              </div>
            </div>
            <div className="modal-footer" style={{marginTop:'20px', textAlign:'right'}}>
              <button className="btn-secondary" onClick={() => setIsDetailsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}