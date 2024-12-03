import PacbioTagSetFactory from '../../../factories/PacbioTagSetFactory.js'
import PrinterFactory from '../../../factories/PrinterFactory.js'
import PacbioLibraryBatchFactory from '../../../factories/PacbioLibraryBatchFactory.js'
import PacbioRequestFactory from '../../../factories/PacbioRequestFactory.js'
const pacbioLibraryBatchFactory = PacbioLibraryBatchFactory()

describe('Pacbio Pool Create', () => {
  beforeEach(() => {
    cy.wrap(PacbioTagSetFactory()).as('pacbioTagSetFactory')
    cy.wrap(PrinterFactory()).as('printerFactory')
    cy.wrap(PacbioRequestFactory()).as('pacbioRequestFactory')
    cy.wrap(PacbioLibraryBatchFactory()).as('pacbioLibraryBatchFactory')

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.intercept('GET', '/v1/pacbio/tag_sets?include=tags*', {
        statusCode: 200,
        body: pacbioTagSetFactory.content,
      })
    })
    cy.get('@pacbioRequestFactory').then((pacbioRequestFactory) => {
      cy.intercept('GET', '/v1/pacbio/requests?filter*', {
        statusCode: 200,
        body: pacbioRequestFactory.content,
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
    const csvContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
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
    cy.intercept('POST', '/v1/pacbio/library_batches?include=libraries.tube', {
      statusCode: 200,
      body: pacbioLibraryBatchFactory.content,
     
    })
    cy.get('[data-action=create-libraries]').click()
    cy.get('#library-batch-table tbody tr').should('have.length',pacbioLibraryBatchFactory.storeData.librariesInBatch.length)  

    cy.get('#list-barcodes-to-print li').should('have.length', pacbioLibraryBatchFactory.storeData.librariesInBatch.length)
    pacbioLibraryBatchFactory.storeData.librariesInBatch.forEach((library, index) => {
      cy.get('#list-barcodes-to-print li').eq(index).should('contain', library.barcode)
    })

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

  it('will not create libraries when there is an error', () => {

    cy.visit('#/pacbio/library-batch')
    cy.contains('Create Library Batch')

    // Upload CSV file
    //Create a file from PacbioLibraryBatchFactory and attach it to the input
    const csvContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
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
    cy.intercept('POST', '/v1/pacbio/library_batches?include=libraries.tube', {
      statusCode: 422,
      body: {
        errors: {
          error1: ['There was a problem'],
        },
      },
    })

    cy.get('#library-batch-table tbody tr').should('have.length',0)
    cy.contains('No Libraries Created Yet').should('exist')
    cy.contains('No Barcodes to Print Yet').should('exist')
    cy.get('[data-action=create-libraries]').click()
    cy.contains('error1 There was a problem')

  })
})
