describe('Labware Reception page', () => {
  beforeEach(() => {
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

    cy.intercept('POST', '/api/scans', {
      statusCode: 201,
      body: {
        message: 'barcode1, barcode2 successfully stored in location123',
      },
    }).as('storeBarcodes')

    cy.get('#submit-button').click()

    cy.wait('@storeBarcodes').its('response.statusCode').should('eq', 201)
    cy.contains('barcode1, barcode2 successfully stored in location123')
  })

  it('displays error when POST is unsuccessful', () => {
    cy.get('#userCode').type('user123')
    cy.get('#locationBarcode').type('location123')
    cy.get('#labware_barcodes').type('barcode1\nbarcode2')

    cy.intercept('POST', '/api/scans', {
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
