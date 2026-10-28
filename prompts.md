# Prompt Library

This prompt library defines standardized prompt templates for working with coding agents, along with an exemplar five-part prompt for the "Add Expense" feature.

---

## 1. Reusable Prompt Templates

### 1.1 New Feature Template
```markdown
### Feature Request: [Feature Name]

#### 1. Context
- Where this feature fits into the application.
- Relevant existing components, state, or utility modules.

#### 2. Goal
- Clear statement of what user capability or system behavior this introduces.

#### 3. Constraints
- Architectural constraints (e.g., state kept in App, one component per file).
- Technology constraints (e.g., React, Vanilla CSS, data-cy attributes).
- Dependencies constraint (do not install new packages without asking).

#### 4. Acceptance Criteria
- [ ] Criterion 1 (Measurable / testable with RTL or Cypress)
- [ ] Criterion 2 (Edge case handling / error boundary)
- [ ] Criterion 3 (UI rendering & state update verification)

#### 5. Examples & Test Cases
- Input payload -> Expected output state / rendered UI.
- Invalid input payload -> Expected validation error message.
```

---

### 1.2 Bug Fix Template
```markdown
### Bug Report: [Short Title]

#### 1. Current Behavior
- Description of what is currently happening.
- Screenshots, console logs, or stack trace.

#### 2. Expected Behavior
- What should happen instead under valid conditions.

#### 3. Reproduction Steps
1. Navigate to [...]
2. Enter values [...]
3. Click [...]
4. Observe failure [...]

#### 4. Suspected Cause & Scope
- Files or functions likely involved.
- Regression risks to watch out for.

#### 5. Acceptance Criteria
- [ ] Write a failing regression test confirming the bug.
- [ ] Implement the minimal fix without modifying unaffected code.
- [ ] Confirm regression test and all existing test suites pass.
```

---

### 1.3 Refactor Template
```markdown
### Refactor Request: [Scope/Module]

#### 1. Motivation
- Code smell, duplication, maintainability, or readability issue being addressed.

#### 2. Scope of Changes
- Specific files and functions to refactor.
- Boundaries: what must NOT be changed.

#### 3. Invariants & Safety Guarantees
- Public API / prop contracts must remain identical.
- All existing unit, integration, and E2E tests must pass without edits.

#### 4. Acceptance Criteria
- [ ] Pure logic cleanly extracted into helper/utility modules where appropriate.
- [ ] Component readability improved, maintaining one component per file rule.
- [ ] Test coverage unchanged or improved.
```

---

### 1.4 Generate Tests Template
```markdown
### Test Generation Request: [Target Component or Logic]

#### 1. Target
- File / Module: `[path/to/file]`
- Testing Framework: Vitest + React Testing Library / Cypress

#### 2. Test Objectives
- Happy path coverage.
- Boundary & edge cases (zero values, empty strings, exceeding maximums).
- Error state assertion and asynchronous state updates.

#### 3. Constraints
- Use semantic queries or `data-cy` selectors.
- Do not test implementation details (test user-observable behavior).
- No mocking of core logic; isolate only environment boundaries.

#### 4. Acceptance Criteria
- [ ] Test suite executes deterministically with zero flakiness.
- [ ] Minimum of [N] distinct assertions covering required scenarios.
- [ ] Intentionally breaking the implementation causes tests to fail cleanly.
```

---

### 1.5 Review Diff Template
```markdown
### Code Review & Diff Checklist: [Branch / PR Name]

#### Checklist:
1. **Scope & Relevance**:
   - Does this diff strictly match the requested task?
   - Are there unexpected or stray changes?
2. **Architecture & Standards**:
   - Is state stored in the designated root (`App.jsx`)?
   - Is there only one component per file?
   - Are all interactive elements tagged with stable `data-cy` attributes?
3. **Robustness & Edge Cases**:
   - Are invalid inputs (empty strings, negatives, non-numeric values) handled gracefully?
   - Are errors cleanly surfaced to the user?
4. **Testing Verification**:
   - Do all unit and component tests pass?
   - Do Cypress E2E flows succeed?
5. **Approval Decision**: [Approve / Request Changes with actionable feedback]
```

---

### 1.6 Commit Message Template
```markdown
<type>(<scope>): <short imperative summary>

[Optional longer description explaining the rationale and changes made]

- Closes: #[Issue Number]
- Breaking Changes: None

Types: feat, fix, refactor, test, chore, docs, style
Example: feat(expense-form): add validation for amounts over 100000
```

---

## 2. Exemplar Five-Part Prompt: "Add Expense" Feature

### Part 1: Context
We are developing a React expense tracker application built with Vite. The root component `App.jsx` owns the expense state list (`expenses`). We need a dedicated form component `ExpenseForm.jsx` that enables users to input and submit new expense entries into the system.

### Part 2: Goal
Implement the `ExpenseForm` component and wire it to the `App` component state so users can enter a Title, Amount, and Category (`Food`, `Travel`, `Bills`, `Other`), validate the data on submission, and update the active expenses list while resetting form fields upon success.

### Part 3: Constraints
1. **Architecture**: Single component in `src/components/ExpenseForm.jsx`. State of all expenses remains in `App.jsx`.
2. **Selectors**: All inputs and controls must use exact test selectors:
   - `data-cy="title"` for Title input.
   - `data-cy="amount"` for Amount input.
   - `data-cy="category"` for Category select dropdown.
   - `data-cy="add-expense"` for Add button.
   - `data-cy="error-message"` for error display.
3. **No External Libraries**: Use native HTML form elements and vanilla CSS. Do not install additional packages without explicit permission.
4. **Validation Rules**:
   - Title must not be empty or whitespace only.
   - Amount must be a valid positive number greater than 0.
   - Amount must not exceed 100,000.
   - Category must be one of: `Food`, `Travel`, `Bills`, `Other`.

### Part 4: Acceptance Criteria (Every criterion is testable)
- [ ] **AC 1**: When user inputs Title "Lunch", Amount "250", Category "Food" and clicks `[data-cy="add-expense"]`, the `onAddExpense` callback is invoked with `{ id, title: "Lunch", amount: 250, category: "Food", createdAt }`.
- [ ] **AC 2**: Upon successful submission, Title and Amount input values reset to empty, and Category resets to default (`Food`).
- [ ] **AC 3**: If Title is empty or only whitespace, clicking `[data-cy="add-expense"]` displays an error message containing "Title is required" and does not call `onAddExpense`.
- [ ] **AC 4**: If Amount is non-numeric, 0, or negative (e.g., `-50`, `0`, `abc`), an error message containing "Amount must be greater than 0" is displayed and `onAddExpense` is not called.
- [ ] **AC 5**: If Amount exceeds 100,000 (e.g., `100001`), an error message containing "Amount cannot exceed 100,000" is displayed and `onAddExpense` is not called.
- [ ] **AC 6**: Entering valid data clears any prior displayed validation error message.

### Part 5: Examples & Test Cases
- **Valid Entry**:
  - Input: Title = `"Office Supplies"`, Amount = `"1500.50"`, Category = `"Bills"`
  - Action: Click `[data-cy="add-expense"]`
  - Result: Expense added to list, fields reset, error message absent.
- **Invalid Entry (Negative Amount)**:
  - Input: Title = `"Coffee"`, Amount = `"-15"`, Category = `"Food"`
  - Action: Click `[data-cy="add-expense"]`
  - Result: `[data-cy="error-message"]` displays "Amount must be greater than 0", list remains unchanged.
- **Invalid Entry (Exceeds Max)**:
  - Input: Title = `"Car"`, Amount = `"150000"`, Category = `"Other"`
  - Action: Click `[data-cy="add-expense"]`
  - Result: `[data-cy="error-message"]` displays "Amount cannot exceed 100,000".
