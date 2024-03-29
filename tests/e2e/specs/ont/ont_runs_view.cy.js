describe('ONT Runs view', () => {
  it('Visits the ont runs url', () => {
    cy.intercept('/v1/ont/runs?page[size]=25&page[number]=1&include=instrument', {
      fixture: 'tractionOntRuns.json',
    })
    cy.visit('#/ont/runs')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue').children().should('contain', 'State').and('contain', 'Experiment ID')

    cy.get('#run-index').contains('tr', '5')
    cy.get('#id').invoke('text').should('match', /\d+/)
    cy.get('#experiment_name').invoke('text').should('include', 'ONTRUN-')
    cy.get('#state').invoke('text').should('match', /\w+/)
    cy.get('#instrument_name').invoke('text').should('match', /\w+/)
    cy.get('#created_at').invoke('text').should('match', /\d+/)
    cy.get('#actions').invoke('text').should('include', 'Edit').and('include', 'Sample Sheet')
  })
})
