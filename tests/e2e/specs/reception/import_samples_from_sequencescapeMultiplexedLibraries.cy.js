import SequencescapeMultiplexedLibraryFactory from '../../../factories/SequencescapeMultiplexedLibraryFactory'
import PrinterFactory from '../../../factories/PrinterFactory.js'
import OntTagSetFactory from '../../../factories/OntTagSetFactory.js'

describe('Import samples from Sequencescape Multiplexed Libraries', () => {
  beforeEach(() => {
    cy.intercept('v1/library_types?fields[library_types]=name,pipeline', {
      fixture: 'tractionLibraryTypes.json',
    })

    cy.wrap(PrinterFactory()).as('printerFactory')
    cy.get('@printerFactory').then((printerFactory) => {
      cy.intercept('GET', '/v1/printers', {
        statusCode: 200,
        body: printerFactory.content,
      })
    })

    cy.wrap(OntTagSetFactory()).as('ontTagSetFactory')
    cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
      cy.intercept('GET', '/v1/ont/tag_sets', {
        statusCode: 200,
        body: ontTagSetFactory.content,
      })
    })

    cy.intercept('v1/data_types?fields[data_types]=name,pipeline', {
      fixture: 'tractionDataTypes.json',
    })

    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
      features: {
        kinnex_sample_reception: { enabled: true },
      },
    })
  })
  describe('Successfully - V2', () => {
    beforeEach(() => {
      cy.visit('#/reception')
      cy.get('[data-type="source-list"]').select('Sequencescape Multiplexed Libraries')
      cy.get('#workflowSelect').select('ONT -20 samples')
      cy.get('#userCode').type('usercodeX')
      cy.contains('Scan barcodes')
      cy.get('#cost_code').type('aCostCodeExample')
      cy.get('[data-attribute=number-of-flowcells-input]').type('3')
      cy.intercept(
        {
          url: '/api/v2/labware*',
          query: {
            'filter[barcode]': '3980000042705',
            include:
              'receptacles.aliquots.library.aliquots.sample.sample_metadata,receptacles.aliquots.library.aliquots.study,receptacles.aliquots.library.aliquots,receptacles.aliquots.library.labware.receptacles',
            'fields[tubes]': 'labware_barcode,receptacles',
            'fields[labware]': 'labware_barcode,receptacles',
            'fields[aliquots]': 'study,library_type,sample,insert_size_to,tag_oligo',
            'fields[receptacles]': 'aliquots',
            'fields[sample_metadata]': 'sample_common_name,volume,concentration',
            'fields[samples]': 'sample_metadata,name,uuid',
            'fields[studies]': 'uuid',
          },
        },
        {
          statusCode: 200,
          body: SequencescapeMultiplexedLibraryFactory().content,
        },
      )
      cy.intercept('POST', '/v1/receptions', {
        body: {
          data: {
            attributes: {
              labware: {
                NT42F: { imported: 'success' },
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
          message: 'SE108532I successfully stored in LRT020 Draw 1',
        },
      })
      cy.get('#barcode').type('3980000042705\n')
      cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
        cy.get('[data-type=tag-set-list').select(ontTagSetFactory.storeData.selected.tagSet.name)
      })
      cy.contains('Import 1 labware into ONT from Sequencescape Multiplexed Libraries')
      cy.contains('The imported labware will be scanned into LRT020 Draw 1')
      cy.get('[data-action="import-labware"]').click()
      cy.contains('NT42F imported from Sequencescape')
      cy.contains('SE108532I successfully stored in LRT020 Draw 1')
    })

    it('successfully import to traction but fails to scan in to labWhere', () => {
      cy.intercept('POST', '/api/scans', {
        statusCode: 422,
        errors: ['Failed to access LabWhere'],
      })
      cy.get('#barcode').type('3980000042705\n')
      cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
        cy.get('[data-type=tag-set-list').select(ontTagSetFactory.storeData.selected.tagSet.name)
      })
      cy.contains('Import 1 labware into ONT from Sequencescape Multiplexed Libraries')
      cy.contains('The imported labware will be scanned into LRT020 Draw 1')
      cy.get('[data-action="import-labware"]').click()
      cy.contains('NT42F imported from Sequencescape')
      cy.contains('Failed to access LabWhere')
    })
  })

  it('Unsuccessfully - when the libraries do not exist', () => {
    cy.visit('#/reception')
    cy.contains('Scan barcodes')
    cy.get('[data-type="source-list"]').select('Sequencescape Multiplexed Libraries')
    cy.intercept(
      {
        url: '/api/v2/labware*',
        query: {
          'filter[barcode]': 'NT42F',
          include:
            'receptacles.aliquots.library.aliquots.sample.sample_metadata,receptacles.aliquots.library.aliquots.study,receptacles.aliquots.library.aliquots,receptacles.aliquots.library.labware.receptacles',
          'fields[tubes]': 'labware_barcode,receptacles',
          'fields[labware]': 'labware_barcode,receptacles',
          'fields[aliquots]': 'study,library_type,sample,insert_size_to,tag_oligo',
          'fields[receptacles]': 'aliquots',
          'fields[sample_metadata]': 'sample_common_name,volume,concentration',
          'fields[samples]': 'sample_metadata,name,uuid',
          'fields[studies]': 'uuid',
        },
      },
      {
        statusCode: 200,
        body: { data: [] },
      },
    )
    cy.get('#barcode').type('NT42F\n')
    cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
      cy.get('[data-type=tag-set-list').select(ontTagSetFactory.storeData.selected.tagSet.name)
    })
    cy.contains('Import 0 labware into ONT from Sequencescape Multiplexed Libraries')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('No labware to import')
  })

  it('Unsuccessfully - when there is an error from traction', () => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Sequencescape Multiplexed Libraries')
    cy.contains('Scan barcodes')
    cy.intercept(
      {
        url: '/api/v2/labware*',
        query: {
          'filter[barcode]': '3980000042705',
          include:
            'receptacles.aliquots.library.aliquots.sample.sample_metadata,receptacles.aliquots.library.aliquots.study,receptacles.aliquots.library.aliquots,receptacles.aliquots.library.labware.receptacles',
          'fields[tubes]': 'labware_barcode,receptacles',
          'fields[labware]': 'labware_barcode,receptacles',
          'fields[aliquots]': 'study,library_type,sample,insert_size_to,tag_oligo',
          'fields[receptacles]': 'aliquots',
          'fields[sample_metadata]': 'sample_common_name,volume,concentration',
          'fields[samples]': 'sample_metadata,name,uuid',
          'fields[studies]': 'uuid',
        },
      },
      {
        statusCode: 200,
        body: SequencescapeMultiplexedLibraryFactory().content,
      },
    )
    cy.intercept('/v1/receptions', {
      statusCode: 422,
      body: { errors: [{ title: 'receptions', detail: 'There was an error.' }] },
    })
    cy.get('#barcode').type('3980000042705\n')
    cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
      cy.get('[data-type=tag-set-list').select(ontTagSetFactory.storeData.selected.tagSet.name)
    })
    cy.contains('Import 1 labware into ONT from Sequencescape Multiplexed Libraries')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('There was an error.')
  })
})
