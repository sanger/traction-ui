// https://docs.cypress.io/api/introduction/api.html

describe('Import samples from Samples extraction, for Pacbio', () => {
  beforeEach(() => {
    cy.intercept('v1/library_types?fields[library_types]=name,pipeline', {
      fixture: 'tractionLibraryTypes.json',
    })
    cy.intercept('v1/data_types?fields[data_types]=name,pipeline', {
      fixture: 'tractionDataTypes.json',
    })
    cy.withFlags({
      enable_custom_alert: { enabled: true },
    })
  })

  it('Successfully', () => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Samples Extraction')
    cy.contains('Scan barcodes')
    cy.get('#barcodes').type('SE108532I')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      fixture: 'sampleExtractionTubesWithSample.json',
    })
    cy.intercept('POST', '/v1/receptions', { fixture: 'tractionPacbioRequest.json' }).as(
      'postPayload',
    )
    cy.contains('Import 1 labware into PacBio from Samples Extraction')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('Imported 1 request from Samples Extraction')
  })

  it('Unsuccessfully - When tubes are missing', () => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Samples Extraction')
    cy.contains('Scan barcodes')
    cy.get('#barcodes').type('SE108532I SE108533J')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I,SE108533J', {
      fixture: 'sampleExtractionTubesWithSample.json',
    })
    cy.intercept('POST', '/v1/receptions', { fixture: 'tractionPacbioRequest.json' }).as(
      'postPayload',
    )
    cy.contains('Import 2 labware into PacBio from Samples Extraction')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('Error: Labware could not be retrieved from Samples Extraction: SE108533J')
  })

  it('Unsuccessfully - When traction errors', () => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Samples Extraction')
    cy.contains('Scan barcodes')
    cy.get('[data-type="pipeline-list"]').select('ONT')
    cy.get('#barcodes').type('SE108532I')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      fixture: 'sampleExtractionTubesWithSample.json',
    })
    cy.intercept('/v1/receptions', {
      statusCode: 422,
      body: { errors: [{ title: 'receptions', detail: 'There was an error.' }] },
    })
    cy.contains('Import 1 labware into ONT from Samples Extraction')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('There was an error.')
  })
})
