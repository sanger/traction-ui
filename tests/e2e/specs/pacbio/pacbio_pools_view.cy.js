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

    cy.get('[data-attribute=id]').first().invoke('text').should('match', /\d+/)
    cy.get('[data-attribute=barcode]').first().invoke('text').should('include', 'TRAC')
    cy.get('[data-attribute=source_identifier]').first().invoke('text').should('match', /\w+/)
    cy.get('[data-attribute=volume]').first().invoke('text').should('match', /\d+/)
    cy.get('[data-attribute=concentration]').first().invoke('text').should('match', /\d+/)
    cy.get('[data-attribute=template_prep_kit_box_barcode]')
      .first()
      .invoke('text')
      .should('match', /\w+/)
    cy.get('[data-attribute=insert_size]').first().invoke('text').should('match', /\d+/)

    // Handle location column separately due to confirm labwhere call is working
    cy.get('[data-attribute=location]').last().should('contain', 'box-test')

    //Show details
    cy.get('button[id^="details-btn-"]').first().click()
    cy.get('[id^="details-table-"]').find('tr').its('length').should('be.gt', 1)
  })
})
