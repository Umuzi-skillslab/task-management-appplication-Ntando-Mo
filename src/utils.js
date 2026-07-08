// Utilities - Starter Code (WITH ERRORS AND MISSING FEATURES)

// Bug: Not using proper data structures
const priorities = ["low", "medium", "high"];

// Bug: Missing JSON operations
function saveToStorage(data) {
    // Bug: Not converting to JSON
    localStorage.setItem("tasks", data);
}

function loadFromStorage() {
    // Bug: Not parsing JSON
    const data = localStorage.getItem("tasks");
    return data;
}

// Bug: Incorrect Math object usage
function generateRandomId() {
    return Math.random();  // Bug: Returns decimal, not integer
}

// Bug: Poor string manipulation
function formatTaskName(name) {
    // Bug: Not using string methods properly
    if (typeof name !== 'string') return "";
    //Capitalize first letter, lower case the rest, and trim whitespace
    return name.trim().charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Bug: Incorrect boolean logic
function isHighPriority(task) {

    // Add safety check for undefined
    if (!task || typeof task.priority === 'undefined') {
        return false;
    }

    if (task.priority === "high") {  // Bug: Using ==
        return true;  // Bug: Should return boolean
    }
    return false;
}

// Missing: Class definitions
// Missing: Inheritance example
// Missing: Module exports
// Missing: Proper use of operators (logical, comparison)
// Missing: Recursion
// Missing: Functional programming patterns
// Missing: Proper scope demonstration
