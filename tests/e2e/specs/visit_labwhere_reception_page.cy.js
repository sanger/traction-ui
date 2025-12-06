import PacbioLibraryFactory from '../../factories/PacbioLibraryFactory.js'

describe('Labware Reception page', () => {
  const labwhereUrl = Cypress.env('VITE_LABWHERE_BASE_URL')

  beforeEach(() => {
    cy.withFlags({
      rust_labwhere_service: { enabled: false },
    })
    cy.visit('#/labwhere-reception')
  })

  it('Shows the correct components', () => {
    cy.contains('User barcode or swipecard')
    cy.contains('Location barcode')
    cy.contains('Start position')
    cy.contains('Barcodes')
    cy.contains('Summary')
    cy.get('#userCode').should('exist')
    cy.get('#locationBarcode').should('exist')
    cy.get('#labware_barcodes').should('exist')
    cy.get('#submit-button').should('exist')
    cy.get('#reset-button').should('exist')
  })

  it('displays success when POST request is successful', () => {
    cy.get('#userCode').type('user123')
    cy.get('#locationBarcode').type('location123')
    cy.get('#labware_barcodes').type('barcode1\nbarcode2')

    cy.intercept('POST', `${labwhereUrl}/api/scans`, {
      statusCode: 201,
      body: {
        message: 'barcode1, barcode2 successfully stored in location123',
      },
    }).as('storeBarcodes')

    cy.get('#submit-button').click()

    cy.wait('@storeBarcodes').its('response.statusCode').should('eq', 201)
    cy.contains('barcode1, barcode2 successfully stored in location123')
  })

  it('exhausts samples when scanning to a destroyed location ', () => {
    cy.get('#userCode').type('user123')
    cy.get('#locationBarcode').type('lw-destroyed-217')
    cy.get('#labware_barcodes').type('barcode1\nbarcode2')
    const pacbioLibraryFactory = PacbioLibraryFactory()

    cy.wrap(pacbioLibraryFactory).as('pacbioLibraryFactory')
    cy.get('@pacbioLibraryFactory').then((pacbioLibraryFactory) => {
      cy.intercept('/v1/pacbio/libraries?filter[barcode]=barcode1,barcode2&include=request,tag', {
        statusCode: 200,
        body: pacbioLibraryFactory.content,
      })
      cy.intercept('PATCH', '/v1/pacbio/libraries/722', {
        statusCode: 200,
        body: {
          data: {},
        },
      })
    })
    cy.intercept('POST', `${labwhereUrl}/api/scans`, {
      statusCode: 201,
      body: {
        message: 'barcode1, barcode2 successfully stored in location123',
      },
    }).as('storeBarcodes')

    cy.get('#submit-button').click()

    cy.wait('@storeBarcodes').its('response.statusCode').should('eq', 201)
    cy.contains(
      'barcode1, barcode2 successfully stored in location123 and sample volumes have been exhausted for 1 library',
    )
  })

  it('displays error when POST is unsuccessful', () => {
    cy.get('#userCode').type('user123')
    cy.get('#locationBarcode').type('location123')
    cy.get('#labware_barcodes').type('barcode1\nbarcode2')

    cy.intercept('POST', `${labwhereUrl}/api/scans`, {
      statusCode: 422,
      body: {
        success: false,
        errors: ['Failed to store barcodes'],
        data: {},
      },
    }).as('storeBarcodes')

    cy.get('#submit-button').click()

    cy.wait('@storeBarcodes').its('response.statusCode').should('eq', 422)
    cy.contains('Failed to store barcodes')
  })
})
