// https://docs.cypress.io/api/introduction/api.html

describe('Visit Batch Pooling Page', () => {
  it('Visits the batch pooling page', () => {
    cy.visit('/batch-pooling')
    cy.contains('Batch Pooling')
  })
})
