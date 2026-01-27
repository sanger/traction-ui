import PrinterFactory from '../../../factories/PrinterFactory.js'
import LibraryTypeFactory from '../../../factories/LibraryTypeFactory.js'

describe('Import samples from Mocked plates', () => {
  beforeEach(() => {
    cy.wrap(LibraryTypeFactory()).as('libraryTypeFactory')
    cy.get('@libraryTypeFactory').then((libraryTypeFactory) => {
      cy.intercept('GET', 'v1/library_types', {
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
    cy.get('[data-type="source-list"]').select('Mocked plates')
  })

  describe('Successfully', () => {
    beforeEach(() => {
      cy.contains('Scan barcodes')
      cy.get('#cost_code').type('aCostCodeExample')

      cy.get('[data-attribute=estimate_of_gb_required]').type('3')
      cy.intercept('POST', '/v1/receptions', {
        body: {
          data: {
            attributes: {
              labware: {
                MockPlate1: { imported: 'success' },
              },
            },
          },
        },
      })
    })

    it('successfully import to traction and scanning in to labWhere', () => {
      const labwhereUrl = Cypress.env('VITE_LABWHERE_BASE_URL')
      cy.intercept('GET', `${labwhereUrl}/api/locations/mocked-location-123`, {
        statusCode: 200,
        body: {
          barcode: 'mocked-location-123',
          name: 'Mocked Location',
        },
      })

      cy.intercept('POST', `${labwhereUrl}/api/scans`, {
        statusCode: 201,
        body: {
          message: 'MockPlate1 successfully stored in Mocked Location',
        },
      })

      // Scan into custom location
      cy.get('#workflowSelect').select('Custom Location')
      cy.get('[data-attribute="custom-location-barcode-input"]').type('mocked-location-123')
      cy.get('#userCode').type('usercodeX')

      // Wait 500ms to allow debounce location search function to be called and validate input
      cy.wait(500)

      cy.get('#barcodes').type('MockPlate1\n')
      cy.contains('Import 1 labware into PacBio from Mocked plates')
      cy.contains('The imported labware will be scanned into Mocked Location')
      cy.get('[data-action="import-labware"]').click()
      cy.contains('MockPlate1 imported from Mocked plates')
      cy.contains('MockPlate1 successfully stored in Mocked Location')
    })

    it('successfully imports to traction but does not scan in to labWhere when a bad custom location is provided', () => {
      const labwhereUrl = Cypress.env('VITE_LABWHERE_BASE_URL')
      cy.intercept('GET', `${labwhereUrl}/api/locations/bad-location`, {
        statusCode: 200,
        body: null,
      })

      // Scan into custom location that doesnt exist
      cy.get('#workflowSelect').select('Custom Location')
      cy.get('[data-attribute="custom-location-barcode-input"]').type('bad-location')
      cy.get('#userCode').type('usercodeX')

      // Wait 500ms to allow debounce location search function to be called and validate input
      cy.wait(500)

      cy.get('#barcodes').type('MockPlate1\n')
      cy.contains('Import 1 labware into PacBio from Mocked plates')
      cy.contains('No location selected to scan into')
      cy.get('[data-action="import-labware"]').click()
      cy.contains('MockPlate1 imported from Mocked plates')
      cy.contains('Failed to access LabWhere')
    })

    it('successfully import to traction but fails to scan in to labWhere when labwhere errors', () => {
      const labwhereUrl = Cypress.env('VITE_LABWHERE_BASE_URL')
      cy.intercept('POST', `${labwhereUrl}/api/scans`, {
        statusCode: 422,
        errors: ['Failed to access LabWhere'],
      })
      cy.intercept('GET', `${labwhereUrl}/api/locations/mocked-location-123`, {
        statusCode: 200,
        body: {
          barcode: 'mocked-location-123',
          name: 'Mocked Location',
        },
      })

      // Scan into custom location that doesnt exist
      cy.get('#workflowSelect').select('Custom Location')
      cy.get('[data-attribute="custom-location-barcode-input"]').type('mocked-location-123')
      cy.get('#userCode').type('usercodeX')

      // Wait 500ms to allow debounce location search function to be called and validate input
      cy.wait(500)

      cy.get('#barcodes').type('MockPlate1\n')
      cy.contains('Import 1 labware into PacBio from Mocked plates')
      cy.contains('The imported labware will be scanned into Mocked Location')
      cy.get('[data-action="import-labware"]').click()
      cy.contains('MockPlate1 imported from Mocked plates')
      cy.contains('Failed to access LabWhere')
    })
  })
})
