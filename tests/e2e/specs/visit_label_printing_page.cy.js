// https://docs.cypress.io/api/introduction/api.html
import PrinterFactory from '../../factories/PrinterFactory.js'
import WorkflowFactory from '../../factories/WorkflowFactory.js'

describe('Label Printing page', () => {
  beforeEach(() => {
    cy.wrap(PrinterFactory()).as('printerFactory')
    cy.get('@printerFactory').then((printerFactory) => {
      cy.intercept('GET', '/v1/printers', {
        statusCode: 200,
        body: printerFactory.content,
      })
    })

    cy.wrap(WorkflowFactory()).as('workflowFactory')
    cy.get('@workflowFactory').then((workflowFactory) => {
      cy.intercept('GET', '/v1/workflows?include=workflow_steps', {
        statusCode: 200,
        body: workflowFactory.content,
      })
    })

    cy.visit('#/label-printing')
    cy.get('#barcode-input').type('aBarcode')
    cy.get('#suffix-selection').select('BEXT - Labelling')
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
    cy.contains('aBarcode-BEXT-1')
    cy.contains('aBarcode-BEXT-2')
    cy.contains('aBarcode-BEXT-3')
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
