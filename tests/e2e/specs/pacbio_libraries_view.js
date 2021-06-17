describe('Pacbio Libraries view', () => {
  it('Visits the pacbio libraries url', () => {
    cy.intercept('/v1/pacbio/libraries?include=request,tag.tag_set,tube', {
      fixture: 'tractionPacbioLibraries.json',
    })
    cy.visit('#/pacbio/libraries')
    cy.get('#libraries').contains('tr', '5')
    cy.get('.library').first()
    cy.get('.library-id').should('not.be.empty')
    cy.get('.sample-name').should('not.be.empty')
    cy.get('.barcode').should('not.be.empty')
    cy.get('.source').should('not.be.empty')
    cy.get('.volume').should('not.be.empty')
    cy.get('.concentration').should('not.be.empty')
    cy.get('.template-prep-kit-box-barcode').should('not.be.empty')
    cy.get('.fragment-size').should('not.be.empty')
  })
})
