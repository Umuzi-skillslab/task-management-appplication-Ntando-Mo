import {
  taskList,
  addTask,
  Task,
  calculateAveragePriority,
  countCompletedTasks,
  getHighPriorityTasks,
} from "./app.js";
import { saveToStorage, loadFromStorage } from "./utils.js";

// Keep track of active filters and search terms globally
let currentFilter = "all";
let searchQuery = "";

// Wait for the HTML to fully load before running scripts to prevent null errors
document.addEventListener("DOMContentLoaded", setupEventListeners);

function setupEventListeners() {
  // Load any existing tasks from local storage when the page refreshes
  const savedTasks = loadFromStorage();

  if (savedTasks && savedTasks.length > 0) {
    savedTasks.forEach((taskData) => {
      // We need to recreate the Task objects so their methods (like toggleCompletion) still work
      const restoredTask = new Task(
        taskData.title,
        taskData.description,
        taskData.priority,
      );
      restoredTask.id = taskData.id;
      restoredTask.completed = taskData.completed;
      taskList.push(restoredTask);
    });
    displayTasks();
  }

  // Grab all the HTML elements we need to interact with
  const addButton = document.querySelector(".add-task-btn");
  const taskListContainer = document.getElementById("task-list");
  const priorityInput = document.getElementById("priority");
  const titleInput = document.getElementById("title");
  const searchInput = document.getElementById("search-input");
  const sortBtn = document.getElementById("sort-priority-btn");
  const filterBtns = document.querySelectorAll(".filter-btn");

  // Only add the click listener if the button actually exists on the page
  if (addButton) {
    addButton.addEventListener("click", handleAddTask);
  }

  // Setup event delegation on the main container instead of attaching listeners to every single task
  if (taskListContainer) {
    taskListContainer.addEventListener("click", handleTaskClick);
  }

  // Allow users to press Enter to submit the form if they are typing in an input box
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

  // Give visual feedback when the user is focused on the title input
  if (titleInput) {
    titleInput.addEventListener(
      "focus",
      () => (titleInput.style.outline = "2px solid #4CAF50"),
    );
    titleInput.addEventListener("blur", () => (titleInput.style.outline = ""));
  }

  // Update the search query and re-render the list every time the user types a letter
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      displayTasks();
    });
  }

  // Handle the filter buttons (All, Active, Completed)
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      currentFilter = e.target.dataset.filter;
      displayTasks();
    });
  });

  // Sort the global array by priority (highest first) and save the new order
  if (sortBtn) {
    sortBtn.addEventListener("click", () => {
      taskList.sort((a, b) => b.priority - a.priority);
      saveToStorage(taskList);
      displayTasks();
    });
  }
}

function handleAddTask(event) {
  // Stop the form from refreshing the page
  if (event) event.preventDefault();

  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");
  const priorityInput = document.getElementById("priority");

  if (!titleInput || !descInput || !priorityInput) return;

  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const priority = parseInt(priorityInput.value);

  // Basic check to make sure the user didn't leave anything blank
  if (!title || !description || isNaN(priority)) {
    alert("Please fill in all fields completely.");
    return;
  }

  // Make sure they didn't manually bypass the HTML and submit a crazy number
  if (priority < 1 || priority > 5) {
    alert("Priority must be between 1 and 5.");
    return;
  }

  addTask(title, description, priority);
  saveToStorage(taskList);
  displayTasks();

  // Clear the form fields so they can add another task easily
  titleInput.value = "";
  descInput.value = "";
  priorityInput.value = "";
  titleInput.focus();
}

function displayTasks() {
  const container = document.getElementById("task-list");
  if (!container) return;

  // Clear out the old HTML before rendering the new list
  container.innerHTML = "";

  // Filter the array based on the current search text (checking both title and description)
  let displayList = taskList.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Apply the status filters based on the global variable
  if (currentFilter === "active")
    displayList = displayList.filter((t) => !t.completed);
  if (currentFilter === "completed")
    displayList = displayList.filter((t) => t.completed);

  for (const task of displayList) {
    const div = document.createElement("div");
    div.className = "task-item";
    div.dataset.id = task.id;

    const { title, description, priority, completed } = task;

    // Figure out which text and color class to show for the priority badge
    let priorityClass =
      priority >= 4 ? "high" : priority === 3 ? "medium" : "low";
    let priorityText =
      priority === 5
        ? "High (5) 🔴"
        : priority === 4
          ? "High (4) 🔴"
          : priority === 3
            ? "Medium (3) 🟡"
            : priority === 2
              ? "Low (2) 🟢"
              : "Low (1) 🟢";

    // Use template literals to safely inject the task data into the HTML structure
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

  // Update the dashboard numbers whenever the list changes
  displayStatistics();
}

function displayStatistics() {
  const stats = document.getElementById("statistics-panel");
  if (!stats) return;

  // Calculate all the stats using our imported functions
  const completedCount = countCompletedTasks(taskList);
  const pendingCount = taskList.length - completedCount;
  const avgPriority = calculateAveragePriority(taskList);
  const highPriorityCount = getHighPriorityTasks(3).length;

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

  // Find the closest task card that was clicked using the data-id attribute
  const taskElement = event.target.closest(".task-item");
  if (!taskElement) return;

  // Find the actual task object in our array
  const taskId = parseInt(taskElement.dataset.id);
  const targetTask = taskList.find((task) => task.id === taskId);

  if (!targetTask) return;

  // Complete/Undo button clicked
  if (event.target.classList.contains("toggle-btn")) {
    targetTask.toggleCompletion();
    saveToStorage(taskList);
    displayTasks();
  }
  // Edit button clicked
  else if (event.target.classList.contains("edit-btn")) {
    const newTitle = prompt("Edit task title:", targetTask.title);
    if (newTitle !== null && newTitle.trim() !== "") {
      targetTask.title = newTitle.trim();
    }

    const newDescription = prompt(
      "Edit task description:",
      targetTask.description,
    );
    if (newDescription !== null && newDescription.trim() !== "") {
      targetTask.description = newDescription.trim();
    }

    // Only save and render if they actually clicked OK on the prompts
    saveToStorage(taskList);
    displayTasks();
  }
  // Delete button clicked - ask for confirmation first so they don't accidentally wipe a task
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
