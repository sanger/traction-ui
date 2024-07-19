// https://docs.cypress.io/api/introduction/api.html
import PrinterFactory from '../../factories/PrinterFactory.js'

describe('Label Printing page', () => {
  beforeEach(() => {
    cy.wrap(PrinterFactory()).as('printerFactory')
    cy.get('@printerFactory').then((printerFactory) => {
      cy.intercept('GET', '/v1/printers', {
        statusCode: 200,
        body: printerFactory.content,
      })
    })

    cy.visit('#/label-printing')
    cy.get('#barcode-input').type('aBarcode')
    cy.get('#suffix-selection').select('OPLX - Pool')
    cy.get('#number-of-labels').type(3)
    cy.get('@printerFactory').then((printerFactory) => {
      cy.get('#printer-choice').select(printerFactory.storeData.selected.printer.name)
    })
  })

  it('Shows the correct information', () => {
    cy.contains('Barcodes')
    cy.contains('Suffix')
    cy.contains('Number of labels')
    cy.contains('Choice of Printer')
    cy.contains('Reset')
    cy.contains('Print Labels')

    cy.get('#submit-button').click()

    cy.contains('Preview Barcodes')
    cy.contains('aBarcode-OPLX-1')
    cy.contains('aBarcode-OPLX-2')
    cy.contains('aBarcode-OPLX-3')
  })

  it('PMB request is successful', () => {
    cy.intercept('/v2/print_jobs', {
      statusCode: 200,
      body: {
        message: 'Successful',
      },
    })
    cy.get('#submit-button').click()
    cy.contains('Barcode(s) successfully printed')
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
    cy.contains('label is invalid')
  })
})
