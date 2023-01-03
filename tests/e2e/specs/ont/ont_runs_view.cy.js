describe('ONT Runs view', () => {
  it('Visits the ont runs url', () => {
    cy.intercept('/v1/ont/runs', {
      fixture: 'tractionOntRuns.json',
    })
    cy.visit('#/ont/runs')
    cy.get('#run-index').contains('tr', '5')
    cy.get('.run')
      .first()
      .within(() => {
        cy.get('.run-id').should('have.length.greaterThan', 0)
        cy.get('.name').should('have.length.greaterThan', 0)
        cy.get('.state').should('have.length.greaterThan', 0)
        cy.get('.instrument-name').should('have.length.greaterThan', 0)
      })
  })
})
