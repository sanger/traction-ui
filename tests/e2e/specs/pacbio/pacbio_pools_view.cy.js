import PrinterFactory from '../../../factories/PrinterFactory.js'
import PacbioPoolFactory from '../../../factories/PacbioPoolFactory.js'

describe('Pacbio Pools view', () => {
  it('Visits the pacbio pools url', () => {
    cy.wrap(PacbioPoolFactory()).as('pacbioPoolFactory')
    cy.get('@pacbioPoolFactory').then((pacbioPoolFactory) => {
      cy.intercept(
        'GET',
        'v1/pacbio/pools?page[size]=25&page[number]=1&include=used_aliquots.tag,used_aliquots.source,libraries.request&fields[requests]=sample_name&fields[tags]=group_id',
        {
          statusCode: 200,
          body: pacbioPoolFactory.content,
        },
      )
    })

    // Stub labwhere request
    cy.get('@pacbioPoolFactory')
      .then((pacbioPoolFactory) => {
        const labwhereUrl = Cypress.env('VITE_LABWHERE_BASE_URL')
        cy.intercept(`${labwhereUrl}/api/labwares/searches`, {
          statusCode: 200,
          body: [
            {
              barcode: pacbioPoolFactory.content.data[0].attributes.barcode,
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

    // Handle location column separately due to labwhere request stub
    cy.wait('@labwhereRequest').its('response.statusCode').should('eq', 200)
    // Currently these tables have invalid HTML (multiple elements with same ID)
    // so we have to use 'td#location' instead of '#location' to get all matching table cells
    cy.get('td#location').should('have.length.greaterThan', 0)
    cy.get('td#location').last().should('contain', 'box-test')

    //Show details
    cy.get('button[id^="details-btn-"]').first().click()
    cy.get('[id^="details-table-"]').find('tr').its('length').should('be.gt', 1)
  })
})
