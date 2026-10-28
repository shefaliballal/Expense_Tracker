import { describe, it, expect } from 'vitest';
import {
  validateExpenseInput,
  calculateTotal,
  formatCurrency,
  filterExpenses,
  MAX_EXPENSE_AMOUNT,
} from '../utils/expenseUtils';

describe('expenseUtils: Pure Logic Suite', () => {
  describe('validateExpenseInput', () => {
    it('accepts valid input parameters', () => {
      const result = validateExpenseInput('Lunch', '250', 'Food');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('rejects an empty or whitespace-only title', () => {
      const emptyResult = validateExpenseInput('', 200, 'Food');
      expect(emptyResult.isValid).toBe(false);
      expect(emptyResult.error).toContain('Title is required');

      const whitespaceResult = validateExpenseInput('   ', 200, 'Food');
      expect(whitespaceResult.isValid).toBe(false);
      expect(whitespaceResult.error).toContain('Title is required');
    });

    it('rejects non-numeric amount inputs', () => {
      const result = validateExpenseInput('Coffee', 'abc', 'Food');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid number');
    });

    it('rejects zero or negative amounts', () => {
      const zeroResult = validateExpenseInput('Coffee', 0, 'Food');
      expect(zeroResult.isValid).toBe(false);
      expect(zeroResult.error).toContain('greater than 0');

      const negativeResult = validateExpenseInput('Taxi', -150, 'Travel');
      expect(negativeResult.isValid).toBe(false);
      expect(negativeResult.error).toContain('greater than 0');
    });

    // Test-first exercise requirement: amounts over 1,00,000 are rejected
    it('rejects amounts over 1,00,000 (100000)', () => {
      const boundaryPass = validateExpenseInput('Flight', MAX_EXPENSE_AMOUNT, 'Travel');
      expect(boundaryPass.isValid).toBe(true);

      const excessResult = validateExpenseInput('Luxury Watch', 100001, 'Other');
      expect(excessResult.isValid).toBe(false);
      expect(excessResult.error).toBe('Amounts over 1,00,000 are rejected.');
    });

    it('rejects invalid categories', () => {
      const result = validateExpenseInput('Gadget', 500, 'InvalidCategory');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid category');
    });
  });

  describe('calculateTotal', () => {
    it('returns 0 for empty or invalid expense arrays', () => {
      expect(calculateTotal([])).toBe(0);
      expect(calculateTotal(null)).toBe(0);
      expect(calculateTotal(undefined)).toBe(0);
    });

    it('calculates the exact floating-point sum of expense amounts', () => {
      const sample = [
        { amount: 250 },
        { amount: 400 },
        { amount: 15.99 },
      ];
      expect(calculateTotal(sample)).toBe(665.99);
    });

    it('safely handles non-numeric or malformed items in the array', () => {
      const sampleWithMalformed = [
        { amount: 100 },
        { amount: 'invalid' },
        { amount: 50.5 },
      ];
      expect(calculateTotal(sampleWithMalformed)).toBe(150.5);
    });
  });

  describe('formatCurrency', () => {
    it('formats numbers strictly to 2 decimal places', () => {
      expect(formatCurrency(650)).toBe('650.00');
      expect(formatCurrency(250.5)).toBe('250.50');
      expect(formatCurrency(0)).toBe('0.00');
    });

    it('returns "0.00" for invalid values', () => {
      expect(formatCurrency(NaN)).toBe('0.00');
      expect(formatCurrency(null)).toBe('0.00');
    });
  });

  describe('filterExpenses', () => {
    const sample = [
      { id: 1, title: 'Lunch', amount: 250, category: 'Food' },
      { id: 2, title: 'Cab', amount: 400, category: 'Travel' },
      { id: 3, title: 'Electricity', amount: 1200, category: 'Bills' },
    ];

    it('returns all expenses when filter is "All" or unspecified', () => {
      expect(filterExpenses(sample, 'All')).toHaveLength(3);
      expect(filterExpenses(sample, '')).toHaveLength(3);
    });

    it('filters expenses strictly by chosen category', () => {
      const foodOnly = filterExpenses(sample, 'Food');
      expect(foodOnly).toHaveLength(1);
      expect(foodOnly[0].title).toBe('Lunch');

      const travelOnly = filterExpenses(sample, 'Travel');
      expect(travelOnly).toHaveLength(1);
      expect(travelOnly[0].title).toBe('Cab');
    });
  });
});
