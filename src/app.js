// Task Management Application - Starter Code with Errors
import { generateRandomId } from "./utils.js";

// Global variables (scoping issues)
const taskList = []; //Fixed with const
let taskCounter = 0; // Should use let or const

// Defines the blueprint for standard tasks. Includes an automatic ID generator and defaults completion status to false.
class Task {
  constructor(title, description, priority) {
    this.id = generateRandomId();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.completed = false;
    // Missing: id property
  }

  // method to toggle completion
  toggleCompletion() {
    this.completed = !this.completed;
  }

  getInfo() {
    // Wrong string concatenation - should use template literals -- Fixed
    return `Task: ${this.title} - Priority: ${this.priority}`;
  }
}

// Demonstrates OOP inheritance. Calls super() to inherit core Task properties while adding a unique parentTask property.
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

//Validation & Try-Catch
// Implements a try-catch block to handle task creation. Validates that the title is a non-empty string before instantiating the Task object.
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
// Safely queries the array using the .find() method. Includes strict type checking to prevent errors from invalid search inputs.
function findTaskByTitle(title) {
  // Edge case: null or non-string inputs
  if (typeof title !== "string" || title === null) {
    console.error("Search Error: Title must be a valid string.");
    return undefined;
  }
  return taskList.find((task) => task.title === title);
}

// Validates inputs to ensure strict typing. Iterates through the global task list to update priority and exits early upon success.
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

// Validation & Try-Catch
// Utilizes object destructuring to safely extract specific properties, preventing accidental mutation of the entire task object.
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

// Pure function utilizing the ES6 spread operator to combine two arrays without mutating the original inputs.
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

// Recursive function that navigates through a nested list of tasks. The base case ensures the recursion stops when the array is empty.
function countCompletedTasks(tasks, index = 0) {
  // Missing: base case check
  if (!Array.isArray(tasks) || index >= tasks.length) {
    return 0;
  }
  if (tasks[index].completed) {
    return 1 + countCompletedTasks(tasks, index + 1);
  } else {
    return countCompletedTasks(tasks, index + 1);
  }
}

// Calculates total priority using the higher-order .reduce() method. Includes a guard clause to prevent NaN errors from empty arrays.
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

// Utilizes the higher-order .filter() method to return a new array containing only tasks that meet or exceed the specified threshold.
function getHighPriorityTasks(minPriority) {
  if (typeof minPriority !== "number") return [];

  //Replaced imperative loop with functional .filter()
  return taskList.filter((task) => task.priority > minPriority);
}

// Object with missing methods
const TaskManager = {
  tasks: taskList,

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

// Utilizes a rest parameter to handle an indefinite number of arguments safely
function logMultipleTasks(...tasks) {
    if (tasks.length === 0) {
        console.log("No tasks provided.");
        return;
    }
    tasks.forEach(task => console.log(`Task to process: ${task}`));
}

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
