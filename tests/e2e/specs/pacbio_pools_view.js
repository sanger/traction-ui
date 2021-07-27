describe('Pacbio Pools view', () => {
  it('Visits the pacbio pools url', () => {
    cy.intercept('/v1/pacbio/pools?include=tube,libraries.request,libraries.tag', {
      fixture: 'tractionPacbioPools.json',
    })
    cy.visit('#/pacbio/pools')
    cy.get('#pool-index').contains('tr', '5')
    cy.get('.pool')
      .first()
      .within(() => {
        // is there a better way? don't want to tie values to fixtures
        cy.get('.pool-id').should('have.length.greaterThan', 0)
        cy.get('.barcode').should('have.length.greaterThan', 0)
        cy.get('.source-identifier').should('have.length.greaterThan', 0)
        cy.get('.volume').should('have.length.greaterThan', 0)
        cy.get('.concentration').should('have.length.greaterThan', 0)
        cy.get('.template-prep-kit-box-barcode').should('have.length.greaterThan', 0)
        cy.get('.fragment-size').should('have.length.greaterThan', 0)
      })
  })
})
