// Proper imports from the src folder
import { formatTaskName, generateRandomId, isHighPriority } from '../src/utils.js';
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
    getTaskDetails
} from '../src/app.js';

describe('Task Class', () => {
    test('should create a task with all properties', () => {
        const task = new Task('Test Task', 'Description', 3);
        expect(task.title).toBe('Test Task');
        expect(task.description).toBe('Description');
        expect(task.priority).toBe(3);
        expect(task.completed).toBe(false); // Checks default property
    });
    
    test('getInfo method should return formatted string', () => {
        const task = new Task('Read', 'Read 20 pages', 2);
        expect(task.getInfo()).toContain('Task: Read');
    });

    test('toggle completion should flip boolean status', () => {
        const task = new Task('Run', 'Run 5km', 4);
        task.toggleCompletion();
        expect(task.completed).toBe(true);
    });
});

describe('Task Functions', () => {
    // Fix: Added beforeEach to reset taskList
    beforeEach(() => {
        taskList.length = 0; 
    });
    
    test('should add task directly to taskList array', () => {
        addTask('New Task', 'Test', 2);
        expect(taskList.length).toBe(1);
        expect(taskList[0].title).toBe('New Task');
    });
    
    test('findTaskByTitle should locate correct task', () => {
        addTask('Find Me', 'Testing find', 1);
        const found = findTaskByTitle('Find Me');
        expect(found.title).toBe('Find Me');
    });

    test('updateTaskPriority should change priority', () => {
        addTask('Update Me', 'Testing update', 1);
        updateTaskPriority('Update Me', 5);
        expect(taskList[0].priority).toBe(5);
    });

    test('calculateAveragePriority should return correct math', () => {
        addTask('A', 'Desc', 2);
        addTask('B', 'Desc', 4);
        expect(calculateAveragePriority(taskList)).toBe(3);
    });

    test('error handling: findTaskByTitle on non-existent task returns undefined', () => {
        const missingTask = findTaskByTitle('Ghost Task');
        expect(missingTask).toBeUndefined();
    });
});

describe('Array Operations', () => {
    test('mergeTasks should combine arrays using spread operator', () => {
        const listA = [{ title: 'Task A' }];
        const listB = [{ title: 'Task B' }];
        const merged = mergeTasks(listA, listB);
        expect(merged.length).toBe(2);
    });

    test('getHighPriorityTasks should filter arrays', () => {
        // Clear list and add fresh tasks
        taskList.length = 0; 
        addTask('Low Task', 'Desc', 1);
        addTask('High Task', 'Desc', 5);
        
        // Let it filter the global taskList
        const high = getHighPriorityTasks(3); 
        expect(high[0].priority).toBe(5);
    });

    test('recursive function countCompletedTasks should count accurately', () => {
        const mockTasks = [{ completed: true }, { completed: false }, { completed: true }];
        expect(countCompletedTasks(mockTasks)).toBe(2);
    });
});

// Missing Describe Blocks Added:

describe('SubTask class and inheritance', () => {
    test('SubTask inherits from Task and overrides getInfo', () => {
        const sub = new SubTask('Buy Milk', '2 Liters', 1, 'Groceries');
        expect(sub.title).toBe('Buy Milk'); // Inherited
        expect(sub.parentTask).toBe('Groceries'); // Unique
        expect(sub.getInfo()).toContain('SubTask:'); // Overridden
    });
});

describe('Destructuring functions', () => {
    test('getTaskDetails should extract specific properties', () => {
        const task = new Task('Design', 'Make logo', 4);
        const details = getTaskDetails(task);
        
        // Checking for the destructured object instead of a string
        expect(typeof details).toBe('object');
        expect(details.title).toBe('Design');
    });
});

describe('Module exports/imports', () => {
    test('Variables and functions are properly exported/imported', () => {
        expect(isHighPriority).toBeDefined();
        expect(formatTaskName).toBeDefined();
        expect(generateRandomId).toBeDefined();
    });
});