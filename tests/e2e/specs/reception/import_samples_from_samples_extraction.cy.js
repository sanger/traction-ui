import SamplesExtractionLabwareFactory from '../../../factories/SamplesExtractionLabwareFactory.js'

describe('Import samples from Samples extraction, for Pacbio', () => {
  beforeEach(() => {
    cy.intercept('v1/library_types?fields[library_types]=name,pipeline', {
      fixture: 'tractionLibraryTypes.json',
    })
    cy.intercept('v1/data_types?fields[data_types]=name,pipeline', {
      fixture: 'tractionDataTypes.json',
    })
  })
  it('Successfully - v2', () => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Samples Extraction')
    cy.contains('Scan barcodes')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      statusCode: 200,
      body: SamplesExtractionLabwareFactory().content,
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
    cy.get('#barcodes').type('SE108532I\n')
    cy.contains('Import 1 labware into PacBio from Samples Extraction')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('SE108532I imported from Samples Extraction')
  })

  it('Unsuccessfully - When tubes are missing', () => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Samples Extraction')
    cy.contains('Scan barcodes')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I,SE108533J', {
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

    cy.get('#barcodes').type('SE108532I\nSE108533J\n')
    cy.contains('Import 1 labware into PacBio from Samples Extraction')
    cy.get('[data-action="import-labware"]').click()
    // TODO: we might need to change the message if something is missing
    cy.contains('SE108532I imported from Samples Extraction')
  })

  it('Unsuccessfully - When traction errors', () => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Samples Extraction')
    cy.contains('Scan barcodes')
    cy.get('[data-type="pipeline-list"]').select('ONT')
    cy.intercept('/api/v1/assets?filter[barcode]=SE108532I', {
      statusCode: 200,
      body: SamplesExtractionLabwareFactory().content,
    })
    cy.intercept('/v1/receptions', {
      statusCode: 422,
      body: { errors: [{ title: 'receptions', detail: 'There was an error.' }] },
    })
    cy.get('#barcodes').type('SE108532I\n')
    cy.contains('Import 1 labware into ONT from Samples Extraction')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('There was an error.')
  })
})
