import PacbioTagSetFactory from '../../../factories/PacbioTagSetFactory.js'
import PrinterFactory from '../../../factories/PrinterFactory.js'
import PacbioLibraryBatchFactory from '../../../factories/PacbioLibraryBatchFactory.js'

describe('Pacbio Pool Create', () => {
  beforeEach(() => {
    cy.wrap(PacbioTagSetFactory()).as('pacbioTagSetFactory')
    cy.wrap(PrinterFactory()).as('printerFactory')
    cy.wrap(PacbioLibraryBatchFactory()).as('pacbioLibraryBatchFactory')

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.intercept('GET', '/v1/pacbio/tag_sets?include=tags', {
        statusCode: 200,
        body: pacbioTagSetFactory.content,
      })
    })

    cy.get('@printerFactory').then((printerFactory) => {
      cy.intercept('GET', '/v1/printers', {
        statusCode: 200,
        body: printerFactory.content,
      })
    })
  })

  it('Creates a pool successfully', () => {
    cy.visit('#/pacbio/library-batch')
    cy.contains('Create Library Batch')

    // Upload CSV file
    //Create a file from PacbioLibraryBatchFactory and attach it to the input
    const csvContent = PacbioLibraryBatchFactory().createCsvFromLibraryBatchData(
      PacbioTagSetFactory().storeData.tags,
    )
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const file = new File([blob], 'pacbio_library_batch.csv', { type: 'text/csv' })

    // Attach the generated CSV file
    cy.get('#csvFileInput').attachFile({
      fileContent: file,
      fileName: 'pacbio_library_batch.csv',
      mimeType: 'text/csv',
    })

    // Show CSV Preview
    cy.get('[data-type=csv-preview-btn]').click()
    cy.get('[data-type=csv-preview]').should('exist')

    // Create Libraries
    cy.intercept('POST', '/v1/pacbio/library_batches', {
      statusCode: 201,
      body: {
        data: {
          library_batch: {
            id: '1',
            libraries: [{ barcode: 'barcode1' }, { barcode: 'barcode2' }],
          },
        },
      },
    })
    cy.get('[data-action=create-libraries]').click()
    cy.get('#library-batch-table').should('exist')

    // Select Printer
    cy.get('@printerFactory').then((printerFactory) => {
      cy.get('[data-type=printer-options]').select(printerFactory.storeData.selected.printer.name)
    })

     // Print Labels
     cy.intercept('/v2/print_jobs', {
        statusCode: 200,
        body: {
          message: 'Successful',
        },
      })
      cy.get('#print-button').click()
      cy.contains('Barcode(s) successfully printed')
  })
})
