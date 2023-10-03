// https://docs.cypress.io/api/introduction/api.html

describe('Import samples from Samples extraction, for Pacbio', () => {
  beforeEach(() => {
    cy.intercept('v1/library_types?fields[library_types]=name,pipeline', {
      fixture: 'tractionLibraryTypes.json',
    })
    cy.intercept('v1/data_types?fields[data_types]=name,pipeline', {
      fixture: 'tractionDataTypes.json',
    })
  })

  it('Successfully - v1', () => {
    // TODO: remove once dpl_877_reception_request is enabled by default
    cy.withFlags({
      dpl_877_reception_request: { enabled: false },
    })
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
    cy.contains('Imported 1 labware(s) from Samples Extraction')
  })

  it('Successfully - v2', () => {
    // TODO: remove once dpl_877_reception_request is enabled by default
    cy.withFlags({
      dpl_877_reception_request: { enabled: true },
    })
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Samples Extraction')
    cy.contains('Scan barcodes')
    cy.get('#barcodes').type('SE108532I')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      fixture: 'sampleExtractionTubesWithSample.json',
    })
    cy.intercept('POST', '/v1/receptions', {
      body: {
        data: {
          attributes: {
            labware: {
              SE108532I: { imported: 'success' },
            },
          },
        },
      },
    })
    cy.contains('Import 1 labware into PacBio from Samples Extraction')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('SE108532I imported from Samples Extraction')
  })

  // TODO - we need to change this to a warning.
  it('Unsuccessfully - When tubes are missing', () => {
    // TODO: remove once dpl_877_reception_request is enabled by default
    cy.withFlags({
      dpl_877_reception_request: { enabled: false },
    })
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
    // TODO: we might need to change the message if something is missing
    cy.contains('Imported 1 labware(s) from Samples Extraction')
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
