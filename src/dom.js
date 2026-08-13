import {
  taskList,
  addTask,
  Task,
  calculateAveragePriority,
  countCompletedTasks,
  getHighPriorityTasks,
} from "./app.js";
import { saveToStorage, loadFromStorage } from "./utils.js";

// Store the current search and filter values
let currentFilter = "all";
let searchQuery = "";

// Wait for the page to load before running the JavaScript
document.addEventListener("DOMContentLoaded", setupEventListeners);

function setupEventListeners() {
  // Load any saved tasks from local storage
  const savedTasks = loadFromStorage();

  if (savedTasks && savedTasks.length > 0) {
    // Use a for-of loop to go through saved tasks
    for (const taskData of savedTasks) {
      // Recreate the Task objects so their methods still work
      const restoredTask = new Task(
        taskData.title,
        taskData.description,
        taskData.priority,
      );
      restoredTask.id = taskData.id;
      restoredTask.completed = taskData.completed; 
      taskList.push(restoredTask);
    }
    displayTasks();
  }

  // Get the HTML elements we'll use
  const addButton = document.querySelector(".add-task-btn");
  const taskListContainer = document.getElementById("task-list");
  const priorityInput = document.getElementById("priority");
  const titleInput = document.getElementById("title");
  const searchInput = document.getElementById("search-input");
  const sortBtn = document.getElementById("sort-priority-btn");
  const filterGroup = document.querySelector(".filter-sort-group");

  // Check the button exists before adding the event listener
  addButton?.addEventListener("click", handleAddTask);
  
  // Use event delegation to handle clicks on the task buttons
  taskListContainer?.addEventListener("click", handleTaskClick);

  // Allow Enter to add a task
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Enter" &&
      (document.activeElement.id === "title" ||
        document.activeElement.id === "description" ||
        document.activeElement.id === "priority")
    ) {
      handleAddTask(e);
    }
  });

  // Highlight the title input when it's selected
  if (titleInput) {
    titleInput.addEventListener("focus", () => (titleInput.style.outline = "2px solid #4CAF50"));
    titleInput.addEventListener("blur", () => (titleInput.style.outline = ""));
  }

  // Update the task list while the user types
  searchInput?.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    displayTasks();
  });

  // Filter tasks based on the selected button using event delegation
  filterGroup?.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      currentFilter = e.target.dataset.filter;
      displayTasks();
    }
  });

  // Sort tasks from highest to lowest priority
  sortBtn?.addEventListener("click", () => {
    taskList.sort((a, b) => b.priority - a.priority);
    saveToStorage(taskList);
    displayTasks();
  });
}

function handleAddTask(event) {
  // Prevent the page from refreshing
  if (event) event.preventDefault();

  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");
  const priorityInput = document.getElementById("priority");

  if (!titleInput || !descInput || !priorityInput) return;

  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const priority = parseInt(priorityInput.value);

  // Make sure all fields have been filled in
  if (!title || !description || isNaN(priority)) {
    alert("Please fill in all fields completely.");
    return;
  }

  // Make sure the priority is between 1 and 5
  if (priority < 1 || priority > 5) {
    alert("Priority must be between 1 and 5.");
    return;
  }

  addTask(title, description, priority);
  saveToStorage(taskList);
  displayTasks();

  // Clear the form after adding a task
  titleInput.value = "";
  descInput.value = "";
  priorityInput.value = "";
  titleInput.focus();
}

function displayTasks() {
  const container = document.getElementById("task-list");
  if (!container) return;
  
  // Clear the task list before displaying it again
  container.innerHTML = "";

  // Search by task title or description
  let displayList = taskList.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Apply the selected filter
  if (currentFilter === "active") displayList = displayList.filter((t) => !t.completed);
  if (currentFilter === "completed") displayList = displayList.filter((t) => t.completed);

  for (const task of displayList) {
    const div = document.createElement("div");
    div.className = "task-item";
    div.dataset.id = task.id;

    const { title, description, priority, completed } = task;

    // Display the correct label and colour for each priority
    let priorityClass;
    let priorityText;

    switch (priority) {
      case 5:
        priorityClass = "critical";
        priorityText = "Critical 🔴";
        break;
      case 4:
        priorityClass = "high";
        priorityText = "High 🟠";
        break;
      case 3:
        priorityClass = "medium";
        priorityText = "Medium 🟡";
        break;
      case 2:
        priorityClass = "low";
        priorityText = "Low 🟢";
        break;
      default:
        priorityClass = "very-low";
        priorityText = "Very Low 🔵";
    }

    // Display the task information on the page
    div.innerHTML = `
            <div class="task-card ${completed ? "completed" : ""}">
                <div class="task-header">
                    <h3>${title}</h3>
                    <div class="task-actions">
                        <button class="toggle-btn">${completed ? "Undo" : "Complete"}</button>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                </div>
                <p class="task-desc">${description}</p>
                <p class="task-meta">Priority: <span class="${priorityClass}">${priorityText}</span></p>
            </div>
        `;
    container.appendChild(div);
  }

  // Update the statistics
  displayStatistics();
}

function displayStatistics() {
  const stats = document.getElementById("statistics-panel");
  if (!stats) return;

  // Calculate the task statistics
  const completedCount = countCompletedTasks(taskList);
  const pendingCount = taskList.length - completedCount;
  const avgPriority = calculateAveragePriority(taskList);
  
  // Get the number of high priority tasks
  const highPriorityCount = getHighPriorityTasks(taskList, 3).length;

  stats.innerHTML = `
        <div class="stats-header">
            <h3>Dashboard Statistics</h3>
        </div>
        <div class="stats-grid">
            <div class="stat-box"><strong>Total Tasks:</strong> ${taskList.length}</div>
            <div class="stat-box"><strong>Completed:</strong> ${completedCount}</div>
            <div class="stat-box"><strong>Pending:</strong> ${pendingCount}</div>
            <div class="stat-box"><strong>Avg Priority:</strong> ${avgPriority}</div>
            <div class="stat-box"><strong>High Priority:</strong> ${highPriorityCount}</div>
        </div>
    `;
}

function handleTaskClick(event) {
  if (!event.target) return;
  
  // Find the task that was clicked
  const taskElement = event.target.closest(".task-item");
  if (!taskElement) return;

  // Get the matching task from the array
  const taskId = parseInt(taskElement.dataset.id);
  const targetTask = taskList.find((task) => task.id === taskId);
  if (!targetTask) return;

  // Toggle the task status
  if (event.target.classList.contains("toggle-btn")) {
    targetTask.toggleCompletion();
    saveToStorage(taskList);
    displayTasks();
  } 
  // Edit the task
  else if (event.target.classList.contains("edit-btn")) {
    const newTitle = prompt("Edit task title:", targetTask.title);
    if (newTitle !== null && newTitle.trim() !== "") {
      targetTask.title = newTitle.trim();
    }

    const newDescription = prompt("Edit task description:", targetTask.description);
    if (newDescription !== null && newDescription.trim() !== "") {
      targetTask.description = newDescription.trim();
    }
    
    // Save the changes and refresh the task list
    saveToStorage(taskList);
    displayTasks();
  } 
  // Ask for confirmation before deleting the task
  else if (event.target.classList.contains("delete-btn")) {
    if (confirm("Are you sure you want to delete this task?")) {
      const index = taskList.findIndex((task) => task.id === taskId);
      if (index !== -1) {
        taskList.splice(index, 1);
        saveToStorage(taskList);
        displayTasks();
      }
    }
  }
}