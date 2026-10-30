import React, { useState } from 'react';
import { CATEGORIES, parseParticipantNames, validateExpenseInput } from '../utils/expenseUtils';

/**
 * ExpenseForm Component
 * 
 * Props:
 * - onAddExpense: Function(expense: { title: string, amount: number, category: string })
 *   Callback invoked when user submits a valid expense.
 * 
 * Internal State:
 * - title: string, current value of the title text input
 * - amount: string, current value of the amount number input
 * - category: string, current selected category ('Food', 'Travel', 'Bills', 'Other')
 * - participants: string, comma-separated names sharing the expense
 * - error: string | null, validation error message displayed if input validation fails
 */
export default function ExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [participants, setParticipants] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateExpenseInput(title, amount, category);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    // Input is valid: clear error and notify parent
    setError(null);
    onAddExpense({
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      participants: parseParticipantNames(participants),
    });

    // Reset form inputs to pristine state
    setTitle('');
    setAmount('');
    setCategory('Food');
    setParticipants('');
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h3>Add New Expense</h3>
      </div>

      {error && (
        <div className="form-error-banner" data-cy="error-message" role="alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="expense-title">Expense Title</label>
          <input
            id="expense-title"
            type="text"
            placeholder="e.g. Lunch, Train Ticket"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            data-cy="title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expense-amount">Amount (₹)</label>
          <input
            id="expense-amount"
            type="number"
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (error) setError(null);
            }}
            data-cy="amount"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expense-category">Category</label>
          <select
            id="expense-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            data-cy="category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="expense-participants">People sharing (optional)</label>
          <input
            id="expense-participants"
            type="text"
            placeholder="e.g. Alex, Sam"
            value={participants}
            onChange={(e) => {
              setParticipants(e.target.value);
              if (error) setError(null);
            }}
            data-cy="participants"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" data-cy="add-expense">
        Add Expense
      </button>
    </form>
  );
}
