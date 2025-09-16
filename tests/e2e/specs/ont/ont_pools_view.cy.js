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
    cy.get('@ontPoolFactory')
      .then((ontPoolFactory) => {
        const labwhereUrl = Cypress.env('VITE_LABWHERE_BASE_URL')
        console.log(ontPoolFactory.content)
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
      .as('labwhereRequest')

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
    cy.get('#id').invoke('text').should('match', /\d+/)
    cy.get('#barcode').invoke('text').should('include', 'TRAC')
    cy.get('#source_identifier').invoke('text').should('match', /\w+/)
    cy.get('#volume').invoke('text').should('match', /\d+/)
    cy.get('#concentration').invoke('text').should('match', /\d+/)
    cy.get('#kit_barcode').invoke('text').should('match', /\w+/)
    cy.get('#insert_size').invoke('text').should('match', /\d+/)
    cy.get('#final_library_amount').invoke('text').should('match', /\d+/)

    // Handle location column separately due to labwhere request stub
    cy.wait('@labwhereRequest').its('response.statusCode').should('eq', 200)
    // Currently these tables have invalid HTML (multiple elements with same ID)
    // so we have to use 'td#location' instead of '#location' to get all matching table cells
    cy.get('td#location').should('have.length.greaterThan', 0)
    cy.get('td#location').first().should('contain', 'box-test')
  })
})
