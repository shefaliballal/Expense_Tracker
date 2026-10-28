# AGENTS.md - Developer & Agent Workflow Guide

This document defines repository standards, architecture, commands, and rules for human developers and AI coding agents working on the Expense Tracker project.

---

## 1. Tech Stack Overview
- **Runtime**: Node.js v20+ (tested on Node v24)
- **Framework & Tooling**: React 19 + Vite 8
- **Testing**:
  - Unit & Component Testing: Vitest + React Testing Library + @testing-library/jest-dom + jsdom
  - End-to-End Testing: Cypress
- **Styling**: Modern Vanilla CSS (Design system with dark-slate/emerald accents, responsive layouts, glassmorphism card surfaces)

---

## 2. Directory & Folder Layout
```text
expense-tracker/
├── cypress/
│   ├── e2e/
│   │   ├── expenses.cy.js       # Main journey spec (add, filter, count, total)
│   │   ├── validation.cy.js     # Invalid input rejection spec
│   │   └── delete.cy.js         # Delete flow spec
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CategoryFilter.jsx   # Category filter select component
│   │   ├── ExpenseForm.jsx      # Form for adding expenses with input validation
│   │   ├── ExpenseItem.jsx      # Single expense row display with delete button
│   │   └── ExpenseList.jsx      # List container rendering filtered ExpenseItem elements
│   ├── test/
│   │   ├── setup.js             # Vitest / jest-dom setup file
│   │   ├── expenseUtils.test.js # Unit tests for pure calculation and validation logic
│   │   └── ExpenseComponents.test.jsx # React Testing Library component tests
│   ├── utils/
│   │   └── expenseUtils.js      # Pure validation, total formatting & filter utilities
│   ├── App.css                  # Modern UI styles, animations, responsive design
│   ├── App.jsx                  # Root component owning expenses & category filter state
│   ├── index.css                # Base CSS resets and CSS custom properties
│   └── main.jsx                 # Vite application mount point
├── AGENTS.md                    # This document
├── cypress.config.js            # Cypress E2E configuration (baseUrl: http://localhost:5173)
├── package.json                 # Project dependencies and script declarations
├── prompts.md                   # Reusable prompt library & 5-part prompt
└── vite.config.js               # Vite config with Vitest testing configuration
```

---

## 3. Commands
Agents and developers must use the following standard commands:

- **Install Dependencies**:
  ```bash
  npm install
  ```
- **Run Development Server**:
  ```bash
  npm run dev
  ```
- **Build Production Bundle**:
  ```bash
  npm run build
  ```
- **Run Unit & Component Tests (Vitest)**:
  ```bash
  npm test
  # or non-interactive single run:
  npm run test:run
  ```
- **Run Test Coverage**:
  ```bash
  npm run test:coverage
  ```
- **Run Cypress E2E Tests**:
  ```bash
  # Headless mode (requires dev server running on http://localhost:5173):
  npm run cy:run
  # Interactive Cypress Runner:
  npm run cy:open
  ```

---

## 4. Architectural Conventions
1. **One Component per File**: Each UI component must reside in its own dedicated file in `src/components/`.
2. **State Management**: Primary application state (`expenses`, `filterCategory`) is kept in `App.jsx` and passed down via explicit props and handler callbacks.
3. **Pure Logic Extraction**: Mathematical calculations (running total, floating-point precision, formatting to 2 decimals) and validation rules must reside in `src/utils/expenseUtils.js` to ensure 100% testability.
4. **Stable Selectors**: Never bind tests to arbitrary CSS classes. Always use explicit `data-cy` attributes:
   - `data-cy="title"`
   - `data-cy="amount"`
   - `data-cy="category"`
   - `data-cy="add-expense"`
   - `data-cy="error-message"`
   - `data-cy="filter"`
   - `data-cy="total"`
   - `data-cy="count"`
   - `data-cy="expense-item"`
   - `data-cy="delete-expense"`
5. **Component Documentation**: For every component created or maintained, include a clear header docstring explaining its purpose, props, and internal state.

---

## 5. Agent Rules
- **No New Dependencies Without Asking**: Do not install external npm packages unless explicitly approved or mandated by the project specification.
- **Work on a Branch**: Every distinct feature, fix, or refactor should be developed on a dedicated git branch (e.g., `feat/expense-form`, `feat/testing-vitest`).
- **Review Diff & Summarize**: Before completing any task, check `git diff`, run unit tests, and provide a clear summary of all file changes.
