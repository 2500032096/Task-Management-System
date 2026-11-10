const express = require("express");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection (No .env)
mongoose.connect("mongodb://127.0.0.1:27017/taskmanagement")
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("MongoDB Error:", err.message));

// Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    priority: String,
    completed: {
        type: Boolean,
        default: false
    }
});

const Task = mongoose.model("Task", taskSchema);

// Get Tasks
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Add Task
app.post("/tasks", async (req, res) => {
    const task = await Task.create(req.body);
    res.json(task);
});

// Update Task
app.put("/tasks/:id", async (req, res) => {
    const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(task);
});

// Delete Task
app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task Deleted" });
});

// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});