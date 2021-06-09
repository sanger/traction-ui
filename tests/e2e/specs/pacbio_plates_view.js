describe('Pacbio plates view', () => {
  it('Visits the pacbio plates url', () => {
    cy.intercept('/v1/pacbio/plates?include=wells.materials', {
      fixture: 'pacbioPlates.json',
    })
    cy.visit('#/pacbio/plates')
    cy.get('#plates-table').contains('td', '1')
    cy.get('#filterInput')
      .clear()
      .type('1')
    cy.get('#input-per-page')
      .clear()
      .type('1')
    cy.get('#details-btn-1').click()
    cy.get('.plate')
      .find('ellipse')
      .should('have.length', 96)
    cy.get('ellipse.filled').should('have.length', 1)
    cy.get('ellipse.empty').should('have.length', 95)
  })
})
