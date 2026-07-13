# Task Management Application – Debugging & Refactoring

## Overview

This project involved debugging and improving an existing Task Management Application that contained several intentional errors and incomplete features. The goal was to identify the problems, fix them using modern JavaScript (ES6+), and build a working application with automated tests.

## Errors Found

### Variables & Operators
1. Used `var` instead of `let` and `const`.
2. Variables were used without being declared.
3. Assignment (`=`) was used instead of a comparison operator.
4. Loose equality (`==`) was used instead of strict equality (`===`).
5. Missing `typeof` checks for input validation.
6. Variables were not initialized correctly, causing `undefined` values.

### Control Flow
7. A `for` loop contained an off-by-one error.
8. A `while` loop could run forever because it was missing an increment.
9. Some conditional statements were incomplete or could be simplified.
10. Some loops could be replaced with cleaner `for...of` loops.

### Functions & Functional Programming
11. Some functions were missing required parameters.
12. A recursive function had no proper base case.
13. Some functions were not pure and modified data directly.
14. Imperative loops were used where array methods such as `filter()`, `find()`, and `reduce()` were more suitable.

### Object-Oriented Programming
15. The `Task` class was missing an `id` property.
16. The `Task` class did not include a `toggleCompletion()` method.
17. The `SubTask` class was missing the required `super()` call.
18. Some object methods used `this` incorrectly.

### Modern JavaScript (ES6+)
19. String concatenation was used instead of template literals.
20. Object and array destructuring were missing.
21. Spread and rest operators were not implemented.
22. The project was not fully organized using ES6 modules (`import`/`export`).

### DOM Manipulation & Storage
23. DOM elements were accessed without checking for `null`.
24. Event delegation was not used for dynamically created elements.
25. `localStorage` data was not correctly handled using `JSON.stringify()` and `JSON.parse()`.

## Fixes Implemented

To improve the application, I:

- Replaced `var` with `let` and `const`.
- Fixed loops, recursion, and conditional logic.
- Added input validation and `try...catch` blocks.
- Corrected the `Task` and `SubTask` classes and inheritance.
- Implemented ES6 modules using `import` and `export`.
- Used template literals, object destructuring, the spread operator, and rest parameters.
- Added event delegation and null checks before manipulating the DOM.
- Implemented `localStorage` to save and load tasks.
- Added Jest tests to verify the application's functionality.

## Features Added

- ES6 Modules
- Classes and Inheritance
- Template Literals
- Object & Array Destructuring
- Spread and Rest Operators
- Higher-order Array Methods
- Event Delegation
- Local Storage Persistence
- Automated Jest Testing

## Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/Umuzi-skillslab/task-management-appplication-Ntando-Mo.git
   ```
2. Open the project folder.
3. Run `index.html` using the Live Server extension.

## Running the Tests

1. Open a terminal in the project folder.
2. Install the dependencies:

   ```bash
   npm install --legacy-peer-deps
   ```

3. Run the tests:

   ```bash
   npm test
   ```

All tests are currently passing successfully.

## Reflection

This project helped me improve my debugging skills and my understanding of modern JavaScript. The biggest challenge was finding logic errors that didn't always produce obvious errors but still caused incorrect behaviour. Writing Jest tests made it much easier to identify these problems and confirm that my fixes were working correctly. I also became more confident using ES6 features such as modules, classes, destructuring, template literals, higher-order array methods, and local storage. Overall, this project gave me a much better understanding of how to build and organize a modular JavaScript application.