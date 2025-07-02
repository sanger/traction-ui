// TODO: hypothetical sample data for testing
const sample = {
  id: 1,
  attributes: {
    name: 'sample-1',
    submission_date: '2023-10-01',
    sanger_sample_id: 'SANGER-123',
    supplier_sample_name: 'Supplier Sample',
    cohort: 'Cohort A',
    study_number: 'Study 001',
    study_name: 'Study Name A',
    sample_type: 'Type A',
    cost_code: 'Cost-123',
    species: 'Species A',
    cell_type: 'Cell Type A',
    no_of_requested_cell_type: 100,
    supplied_concentration: 1.5,
    supplied_volume: 10,
    submitting_faculty: 'Faculty A',
    library_type: 'Library Type A',
    // TODO: this field is a field for the table not the report. This should be removed
    remove: '',
  },
}

// Sample with some missing data
const sample2 = {
  id: 2,
  attributes: {
    name: 'sample-2',
    submission_date: '2023-10-01',
    sanger_sample_id: 'SANGER-123',
    supplier_sample_name: '',
    cohort: '',
    study_number: 'Study 001',
    study_name: 'Study Name A',
    sample_type: 'Type A',
    cost_code: 'Cost-123',
    species: 'Species A',
    cell_type: 'Cell Type A',
    no_of_requested_cell_type: 100,
    supplied_concentration: 1.5,
    supplied_volume: 10,
    submitting_faculty: '',
    library_type: 'Library Type A',
    // TODO: this field is a field for the table not the report. This should be removed
    remove: '',
  },
}

describe('Sample Report page', () => {
  beforeEach(() => {
    cy.visit('#/sample-report')
  })

  it('Shows the correct components', () => {
    cy.contains('Sample report')
    cy.contains('Select samples')
    cy.contains('Preview')
    cy.contains('No samples added yet')
    cy.get('#sampleInput').should('exist')
    cy.get('#searchSamples').should('exist')
    cy.get('#sampleReportTable').should('exist')
    cy.get('#download').should('exist')
    cy.get('#reset').should('exist')
  })

  describe('Sample scanning', () => {
    it('Successfully - when the sample exists', () => {
      cy.intercept('v1/samples?filter[name]=sample-1', {
        statusCode: 200,
        body: {
          data: [sample],
        },
      })
      cy.get('#sampleInput').type('sample-1')
      cy.get('#searchSamples').click()

      cy.intercept('v1/samples?filter[name]=sample-2', {
        statusCode: 200,
        body: {
          data: [sample2],
        },
      })
      cy.get('#sampleInput').type('sample-2')
      // Simulate pressing Enter to add the sample
      cy.get('#sampleInput').type('{enter}')

      cy.get('#sampleReportTable').contains('sample-1')
      cy.get('#sampleReportTable').contains('sample-2')

      cy.get('#download').click()

      const time = new Date().toLocaleDateString().replace(/\//g, '_')
      cy.readFile(`${Cypress.config('downloadsFolder')}/traction_sample_report_${time}.csv`).then(
        (csv) => {
          csv = csv.split('\n')
          expect(csv[0]).to.include(
            '"Sample ID","Sample Name","Date Submitted","Sanger Sample ID","Supplier Sample Name","Cohort","Study Number","Study Name","Sample Type","Cost Code","Species","Cell Type","Number Of Requested Cell Type","Supplied Concentration (ng/uL)","Supplied Volume (uL)","Submitting Faculty","Library Type",""',
          )
          expect(csv[1]).to.include(
            '"1","sample-1","2023-10-01","SANGER-123","Supplier Sample","Cohort A","Study 001","Study Name A","Type A","Cost-123","Species A","Cell Type A","100","1.5","10","Faculty A","Library Type A",""',
          )
          expect(csv[2]).to.include(
            '"2","sample-2","2023-10-01","SANGER-123","","","Study 001","Study Name A","Type A","Cost-123","Species A","Cell Type A","100","1.5","10","","Library Type A",""',
          )
        },
      )

      // Clean up the downloaded file
      cy.task('deleteFolder', Cypress.config('downloadsFolder'))
    })

    it('Unsuccessfully - when the sample does not exists', () => {
      cy.intercept('v1/samples?filter[name]=sample-1', {
        statusCode: 200,
        body: { data: [] },
      })
      cy.get('#sampleInput').type('sample-1')
      cy.get('#searchSamples').click()
      cy.contains('No samples found with the provided input')
      cy.contains('No samples added yet')
    })

    it('Unsuccessfully - when the server returns an error', () => {
      cy.intercept('v1/samples?filter[name]=sample-1', {
        statusCode: 422,
        body: {
          errors: {
            InternalServerError: ['A failure occured'],
          },
        },
      })
      cy.get('#sampleInput').type('sample-1')
      cy.get('#searchSamples').click()
      cy.contains('Error fetching samples: InternalServerError A failure occured')
      cy.contains('No samples added yet')
    })
  })
})
