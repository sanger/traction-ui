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
    cy.get('#library-index').contains('tr', '5')
    cy.get('.library')
      .first()
      .within(() => {
        // is there a better way? don't want to tie values to fixtures
        cy.get('.library-id').should('have.length.greaterThan', 0)
        cy.get('.sample-name').should('have.length.greaterThan', 0)
        cy.get('.barcode').should('have.length.greaterThan', 0)
        cy.get('.source-identifier').should('have.length.greaterThan', 0)
        cy.get('.volume').should('have.length.greaterThan', 0)
        cy.get('.concentration').should('have.length.greaterThan', 0)
        cy.get('.template-prep-kit-box-barcode').should('have.length.greaterThan', 0)
        cy.get('.insert-size').should('have.length.greaterThan', 0)
      })
  })
})
