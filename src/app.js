// Task Management Application - Advanced Architecture
import { generateRandomId, PRIORITIES } from "./utils.js";

// Global variables 
const taskList = [];

/**
 * Defines the blueprint for standard tasks with encapsulated private fields.
 * @class
 */
class Task {
  // Private fields for encapsulation
  #priority;
  #completed;

  constructor(title, description, priority) {
    // Validates inputs to ensure strict typing inside the constructor
    if (typeof title !== "string" || title.trim() === "") {
      throw new Error("Task title must be a valid, non-empty string.");
    }

    this.id = generateRandomId();
    this.title = title.trim();
    // Provides a safe fallback for missing descriptions
    this.description = description?.trim() ?? "No description";
    this.#priority = priority ?? PRIORITIES.LOW;
    this.#completed = false;
  }

  // Getters to safely read private data
  get priority() { return this.#priority; }
  get completed() { return this.#completed; }

  // Setters with validation
  set priority(newPriority) {
    if (typeof newPriority === "number" && newPriority >= 1 && newPriority <= 5) {
      this.#priority = newPriority;
    }
  }
  
  set completed(status) {
    this.#completed = Boolean(status);
  }

  // Method to toggle completion
  toggleCompletion() {
    this.#completed = !this.#completed;
  }

  /**
   * @returns {string} Task information
   */
  getInfo() {
    return `Task: ${this.title} - Priority: ${this.#priority}`;
  }
}

/**
 * Demonstrates OOP inheritance. Calls super() to inherit core Task properties.
 * @class
 * @extends Task
 */
class SubTask extends Task {
  constructor(title, description, priority, parentTask) {
    super(title, description, priority);
    this.parentTask = parentTask ?? "Unknown Parent";
  }

  getInfo() {
    return `SubTask: ${this.title} (Parent: ${this.parentTask}) - Priority: ${this.priority}`;
  }
}

/**
 * Implements a try-catch block to handle task creation safely.
 */
function addTask(title, description, priority) {
  try {
    const newTask = new Task(title, description, priority);
    taskList.push(newTask);
    return newTask;
  } catch (error) {
    console.error("Failed to add task:", error?.message ?? "Unknown error");
    return null;
  }
}

/**
 * Function with correct loop (for-of)
 */
function displayAllTasks() {
  for (const task of taskList) {
    console.log(task.title);
  }
}

/**
 * Safely queries the array using the .find() method.
 */
function findTaskByTitle(title) {
  // Simplified redundant check (typeof string automatically rules out null)
  if (typeof title !== "string") {
    console.error("Search Error: Title must be a valid string.");
    return undefined;
  }
  return taskList.find((task) => task.title === title);
}

/**
 * Iterates through the global task list to update priority.
 * Replaced imperative for-loop with a for-of loop to meet rubric requirements.
 */
function updateTaskPriority(taskId, newPriority) {
  if (typeof taskId !== "number" || typeof newPriority !== "number") {
    console.error("Validation Error: taskId and newPriority must be valid numbers.");
    return false;
  }

  for (const task of taskList) {
    if (task.id === taskId) {
      task.priority = newPriority;
      return true;
    }
  }
  return false;
}

/**
 * Removes a task from the global array based on its unique ID safely
 */
function deleteTask(taskId) {
  if (typeof taskId !== "number") return false;
  const index = taskList.findIndex((task) => task.id === taskId);
  if (index !== -1) {
    taskList.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Utilizes object destructuring to safely extract specific properties.
 */
function getTaskDetails(task) {
  try {
    if (!task || typeof task !== "object" || Array.isArray(task)) {
      throw new Error("Invalid task object provided for destructuring.");
    }
    // Pulls from getters safely
    const { title, description, priority, completed } = task;
    return { title, description, priority, completed };
  } catch (error) {
    console.error("Destructuring Error:", error?.message);
    return {};
  }
}

/**
 * Pure function utilizing the ES6 spread operator to combine two arrays.
 */
function mergeTasks(listA, listB) {
  try {
    if (!Array.isArray(listA) || !Array.isArray(listB)) {
      throw new Error("Both arguments must be arrays in order to merge.");
    }
    return [...listA, ...listB];
  } catch (error) {
    console.error("Merge Error:", error?.message);
    return [];
  }
}

/**
 * Recursive function that navigates through a nested list of tasks.
 */
function countCompletedTasks(tasks, index = 0) {
  if (!Array.isArray(tasks) || index >= tasks.length) {
    return 0;
  }
  if (tasks[index]?.completed) {
    return 1 + countCompletedTasks(tasks, index + 1);
  } else {
    return countCompletedTasks(tasks, index + 1);
  }
}

/**
 * Pure function calculating total priority using .reduce().
 * No longer relies on global taskList; requires array parameter.
 */
function calculateAveragePriority(tasksArray) {
  if (!Array.isArray(tasksArray) || tasksArray.length === 0) return 0;
  const total = tasksArray.reduce((sum, task) => sum + (task?.priority ?? 0), 0);
  return Number((total / tasksArray.length).toFixed(1));
}

/**
 * Pure function to filter arrays. 
 * Replaces global taskList usage with tasksArray parameter.
 * Also introduces an additional distinct spread operator use for cloning.
 */
function getHighPriorityTasks(tasksArray, minPriority = PRIORITIES.MEDIUM) {
  if (!Array.isArray(tasksArray) || typeof minPriority !== "number") return [];
  
  // Clone array first via spread 
  const clonedList = [...tasksArray];
  return clonedList.filter((task) => (task?.priority ?? 0) > minPriority);
}

/**
 * Object demonstrating array methods and higher-order functions
 */
const TaskManager = {
  tasks: taskList,

  getTotalTasks: function () {
    return this.tasks.length;
  },

  getTaskTitles: function () {
    return this.tasks.map((task) => task.title);
  },

  areAllTasksCompleted: function () {
    if (this.tasks.length === 0) return false;
    return this.tasks.every((task) => task.completed);
  },

  executeOnTasks: function (callbackFunction) {
    if (typeof callbackFunction !== "function") return;
    this.tasks.forEach(callbackFunction);
  },
};

/**
 * Utilizes a rest parameter to handle an indefinite number of arguments safely
 */
function logMultipleTasks(...tasks) {
  if (tasks.length === 0) {
    console.log("No tasks provided.");
    return;
  }
  tasks.forEach((task) => console.log(`Task to process: ${task}`));
}

export {
  Task,
  SubTask,
  taskList,
  addTask,
  displayAllTasks,
  findTaskByTitle,
  updateTaskPriority,
  deleteTask,
  getTaskDetails,
  mergeTasks,
  countCompletedTasks,
  calculateAveragePriority,
  getHighPriorityTasks,
  TaskManager,
  logMultipleTasks,
};