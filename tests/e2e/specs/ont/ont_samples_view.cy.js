describe('Ont samples view', () => {
  it('Visits the ont samples url', () => {
    cy.intercept('/v1/ont/requests?page[size]=25&page[number]=1', {
      fixture: 'tractionOntRequests.json',
    })
    cy.visit('#/ont/samples')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue')
      .children()
      .should('contain', 'Sample ID (Request)')
      .and('contain', 'Sample name')
      .and('contain', 'Source barcode')

    cy.get('#samples-table').find('tr').should('have.length', '7')
    cy.get('#id').should('have.length.greaterThan', 0)
    cy.get('#source_identifier').should('have.length.greaterThan', 0)
    cy.get('#sample_name').should('have.length.greaterThan', 0)
    cy.get('#source_identifier').should('have.length.greaterThan', 0)
    cy.get('#library_type').should('have.length.greaterThan', 0)
    cy.get('#data_type').should('have.length.greaterThan', 0)
    cy.get('#number_of_flowcells').should('have.length.greaterThan', 0)
    cy.get('#cost_code').should('have.length.greaterThan', 0)
    cy.get('#external_study_id').should('have.length.greaterThan', 0)
    cy.get('#created_at').should('have.length.greaterThan', 0)
  })
})
