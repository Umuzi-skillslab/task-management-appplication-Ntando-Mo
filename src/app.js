// Task Management Application - Starter Code with Errors
import { generateRandomId } from "./utils.js";

// Global variables (scoping issues)
const taskList = []; //Fixed with const
let taskCounter = 0; // Should use let or const

// Task class with errors
class Task {
  constructor(title, description, priority) {
    this.id = generateRandomId();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.completed = false;
    // Missing: id property
  }

  // Missing: method to toggle completion
  toggleCompletion() {
    this.completed = !this.completed;
  }

  getInfo() {
    // Wrong string concatenation - should use template literals -- Fixed
    return `Task: ${this.title} - Priority: ${this.priority}`;
  }
}

// Subtask class with inheritance issues
class SubTask extends Task {
  constructor(title, description, priority, parentTask) {
    // Missing: super() call
    super(title, description, priority);
    this.parentTask = parentTask;
  }

  //Overriding getInfo method with errors
  getInfo() {
    return `SubTask: ${this.title} (Parent: ${this.parentTask}) - Priority: ${this.priority}`;
  }
}

//Validation & Try-Catch #1
function addTask(title, description, priority) {
  try {
    // Check for null/undefined/empty strings
    if (typeof title !== "string" || title.trim() === "") {
      throw new Error("Task title must be a valid, non-empty string.");
    }

    const newTask = new Task(title, description, priority);
    taskList.push(newTask);
    return newTask;
  } catch (error) {
    //error message
    console.error("Failed to add task:", error.message);
    return null;
  }
}

// Function with incorrect loop
function displayAllTasks() {
  // Wrong loop - should use for-of
  for (const task of taskList) {
    console.log(task.title);
  }
}

// Function missing parameter
function findTaskByTitle(title) {
  // Edge case: null or non-string inputs
  if (typeof title !== "string" || title === null) {
    console.error("Search Error: Title must be a valid string.");
    return undefined;
  }
  return taskList.find((task) => task.title === title);
}

// Function with type checking issues
// safe validation for tests
function updateTaskPriority(taskId, newPriority) {
  if (typeof taskId !== "number" || typeof newPriority !== "number") {
    // Meaningful error message for invalid data types
    console.error(
      "Validation Error: taskId and newPriority must be valid numbers.",
    );
    return false;
  }

  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === taskId) {
      taskList[i].priority = newPriority;
      return true;
    }
  }
  return false;
}

// Function that should use destructuring but doesn't
// Validation & Try-Catch
function getTaskDetails(task) {
  try {
    // Prevent destructuring null or undefined objects
    if (!task || typeof task !== "object" || Array.isArray(task)) {
      throw new Error("Invalid task object provided for destructuring.");
    }
    const { title, description, priority } = task;
    return { title, description, priority };
  } catch (error) {
    console.error("Destructuring Error:", error.message);
    return {};
  }
}

// Function missing spread/rest operators
// 2. Validation & Try-Catch #2
function mergeTasks(listA, listB) {
  try {
    // Ensure both parameters are actually arrays
    if (!Array.isArray(listA) || !Array.isArray(listB)) {
      throw new Error("Both arguments must be arrays in order to merge.");
    }
    return [...listA, ...listB];
  } catch (error) {
    console.error("Merge Error:", error.message);
    return [];
  }
}

// Recursive function with error
function countCompletedTasks(tasks, index = 0) {
  // Missing: base case check
  if (!Array.isArray(tasks) || index >= tasks.length) {
    return 0;
  }
  // Missing: null/undefined check

  if (tasks[index].completed) {
    return 1 + countCompletedTasks(tasks, index + 1);
  } else {
    return countCompletedTasks(tasks, index + 1);
  }
}

// Function with Math object issues
// Validation (Handling Edge Cases)
function calculateAveragePriority(tasks) {
  // Edge case: check for undefined or non-arrays
  if (!Array.isArray(tasks)) {
    console.error(
      "Validation Error: calculateAveragePriority requires an array.",
    );
    return 0;
  }

  // Edge case: Handling empty arrays to prevent dividing by zero (NaN)
  if (tasks.length === 0) return 0;

  const total = tasks.reduce((sum, task) => sum + task.priority, 0);
  return Number((total / tasks.length).toFixed(1));
}

// Filter function with errors
function getHighPriorityTasks(minPriority) {
  if (typeof minPriority !== "number") return [];

  //Replaced imperative loop with functional .filter()
  return taskList.filter((task) => task.priority > minPriority);
}

// Object with missing methods
const TaskManager = {
  tasks: taskList,

  // Missing: method to add task using functional approach
  // Missing: method using array methods (map, filter, reduce)

  getTotalTasks: function () {
    return this.tasks.length;
  },

  // Method using array method (.map)
  getTaskTitles: function () {
    return this.tasks.map((task) => task.title);
  },

  // Method using array method (.every)
  areAllTasksCompleted: function () {
    if (this.tasks.length === 0) return false;
    return this.tasks.every((task) => task.completed);
  },

  //  Higher-order function demonstration (takes a function as a parameter)
  executeOnTasks: function (callbackFunction) {
    if (typeof callbackFunction !== "function") return;
    this.tasks.forEach(callbackFunction);
  },
};

// Export issues - should be a module
// Missing: proper module exports

// Exports
export {
  Task,
  SubTask,
  taskList,
  addTask,
  displayAllTasks,
  findTaskByTitle,
  updateTaskPriority,
  getTaskDetails,
  mergeTasks,
  countCompletedTasks,
  calculateAveragePriority,
  getHighPriorityTasks,
  TaskManager,
};
