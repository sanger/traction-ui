describe('Pacbio Runs view', () => {
  it('Visits the pacbio runs url', () => {
    cy.intercept('/v1/pacbio/runs?include=plate.wells.pools.tube', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.visit('#/pacbio/runs')
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
