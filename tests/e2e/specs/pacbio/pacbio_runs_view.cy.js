import PacbioSmrtLinkVersionFactory from '../../../factories/PacbioSmrtLinkVersionFactory.js'
import PacbioRunFactory from '../../../factories/PacbioRunFactory.js'

describe('Pacbio Runs view', () => {
  beforeEach(() => {
    cy.wrap(PacbioSmrtLinkVersionFactory()).as('pacbioSmrtLinkVersionFactory')
    cy.wrap(PacbioRunFactory()).as('pacbioRunFactory')
  })

  it('Visits the pacbio runs url', () => {
    cy.get('@pacbioRunFactory').then((pacbioRunFactory) => {
      cy.intercept('GET', '/v1/pacbio/runs?page[size]=25&page[number]=1', {
        statusCode: 200,
        body: pacbioRunFactory.content,
      })
    })
    cy.get('@pacbioSmrtLinkVersionFactory').then((pacbioSmrtLinkVersionFactory) => {
      cy.intercept('GET', '/v1/pacbio/smrt_link_versions', {
        statusCode: 200,
        body: pacbioSmrtLinkVersionFactory.content,
      })
    })
    cy.visit('#/pacbio/runs')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue').children().and('contain', 'Name')
    cy.get('@pacbioRunFactory').then((pacbioRunFactory) => {
      cy.get('#run-index').contains('tr', Object.values(pacbioRunFactory.storeData.runs).length)
      const run = pacbioRunFactory.storeData.getRunByState('started')
      cy.get(`#completeRun-${run.id}`)
      cy.get(`#editRun-${run.id}`)
      cy.get(`#generate-sample-sheet-${run.id}`)
    })
    cy.get('#run-index')
      .first()
      .within(() => {
        cy.get('[data-attribute=id]').should('have.length.greaterThan', 0)
        cy.get('[data-attribute=name]').should('have.length.greaterThan', 0)
        cy.get('[data-attribute=state]').should('have.length.greaterThan', 0)
        cy.get('[data-attribute=sequencing_kit_box_barcodes]').should('have.length.greaterThan', 0)
        cy.get('[data-attribute=dna_control_complex_box_barcode]').should(
          'have.length.greaterThan',
          0,
        )
        cy.get('[data-attribute=system_name_and_version]')
          .find('.badge')
          .should('have.length.greaterThan', 0)
        cy.get('[data-attribute=adaptive_loading]').should('exist')
      })
  })
})
