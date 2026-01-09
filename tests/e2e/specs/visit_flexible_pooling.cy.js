// https://docs.cypress.io/api/introduction/api.html

describe('Visit Flexible Pooling Page', () => {
  beforeEach(() => {
    cy.withFlags({
      flexible_pooling: { enabled: true },
    })
  })

  it('Visits the Flexible Pooling page', () => {
    cy.visit('/flexible-pooling')
    cy.contains('Flexible Pooling')
  })
})
