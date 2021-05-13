// https://docs.cypress.io/api/introduction/api.html

describe('Import samples from Samples extraction', () => {
  it('Visits the app root url', () => {
    cy.visit('#/pacbio/reception')
    cy.contains('Barcodes:')
    cy.get('#barcodes').type('DE1')
    cy.intercept('/api/v1/assets?filter[barcode]=DE1', { fixture: 'sampleExtractionTubesWithSample.json' })
    cy.intercept('/v1/pacbio/requests', {fixture: 'tractionPacbioSamples.json'})
    cy.get('#findSampleExtractionTubes').click()
  })
})
