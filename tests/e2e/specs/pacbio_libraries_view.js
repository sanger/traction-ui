describe('Pacbio Libraries view', () => {
  it('Visits the pacbio libraries url', () => {
    cy.intercept('/v1/pacbio/libraries?include=request,tag.tag_set,tube', {
      fixture: 'tractionPacbioLibraries.json',
    })
    cy.visit('#/pacbio/libraries')
    cy.get('#libraries').contains('tr', '5')
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
        cy.get('.fragment-size').should('have.length.greaterThan', 0)
      })
  })
})
