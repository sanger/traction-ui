// https://docs.cypress.io/api/introduction/api.html

describe('Import samples from Samples extraction, for Pacbio', () => {
  it('Successfully', () => {
    cy.visit('#/reception')
    cy.clickMenuItem('Samples Extraction')
    cy.contains('Scan Barcodes')
    cy.get('#barcodes').type('SE108532I')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      fixture: 'sampleExtractionTubesWithSample.json',
    })
    cy.intercept('POST', '/v1/receptions', { fixture: 'tractionPacbioRequest.json' }).as(
      'postPayload',
    )
    cy.get('button').contains('Import 1 labware from Samples Extraction').click()
    cy.contains('Imported 1 request from Samples Extraction')
  })

  it('Unsuccessfully - When tubes are missing', () => {
    cy.visit('#/reception')
    cy.clickMenuItem('Samples Extraction')
    cy.contains('Scan Barcodes')
    cy.get('#barcodes').type('SE108532I SE108533J')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I,SE108533J', {
      fixture: 'sampleExtractionTubesWithSample.json',
    })
    cy.intercept('POST', '/v1/receptions', { fixture: 'tractionPacbioRequest.json' }).as(
      'postPayload',
    )
    cy.get('button').contains('Import 2 labware from Samples Extraction').click()
    cy.contains('Error: Labware could not be retrieved from Samples Extraction: SE108533J')
  })

  it('Unsuccessfully - When traction errors', () => {
    cy.visit('#/reception')
    cy.clickMenuItem('Samples Extraction')
    cy.contains('Scan Barcodes')
    cy.get('#barcodes').type('SE108532I')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      fixture: 'sampleExtractionTubesWithSample.json',
    })
    cy.intercept('/v1/receptions', {
      statusCode: 422,
      body: { errors: [{ title: 'receptions', detail: 'There was an error.' }] },
    })
    cy.get('button').contains('Import 1 labware from Samples Extraction').click()
    cy.contains('There was an error.')
  })
})
