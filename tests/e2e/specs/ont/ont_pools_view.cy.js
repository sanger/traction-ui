import OntPoolFactory from '../../../factories/OntPoolFactory.js'
import PrinterFactory from '../../../factories/PrinterFactory.js'

describe('Ont pools view', () => {
  beforeEach(() => {
    cy.withFlags({
      rust_labwhere_service: { enabled: false },
    })
  })
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
  })
})
