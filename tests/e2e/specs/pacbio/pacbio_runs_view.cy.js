describe('Pacbio Runs view', () => {
  it('Visits the pacbio runs url', () => {
    cy.intercept('/v1/pacbio/runs', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.visit('#/pacbio/runs')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue').children().should('contain', 'Run ID').and('contain', 'Name')
    cy.get('#run-index').contains('tr', '5')
    cy.get('#startRun-7')
    cy.get('#completeRun-7')
    cy.get('#editRun-7')
    cy.get('#cancelRun-7')
    cy.get('#generate-sample-sheet-7')
    cy.get('.run')
      .first()
      .within(() => {
        cy.get('.run-id').should('have.length.greaterThan', 0)
        cy.get('.name').should('have.length.greaterThan', 0)
        cy.get('.state').should('have.length.greaterThan', 0)
        cy.get('.sequencing-kit-box-barcode').should('have.length.greaterThan', 0)
        cy.get('.dna-control-complex-box-barcode').should('have.length.greaterThan', 0)
        cy.get('.system-name').should('have.length.greaterThan', 0)
      })
  })
})
