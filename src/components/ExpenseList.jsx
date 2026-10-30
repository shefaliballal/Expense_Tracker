import React from 'react';
import ExpenseItem from './ExpenseItem';

/**
 * ExpenseList Component
 * 
 * Props:
 * - expenses: Array of expense objects to render.
 * - onDelete: Function(id) passed down to each ExpenseItem.
 * - onToggleParticipantPaid: Function(expenseId, participantName) for payment status changes.
 * 
 * State:
 * - Stateless container component.
 */
export default function ExpenseList({ expenses, onDelete, onToggleParticipantPaid }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty-expenses-state">
        <p>No expenses found in this category.</p>
        <span className="empty-hint">Add an expense above or change the filter to view existing items.</span>
      </div>
    );
  }

  return (
    <div className="expenses-list-container">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onDelete={onDelete}
          onToggleParticipantPaid={onToggleParticipantPaid}
        />
      ))}
    </div>
  );
}
