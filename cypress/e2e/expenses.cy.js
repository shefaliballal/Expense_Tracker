describe('Expense tracker', () => {
  it('adds expenses and filters by category', () => {
    cy.visit('/');

    // Add Lunch (250, Food)
    cy.get('[data-cy="title"]').type('Lunch');
    cy.get('[data-cy="amount"]').type('250');
    cy.get('[data-cy="category"]').select('Food');
    cy.get('[data-cy="add-expense"]').click();

    // Add Cab (400, Travel)
    cy.get('[data-cy="title"]').type('Cab');
    cy.get('[data-cy="amount"]').type('400');
    cy.get('[data-cy="category"]').select('Travel');
    cy.get('[data-cy="add-expense"]').click();

    // Verify running total across both expenses
    cy.get('[data-cy="total"]').should('contain', '650.00');

    // Filter to Food category
    cy.get('[data-cy="filter"]').select('Food');
    cy.get('[data-cy="expense-item"]').should('have.length', 1);
    cy.get('[data-cy="count"]').should('contain', '1');
    cy.get('[data-cy="total"]').should('contain', '250.00');
  });
});
