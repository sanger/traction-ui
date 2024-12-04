import PacbioPlateFactory from '../../../factories/PacbioPlateFactory.js'

describe('Pacbio plates view', () => {
  it('Visits the pacbio plates url', () => {
    cy.wrap(PacbioPlateFactory()).as('pacbioSinglePlateFactory')
    cy.get('@pacbioSinglePlateFactory').then((pacbioSinglePlateFactory) => {
      cy.intercept(
        'GET',
        'v1/pacbio/plates?filter[barcode]=GEN-1680611780-1&include=wells.requests',
        {
          statusCode: 200,
          body: pacbioSinglePlateFactory.content,
        },
      )
    })
    // When we type 1 into input per page we search for page size 1
    cy.wrap(PacbioPlateFactory()).as('pacbioPlateFactory')
    cy.get('@pacbioPlateFactory').then((pacbioPlateFactory) => {
      cy.intercept('GET', /\/v1\/pacbio\/plates\?page\[size\]=\d+&page\[number\]=\d+/, {
        statusCode: 200,
        body: pacbioPlateFactory.content,
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
    cy.get('[data-status=filled]').should('have.length', 8)
    cy.get('[data-status=empty]').should('have.length', 88)
  })
})
