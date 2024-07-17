import PacbioPlatesRequestFactory from '../../../factories/PacbioPlatesRequestFactory.js'

describe('Pacbio plates view', () => {
  it('Visits the pacbio plates url', () => {
    cy.intercept('v1/pacbio/plates?filter[barcode]=DN1&include=wells.requests', {
      fixture: 'pacbioPlateWithWellsRequest.json',
    })
    // When we type 1 into input per page we search for page size 1
    cy.wrap(PacbioPlatesRequestFactory()).as('pacbioPlateRequestFactory')
    cy.get('@pacbioPlateRequestFactory').then((pacbioPlateRequestFactory) => {
      cy.intercept('GET', '/v1/pacbio/plates?page[size]=1&page[number]=1', {
        statusCode: 200,
        body: pacbioPlateRequestFactory.content,
      })
      cy.intercept('/v1/pacbio/plates?page[size]=25&page[number]=1', {
        statusCode: 200,
        body: pacbioPlateRequestFactory.content,
      })
    })

    cy.visit('#/pacbio/plates')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue').children().should('contain', 'Barcode')
    cy.get('#plate-index').contains('td', '1')
    cy.get('#filterInput').clear().type('1')
    cy.get('#input-per-page').clear().type('1')
    cy.get('#details-btn-1').click()
    cy.get('ellipse').should('have.length', 96)
    cy.get('[data-status=filled]').should('have.length', 2)
    cy.get('[data-status=empty]').should('have.length', 94)
  })
})
