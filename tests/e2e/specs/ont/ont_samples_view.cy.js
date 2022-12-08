describe('Ont samples view', () => {
  it('Visits the ont samples url', () => {
    cy.intercept('/v1/ont/requests', {
      fixture: 'tractionOntRequests.json',
    })
    cy.visit('#/ont/samples')
    cy.get('#samples-table').contains('tr', '5')
    cy.get('.sample')
      .first()
      .within(() => {
        cy.get('.id').should('have.length.greaterThan', 0)
        cy.get('.source_identifier').should('have.length.greaterThan', 0)
        cy.get('.sample_name').should('have.length.greaterThan', 0)
        cy.get('.source_identifier').should('have.length.greaterThan', 0)
        cy.get('.library_type').should('have.length.greaterThan', 0)
        cy.get('.data_type').should('have.length.greaterThan', 0)
        cy.get('.number_of_flowcells').should('have.length.greaterThan', 0)
        cy.get('.cost_code').should('have.length.greaterThan', 0)
        cy.get('.external_study_id').should('have.length.greaterThan', 0)
        cy.get('.created_at').should('have.length.greaterThan', 0)
      })
  })
})
