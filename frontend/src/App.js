import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // View State: "login", "register", "dashboard", or "admin-dashboard"
  const [view, setView] = useState(() => {
    const session = localStorage.getItem("taskflow_active_session");
    if (!session) return "login";
    const user = JSON.parse(session);
    return user.email === "admin@taskflow.com" ? "admin-dashboard" : "dashboard";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const session = localStorage.getItem("taskflow_active_session");
    return session ? JSON.parse(session) : null;
  });

  // Auth Inputs
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");

  // Task Form State (for regular users)
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [taskDate, setTaskDate] = useState("");
  const [taskDay, setTaskDay] = useState("Monday");
  const [taskTime, setTaskTime] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  // Admin State (to view all users and their tasks)
  const [allUsersTasks, setAllUsersTasks] = useState([]);

  // Selected Task Modal State
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalDate, setModalDate] = useState("");
  const [modalDay, setModalDay] = useState("Monday");
  const [modalTime, setModalTime] = useState("");

  // Live Date and Time State for Topbar Clock
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Load user tasks or admin overview data
  useEffect(() => {
    if (currentUser) {
      if (currentUser.email === "admin@taskflow.com") {
        loadAdminData();
      } else {
        const storageKey = `taskflow_tasks_${currentUser.email}`;
        const savedTasks = localStorage.getItem(storageKey);
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        } else {
          const defaults = [
            {
              _id: "w1",
              title: "Design CSS Grid Wireframe Layout",
              description: "Define CSS layout grid columns and spacing.\n📅 Date: 2026-09-28 (Monday) ⏰ Time: 10:00",
              priority: "High",
              taskDate: "2026-09-28",
              taskDay: "Monday",
              taskTime: "10:00",
              completed: false,
            },
          ];
          setTasks(defaults);
          localStorage.setItem(storageKey, JSON.stringify(defaults));
        }
      }
    }
  }, [currentUser]);

  // Save tasks for regular users
  useEffect(() => {
    if (currentUser && currentUser.email !== "admin@taskflow.com") {
      localStorage.setItem(`taskflow_tasks_${currentUser.email}`, JSON.stringify(tasks));
    }
  }, [tasks, currentUser]);

  // Helper function to load all users and their respective tasks for Admin
  const loadAdminData = () => {
    const users = JSON.parse(localStorage.getItem("taskflow_users")) || [];
    let compiledData = [];

    users.forEach((user) => {
      const userTasks = JSON.parse(localStorage.getItem(`taskflow_tasks_${user.email}`)) || [];
      compiledData.push({
        userName: user.name,
        userEmail: user.email,
        tasks: userTasks,
      });
    });

    setAllUsersTasks(compiledData);
  };

  // --- AUTH HANDLERS ---
  const handleLogin = (e) => {
    e.preventDefault();
    const emailTrim = authEmail.trim().toLowerCase();
    const passTrim = authPassword.trim();

    // Special shortcut login for Admin account
    if (emailTrim === "admin@taskflow.com" && passTrim === "admin123") {
      const adminSession = { name: "System Admin", email: "admin@taskflow.com" };
      localStorage.setItem("taskflow_active_session", JSON.stringify(adminSession));
      setCurrentUser(adminSession);
      setView("admin-dashboard");
      setAuthEmail("");
      setAuthPassword("");
      return;
    }

    const users = JSON.parse(localStorage.getItem("taskflow_users")) || [];
    const found = users.find((u) => u.email === emailTrim && u.password === passTrim);

    if (found) {
      const sessionData = { name: found.name, email: found.email };
      localStorage.setItem("taskflow_active_session", JSON.stringify(sessionData));
      setCurrentUser(sessionData);
      setView("dashboard");
      setAuthEmail("");
      setAuthPassword("");
    } else {
      alert("Invalid email or password. (Hint for Admin: admin@taskflow.com / admin123)");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const trimmedName = authName.trim();
    const trimmedEmail = authEmail.trim().toLowerCase();
    const trimmedPassword = authPassword.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      alert("Please fill in all fields.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("taskflow_users")) || [];
    if (users.some((u) => u.email === trimmedEmail)) {
      alert("An account with this email already exists. Please login.");
      return;
    }

    const newUser = { name: trimmedName, email: trimmedEmail, password: trimmedPassword };
    users.push(newUser);
    localStorage.setItem("taskflow_users", JSON.stringify(users));

    const sessionData = { name: trimmedName, email: trimmedEmail };
    localStorage.setItem("taskflow_active_session", JSON.stringify(sessionData));
    setCurrentUser(sessionData);
    setView("dashboard");

    setAuthName("");
    setAuthEmail("");
    setAuthPassword("");
    alert("Registration Successful!");
  };

  const handleLogout = () => {
    localStorage.removeItem("taskflow_active_session");
    setCurrentUser(null);
    setView("login");
  };

  // --- TASK HANDLERS ---
  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const dateString = taskDate || new Date().toISOString().split("T")[0];
      const timeString = taskTime || "12:00";
      const baseDesc = description.trim() || "No description";
      const fullDescription = `${baseDesc}\n📅 Date: ${dateString} (${taskDay}) ⏰ Time: ${timeString}`;

      const newTask = {
        _id: Date.now().toString(),
        title: title.trim(),
        description: fullDescription,
        priority,
        taskDate: dateString,
        taskDay: taskDay,
        taskTime: timeString,
        completed: false,
      };

      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setTaskDate("");
      setTaskDay("Monday");
      setTaskTime("");
      setLoading(false);
    }, 200);
  };

  const toggleTask = (taskToToggle) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskToToggle._id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setTasks((prev) => prev.filter((task) => task._id !== id));
  };

  const handleOpenTask = (task) => {
    setSelectedTask(task);
    setModalDate(task.taskDate || "");
    setModalDay(task.taskDay || "Monday");
    setModalTime(task.taskTime || "");
  };

  const handleSaveTaskSchedule = (e) => {
    e.preventDefault();
    setTasks((prev) =>
      prev.map((t) => {
        if (t._id === selectedTask._id) {
          const cleanDesc = t.description.split("\n📅 Date:")[0];
          const updatedDescription = `${cleanDesc}\n📅 Date: ${modalDate} (${modalDay}) ⏰ Time: ${modalTime}`;
          return {
            ...t,
            description: updatedDescription,
            taskDate: modalDate,
            taskDay: modalDay,
            taskTime: modalTime,
          };
        }
        return t;
      })
    );
    setSelectedTask(null);
    alert("Task schedule updated successfully!");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = (task.title || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && !task.completed) ||
      (filter === "Completed" && task.completed);
    return matchesSearch && matchesFilter;
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  // --- 1. LOGIN VIEW ---
  if (view === "login") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>TaskFlow</h1>
          <h2>Welcome Back</h2>
          <p>Login to manage your tasks</p>
          <form onSubmit={handleLogin}>
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
            />
            <label htmlFor="login-pass">Password</label>
            <input
              id="login-pass"
              type="password"
              placeholder="Enter password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              required
            />
            <button type="submit" className="auth-btn">Login</button>
          </form>
          <p style={{ fontSize: "11px", color: "#64748b", marginTop: "10px", textAlign: "center" }}>
            🔑 Admin Login: <b>admin@taskflow.com</b> / Pass: <b>admin123</b>
          </p>
          <p className="switch-text">
            Don't have an account?{" "}
            <span onClick={() => setView("register")} style={{ color: "#6366f1", cursor: "pointer", fontWeight: "600" }}>
              Register
            </span>
          </p>
        </div>
      </div>
    );
  }

  // --- 2. REGISTER VIEW ---
  if (view === "register") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>TaskFlow</h1>
          <h2>Create Account</h2>
          <p>Register to manage your tasks</p>
          <form onSubmit={handleRegister}>
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              placeholder="Enter your name"
              value={authName}
              onChange={(e) => setAuthName(e.target.value)}
              required
            />
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              placeholder="Enter your email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
            />
            <label htmlFor="reg-pass">Password</label>
            <input
              id="reg-pass"
              type="password"
              placeholder="Create password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              required
            />
            <button type="submit" className="auth-btn">Register</button>
          </form>
          <p className="switch-text">
            Already have an account?{" "}
            <span onClick={() => setView("login")} style={{ color: "#6366f1", cursor: "pointer", fontWeight: "600" }}>
              Login
            </span>
          </p>
        </div>
      </div>
    );
  }

  // --- 3. ADMIN DASHBOARD VIEW ---
  if (view === "admin-dashboard") {
    return (
      <div className="app">
        <aside className="sidebar">
          <h2>TaskFlow Admin</h2>
          <nav>
            <a href="#admin-overview">📊 User Overview</a>
          </nav>
          <div className="sidebar-bottom">
            <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div>
              <h1>Admin Control Panel</h1>
              <p>Monitor all registered users and their created tasks across the system.</p>
            </div>
            <div className="datetime-widget">
              <span className="date-text">📅 {formattedDate}</span>
              <span className="time-text">⏰ {formattedTime}</span>
            </div>
            <div className="profile">🛡️ Administrator</div>
          </header>

          <section className="content" style={{ gridTemplateColumns: "1fr" }}>
            <div className="tasks-card" id="admin-overview">
              <div className="tasks-header" style={{ marginBottom: "20px" }}>
                <h2>👥 All Registered Users & Their Tasks</h2>
                <button 
                  onClick={loadAdminData} 
                  style={{ background: "#6366f1", color: "white", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
                >
                  🔄 Refresh Data
                </button>
              </div>

              {allUsersTasks.length === 0 ? (
                <div className="empty">
                  <h3>No Users Found</h3>
                  <p>No regular users have registered yet.</p>
                </div>
              ) : (
                allUsersTasks.map((userData, index) => (
                  <div key={index} style={{ marginBottom: "30px", borderBottom: "2px solid #e2e8f0", paddingBottom: "20px" }}>
                    <div style={{ background: "#f8fafc", padding: "12px 18px", borderRadius: "10px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h3 style={{ color: "#1e293b", fontSize: "16px" }}>👤 {userData.userName}</h3>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>📧 {userData.userEmail}</span>
                      </div>
                      <span style={{ background: "#e0e7ff", color: "#4338ca", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                        {userData.tasks.length} Tasks Created
                      </span>
                    </div>

                    {userData.tasks.length === 0 ? (
                      <p style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic", paddingLeft: "10px" }}>This user has not added any tasks yet.</p>
                    ) : (
                      userData.tasks.map((task) => (
                        <div className="task-item" key={task._id} style={{ marginLeft: "10px", padding: "12px 0" }}>
                          <div className="task-info">
                            <h4 className={task.completed ? "finished" : ""} style={{ fontSize: "15px" }}>{task.title}</h4>
                            <p style={{ whiteSpace: "pre-line", fontSize: "13px" }}>{task.description}</p>
                            <div className="badges" style={{ marginTop: "6px" }}>
                              <span className={`priority ${(task.priority || "Medium").toLowerCase()}`}>
                                {task.priority || "Medium"} Priority
                              </span>
                              <span className={task.completed ? "done" : "pending-badge"}>
                                {task.completed ? "Completed" : "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          <footer>
            <p>© 2026 Task Management System | TaskFlow Admin</p>
          </footer>
        </main>
      </div>
    );
  }

  // --- 4. REGULAR USER DASHBOARD VIEW ---
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>TaskFlow</h2>
        <nav>
          <a href="#dashboard">🏠 Dashboard</a>
          <a href="#tasks">📋 My Tasks</a>
          <a href="#add-task">➕ Add Task</a>
        </nav>
        <div className="sidebar-bottom">
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>Task Management System</h1>
            <p>Organize your work and achieve your goals.</p>
          </div>

          <div className="datetime-widget">
            <span className="date-text">📅 {formattedDate}</span>
            <span className="time-text">⏰ {formattedTime}</span>
          </div>

          <div className="profile">👤 {currentUser?.name || "Student"}</div>
        </header>

        <section className="stats" id="dashboard">
          <div className="stat-card purple">
            <h3>Total Tasks</h3>
            <h2>{tasks.length}</h2>
            <p>All your tasks</p>
          </div>
          <div className="stat-card green">
            <h3>Completed</h3>
            <h2>{completedCount}</h2>
            <p>Finished tasks</p>
          </div>
          <div className="stat-card orange">
            <h3>Pending</h3>
            <h2>{pendingCount}</h2>
            <p>Tasks remaining</p>
          </div>
        </section>

        <section className="content">
          <div className="form-card" id="add-task">
            <h2>➕ Create New Task</h2>
            <form onSubmit={addTask}>
              <label htmlFor="task-title">Task Title</label>
              <input
                id="task-title"
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <label htmlFor="task-date">Task Date</label>
              <input
                id="task-date"
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                required
              />

              <label htmlFor="task-day">Day of the Week</label>
              <select
                id="task-day"
                value={taskDay}
                onChange={(e) => setTaskDay(e.target.value)}
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>

              <label htmlFor="task-time">Task Time</label>
              <input
                id="task-time"
                type="time"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
                required
              />

              <button type="submit" className="add-btn" disabled={loading}>
                {loading ? "Adding Task..." : "+ Add Task"}
              </button>
            </form>
          </div>

          <div className="tasks-card" id="tasks">
            <div className="tasks-header">
              <h2>📋 My Tasks</h2>
              <span>{filteredTasks.length} Tasks</span>
            </div>

            <div className="filters">
              <input
                type="text"
                placeholder="🔍 Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="empty">
                <h3>🎯 No Tasks Found</h3>
                <p>Create your first task!</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div 
                  className="task-item" 
                  key={task._id}
                  onClick={() => handleOpenTask(task)}
                  style={{ cursor: "pointer" }}
                  title="Click to edit task date, day, or time"
                >
                  <div className="task-info">
                    <h3 className={task.completed ? "finished" : ""}>{task.title}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>{task.description}</p>

                    <div className="badges">
                      <span className={`priority ${(task.priority || "Medium").toLowerCase()}`}>
                        {task.priority || "Medium"} Priority
                      </span>
                      <span className={task.completed ? "done" : "pending-badge"}>
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="actions" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="complete" onClick={() => toggleTask(task)}>
                      {task.completed ? "↩ Undo" : "✓ Complete"}
                    </button>
                    <button type="button" className="delete" onClick={() => deleteTask(task._id)}>
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {selectedTask && (
          <div className="modal-overlay" style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
          }}>
            <div className="modal-card" style={{ background: "white", padding: "30px", borderRadius: "15px", width: "400px", maxWidth: "90%" }}>
              <h2>📌 Update Task Schedule</h2>
              <p style={{ margin: "10px 0", fontWeight: "600" }}>{selectedTask.title}</p>
              
              <form onSubmit={handleSaveTaskSchedule}>
                <label htmlFor="modal-date">Date</label>
                <input
                  id="modal-date"
                  type="date"
                  value={modalDate}
                  onChange={(e) => setModalDate(e.target.value)}
                  style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  required
                />

                <label htmlFor="modal-day">Day of the Week</label>
                <select
                  id="modal-day"
                  value={modalDay}
                  onChange={(e) => setModalDay(e.target.value)}
                  style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>

                <label htmlFor="modal-time">Time</label>
                <input
                  id="modal-time"
                  type="time"
                  value={modalTime}
                  onChange={(e) => setModalTime(e.target.value)}
                  style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  required
                />

                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" style={{ flex: 1, background: "#6366f1", color: "white", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                    Save
                  </button>
                  <button type="button" onClick={() => setSelectedTask(null)} style={{ flex: 1, background: "#e2e8f0", color: "#1e293b", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <footer>
          <p>© 2026 Task Management System | TaskFlow</p>
        </footer>
      </main>
    </div>
  );
}

export default App;