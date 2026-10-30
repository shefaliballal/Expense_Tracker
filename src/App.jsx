import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import CategoryFilter from './components/CategoryFilter';
import ExpenseList from './components/ExpenseList';
import {
  calculateTotal,
  filterExpenses,
  formatCurrency,
  splitAmountEvenly,
} from './utils/expenseUtils';
import './App.css';

/**
 * App Component (Root)
 * 
 * Owns primary application state:
 * - expenses: Array of { id, title, amount, category, participants, createdAt }
 * - filterCategory: string ('All' | 'Food' | 'Travel' | 'Bills' | 'Other')
 * 
 * Provides:
 * - Adding expenses with unique IDs
 * - Deleting expenses by ID
 * - Toggling individual participant payment status
 * - Category-based filtering
 * - Running total display (formatted to 2 decimal places)
 * - Visible item count
 */
export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');

  // Add a newly validated expense to state
  const handleAddExpense = (newExpenseData) => {
    const shares = splitAmountEvenly(newExpenseData.amount, newExpenseData.participants.length);
    const expenseWithId = {
      ...newExpenseData,
      participants: newExpenseData.participants.map((name, index) => ({
        name,
        amount: shares[index],
        paid: false,
      })),
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [expenseWithId, ...prev]);
  };

  // Delete an expense by its ID
  const handleDeleteExpense = (idToDelete) => {
    setExpenses((prev) => prev.filter((item) => item.id !== idToDelete));
  };

  const handleToggleParticipantPaid = (expenseId, participantName) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === expenseId
          ? {
              ...expense,
              participants: expense.participants.map((participant) =>
                participant.name === participantName
                  ? { ...participant, paid: !participant.paid }
                  : participant,
              ),
            }
          : expense,
      ),
    );
  };

  // Compute displayed expenses and running metrics
  const displayedExpenses = filterExpenses(expenses, filterCategory);
  const runningTotal = calculateTotal(displayedExpenses);
  const formattedTotal = formatCurrency(runningTotal);
  const visibleCount = displayedExpenses.length;

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">💳</span>
          <h1>Expense Tracker</h1>
        </div>
        <p className="header-subtitle">
          Track personal expenses, filter categories, and manage finances with precision.
        </p>
      </header>

      <main className="app-main">
        {/* Metric Summary Cards */}
        <section className="stats-grid" aria-label="Financial Summary">
          <div className="stat-card total-card">
            <span className="stat-label">Running Total</span>
            <div className="stat-value" data-cy="total">
              ₹{formattedTotal}
            </div>
            <span className="stat-caption">
              {filterCategory === 'All' ? 'Across all categories' : `In category "${filterCategory}"`}
            </span>
          </div>

          <div className="stat-card count-card">
            <span className="stat-label">Visible Expenses</span>
            <div className="stat-value" data-cy="count">
              {visibleCount}
            </div>
            <span className="stat-caption">
              {visibleCount === 1 ? '1 transaction displayed' : `${visibleCount} transactions displayed`}
            </span>
          </div>
        </section>

        {/* Expense Creation Form */}
        <section className="card form-section" aria-label="Add Expense Section">
          <ExpenseForm onAddExpense={handleAddExpense} />
        </section>

        {/* Filter and Expense Records Section */}
        <section className="card list-section" aria-label="Expense History Section">
          <div className="list-section-header">
            <h3>Expense History</h3>
            <CategoryFilter
              selectedCategory={filterCategory}
              onSelectCategory={setFilterCategory}
            />
          </div>

          <ExpenseList
            expenses={displayedExpenses}
            onDelete={handleDeleteExpense}
            onToggleParticipantPaid={handleToggleParticipantPaid}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>Built with React + Vite • Verified with Vitest, RTL, and Cypress</p>
      </footer>
    </div>
  );
}
