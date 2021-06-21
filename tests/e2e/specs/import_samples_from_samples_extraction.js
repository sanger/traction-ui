// https://docs.cypress.io/api/introduction/api.html

describe('Import samples from Samples extraction', () => {
  it('Successfully', () => {
    cy.visit('#/pacbio/reception')
    cy.contains('Barcodes:')
    cy.get('#barcodes').type('SE108532I')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      fixture: 'sampleExtractionTubesWithSample.json',
    })
    cy.intercept('/v1/pacbio/requests', { fixture: 'tractionPacbioSample.json' })
    cy.get('#findSampleExtractionTubes').click()
    cy.contains('Samples have been created with barcodes: SE108532I')
  })

  it('Unsuccessfully', () => {
    cy.visit('#/pacbio/reception')
    cy.contains('Barcodes:')
    cy.get('#barcodes').type('SE108532I')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      fixture: 'sampleExtractionTubesWithSample.json',
    })
    cy.intercept('/v1/pacbio/requests', {
      statusCode: 422,
      body: { data: { errors: { error1: ['There was an error.'] } } },
    })
    cy.get('#findSampleExtractionTubes').click()
    cy.contains('Failed to create samples: error1 There was an error.')
  })
})
