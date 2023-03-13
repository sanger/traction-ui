describe('ONT Runs view', () => {
  beforeEach(() => {
    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
      features: {
        dpl_281_ont_create_sequencing_runs: { enabled: true },
        enable_custom_table: { enabled: true },
        dpl_279_ont_libraries_and_pools: { enabled: true },
      },
    })
  })

  it('Visits the ont runs url', () => {
    cy.intercept('/v1/ont/runs?include=instrument', {
      fixture: 'tractionOntRuns.json',
    })
    cy.visit('#/ont/runs')
    cy.get('#run-index').contains('tr', '5')
    cy.get('#id').invoke('text').should('match', /\d+/)
    cy.get('#experiment_name').invoke('text').should('include', 'ONTRUN-')
    cy.get('#state').invoke('text').should('match', /\w+/)
    cy.get('#instrument_name').invoke('text').should('match', /\w+/)
    cy.get('#created_at').invoke('text').should('match', /\d+/)
    cy.get('#actions').invoke('text').should('include', 'Edit').and('include', 'Sample Sheet')
  })
})
