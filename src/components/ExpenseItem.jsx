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
 * - onToggleParticipantPaid: Function(expenseId, participantName)
 *   Callback that toggles the payment status of one participant.
 * 
 * State:
 * - Stateless presentational component.
 */
export default function ExpenseItem({ expense, onDelete, onToggleParticipantPaid }) {
  const { id, title, amount, category, participants = [] } = expense;

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
          {participants.length > 0 && (
            <div className="expense-participants" aria-label={`Shares for ${title}`}>
              {participants.map((participant) => (
                <div className="participant-share" key={participant.name}>
                  <span>
                    {participant.name}: ₹{formatCurrency(participant.amount)}
                  </span>
                  <button
                    type="button"
                    className={`btn-paid${participant.paid ? ' is-paid' : ''}`}
                    onClick={() => onToggleParticipantPaid(id, participant.name)}
                    aria-label={`Mark ${participant.name} ${participant.paid ? 'unpaid' : 'paid'}`}
                    data-cy="mark-paid"
                  >
                    {participant.paid ? 'Paid' : 'Mark paid'}
                  </button>
                </div>
              ))}
            </div>
          )}
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
