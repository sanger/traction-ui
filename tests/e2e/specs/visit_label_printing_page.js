// https://docs.cypress.io/api/introduction/api.html

describe('Label Printing page', () => {
  beforeEach(() => {
    cy.visit('#/label-printing')

    cy.get('#printLabels').should('be.disabled')

    cy.get('#barcode_input').type('aBarcode')
    cy.get('#suffix_selection').select('L (Lysed)')
    cy.get('#number_of_labels').type(3)
    cy.get('#printer_choice').select('stub')
    cy.get('#copies').type(2)
  })

  it('Shows the correct information', () => {
    cy.contains('Barcode:')
    cy.contains('Suffix:')
    cy.contains('Number of labels:')
    cy.contains('Choice of Printer:')
    cy.contains('Reset')
    cy.contains('Print Labels')

    cy.get('#printLabels').should('not.be.disabled')
    cy.get('#printLabels').click()

    cy.contains('Print Labels')
    cy.contains('List of barcodes to be printed:')
    cy.contains('Number of labels:')
    cy.contains('aBarcode-L1')
    cy.contains('aBarcode-L2')
    cy.contains('aBarcode-L3')
    cy.contains('Printer: stub')
    cy.contains('Copies: 2')

    cy.contains('OK').should('not.be.disabled')
  })

  it('PMB request is successful', () => {
    cy.get('#printLabels').click()

    cy.intercept('/v2/print_jobs', {
      statusCode: 200,
      body: {
        message: 'Successful',
      },
    })
    cy.contains('OK').click()
    cy.contains('Response: Successful')
  })

  it('PMB request is unsuccessful, failed response', () => {
    cy.get('#printLabels').click()

    cy.intercept('/v2/print_jobs', {
      statusCode: 422,
      body: {
        errors: [
          {
            source: {
              pointer: 'api/label',
            },
            detail: 'is invalid',
          },
        ],
      },
    })
    cy.contains('OK').click()
    cy.contains('Print request failed: api/label is invalid')
  })

  it('PMB request is unsuccessful, empty response', () => {
    cy.get('#printLabels').click()

    cy.intercept('/v2/print_jobs', {
      statusCode: 422,
      body: {
        errors: [],
      },
    })
    cy.contains('OK').click()
    cy.contains('Print request failed: Unknown')
  })
})
