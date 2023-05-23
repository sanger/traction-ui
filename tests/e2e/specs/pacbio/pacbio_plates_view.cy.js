describe('Pacbio plates view', () => {
  beforeEach(() =>
    cy.withFlags({
      enable_custom_table: { enabled: true },
      enable_custom_form: { enabled: true },
    }),
  )
  it('Visits the pacbio plates url', () => {
    cy.intercept('v1/pacbio/plates?filter[barcode]=DN1&include=wells.requests', {
      fixture: 'pacbioPlateWithWellsRequest.json',
    })
    cy.intercept('/v1/pacbio/plates', {
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
    cy.get('#details-btn-1').click()
    cy.get('.plate').find('ellipse').should('have.length', 96)
    cy.get('ellipse.filled').should('have.length', 2)
    cy.get('ellipse.empty').should('have.length', 94)
  })
})
