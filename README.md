# Task Management Application - Debugging & Refactoring

## Overview

This project is a modern, modular Task Management Application built for a local startup. The original codebase was delivered incomplete and contained numerous intentional errors, scoping issues, and poor programming practices. My objective was to debug the application, implement modern ES6+ features, enforce functional programming principles, and build a comprehensive automated test suite.

## Major Errors Identified

During the initial audit, I identified the following major issues across the codebase:

**Variables & Operators**

1. Widespread use of `var`, causing global scope pollution.
2. Undeclared variables bypassing strict mode.
3. Assignment operators (`=`) incorrectly used inside conditional statements.
4. Non-strict equality (`==`) used instead of strict equality (`===`).
5. Missing `typeof` checks leading to unhandled data types.
6. Missing variable initialization causing `undefined` reference errors.

**Control Flow & Functions**

7. Off-by-one errors in standard `for` loops.
8. Infinite `while` loops caused by missing incrementers.
9. Recursive functions missing proper base cases (risking stack overflows).
10. Functions missing required arguments in their signatures.
11. Impure functions mutating global arrays directly.
12. Redundant conditional blocks easily simplified by ternary operators.
13. Implicit globals created by missing variable declarations inside functions.

**Object-Oriented Programming (OOP)**

14. `Task` class missing the core `id` property in its constructor.
15. `SubTask` inheritance failing due to a missing `super()` call.
16. `Task` class missing the required `toggleCompletion` method.
17. Incorrect `this` context handling inside object methods.
18. Hardcoded object properties instead of dynamic parameter assignment.

**DOM, Storage & Error Handling**

19. Outdated string concatenation used for HTML rendering.
20. Event listeners missing `.preventDefault()` on form submissions.
21. Missing null-checks before DOM manipulation, causing runtime crashes.
22. LocalStorage saving raw objects instead of using `JSON.stringify()`.
23. Complete lack of `try-catch` blocks for critical logic failure points.
24. Missing module export statements preventing cross-file integration.
25. Direct DOM manipulation ignoring Event Delegation best practices.

## Fixes & Modern ES6+ Features

- **Scoping & Logic:** Replaced `var` with `let` and `const`. Replaced imperative loops with functional higher-order methods like `.filter()` and `.reduce()`.
- **OOP & Modules:** Restructured `Task` classes for proper inheritance. Split the monolithic file into modular `import`/`export` files.
- **Modern Syntax:** Replaced string concatenation with Template Literals. Applied Object Destructuring to safely extract properties. Utilized Spread syntax (`...array`) for safe array merging and Rest parameters (`...tasks`) for handling dynamic function arguments.
- **Storage & Safety:** Implemented strict null checks, Event Delegation for dynamic UI elements, and data rehydration via `localStorage`.

## Instructions: Running the Application

The core application runs natively in the browser and does not require Node.js to operate.

1. Clone the repository: `git clone https://github.com/Umuzi-skillslab/task-management-appplication-Ntando-Mo.git`
2. Navigate into the project directory: `cd task-management-appplication-Ntando-Mo`
3. Open `index.html` using a Live Server extension in your browser.

## Instructions: Running the Tests

This project uses Jest for automated testing, which requires a Node environment.

1. Open your terminal inside the root directory.
2. Install dependencies: `npm install --legacy-peer-deps`
3. Execute the test suite: `npm test`

**Test Results:** The suite includes 19 comprehensive tests covering core logic, OOP inheritance, edge cases, and error handling. **19/19 tests are currently passing with 0 failures.**

## Reflection

The most challenging part of this capstone was tracking down silent logic bugs that didn't immediately throw console errors. For example, testing the `updateTaskPriority` function revealed a bug where a numerical task ID was strictly compared (`===`) to a string, causing the update to silently fail. Debugging this required writing targeted Jest edge-case tests and implementing strict `typeof` validations to ensure data integrity.
