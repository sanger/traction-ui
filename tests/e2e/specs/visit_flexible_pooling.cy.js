// https://docs.cypress.io/api/introduction/api.html

describe('Visit Flexible Pooling Page', () => {
  it('Visits the flexible pooling page', () => {
    cy.visit('/flexible-pooling')
    cy.contains('Flexible Pooling')
  })
})
