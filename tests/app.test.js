// Setup a localStorage mock for testing storage functions
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Imports from the src folder
import {
  formatTaskName,
  generateRandomId,
  isHighPriority,
  saveToStorage,
  loadFromStorage,
} from "../src/utils.js";
import {
  Task,
  SubTask,
  addTask,
  taskList,
  findTaskByTitle,
  updateTaskPriority,
  calculateAveragePriority,
  mergeTasks,
  getHighPriorityTasks,
  countCompletedTasks,
  getTaskDetails,
} from "../src/app.js";

// Centralized state reset before every single test
beforeEach(() => {
  taskList.length = 0;
  global.localStorage.clear();
  jest.clearAllMocks();
});

describe("Task Class", () => {
  test("should create a task with all properties", () => {
    const task = new Task("Test Task", "Description", 3);
    expect(task.title).toBe("Test Task");
    expect(task.description).toBe("Description");
    expect(task.priority).toBe(3);
    expect(task.completed).toBe(false); // Checks default property
  });

  test("getInfo method should return formatted string", () => {
    const task = new Task("Read", "Read 20 pages", 2);
    expect(task.getInfo()).toContain("Task: Read");
  });

  test("toggle completion should flip boolean status", () => {
    const task = new Task("Run", "Run 5km", 4);
    task.toggleCompletion();
    expect(task.completed).toBe(true);
  });
});

describe("Task Functions", () => {
  test("should add task directly to taskList array", () => {
    addTask("New Task", "Test", 2);
    expect(taskList.length).toBe(1);
    expect(taskList[0].title).toBe("New Task");
  });

  test("findTaskByTitle should locate correct task", () => {
    addTask("Find Me", "Testing find", 1);
    const found = findTaskByTitle("Find Me");
    expect(found.title).toBe("Find Me");
  });

  test("updateTaskPriority should change priority", () => {
    addTask("Update Me", "Testing update", 1);

    // Find the auto-generated ID of the task
    const targetTask = taskList.find((task) => task.title === "Update Me");

    // Pass the ID (not the title) into the function
    updateTaskPriority(targetTask.id, 5);

    expect(taskList[0].priority).toBe(5);
  });

  test("calculateAveragePriority should return correct math", () => {
    addTask("A", "Desc", 2);
    addTask("B", "Desc", 4);
    expect(calculateAveragePriority(taskList)).toBe(3);
  });

  test("error handling: findTaskByTitle on non-existent task returns undefined", () => {
    const missingTask = findTaskByTitle("Ghost Task");
    expect(missingTask).toBeUndefined();
  });
});

describe("Array Operations", () => {
  test("mergeTasks should combine arrays using spread operator", () => {
    const listA = [{ title: "Task A" }];
    const listB = [{ title: "Task B" }];
    const merged = mergeTasks(listA, listB);
    expect(merged.length).toBe(2);
  });

  test("getHighPriorityTasks should filter arrays", () => {
    // Clear list and add fresh tasks
    taskList.length = 0;
    addTask("Low Task", "Desc", 1);
    addTask("High Task", "Desc", 5);

    // Pass the array into the pure function
    const high = getHighPriorityTasks(taskList, 3);
    expect(high[0].priority).toBe(5);
  });

  test("recursive function countCompletedTasks should count accurately", () => {
    const mockTasks = [
      { completed: true },
      { completed: false },
      { completed: true },
    ];
    expect(countCompletedTasks(mockTasks)).toBe(2);
  });
});

describe("SubTask class and inheritance", () => {
  test("SubTask inherits from Task and overrides getInfo", () => {
    const sub = new SubTask("Buy Milk", "2 Liters", 1, "Groceries");
    expect(sub.title).toBe("Buy Milk"); // Inherited
    expect(sub.parentTask).toBe("Groceries"); // Unique
    expect(sub.getInfo()).toContain("SubTask:"); // Overridden
  });
});

describe("Destructuring functions", () => {
  test("getTaskDetails should extract specific properties", () => {
    const task = new Task("Design", "Make logo", 4);
    const details = getTaskDetails(task);

    // Checking for the destructured object instead of a string
    expect(typeof details).toBe("object");
    expect(details.title).toBe("Design");
  });
});

describe("Module exports/imports", () => {
  test("Variables and functions are properly exported/imported", () => {
    expect(isHighPriority).toBeDefined();
    expect(formatTaskName).toBeDefined();
    expect(generateRandomId).toBeDefined();
  });
});

describe("Error Handling", () => {
  test("updateTaskPriority with invalid data types returns false", () => {
    addTask("Invalid Test", "Desc", 1);
    // Pass strings instead of numbers to trigger validation logic
    const result = updateTaskPriority("wrong_id", "high");
    expect(result).toBe(false);
  });

  test("findTaskByTitle handles invalid input types gracefully", () => {
    // Passing null or numbers instead of a valid string title
    expect(findTaskByTitle(null)).toBeUndefined();
    expect(findTaskByTitle(999)).toBeUndefined();
  });
});

describe("Storage / LocalStorage under JSDOM", () => {
  test("saveToStorage and loadFromStorage should save and load tasks correctly", () => {
    const testTasks = [{ id: 1, title: "Store Task", completed: false }];
    saveToStorage(testTasks);
    const loaded = loadFromStorage();
    expect(loaded).toEqual(testTasks);
  });

  test("loadFromStorage returns empty array if nothing is saved", () => {
    expect(loadFromStorage()).toEqual([]);
  });
});

describe("Edge Cases", () => {
  test("isHighPriority handles objects missing the priority property", () => {
    const weirdTask = { title: "No Priority" };
    // Should safely return false instead of throwing a TypeError
    expect(isHighPriority(weirdTask)).toBe(false);
  });

  test("formatTaskName safely returns empty string for non-string inputs", () => {
    // Passing numbers and null to a string manipulation function
    expect(formatTaskName(123)).toBe("");
    expect(formatTaskName(null)).toBe("");
  });

  test("getHighPriorityTasks handles scenarios where zero tasks meet the criteria", () => {
    // Clear list and add only low priority tasks
    taskList.length = 0;
    addTask("Low Task 1", "Desc", 1);
    addTask("Low Task 2", "Desc", 1);

    // Searching for priority 5 should return an empty array, not undefined or an error
    const highPriority = getHighPriorityTasks(taskList, 5);
    expect(highPriority.length).toBe(0);
    expect(Array.isArray(highPriority)).toBe(true);
  });
});