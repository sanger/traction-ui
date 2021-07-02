describe('Pacbio Pool Create', () => {
  it('Creates a pool successfully', () => {
    cy.intercept('/v1/pacbio/tag_sets?include=tags', {
      fixture: 'tractionPacbioTagSets.json',
    })

    cy.intercept('/v1/pacbio/plates?include=wells.requests', {
      fixture: 'pacbioPlatesRequest.json',
    })

    cy.visit('#/pacbio/pool/new')
    cy.contains('Pool')
    // select a plate(s)
    // scan a plate(s)
    // plates should appear in the plates views
    // select the samples from the plate for the pool
    // samples should appear in the pool
    // and samples that have failed qc should not be selectable
    // TODO: Is this brittle? Need to know the data.
    cy.get('[data-type=tag-set-list]').select('IsoSeq_v1')
    cy.get('[data-attribute=group-id]').should('have.length', 24)
    // the tags should appear underneath the tag set name
    // add the tags to the samples in the pool
    // add the template prep kit box barcode to all of the samples
    // Add the volume for each sample in the pool
    // Add the concentration for each sample in the pool
    // Add the fragment size for each sample in the pool
    // Click the create library button
    // Should see a message 'library successfully created'
  })

  it('Will not create a pool if it is not valid', () => {
    // visit the pooling page
    // select a plate(s)
    // scan a plate(s)
    // plates should appear in the plates views
    // select the samples from the plate for the pool
    // samples should appear in the pool
    // and samples that have failed qc should not be selectable
    // select the tag set
    // the tags should appear underneath the tag set name
    // add the tags to all of the samples in the pool except one
    // add the template prep kit box barcode to all of the samples
    // Add the volume for each sample in the pool
    // Add the concentration for each sample in the pool
    // Add the fragment size for each sample in the pool
    // Click the create library button
    // Should see a message 'All samples in a pool must have a tag'
  })
})
