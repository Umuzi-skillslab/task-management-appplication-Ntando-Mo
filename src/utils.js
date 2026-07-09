//Replaced var with const
const priorities = ["low", "medium", "high"];

//Array destructuring
const [lowPriority, mediumPriority, highPriority] = priorities;

//Added JSON.stringify for proper storage
function saveToStorage(data) {
  if (!data) return;
  localStorage.setItem("tasks", JSON.stringify(data));
}

// Added JSON.parse to properly load objects
function loadFromStorage() {
  const data = localStorage.getItem("tasks");
  return data ? JSON.parse(data) : [];
}

//Returns a whole integer ID instead of a decimal
function generateRandomId() {
  return Math.floor(Math.random() * 1000000);
}

//Proper string manipulation (Pure Function)
function formatTaskName(name) {
  if (typeof name !== "string") return "";
  return name.trim().charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

//Incorrect boolean logic and operators fixed
function isHighPriority(task) {
  if (!task || typeof task.priority === "undefined") {
    return false;
  }
  //Using strict equality === instead of ==
  if (task.priority === "high") {
    return true; // Returning actual boolean
  }
  return false; // Returning actual boolean
}

//Proper module exports
export {
  priorities,
  saveToStorage,
  loadFromStorage,
  generateRandomId,
  formatTaskName,
  isHighPriority,
};