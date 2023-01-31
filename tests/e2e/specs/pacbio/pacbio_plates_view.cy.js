describe('Pacbio plates view', () => {
  it('Visits the pacbio plates url', () => {
    cy.intercept('/v1/pacbio/plates?include=wells.requests', {
      fixture: 'pacbioPlatesRequest.json',
    })
    cy.visit('#/pacbio/plates')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue').children().should('contain', 'Barcode')
    cy.get('#plate-index').contains('td', '1')
    cy.get('#filterInput').clear().type('1')
    cy.get('#input-per-page').clear().type('1')
    cy.get('#details-btn-62').click()
    cy.get('.plate').find('ellipse').should('have.length', 96)
    cy.get('ellipse.filled').should('have.length', 2)
    cy.get('ellipse.empty').should('have.length', 94)
  })
})
