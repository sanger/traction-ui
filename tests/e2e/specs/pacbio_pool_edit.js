describe('Pacbio Pool Edit', () => {
  beforeEach(() => {
    cy.intercept('/v1/pacbio/tag_sets?include=tags', {
      fixture: 'tractionPacbioTagSets.json',
    })

    cy.intercept('/v1/pacbio/plates?include=wells.requests', {
      fixture: 'pacbioPlatesRequest.json',
    })
  })

  it('Updates a pool successfully', () => {
    // when I visit the pools page
    // and I click on edit pool
    // I should see the pool barcode
    // and the plate
    // and the correct tag set
    // and I update the template prep kit bix barcode
    // and I update the volume
    // and I update the concentration
    // and I update the insert size
    // and I click on update pool
    // I should see pool successfully updated
  })

  it('Will not update a pool if there is an error', () => {
  // when I visit the pools page
    // and I click on edit pool
    // I should see the pool barcode
    // and the plate
    // and the correct tag set
    // and I remove the insert size
    // and I click on update pool
    // I should see pool not valid
  })
})
