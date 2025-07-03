// TODO: hypothetical sample data for testing
const request = {
  id: 1,
  type: 'requests',
  attributes: {
    library_type: 'Pacbio_HiFi',
    estimate_of_gb_required: null,
    number_of_smrt_cells: null,
    cost_code: 'aCostCodeExample',
    external_study_id: '123',
    sample_name: 'sample-1',
    barcode: 'NT6746',
    sample_species: 'human',
    created_at: '2025/06/23 13:05',
    source_identifier: 'NT6746',
    sample_retention_instruction: null,
  },
  relationships: {
    sample: {
      data: {
        type: 'samples',
        id: '2',
      },
    },
  },
}

const sample = {
  id: '2',
  type: 'samples',
  attributes: {
    name: 'sample-11',
    date_of_sample_collection: '2025-06-23',
    species: 'human',
    external_id: '123',
    retention_instruction: null,
    supplier_name: 'Supplier B',
    sanger_sample_id: 'id-123',
  },
}

// Sample with some missing data
const request2 = {
  id: 2,
  type: 'requests',
  attributes: {
    library_type: '',
    estimate_of_gb_required: null,
    number_of_smrt_cells: null,
    cost_code: '',
    external_study_id: '123',
    sample_name: 'sample-2',
    barcode: 'NT6746',
    sample_species: 'human',
    created_at: '2025/06/23 13:05',
    source_identifier: 'NT6746',
    sample_retention_instruction: null,
  },
  relationships: {
    sample: {
      data: {
        type: 'samples',
        id: '3',
      },
    },
  },
}

const sample2 = {
  id: '3',
  type: 'samples',
  attributes: {
    name: 'sample-2',
    date_of_sample_collection: '2025-06-23',
    species: 'human',
    external_id: '123',
    retention_instruction: null,
    supplier_name: 'Supplier B',
    sanger_sample_id: 'id-123',
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
      cy.intercept('v1/pacbio/requests?filter[sample_name]=sample-1&include=sample', {
        statusCode: 200,
        body: {
          data: [request],
          included: [sample],
        },
      })
      cy.get('#sampleInput').type('sample-1')
      cy.get('#searchSamples').click()

      cy.intercept('v1/pacbio/requests?filter[sample_name]=sample-2&include=sample', {
        statusCode: 200,
        body: {
          data: [request2],
          included: [sample2],
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
            '"Date of Sample Collection","Sample ID","Sanger Sample ID","Supplier Sample Name","Cost Code","Sample Name","Source Identifier","Species","Library Type"\r',
          )
          expect(csv[1]).to.include(
            '"2025-06-23","1","id-123","Supplier B","aCostCodeExample","sample-11","NT6746","human","Pacbio_HiFi"\r',
          )
          expect(csv[2]).to.include(
            '"2025-06-23","2","id-123","Supplier B","","sample-2","NT6746","human",""',
          )
        },
      )

      // Clean up the downloaded file
      cy.task('deleteFolder', Cypress.config('downloadsFolder'))
    })

    it('Unsuccessfully - when the sample does not exists', () => {
      cy.intercept('v1/pacbio/requests?filter[sample_name]=sample-1&include=sample', {
        statusCode: 200,
        body: { data: [], included: [] },
      })
      cy.get('#sampleInput').type('sample-1')
      cy.get('#searchSamples').click()
      cy.contains('No samples found with the provided input')
      cy.contains('No samples added yet')
    })

    it('Unsuccessfully - when the server returns an error', () => {
      cy.intercept('v1/pacbio/requests?filter[sample_name]=sample-1&include=sample', {
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
