describe('Expense tracker - Delete flow', () => {
  it('deletes an expense and updates count and total', () => {
    cy.visit('/');

    // Add an item to delete
    cy.get('[data-cy="title"]').type('Grocery Shopping');
    cy.get('[data-cy="amount"]').type('1250.75');
    cy.get('[data-cy="category"]').select('Food');
    cy.get('[data-cy="add-expense"]').click();

    cy.get('[data-cy="expense-item"]').should('have.length', 1);
    cy.get('[data-cy="total"]').should('contain', '1250.75');
    cy.get('[data-cy="count"]').should('contain', '1');

    // Click delete
    cy.get('[data-cy="delete-expense"]').click();

    // Verify row is removed and stats reset
    cy.get('[data-cy="expense-item"]').should('not.exist');
    cy.get('[data-cy="total"]').should('contain', '0.00');
    cy.get('[data-cy="count"]').should('contain', '0');
  });
});
