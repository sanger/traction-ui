import PrinterFactory from '../../../factories/PrinterFactory.js'
import PacbioPoolFactory from '../../../factories/PacbioPoolFactory.js'

describe('Pacbio Pools view', () => {
  it('Visits the pacbio pools url', () => {
    cy.wrap(PacbioPoolFactory()).as('pacbioPoolFactory')
    cy.get('@pacbioPoolFactory').then((pacbioPoolFactory) => {
      cy.intercept(
        'GET',
        'v1/pacbio/pools?page[size]=25&page[number]=1&include=tube,used_aliquots.tag,used_aliquots.source,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id',
        {
          statusCode: 200,
          body: pacbioPoolFactory.content,
        },
      )
    })

    cy.intercept('POST', '/api/labwares/searches', {
      statusCode: 200,
      body: {
        data: [],
      },
    })

    cy.wrap(PrinterFactory()).as('printerFactory')

    cy.get('@printerFactory').then((printerFactory) => {
      cy.intercept('GET', '/v1/printers', {
        statusCode: 200,
        body: printerFactory.content,
      })
    })

    cy.visit('#/pacbio/pools')

    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue')
      .children()
      .should('contain', 'Pool Barcode')
      .and('contain', 'Sample Name')
    cy.get('#pool-index>tbody').contains('tr', '2')

    // is there a better way? don't want to tie values to fixtures
    cy.get('#id').invoke('text').should('match', /\d+/)
    cy.get('#barcode').invoke('text').should('include', 'TRAC')
    cy.get('#source_identifier').invoke('text').should('match', /\w+/)
    cy.get('#volume').invoke('text').should('match', /\d+/)
    cy.get('#concentration').invoke('text').should('match', /\d+/)
    cy.get('#template_prep_kit_box_barcode').invoke('text').should('match', /\w+/)
    cy.get('#insert_size').invoke('text').should('match', /\d+/)

    //Show details
    cy.get('button[id^="details-btn-"]').first().click()
    cy.get('[id^="details-table-"]').find('tr').its('length').should('be.gt', 1)
  })
})
