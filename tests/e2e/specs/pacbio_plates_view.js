describe('Pacbio plates view', () => {
  it('Visits the pacbio plates url', () => {
    cy.intercept('/v1/pacbio/plates?include=wells.materials', {
      fixture: 'pacbioPlate.json',
    })
    cy.visit('#/pacbio/plates')
    cy.get('#plates-table').contains('td', '1')
    cy.get('#filterInput')
      .clear()
      .type('1')
    cy.get('#input-per-page')
      .clear()
      .type('1')
    cy.get('#infoPlateBtn-1').click()
    cy.get('#closeBtn').click()
  })
})
