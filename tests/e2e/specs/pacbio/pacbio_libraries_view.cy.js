describe('Pacbio Libraries view', () => {
  it('Visits the pacbio libraries url', () => {
    cy.intercept('/v1/pacbio/libraries?include=request,tag,tube,pool', {
      fixture: 'tractionPacbioLibraries.json',
    })
    cy.visit('#/pacbio/libraries')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue')
      .children()
      .should('contain', 'Barcode')
      .and('contain', 'Sample Name')
      .and('contain', 'Source')
    cy.wait(3000)
    cy.get('#library-index').contains('tr', '5')
    cy.get('#id').should('have.length.above', 0)
    cy.get('#sample_name').should('have.length.greaterThan', 0)
    cy.get('#barcode').should('have.length.greaterThan', 0)
    cy.get('#source_identifier').should('have.length.greaterThan', 0)
    cy.get('#volume').should('have.length.greaterThan', 0)
    cy.get('#concentration').should('have.length.greaterThan', 0)
    cy.get('#template_prep_kit_box_barcode').should('have.length.greaterThan', 0)
    cy.get('#insert_size').should('have.length.greaterThan', 0)
  })
})
