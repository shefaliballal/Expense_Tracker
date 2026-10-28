import React from 'react';
import { FILTER_CATEGORIES } from '../utils/expenseUtils';

/**
 * CategoryFilter Component
 * 
 * Props:
 * - selectedCategory: string, the currently active filter ('All', 'Food', 'Travel', 'Bills', 'Other')
 * - onSelectCategory: Function(category: string), callback when user selects a different category filter
 * 
 * State:
 * - Stateless control component.
 */
export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="filter-wrapper">
      <label htmlFor="category-filter" className="filter-label">
        Filter by Category:
      </label>
      <select
        id="category-filter"
        className="filter-select"
        value={selectedCategory}
        onChange={(e) => onSelectCategory(e.target.value)}
        data-cy="filter"
      >
        {FILTER_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
