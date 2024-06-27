import SequencescapeLabwareFactory from '../../../factories/SequencescapeLabwareFactory.js'

const sequencescapeRequest =
  '/api/v2/labware?filter[barcode]=DN9000002A,NT1O&include=receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study&fields[plates]=labware_barcode,receptacles&fields[tubes]=labware_barcode,receptacles&fields[wells]=position,aliquots&fields[receptacles]=aliquots&fields[samples]=sample_metadata,name,uuid&fields[sample_metadata]=sample_common_name&fields[studies]=uuid&fields[aliquots]=study,library_type,sample'

describe('Import samples from Sequencescape', () => {
  beforeEach(() => {
    cy.intercept('v1/library_types?fields[library_types]=name,pipeline', {
      fixture: 'tractionLibraryTypes.json',
    })
  })

  it('Successfully - V2', () => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Sequencescape')
    cy.contains('Scan barcodes')
    cy.get('#cost_code').type('aCostCodeExample')
    cy.get('[data-attribute=estimate_of_gb_required]').type('3')
    cy.intercept(
      {
        url: '/api/v2/labware*',
        query: {
          'filter[barcode]': 'DN9000002A,NT1O',
          include: 'receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study',
          'fields[plates]': 'labware_barcode,receptacles',
          'fields[tubes]': 'labware_barcode,receptacles',
          'fields[aliquots]': 'study,library_type,sample',
          'fields[receptacles]': 'aliquots',
          'fields[sample_metadata]': 'sample_common_name',
          'fields[samples]': 'sample_metadata,name,uuid',
          'fields[studies]': 'uuid',
          'fields[wells]': 'position,aliquots',
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
    cy.get('#barcodes').type('DN9000002A\nNT1O\n')
    cy.contains('Import 2 labware into PacBio from Sequencescape')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('DN9000002A imported from Sequencescape')
    cy.contains('NT1O imported from Sequencescape')
  })

  // TODO - we need to change this to a warning.
  it('Unsuccessfully - when the plates do not exist', () => {
    cy.visit('#/reception')
    cy.contains('Scan barcodes')
    cy.intercept(sequencescapeRequest, {
      statusCode: 200,
      body: { data: [] },
    })
    cy.get('#barcodes').type('DN9000002A\nNT1O')
    cy.contains('Import 0 labware into PacBio from Sequencescape')
    cy.get('[data-action="import-labware"]').click()
    // TODO: We might need to change the error if it causes issues.
    cy.contains('No labware to import')
  })

  it('Unsuccessfully - when there is an error from traction', () => {
    cy.visit('#/reception')
    cy.contains('Scan barcodes')
    cy.intercept(sequencescapeRequest, {
      statusCode: 200,
      body: SequencescapeLabwareFactory().content,
    })
    cy.intercept('/v1/receptions', {
      statusCode: 422,
      body: { errors: [{ title: 'receptions', detail: 'There was an error.' }] },
    })
    cy.get('#barcodes').type('DN9000002A\nNT1O\n')
    cy.contains('Import 2 labware into PacBio from Sequencescape')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('There was an error.')
  })
})
