describe('ONT Runs view', () => {
  it('Visits the ont runs url', () => {
    cy.intercept('/v1/ont/runs?include=instrument', {
      fixture: 'tractionOntRuns.json',
    })
    cy.visit('#/ont/runs')
    cy.get('#run-index').contains('tr', '5')
    cy.get('.run')
      .first()
      .within(() => {
        cy.get('.run-id').invoke('text').should('match', /\d+/)
        cy.get('.experiment-name').invoke('text').should('include', 'ONTRUN-')
        cy.get('.state').invoke('text').should('match', /\w+/)
        cy.get('.instrument-name').invoke('text').should('match', /\w+/)
        cy.get('.created-at').invoke('text').should('match', /\d+/)
        cy.get('.actions').invoke('text').should('include', 'Edit').and('include', 'Sample Sheet')
      })
  })
})
