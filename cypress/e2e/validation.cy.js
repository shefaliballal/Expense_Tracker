describe('Expense tracker - Input validation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('rejects an empty title and does not add a row', () => {
    cy.get('[data-cy="amount"]').type('300');
    cy.get('[data-cy="category"]').select('Bills');
    cy.get('[data-cy="add-expense"]').click();

    cy.get('[data-cy="error-message"]').should('be.visible').and('contain', 'Title is required');
    cy.get('[data-cy="expense-item"]').should('not.exist');
    cy.get('[data-cy="count"]').should('contain', '0');
    cy.get('[data-cy="total"]').should('contain', '0.00');
  });

  it('rejects a negative amount and does not add a row', () => {
    cy.get('[data-cy="title"]').type('Refund Test');
    cy.get('[data-cy="amount"]').type('-50');
    cy.get('[data-cy="category"]').select('Other');
    cy.get('[data-cy="add-expense"]').click();

    cy.get('[data-cy="error-message"]').should('be.visible').and('contain', 'Amount must be greater than 0');
    cy.get('[data-cy="expense-item"]').should('not.exist');
    cy.get('[data-cy="count"]').should('contain', '0');
  });

  it('rejects amounts exceeding 1,00,000', () => {
    cy.get('[data-cy="title"]').type('Expensive Equipment');
    cy.get('[data-cy="amount"]').type('150000');
    cy.get('[data-cy="add-expense"]').click();

    cy.get('[data-cy="error-message"]').should('be.visible').and('contain', 'Amounts over 1,00,000 are rejected');
    cy.get('[data-cy="expense-item"]').should('not.exist');
  });
});
