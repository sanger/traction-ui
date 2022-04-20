// https://docs.cypress.io/api/introduction/api.html

describe('Import samples from Samples extraction, for Saphyr', () => {
  it('Successfully', () => {
    cy.visit('#/saphyr/reception')
    cy.contains('Barcodes:')
    cy.get('#barcodes').type('SE108532I')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      fixture: 'sampleExtractionTubesWithSample.json',
    })
    cy.intercept('/v1/saphyr/requests', { fixture: 'tractionPacbioSample.json' })
    cy.get('#findSampleExtractionTubes').click()
    cy.contains('Samples have been created with barcodes: SE108532I')
  })

  it('Failed on Samples extraction request', () => {
    cy.visit('#/saphyr/reception')
    cy.contains('Barcodes:')
    cy.get('#barcodes').type('SE108532I')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      fixture: 'sampleExtractionTubesWithSample.json',
    })
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      statusCode: 422,
      body: { data: [] },
    })
    cy.get('#findSampleExtractionTubes').click()
    cy.contains('Sample Extraction tubes failed to be imported')
  })

  it('Failed on Traction requests creation', () => {
    cy.visit('#/saphyr/reception')
    cy.contains('Barcodes:')
    cy.get('#barcodes').type('SE108532I')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      fixture: 'sampleExtractionTubesWithSample.json',
    })
    cy.intercept('/v1/saphyr/requests', {
      statusCode: 422,
      body: { data: { errors: { error1: ['is invalid'], error2: ["can't be blank"] } } },
    })
    cy.get('#findSampleExtractionTubes').click()
    cy.contains("error1 is invalid, error2 can't be blank")
  })
})
