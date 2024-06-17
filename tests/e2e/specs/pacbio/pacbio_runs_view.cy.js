import PacbioSmrtLinkVersionFactory from '../../../factories/PacbioSmrtLinkVersionFactory'

describe('Pacbio Runs view', () => {
  it('Visits the pacbio runs url', () => {
    cy.intercept('/v1/pacbio/runs?page[size]=25&page[number]=1&include=plates', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.intercept('GET', '/v1/pacbio/smrt_link_versions', {
      statusCode: 200,
      body: PacbioSmrtLinkVersionFactory().content,
    })
    cy.visit('#/pacbio/runs')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue').children().and('contain', 'Name')
    cy.get('#run-index').contains('tr', '5')
    cy.get('#startRun-12')
    cy.get('#editRun-12')
    cy.get('#generate-sample-sheet-12')
    cy.get('#run-index')
      .first()
      .within(() => {
        cy.get('#id').should('have.length.greaterThan', 0)
        cy.get('#name').should('have.length.greaterThan', 0)
        cy.get('#state').should('have.length.greaterThan', 0)
        cy.get('#sequencing_kit_box_barcodes').should('have.length.greaterThan', 0)
        cy.get('#dna_control_complex_box_barcode').should('have.length.greaterThan', 0)
        cy.get('#system_name_and_version').find('.badge').should('have.length.greaterThan', 0)
      })
  })
})
