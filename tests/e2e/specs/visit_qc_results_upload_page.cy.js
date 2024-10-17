// https://docs.cypress.io/api/introduction/api.html

describe('Extraction QC page', () => {
  beforeEach(() => {
    cy.visit('#/qc-results-upload')
    cy.get('#used-by-select-input').select('Extraction')
    cy.contains('Upload File')
    cy.contains('Re-enable')
  })

  it('Shows the correct components', () => {
    cy.contains('QC Results Upload')
    cy.contains('Which QC Results would you like to upload?')
    cy.contains('CSV File')
    cy.contains('Upload File')
  })

  it('QcResultsUpload POST request is successful', () => {
    cy.get('#qcResultsUploadFile').attachFile('qc-results-upload.csv')

    cy.intercept('/v1/qc_results_uploads', {
      statusCode: 201,
      body: {
        data: {
          type: 'qc_results_uploads',
        },
      },
    })
    cy.get('#upload-button').click()

    cy.contains('Successfully imported: qc-results-upload.csv')
  })

  it('QcResultsUpload POST is unsuccessful, unprocessable entity', () => {
    cy.get('#qcResultsUploadFile').attachFile('qc-results-upload-failure.csv')

    cy.intercept('/v1/qc_results_uploads', {
      statusCode: 422,
      body: {
        errors: [
          {
            title: 'Missing required headers: Tissue Tube ID',
            detail: 'csv_data - Missing required headers: Tissue Tube ID',
            code: '100',
            source: { pointer: '/data/attributes/csv_data' },
            status: '422',
          },
        ],
      },
    })
    cy.get('#upload-button').click()

    cy.contains(
      'Missing required headers: Tissue Tube ID csv_data - Missing required headers: Tissue Tube ID',
    )
  })
})
