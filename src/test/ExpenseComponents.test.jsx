import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ExpenseForm from '../components/ExpenseForm';
import App from '../App';

describe('Expense Tracker: Component & Integration Suite', () => {
  /* =========================================================
     Hand-written component tests (Assignment Requirement)
     ========================================================= */
  describe('ExpenseForm Hand-Written Tests', () => {
    it('Hand-written Test 1: adds a valid expense and resets fields', async () => {
      const user = userEvent.setup();
      const mockAddExpense = vi.fn();

      render(<ExpenseForm onAddExpense={mockAddExpense} />);

      const titleInput = screen.getByLabelText(/expense title/i);
      const amountInput = screen.getByLabelText(/amount/i);
      const categorySelect = screen.getByLabelText(/category/i);
      const submitButton = screen.getByRole('button', { name: /add expense/i });

      await user.type(titleInput, 'Dinner with Friends');
      await user.type(amountInput, '850.50');
      await user.selectOptions(categorySelect, 'Food');
      await user.click(submitButton);

      expect(mockAddExpense).toHaveBeenCalledTimes(1);
      expect(mockAddExpense).toHaveBeenCalledWith({
        title: 'Dinner with Friends',
        amount: 850.5,
        category: 'Food',
      });

      // Fields should be reset
      expect(titleInput).toHaveValue('');
      expect(amountInput).toHaveValue(null);
    });

    it('Hand-written Test 2: rejects an empty title and shows error', async () => {
      const user = userEvent.setup();
      const mockAddExpense = vi.fn();

      render(<ExpenseForm onAddExpense={mockAddExpense} />);

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);

      expect(mockAddExpense).not.toHaveBeenCalled();
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(/title is required/i);
    });
  });

  /* =========================================================
     Codex-generated tests for invalid amounts, filtering, deleting, total
     ========================================================= */
  describe('ExpenseForm: Validation Tests', () => {
    it('rejects a negative amount and shows error', async () => {
      const user = userEvent.setup();
      const mockAddExpense = vi.fn();

      render(<ExpenseForm onAddExpense={mockAddExpense} />);

      const titleInput = screen.getByLabelText(/expense title/i);
      const amountInput = screen.getByLabelText(/amount/i);
      const submitButton = screen.getByRole('button', { name: /add expense/i });

      await user.type(titleInput, 'Gym Membership');
      await user.type(amountInput, '-500');
      await user.click(submitButton);

      expect(mockAddExpense).not.toHaveBeenCalled();
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(/amount must be greater than 0/i);
    });

    it('rejects amount over 1,00,000 and displays error', async () => {
      const user = userEvent.setup();
      const mockAddExpense = vi.fn();

      render(<ExpenseForm onAddExpense={mockAddExpense} />);

      const titleInput = screen.getByLabelText(/expense title/i);
      const amountInput = screen.getByLabelText(/amount/i);
      const submitButton = screen.getByRole('button', { name: /add expense/i });

      await user.type(titleInput, 'Car Purchase');
      await user.type(amountInput, '150000');
      await user.click(submitButton);

      expect(mockAddExpense).not.toHaveBeenCalled();
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(/amounts over 1,00,000 are rejected/i);
    });
  });

  describe('App Full Integration Flow: Add, Total, Filter, Delete', () => {
    it('handles adding multiple expenses and updating running total and count', async () => {
      const user = userEvent.setup();
      render(<App />);

      const totalElement = document.querySelector('[data-cy="total"]');
      const countElement = document.querySelector('[data-cy="count"]');

      expect(totalElement).toHaveTextContent('0.00');
      expect(countElement).toHaveTextContent('0');

      // Add Lunch (250, Food)
      await user.type(document.querySelector('[data-cy="title"]'), 'Lunch');
      await user.type(document.querySelector('[data-cy="amount"]'), '250');
      await user.selectOptions(document.querySelector('[data-cy="category"]'), 'Food');
      await user.click(document.querySelector('[data-cy="add-expense"]'));

      expect(document.querySelector('[data-cy="total"]')).toHaveTextContent('250.00');
      expect(document.querySelector('[data-cy="count"]')).toHaveTextContent('1');

      // Add Cab (400, Travel)
      await user.type(document.querySelector('[data-cy="title"]'), 'Cab');
      await user.type(document.querySelector('[data-cy="amount"]'), '400');
      await user.selectOptions(document.querySelector('[data-cy="category"]'), 'Travel');
      await user.click(document.querySelector('[data-cy="add-expense"]'));

      expect(document.querySelector('[data-cy="total"]')).toHaveTextContent('650.00');
      expect(document.querySelector('[data-cy="count"]')).toHaveTextContent('2');

      // Filter by Food
      await user.selectOptions(document.querySelector('[data-cy="filter"]'), 'Food');
      expect(document.querySelectorAll('[data-cy="expense-item"]')).toHaveLength(1);
      expect(document.querySelector('[data-cy="count"]')).toHaveTextContent('1');
      expect(document.querySelector('[data-cy="total"]')).toHaveTextContent('250.00');

      // Filter back to All
      await user.selectOptions(document.querySelector('[data-cy="filter"]'), 'All');
      expect(document.querySelectorAll('[data-cy="expense-item"]')).toHaveLength(2);

      // Delete the first item
      const deleteButtons = document.querySelectorAll('[data-cy="delete-expense"]');
      await user.click(deleteButtons[0]);

      expect(document.querySelectorAll('[data-cy="expense-item"]')).toHaveLength(1);
      expect(document.querySelector('[data-cy="count"]')).toHaveTextContent('1');
    });
  });
});
