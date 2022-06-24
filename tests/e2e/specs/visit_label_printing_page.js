// https://docs.cypress.io/api/introduction/api.html

describe('Label Printing page', () => {
  beforeEach(() => {
    cy.visit('#/label-printing')

    cy.get('#barcode-input').type('aBarcode')
    cy.get('#suffix-selection').select('L')
    cy.get('#number-of-labels').type(3)
    cy.get('#printer-choice').select('stub')
    cy.get('#copies').type(2)
  })

  it('Shows the correct information', () => {
    cy.contains('Barcode:')
    cy.contains('Suffix:')
    cy.contains('Number of labels:')
    cy.contains('Choice of Printer:')
    cy.contains('Number of copies per label:')
    cy.contains('Reset')
    cy.contains('Print Labels')

    cy.get('#submit-button').click()

    cy.contains('List of barcodes to be printed:')
    cy.contains('aBarcode-L1')
    cy.contains('aBarcode-L2')
    cy.contains('aBarcode-L3')
  })

  it('PMB request is successful', () => {
    cy.get('#submit-button').click()

    cy.intercept('/v2/print_jobs', {
      statusCode: 200,
      body: {
        message: 'Successful',
      },
    })
    cy.get('#submit-button').click()
    cy.contains('Successful')
  })

  it('PMB request is unsuccessful, failed response', () => {
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
    cy.get('#submit-button').click()
    cy.contains('api/label is invalid')
  })

  it('PMB request is unsuccessful, empty response', () => {
    cy.intercept('/v2/print_jobs', {
      statusCode: 422,
      body: {
        errors: [],
      },
    })
    cy.get('#submit-button').click()
    cy.contains('Unknown')
  })
})
