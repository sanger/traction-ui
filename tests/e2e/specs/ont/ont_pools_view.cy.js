import OntPoolFactory from '../../../factories/OntPoolFactory.js'
import PrinterFactory from '../../../factories/PrinterFactory.js'

describe('Ont pools view', () => {
  it('Visits the ont pools url', () => {
    cy.wrap(OntPoolFactory()).as('ontPoolFactory')
    cy.get('@ontPoolFactory').then((ontPoolFactory) => {
      cy.intercept(
        'v1/ont/pools?page[size]=25&page[number]=1&include=tube,libraries.tag,libraries.request',
        {
          statusCode: 200,
          body: ontPoolFactory.content,
        },
      )
    })
    cy.wrap(PrinterFactory()).as('printerFactory')
    cy.get('@printerFactory').then((printerFactory) => {
      cy.intercept('GET', '/v1/printers', {
        statusCode: 200,
        body: printerFactory.content,
      })
    })

    // Stub labwhere request
    cy.get('@ontPoolFactory').then((ontPoolFactory) => {
      const labwhereUrl = Cypress.env('VITE_LABWHERE_BASE_URL')
      cy.intercept(`${labwhereUrl}/api/labwares/searches`, {
        statusCode: 200,
        body: [
          {
            barcode: ontPoolFactory.content.data[0].attributes.tube_barcode,
            created_at: 'Tuesday September 16 2025 10:29',
            updated_at: 'Tuesday September 16 2025 10:29',
            location: {
              id: 432,
              name: 'box-test',
            },
          },
        ],
      })
    })

    cy.visit('#/ont/pools')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue')
      .children()
      .should('contain', 'Barcode')
      .and('contain', 'Pool ID')
      .and('contain', 'Sample Name')
    cy.get('#pool-index').find('tr').should('have.length', '16')
    cy.get('[data-attribute=id]').first().invoke('text').should('match', /\d+/)
    cy.get('[data-attribute=barcode]').first().invoke('text').should('include', 'TRAC')
    cy.get('[data-attribute=source_identifier]').first().invoke('text').should('match', /\w+/)
    cy.get('[data-attribute=volume]').first().invoke('text').should('match', /\d+/)
    cy.get('[data-attribute=concentration]').first().invoke('text').should('match', /\d+/)
    cy.get('[data-attribute=kit_barcode]').first().invoke('text').should('match', /\w+/)
    cy.get('[data-attribute=insert_size]').first().invoke('text').should('match', /\d+/)
    cy.get('[data-attribute=final_library_amount]').first().invoke('text').should('match', /\d+/)

    // Handle location column separately to confirm labwhere call is working
    cy.get('[data-attribute=location]').first().should('contain', 'box-test')
  })
})
