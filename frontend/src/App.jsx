import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // View State: "login", "register", or "dashboard"
  const [view, setView] = useState(() => {
    return localStorage.getItem("taskflow_active_session") ? "dashboard" : "login";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const session = localStorage.getItem("taskflow_active_session");
    return session ? JSON.parse(session) : null;
  });

  // Auth Inputs
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");

  // Task State
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  // Live Date and Time State
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update the clock every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, []);

  // Formatter for Date and Time
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

  // Load user-specific tasks from localStorage
  useEffect(() => {
    if (currentUser) {
      const storageKey = `taskflow_tasks_${currentUser.email}`;
      const savedTasks = localStorage.getItem(storageKey);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        const defaults = [
          {
            _id: "w1",
            title: "Design CSS Grid Wireframe Layout",
            description: "Define CSS layout grid columns and spacing.",
            priority: "High",
            completed: false,
          },
          {
            _id: "p1",
            title: "Buy Weekly Grocery Items",
            description: "Get milk, eggs, bread, and fresh vegetables.",
            priority: "Low",
            completed: true,
          },
        ];
        setTasks(defaults);
        localStorage.setItem(storageKey, JSON.stringify(defaults));
      }
    }
  }, [currentUser]);

  // Save tasks on change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`taskflow_tasks_${currentUser.email}`, JSON.stringify(tasks));
    }
  }, [tasks, currentUser]);

  // --- AUTH HANDLERS ---
  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("taskflow_users")) || [];
    const found = users.find(
      (u) => u.email === authEmail.trim().toLowerCase() && u.password === authPassword.trim()
    );

    if (found) {
      const sessionData = { name: found.name, email: found.email };
      localStorage.setItem("taskflow_active_session", JSON.stringify(sessionData));
      setCurrentUser(sessionData);
      setView("dashboard");
      setAuthEmail("");
      setAuthPassword("");
    } else {
      alert("Invalid email or password. Please check your credentials or register.");
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
      const newTask = {
        _id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        priority,
        completed: false,
      };
      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
      setPriority("Medium");
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

  // --- 3. MAIN DASHBOARD VIEW ---
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

          {/* Date & Time Widget */}
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
                <div className="task-item" key={task._id}>
                  <div className="task-info">
                    <h3 className={task.completed ? "finished" : ""}>{task.title}</h3>
                    <p>{task.description || "No description"}</p>
                    <div className="badges">
                      <span className={`priority ${(task.priority || "Medium").toLowerCase()}`}>
                        {task.priority || "Medium"} Priority
                      </span>
                      <span className={task.completed ? "done" : "pending-badge"}>
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="actions">
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

        <footer>
          <p>© 2026 Task Management System | TaskFlow</p>
        </footer>
      </main>
    </div>
  );
}

export default App;