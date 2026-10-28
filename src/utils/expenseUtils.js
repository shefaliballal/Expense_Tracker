/**
 * Pure utility functions for the Expense Tracker application.
 * Handles validation, total calculations, currency formatting, and filtering.
 */

export const CATEGORIES = ['Food', 'Travel', 'Bills', 'Other'];
export const FILTER_CATEGORIES = ['All', ...CATEGORIES];
export const MAX_EXPENSE_AMOUNT = 100000;

/**
 * Validates expense input fields.
 * 
 * Rules:
 * - Title cannot be empty or whitespace only.
 * - Amount must be a valid number, greater than 0.
 * - Amount cannot exceed 100,000 (1,00,000).
 * - Category must be one of the permitted categories.
 * 
 * @param {string} title
 * @param {string|number} amount
 * @param {string} [category]
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validateExpenseInput(title, amount, category = 'Food') {
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { isValid: false, error: 'Title is required.' };
  }

  if (amount === undefined || amount === null || amount === '') {
    return { isValid: false, error: 'Amount is required.' };
  }

  const numericAmount = typeof amount === 'number' ? amount : Number(amount);

  if (Number.isNaN(numericAmount) || !Number.isFinite(numericAmount)) {
    return { isValid: false, error: 'Amount must be a valid number.' };
  }

  if (numericAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0.' };
  }

  if (numericAmount > MAX_EXPENSE_AMOUNT) {
    return { isValid: false, error: 'Amounts over 1,00,000 are rejected.' };
  }

  if (category && !CATEGORIES.includes(category)) {
    return { isValid: false, error: 'Please select a valid category.' };
  }

  return { isValid: true, error: null };
}

/**
 * Calculates the sum of all expense amounts.
 * 
 * @param {Array<{ amount: number }>} expenses
 * @returns {number} Sum rounded to 2 decimal places as a float.
 */
export function calculateTotal(expenses) {
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return 0;
  }
  const sum = expenses.reduce((acc, curr) => {
    const val = Number(curr?.amount);
    return acc + (Number.isFinite(val) ? val : 0);
  }, 0);

  return Math.round((sum + Number.EPSILON) * 100) / 100;
}

/**
 * Formats a numeric amount to a standard currency string formatted to 2 decimal places.
 * 
 * @param {number|string} amount
 * @returns {string} Formatted string, e.g. "650.00"
 */
export function formatCurrency(amount) {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) {
    return '0.00';
  }
  return numeric.toFixed(2);
}

/**
 * Filters a list of expenses by the chosen category.
 * 
 * @param {Array<{ category: string }>} expenses
 * @param {string} category 'All' or specific category name
 * @returns {Array} Filtered expenses
 */
export function filterExpenses(expenses, category) {
  if (!Array.isArray(expenses)) return [];
  if (!category || category === 'All') {
    return expenses;
  }
  return expenses.filter(item => item?.category === category);
}
