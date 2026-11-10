import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design CSS Grid Wireframe Layout", category: "Work", day: "Monday", status: "todo" },
    { id: 2, title: "Write API Documentation Report", category: "Work", day: "Wednesday", status: "todo" },
    { id: 3, title: "Schedule Annual Health Checkup", category: "Personal", day: "Wednesday", status: "todo" },
    { id: 4, title: "Pay Home Internet and Energy Bills", category: "Personal", day: "Friday", status: "todo" },
    { id: 5, title: "Organize Study Desk and Bookshelf", category: "Personal", day: "Sunday", status: "todo" },
    { id: 6, title: "Study Data Structures and Algorithms", category: "Study", day: "Saturday", status: "todo" },

    { id: 7, title: "Fix Authentication LocalStorage Bug", category: "Work", day: "Tuesday", status: "progress" },
    { id: 8, title: "Conduct Sprint Planning Meeting", category: "Work", day: "Thursday", status: "progress" },
    { id: 9, title: "Order Fitness Training Equipment", category: "Personal", day: "Saturday", status: "progress" },
    { id: 10, title: "Prepare Presentation Slides for Class", category: "Study", day: "Wednesday", status: "progress" },

    { id: 11, title: "Deploy Production Web App Build", category: "Work", day: "Friday", status: "completed" },
    { id: 12, title: "Buy Weekly Grocery Items and Supplies", category: "Personal", day: "Monday", status: "completed" },
    { id: 13, title: "Test Unit Test Cases for JS Project", category: "Study", day: "Thursday", status: "completed" },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    category: "Work",
    day: "Monday",
    status: "todo",
  });

  const [activeProject, setActiveProject] = useState("All Projects");
  const [activeView, setActiveView] = useState("Kanban Board");

  // DELETE TASK
  const deleteTask = (id) => {
    if (window.confirm("Do you want to delete this task?")) {
      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== id)
      );
    }
  };

  // COMPLETE TASK
  const completeTask = (id) => {
    if (window.confirm("Did you complete this task?")) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === id
            ? { ...task, status: "completed" }
            : task
        )
      );

      alert("Task completed successfully!");
    }
  };

  // REOPEN TASK
  const reopenTask = (id) => {
    if (window.confirm("Move this task back to To Do?")) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === id
            ? { ...task, status: "todo" }
            : task
        )
      );
    }
  };

  // ADD TASK
  const addTask = (e) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    setTasks((previousTasks) => [
      ...previousTasks,
      {
        ...newTask,
        id: Date.now(),
      },
    ]);

    setNewTask({
      title: "",
      category: "Work",
      day: "Monday",
      status: "todo",
    });

    setShowModal(false);
  };

  // FILTER PROJECTS
  const filteredTasks =
    activeProject === "All Projects"
      ? tasks
      : tasks.filter(
          (task) => task.category === activeProject
        );

  const todoTasks = filteredTasks.filter(
    (task) => task.status === "todo"
  );

  const progressTasks = filteredTasks.filter(
    (task) => task.status === "progress"
  );

  const completedTasks = filteredTasks.filter(
    (task) => task.status === "completed"
  );

  // TASK CARD
  const renderTasks = (taskList) => {
    return taskList.map((task) => (
      <div className="task-card" key={task.id}>

        <div className="task-title">
          <span>{task.title}</span>

          <button
            className="delete-btn"
            onClick={() => deleteTask(task.id)}
            title="Delete Task"
          >
            ×
          </button>
        </div>

        <div className="task-details">
          <span className="category">
            {task.category}
          </span>

          <span className="task-day">
            📅 {task.day}
          </span>
        </div>

        {task.status !== "completed" && (
          <button
            className="complete-btn"
            onClick={() => completeTask(task.id)}
          >
            ✓ Complete Task
          </button>
        )}

        {task.status === "completed" && (
          <div className="completed-actions">
            <span className="completed-label">
              ✓ Completed
            </span>

            <button
              className="reopen-btn"
              onClick={() => reopenTask(task.id)}
            >
              ↩ Reopen
            </button>
          </div>
        )}

      </div>
    ));
  };

  return (
    <div className="app-container">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          ☷ <span>TaskFlow</span>
        </div>

        <div className="user-box">
          <p>Logged in as:</p>

          <strong>
            {localStorage.getItem("username") || "vishnu"}
          </strong>
        </div>

        {/* PROJECTS */}
        <div className="sidebar-section">
          <h4>PROJECTS</h4>

          {["All Projects", "Work", "Personal", "Study"].map(
            (project) => (
              <button
                key={project}
                className={`sidebar-item ${
                  activeProject === project ? "active" : ""
                }`}
                onClick={() => setActiveProject(project)}
              >
                {project}
              </button>
            )
          )}
        </div>

        {/* VIEWS */}
        <div className="sidebar-section">
          <h4>VIEWS</h4>

          {[
            ["▦", "Kanban Board"],
            ["▦", "Daily Schedule"],
            ["⚑", "Workflow Chart"],
          ].map(([icon, view]) => (
            <button
              key={view}
              className={`sidebar-item ${
                activeView === view ? "active" : ""
              }`}
              onClick={() => setActiveView(view)}
            >
              <span className="sidebar-icon">
                {icon}
              </span>

              {view}
            </button>
          ),
          )}
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* HEADER */}
        <header className="top-header">
          <h1>{activeView}</h1>

          <button
            className="new-task-btn"
            onClick={() => setShowModal(true)}
          >
            + New Task
          </button>
        </header>

        {/* KANBAN BOARD */}
        <div className="board">

          {/* TO DO */}
          <div className="board-column">
            <h2>To Do ({todoTasks.length})</h2>

            <div className="column-tasks">
              {renderTasks(todoTasks)}
            </div>
          </div>

          {/* IN PROGRESS */}
          <div className="board-column">
            <h2>In Progress ({progressTasks.length})</h2>

            <div className="column-tasks">
              {renderTasks(progressTasks)}
            </div>
          </div>

          {/* COMPLETED */}
          <div className="board-column">
            <h2>Completed ({completedTasks.length})</h2>

            <div className="column-tasks">
              {renderTasks(completedTasks)}
            </div>
          </div>

        </div>

      </main>

      {/* ADD TASK MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>Create New Task</h2>

            <form onSubmit={addTask}>

              <label>Task Title</label>

              <input
                type="text"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    title: e.target.value,
                  })
                }
                required
              />

              <label>Category</label>

              <select
                value={newTask.category}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    category: e.target.value,
                  })
                }
              >
                <option>Work</option>
                <option>Personal</option>
                <option>Study</option>
              </select>

              <label>Deadline</label>

              <select
                value={newTask.day}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    day: e.target.value,
                  })
                }
              >
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <option key={day}>{day}</option>
                ))}
              </select>

              <label>Status</label>

              <select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    status: e.target.value,
                  })
                }
              >
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <div className="modal-buttons">

                <button
                  type="submit"
                  className="save-btn"
                >
                  Add Task
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;