import SequencescapeLabwareFactory from '../../../factories/SequencescapeLabwareFactory.js'

describe('Import samples from Sequencescape Tubes', () => {
  beforeEach(() => {
    cy.intercept('v1/library_types?fields[library_types]=name,pipeline', {
      fixture: 'tractionLibraryTypes.json',
    })

    cy.intercept('/v1/printers', {
      fixture: 'tractionPrinters.json',
    })
  })

  it('Successfully - V2', () => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Sequencescape Tubes')
    cy.contains('Scan barcodes')
    cy.get('#cost_code').type('aCostCodeExample')
    cy.get('[data-attribute=estimate_of_gb_required]').type('3')
    cy.intercept(
      {
        url: '/api/v2/labware*',
        query: {
          'filter[barcode]': '3980000001795',
          include: 'receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study',
          'fields[tubes]': 'labware_barcode,receptacles',
          'fields[aliquots]': 'study,library_type,sample',
          'fields[receptacles]': 'aliquots',
          'fields[sample_metadata]': 'sample_common_name',
          'fields[samples]': 'sample_metadata,name,uuid',
          'fields[studies]': 'uuid',
        },
      },
      {
        statusCode: 200,
        body: SequencescapeLabwareFactory().content,
      },
    )
    cy.intercept('POST', '/v1/receptions', {
      body: {
        data: {
          attributes: {
            labware: {
              DN9000002A: { imported: 'success' },
              NT1O: { imported: 'success' },
            },
          },
        },
      },
    })
    cy.get('#barcodes').type('3980000001795\n')
    cy.contains('Import 1 labware into PacBio from Sequencescape Tubes')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('DN9000002A imported from Sequencescape')
    cy.contains('NT1O imported from Sequencescape')
  })

  it('Unsuccessfully - when the tubes do not exist', () => {
    cy.visit('#/reception')
    cy.contains('Scan barcodes')
    cy.get('[data-type="source-list"]').select('Sequencescape Tubes')
    cy.intercept(
      {
        url: '/api/v2/labware*',
        query: {
          'filter[barcode]': 'NT10',
          include: 'receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study',
          'fields[tubes]': 'labware_barcode,receptacles',
          'fields[aliquots]': 'study,library_type,sample',
          'fields[receptacles]': 'aliquots',
          'fields[sample_metadata]': 'sample_common_name',
          'fields[samples]': 'sample_metadata,name,uuid',
          'fields[studies]': 'uuid',
        },
      },
      {
        statusCode: 200,
        body: { data: [] },
      },
    )
    cy.get('#barcodes').type('NT10\n')
    cy.contains('Import 0 labware into PacBio from Sequencescape Tubes')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('No labware to import')
  })

  it('Unsuccessfully - when there is an error from traction', () => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Sequencescape Tubes')
    cy.contains('Scan barcodes')
    cy.intercept(
      {
        url: '/api/v2/labware*',
        query: {
          'filter[barcode]': '3980000001795',
          include: 'receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study',
          'fields[tubes]': 'labware_barcode,receptacles',
          'fields[aliquots]': 'study,library_type,sample',
          'fields[receptacles]': 'aliquots',
          'fields[sample_metadata]': 'sample_common_name',
          'fields[samples]': 'sample_metadata,name,uuid',
          'fields[studies]': 'uuid',
        },
      },
      {
        statusCode: 200,
        body: SequencescapeLabwareFactory().content,
      },
    )
    cy.intercept('/v1/receptions', {
      statusCode: 422,
      body: { errors: [{ title: 'receptions', detail: 'There was an error.' }] },
    })
    cy.get('#barcodes').type('3980000001795\n')
    cy.contains('Import 1 labware into PacBio from Sequencescape Tubes')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('There was an error.')
  })
})
