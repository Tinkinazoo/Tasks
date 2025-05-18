const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read tasks
const readTasks = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper function to write tasks
const writeTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
};

// Routes
app.get('/api/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(),
    title: req.body.title,
    completed: false
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const index = tasks.findIndex(task => task.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks[index] = { ...tasks[index], ...req.body };
  writeTasks(tasks);
  res.json(tasks[index]);
});

app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readTasks();
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== req.params.id);
  if (tasks.length === initialLength) {
    return res.status(404).json({ error: 'Task not found' });
  }
  writeTasks(tasks);
  res.status(204).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
