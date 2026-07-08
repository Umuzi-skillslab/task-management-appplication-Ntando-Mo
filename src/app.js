// Task Management Application - Starter Code with Errors
import { generateRandomId } from './utils.js';

// Global variables (scoping issues)
const taskList = [];  //Fixed with const
let taskCounter = 0;  // Should use let or const

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

// Functions with errors

// Function with no error handling
function addTask(title, description, priority) {
    if (typeof title !== 'string' || typeof description !== 'string' || typeof priority !== 'number') {
        console.error("Invalid parameter types provided to addTask");
        return null;
    }
    
    const newTask = new Task(title, description, priority); // Replaced var with const
    taskList.push(newTask);
    taskCounter++;
    return newTask;
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
    // Missing: title parameter
    // Wrong loop construct
    if (typeof title !== 'string') return undefined;
    return taskList.find(task => task.title === title);
}

// Function with type checking issues
function updateTaskPriority(taskId, newPriority) {
    // Missing: typeof check for parameters
    // Missing: null/undefined validation
    // Handle null/undefined values
    if (typeof taskId !== 'number' || typeof newPriority !== 'number') {
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
function getTaskDetails(task) {
    if (!task) return null;
    
    //Object destructuring 
    const { title, description, priority, completed } = task;
    
    //Spread operator (creates a shallow copy of the object)
    return { ...task, detailsAccessed: true };
}

// Function missing spread/rest operators
function mergeTasks(...lists) {
    // Should use spread operator
    const merged = [];
    for (const list of lists) {
        if (Array.isArray(list)) {
            merged.push(...list); //Spread operator 
        }
    }
    return merged;
}

// Recursive function with error
function countCompletedTasks(tasks, index=0) {
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
function calculateAveragePriority(tasksArray) {
    //Added missing conditional check to prevent division by zero
    if (!Array.isArray(tasksArray) || tasksArray.length === 0) {
        return 0;
    }
    // Used functional .reduce() instead of a loop
    const total = tasksArray.reduce((sum, task) => sum + task.priority, 0);
    
    // Fix: Use Math.round to limit to 1 decimal place
    return Math.round((total / tasksArray.length) * 10) / 10;
}

// Filter function with errors
function getHighPriorityTasks(minPriority) {
    if (typeof minPriority !== 'number') return [];

    //Replaced imperative loop with functional .filter()
    return taskList.filter(task => task.priority > minPriority);
}

// Object with missing methods
const TaskManager = {
    tasks: taskList,
    
    // Missing: method to add task using functional approach
    // Missing: method using array methods (map, filter, reduce)
    
    getTotalTasks: function() {
        return this.tasks.length;
    },

    // Method using array method (.map)
    getTaskTitles: function() {
        return this.tasks.map(task => task.title);
    },

    // Method using array method (.every)
    areAllTasksCompleted: function() {
        if (this.tasks.length === 0) return false;
        return this.tasks.every(task => task.completed);
    },

    //  Higher-order function demonstration (takes a function as a parameter)
    executeOnTasks: function(callbackFunction) {
        if (typeof callbackFunction !== 'function') return;
        this.tasks.forEach(callbackFunction);
    }
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
    TaskManager 
};
