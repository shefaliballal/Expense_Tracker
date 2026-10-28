import React from 'react';
import { formatCurrency } from '../utils/expenseUtils';

/**
 * ExpenseItem Component
 * 
 * Props:
 * - expense: { id: string|number, title: string, amount: number, category: string }
 *   The expense record to display.
 * - onDelete: Function(id: string|number)
 *   Callback triggered when the user clicks the delete button for this item.
 * 
 * State:
 * - Stateless presentational component.
 */
export default function ExpenseItem({ expense, onDelete }) {
  const { id, title, amount, category } = expense;

  const getCategoryBadgeClass = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'food':
        return 'badge-food';
      case 'travel':
        return 'badge-travel';
      case 'bills':
        return 'badge-bills';
      default:
        return 'badge-other';
    }
  };

  return (
    <div className="expense-item-row" data-cy="expense-item">
      <div className="expense-main-info">
        <span className={`category-tag ${getCategoryBadgeClass(category)}`}>
          {category}
        </span>
        <div className="expense-text">
          <h4 className="expense-item-title">{title}</h4>
        </div>
      </div>

      <div className="expense-actions-wrapper">
        <span className="expense-item-amount">₹{formatCurrency(amount)}</span>
        <button
          type="button"
          className="btn-icon-delete"
          onClick={() => onDelete(id)}
          aria-label={`Delete ${title}`}
          data-cy="delete-expense"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
