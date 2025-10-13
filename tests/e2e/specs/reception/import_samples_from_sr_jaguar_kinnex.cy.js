import SRJaguarKinnexFactory from '../../../factories/SRJaguarKinnexFactory.js'
import PrinterFactory from '../../../factories/PrinterFactory.js'
import LibraryTypeFactory from '../../../factories/LibraryTypeFactory.js'

describe('Import samples from SR Jaguar Kinnex', () => {
  beforeEach(() => {
    cy.wrap(LibraryTypeFactory()).as('libraryTypeFactory')
    cy.get('@libraryTypeFactory').then((libraryTypeFactory) => {
      cy.intercept('GET', 'v1/library_types?fields[library_types]=name,pipeline', {
        statusCode: 200,
        body: libraryTypeFactory.content,
      })
    })

    cy.wrap(PrinterFactory()).as('printerFactory')
    cy.get('@printerFactory').then((printerFactory) => {
      cy.intercept('GET', '/v1/printers', {
        statusCode: 200,
        body: printerFactory.content,
      })
    })

    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('SR Jaguar Kinnex')
  })
  describe('Importing samples from SR Jaguar Kinnex - Success', () => {
    beforeEach(() => {
      cy.get('#workflowSelect').select('Pacbio -20 samples')
      cy.get('#userCode').type('usercodeX')

      cy.contains('Scan barcodes')
      cy.get('#cost_code').type('aCostCodeExample')

      cy.get('[data-attribute=estimate_of_gb_required]').type('3')
      cy.intercept(
        {
          url: '/api/v2/labware*',
          query: {
            'filter[barcode]': '3980000067791',
            include: 'receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study',
            'fields[tubes]': 'labware_barcode,receptacles',
            'fields[aliquots]': 'study,library_type,sample',
            'fields[receptacles]': 'aliquots',
            'fields[sample_metadata]':
              'sample_common_name,supplier_name,donor_id,date_of_sample_collection',
            'fields[samples]': 'sample_metadata,name,uuid',
            'fields[studies]': 'uuid',
          },
        },
        {
          statusCode: 200,
          body: SRJaguarKinnexFactory().content,
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
    })
    it('successfully import to traction and scanning in to labWhere', () => {
      cy.intercept('POST', '/api/scans', {
        statusCode: 201,
        body: {
          message: 'NT1O successfully stored in LRT006 Draw 1',
        },
      })
      cy.get('#barcodes').type('3980000067791\n')
      cy.contains('Import 1 labware into PacBio from SR Jaguar Kinnex')
      cy.contains('The imported labware will be scanned into LRT006 Draw 1')
      cy.get('[data-action="import-labware"]').click()
      cy.contains('DN9000002A imported from SR Jaguar Kinnex')
      cy.contains('NT1O imported from SR Jaguar Kinnex')
      cy.contains('NT1O successfully stored in LRT006 Draw 1')
    })

    it('successfully import to traction but fails to scan in to labWhere', () => {
      cy.intercept('POST', '/api/scans', {
        statusCode: 422,
        errors: ['Failed to access LabWhere'],
      })
      cy.get('#barcodes').type('3980000067791\n')
      cy.contains('Import 1 labware into PacBio from SR Jaguar Kinnex')
      cy.contains('The imported labware will be scanned into LRT006 Draw 1')
      cy.get('[data-action="import-labware"]').click()
      cy.contains('DN9000002A imported from SR Jaguar Kinnex')
      cy.contains('NT1O imported from SR Jaguar Kinnex')
      cy.contains('Failed to access LabWhere')
    })
  })

  it('Unsuccessfully - when the tubes do not exist', () => {
    cy.contains('Scan barcodes')
    cy.intercept(
      {
        url: '/api/v2/labware*',
        query: {
          'filter[barcode]': 'NT10',
          include: 'receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study',
          'fields[tubes]': 'labware_barcode,receptacles',
          'fields[aliquots]': 'study,library_type,sample',
          'fields[receptacles]': 'aliquots',
          'fields[sample_metadata]':
            'sample_common_name,supplier_name,donor_id,date_of_sample_collection',
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
    cy.contains('Import 0 labware into PacBio from SR Jaguar Kinnex')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('No labware to import')
  })

  it('Unsuccessfully - when there is an error from traction', () => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('SR Jaguar Kinnex')
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
          'fields[sample_metadata]':
            'sample_common_name,supplier_name,donor_id,date_of_sample_collection',
          'fields[samples]': 'sample_metadata,name,uuid',
          'fields[studies]': 'uuid',
        },
      },
      {
        statusCode: 200,
        body: SRJaguarKinnexFactory().content,
      },
    )
    cy.intercept('/v1/receptions', {
      statusCode: 422,
      body: { errors: [{ title: 'receptions', detail: 'There was an error.' }] },
    })
    cy.get('#barcodes').type('3980000001795\n')
    cy.contains('Import 1 labware into PacBio from SR Jaguar Kinnex')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('There was an error.')
  })
})
