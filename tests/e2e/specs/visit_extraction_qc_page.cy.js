// https://docs.cypress.io/api/introduction/api.html

describe('Extraction QC page', () => {
  beforeEach(() => {
    cy.visit('#/extraction-qc')
    cy.get('#used-by-select-input').select('Extraction')
  })

  it('Shows the correct information', () => {
    cy.contains('QC Results Upload')
    cy.contains('Which QC Results would you like to upload?')
    cy.contains('CSV File')
    cy.contains('Upload File')
  })

  it('PMB request is successful', () => {
    cy.get('#qc-results-upload-file').attachFile('qc-results-upload.csv')

    cy.get('#upload-button').click()
    cy.intercept('/v1/qc_results_uploads', {
      statusCode: 201,
      body: {
        data: {
          type: 'qc_results_uploads',
        },
      },
    })
    cy.contains('Successfully imported: qc-results-upload.csv')
  })

  it('PMB request is unsuccessful, failed response', () => {
    cy.get('#qc-results-upload-file').attachFile('qc-results-upload-failure.csv')
    cy.get('#upload-button').click()

    cy.intercept('/v1/qc_results_uploads', {
      statusCode: 422,
      body: {
        errors: {
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
      },
    })
    cy.contains(
      'Missing required headers: Tissue Tube ID csv_data - Missing required headers: Tissue Tube ID',
    )
  })
})
