/**
 * Priority constants matching the 1-5 HTML UI to ensure a Single Source of Truth.
 * @constant {Object}
 */
export const PRIORITIES = {
  CRITICAL: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
  VERY_LOW: 1
};

/**
 * Safely saves data to local storage using try/catch and stringify validation.
 * @param {Array} data - The data array to save.
 */
export function saveToStorage(data) {
  try {
    if (!Array.isArray(data)) throw new Error("Data must be an array");
    localStorage.setItem("tasks", JSON.stringify(data));
  } catch (error) {
    // Uses optional chaining and nullish coalescing to prevent undefined errors
    console.error("Storage Save Error:", error?.message ?? "Unknown error");
  }
}

/**
 * Safely loads and parses data from local storage.
 * @returns {Array} The parsed array or an empty array if corrupted.
 */
export function loadFromStorage() {
  try {
    const data = localStorage.getItem("tasks");
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) throw new Error("Corrupted storage format");
    
    return parsed;
  } catch (error) {
    console.error("Storage Load Error:", error?.message ?? "Unknown error");
    return [];
  }
}

/**
 * Returns a whole integer ID instead of a decimal.
 * @returns {number} Random generated ID.
 */
export function generateRandomId() {
  return Math.floor(Math.random() * 1000000);
}

/**
 * Proper string manipulation (Pure Function).
 * @param {string} name - Raw task name.
 * @returns {string} Formatted task name.
 */
export function formatTaskName(name) {
  if (typeof name !== "string") return "";
  return name.trim().charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Validates if a task is high priority based on the numeric scale.
 * @param {Object} task - The task to evaluate.
 * @returns {boolean} True if priority is High or Critical (4 or 5).
 */
export function isHighPriority(task) {
  // Uses optional chaining safely to avoid crashing on null objects
  return (task?.priority ?? 0) >= PRIORITIES.HIGH;
}