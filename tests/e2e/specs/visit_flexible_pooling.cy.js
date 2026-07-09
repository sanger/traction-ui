// https://docs.cypress.io/api/introduction/api.html
import MultiPoolFactory from '../../factories/MultiPoolFactory.js'

describe('Visit Flexible Pooling Page', () => {
  beforeEach(() => {
    cy.wrap(MultiPoolFactory.all()).as('multiPoolFactory')

    cy.get('@multiPoolFactory').then((multiPoolFactory) => {
      cy.intercept('/v1/multi_pools?page[size]=25&page[number]=1', {
        statusCode: 200,
        body: multiPoolFactory.content,
      })
    })

    cy.get('@multiPoolFactory').then((multiPoolFactory) => {
      const id = multiPoolFactory.storeData.resources.ids[0]
      const singlePoolFactory = MultiPoolFactory.withSubPools(id)
      cy.intercept(`v1/multi_pools/${id}?include=multi_pool_positions.pacbio_pool`, {
        statusCode: 200,
        body: singlePoolFactory.content,
      })
    })
  })

  it('Visits the Flexible Pooling page', () => {
    cy.visit('#/flexible-pooling')
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue')
      .children()
      .should('contain', 'Pipeline')
      .and('contain', 'Pool method')
      .and('contain', 'Pool barcode')

    cy.get('@multiPoolFactory').then((multiPoolFactory) => {
      cy.get('#multipools-table')
        .find('tr')
        .should('have.length', multiPoolFactory.content.data.length + 1)
    })
    // Define an array of all column keys
    const columnKeys = ['id', 'pipeline', 'pool_method', 'number_of_pools', 'created_at']
    // Iterate over the column IDs and verify each has a length greater than 0
    columnKeys.forEach((columnKey) => {
      cy.get(`[data-attribute=${columnKey}]`).first().should('have.length.greaterThan', 0)
    })

    //show details of first miltipool
    cy.get('#multipools-table').within(() => {
      cy.get('@multiPoolFactory').then((multiPoolFactory) => {
        const id = multiPoolFactory.storeData.resources.ids[0]
        cy.get('#details-btn-' + id).click()
        cy.get(`[data-list='subpools-${id}']`).find('tr').should('have.length.greaterThan', 0)
      })
    })
  })
})
