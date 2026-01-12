// https://docs.cypress.io/api/introduction/api.html
import MultiPoolFactory from '../../factories/MultiPoolFactory.js'

describe('Visit Flexible Pooling Page', () => {
  beforeEach(() => {
    cy.withFlags({
      flexible_pooling: { enabled: true },
    })

    cy.wrap(MultiPoolFactory()).as('multiPoolFactory')

    cy.get('@multiPoolFactory').then((multiPoolFactory) => {
      cy.intercept('/v1/multi_pools?page[size]=25&page[number]=1', {
        statusCode: 200,
        body: multiPoolFactory.content,
      })
    })
  })

  it('Visits the Flexible Pooling page', () => {
    cy.visit('#/flexible-pooling')
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue').children().should('contain', 'Pipeline').and('contain', 'Pool method')
  })
})
