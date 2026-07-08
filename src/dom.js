// DOM Manipulation - Starter Code with Errors

// Missing: proper DOM selectors
function setupEventListeners() {
    // Wrong selector method
    var addButton = document.getElementById(".add-task-btn");  // Wrong - mixing ID and class
    var taskInput = document.querySelector("task-input");  // Missing #
    
    // Missing: null checks before adding listeners
    addButton.addEventListener("click", handleAddTask);
    
    // Missing: other event listeners for form submission, etc.
}

// Function with DOM manipulation errors
function handleAddTask() {
    var titleInput = document.getElementById("title");
    var descInput = document.getElementById("description");
    
    // No validation
    // Should use event.preventDefault() if form
    
    var title = titleInput.value;
    var description = descInput.value;
    
    // Missing: priority input
    
    addTask(title, description, 1);
    displayTasks();
    
    // Missing: clear inputs after adding
}

// Function that should use better selectors
function displayTasks() {
    const container = document.getElementById("task-list");
    if (!container) return; // Null check
    
    container.innerHTML = ""; // Clear existing content
    
    for (const task of taskList) {
        const div = document.createElement("div");
        
        //Object destructuring 
        const { title, description, priority } = task;
        
        //Template literal  (Multi-line HTML injection)
        div.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
            <p>Priority: ${priority}</p>
        `;
        container.appendChild(div);
    }
}

// Function with event handling issues
function handleTaskClick(event) {
    if (!event.target) return;
    
    const taskId = event.target.id;
   
    console.log(`Task clicked: ${taskId}`);
}

// Missing: JSON conversion functions
// Missing: functions to save/load tasks from localStorage

// Initialize (wrong placement - should use DOMContentLoaded)
setupEventListeners();
