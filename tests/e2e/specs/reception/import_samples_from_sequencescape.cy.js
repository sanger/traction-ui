import SequencescapeLabwareFactory from '../../../factories/SequencescapeLabwareFactory.js'

const sequencescapeRequest = {
  url: '/api/v2/labware*',
  query: {
    'filter[barcode]': 'DN9000002A,NT1O',
    include: 'receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study',
    'fields[plates]': 'labware_barcode,receptacles,retention_instruction',
    'fields[tubes]': 'labware_barcode,receptacles,retention_instruction',
    'fields[aliquots]': 'study,library_type,sample',
    'fields[receptacles]': 'aliquots',
    'fields[sample_metadata]': 'sample_common_name',
    'fields[samples]': 'sample_metadata,name,uuid',
    'fields[studies]': 'uuid',
    'fields[wells]': 'position,aliquots',
  },
}

describe('Import samples from Sequencescape', () => {
  beforeEach(() => {
    cy.intercept('v1/library_types?fields[library_types]=name,pipeline', {
      fixture: 'tractionLibraryTypes.json',
    })
  })
  describe('Successfully - V2', () => {
    beforeEach(() => {
      cy.visit('#/reception')
      cy.get('[data-type="source-list"]').select('Sequencescape')

      cy.get('#workflowSelect').select('Pacbio -20 samples')
      cy.get('#userCode').type('usercodeX')
      cy.contains('Scan barcodes')
      cy.get('#cost_code').type('aCostCodeExample')
      cy.get('[data-attribute=estimate_of_gb_required]').type('3')
      cy.intercept(sequencescapeRequest, {
        statusCode: 200,
        body: SequencescapeLabwareFactory().content,
      })
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
    })
    it('successfully import to traction and scanning in to labWhere', () => {
      cy.intercept('POST', '/api/scans', {
        statusCode: 201,
        body: {
          message: 'SE108532I successfully stored in LRT006 Draw 1',
        },
      })
      cy.get('#barcodes').type('DN9000002A\nNT1O\n')
      cy.contains('Import 2 labware into PacBio from Sequencescape')
      cy.contains('The imported labware will be scanned into LRT006 Draw 1')
      cy.get('[data-action="import-labware"]').click()
      cy.contains('DN9000002A imported from Sequencescape')
      cy.contains('NT1O imported from Sequencescape')
      cy.contains('SE108532I successfully stored in LRT006 Draw 1')
    })

    it('successfully import to traction but fails to scan in to labWhere', () => {
      cy.intercept('POST', '/api/scans', {
        statusCode: 422,
        errors: ['Failed to access LabWhere'],
      })
      cy.get('#barcodes').type('DN9000002A\nNT1O\n')
      cy.contains('Import 2 labware into PacBio from Sequencescape')
      cy.contains('The imported labware will be scanned into LRT006 Draw 1')
      cy.get('[data-action="import-labware"]').click()
      cy.contains('DN9000002A imported from Sequencescape')
      cy.contains('NT1O imported from Sequencescape')
      cy.contains('Failed to access LabWhere')
    })
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
    cy.get('#workflowSelect').select('Pacbio -20 samples')
    cy.get('#userCode').type('usercodeX')
    cy.contains('Import 0 labware into PacBio from Sequencescape')
    cy.get('[data-action="import-labware"]').click()
    // TODO: We might need to change the error if it causes issues.
    cy.contains('No labware to import')
  })

  it('Unsuccessfully - when there is an error from traction', () => {
    cy.visit('#/reception')
    cy.contains('Scan barcodes')
    cy.get('#workflowSelect').select('Pacbio -20 samples')
    cy.get('#userCode').type('usercodeX')
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
    cy.contains('The imported labware will be scanned into LRT006 Draw 1')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('There was an error.')
  })
})
