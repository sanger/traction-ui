describe('Pacbio library creation from sample', () => {
  it('Visits the pacbio samples url', () => {
    cy.intercept('/v1/pacbio/requests?page[size]=25&page[number]=1', {
      fixture: 'tractionPacbioSamples.json',
    })
    cy.intercept('/v1/pacbio/tag_sets?include=tags', {
      fixture: 'tractionPacbioTagSets.json',
    })
    cy.intercept('/v1/pacbio/libraries?include=tube,primary_aliquot', {
      fixture: 'tractionPacbioLibrary.json',
    })
    cy.visit('#/pacbio/samples')
    cy.get('#samples-table').contains('td', '5')
    cy.get('#samples-table').first().click()
    cy.get('#pacbioLibraryCreate').click()
    cy.get('#tag-set-input').select('Sequel_16_barcodes_v3')
    cy.get('#tag-input').select('bc1001_BAK8A_OA')
    cy.get('#library-volume').type(1)
    cy.get('#library-concentration').type(1)
    cy.get('#library-templatePrepKitBoxBarcode').type('012345678901234567890')
    cy.get('#library-insertSize').type(1)
    cy.get('#create-btn').click()
    cy.contains('Created library with barcode TRAC-2-1465')
  })
})
