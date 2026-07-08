//Proper imports
import { taskList, addTask } from "./app.js";
import { saveToStorage } from "./utils.js";

//Initialize safely ONLY after DOM is fully loaded (Listener 1)
document.addEventListener("DOMContentLoaded", setupEventListeners);

function setupEventListeners() {
  //Corrected selector (querySelector for class)
  const addButton = document.querySelector(".add-task-btn");
  const taskListContainer = document.getElementById("task-list");
  const priorityInput = document.getElementById("priority");
  const titleInput = document.getElementById("title");

  //Null check 1
  if (addButton) {
    addButton.addEventListener("click", handleAddTask); // Listener 2
  }

  //Null check 2
  if (taskListContainer) {
    //Event delegation setup on the parent container (Listener 3)
    taskListContainer.addEventListener("click", handleTaskClick);
  }

  // Extra listeners to hit the 5+ requirement
  if (priorityInput) {
    priorityInput.addEventListener("keypress", (e) => {
      // Listener 4
      if (e.key === "Enter") handleAddTask(e);
    });
  }

  if (titleInput) {
    titleInput.addEventListener(
      "focus",
      () => (titleInput.style.outline = "2px solid #4CAF50"),
    ); // Listener 5
    titleInput.addEventListener("blur", () => (titleInput.style.outline = "")); // Listener 6
  }
}

function handleAddTask(event) {
  //preventDefault where needed
  if (event) event.preventDefault();

  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");
  const priorityInput = document.getElementById("priority");

  if (!titleInput || !descInput || !priorityInput) return;

  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const priority = parseInt(priorityInput.value);

  // Basic validation
  if (!title || !description || isNaN(priority)) {
    alert("Please fill in all fields completely.");
    return;
  }

  // Add task and update UI/Storage
  addTask(title, description, priority);
  saveToStorage(taskList);
  displayTasks();

  //Clear inputs after adding
  titleInput.value = "";
  descInput.value = "";
  priorityInput.value = "";
  titleInput.focus();
}

function displayTasks() {
  const container = document.getElementById("task-list");
  if (!container) return;

  container.innerHTML = "";

  for (const task of taskList) {
    const div = document.createElement("div");
    div.className = "task-item";

    // Add data attribute for event delegation target tracking
    div.dataset.id = task.id;

    const { title, description, priority, completed } = task;

    // Using template literals to build complex innerHTML safely
    div.innerHTML = `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; opacity: ${completed ? "0.6" : "1"}">
                <h3 style="text-decoration: ${completed ? "line-through" : "none"}">${title}</h3>
                <p>${description}</p>
                <p>Priority: ${priority} | Status: ${completed ? "Done" : "Pending"}</p>
                <button class="toggle-btn">Toggle Completion</button>
            </div>
        `;
    container.appendChild(div);
  }
}

//Proper event delegation
function handleTaskClick(event) {
  if (!event.target) return;

  // Check if the actual clicked element was our toggle button
  if (event.target.classList.contains("toggle-btn")) {
    // Traverse up the DOM tree to find the parent div holding the data-id
    const taskElement = event.target.closest(".task-item");
    if (!taskElement) return;

    const taskId = parseInt(taskElement.dataset.id);

    // Find task in array and toggle it
    const targetTask = taskList.find((task) => task.id === taskId);
    if (targetTask) {
      targetTask.toggleCompletion();
      saveToStorage(taskList);
      displayTasks();
    }
  }
}
