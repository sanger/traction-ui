describe('Pacbio Libraries view', () => {
  it('Visits the pacbio libraries url', () => {
    cy.intercept('/v1/pacbio/runs?include=plate.wells.libraries', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.visit('#/pacbio/runs')
    cy.get('#runs').contains('tr', '5')
    cy.get('.run')
      .first()
      .within(() => {
        cy.get('.run-id').should('have.length.greaterThan', 0)
        cy.get('.name').should('have.length.greaterThan', 0)
        cy.get('.state').should('have.length.greaterThan', 0)
        cy.get('.binding-kit-box-barcode').should('have.length.greaterThan', 0)
        cy.get('.sequencing-kit-box-barcode').should('have.length.greaterThan', 0)
        cy.get('.dna-control-complex-box-barcode').should('have.length.greaterThan', 0)
        cy.get('.system-name').should('have.length.greaterThan', 0)
      })
  })
})
