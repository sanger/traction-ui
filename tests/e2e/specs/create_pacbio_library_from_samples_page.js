describe('Pacbio library creation from sample', () => {
  it('Visits the pacbio samples url', () => {
    cy.intercept('/v1/pacbio/requests', {
      fixture: 'tractionPacbioSamples.json',
    })
    cy.intercept('/v1/tags', {
      fixture: 'tractionTags.json',
    })
    cy.intercept('/v1/pacbio/libraries', {
      fixture: 'tractionPacbioLibraries.json',
    })
    cy.visit('#/pacbio/samples')
    cy.get('#samples-table').contains('td', '5')
    cy.get('#samples-table')
      .first()
      .click()
    cy.get('#pacbioLibraryCreate').click()
    cy.get('#tag-input').select('bc1001_BAK8A_OA')
    cy.get('#input-1').type(1)
    cy.get('#input-2').type(1)
    cy.get('#input-3').type('barcode')
    cy.get('#input-4').type(1)
    cy.get('#create-btn').click()
    cy.contains('Created library with barcode TRAC-1')
  })
})
