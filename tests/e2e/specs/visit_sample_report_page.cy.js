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
    library_type: 'Pacbio_HiFi_mplx',
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

const ss_sample = {
  id: '2',
  type: 'samples',
  attributes: {
    uuid: '123',
    sanger_sample_id: 'id-123',
  },
  relationships: {
    sample_metadata: {
      data: {
        type: 'sample_metadata',
        id: '1',
      },
    },
    studies: {
      data: [
        {
          type: 'studies',
          id: '1',
        },
      ],
    },
  },
}

const ss_study = {
  id: '1',
  type: 'studies',
  attributes: {
    name: 'Study 1',
  },
  relationships: {
    study_metadata: {
      data: {
        type: 'study_metadata',
        id: '1',
      },
    },
  },
}

const ss_studyMetadata = {
  id: '1',
  type: 'study_metadata',
  relationships: {
    faculty_sponsor: {
      data: {
        type: 'faculty_sponsors',
        id: '1',
      },
    },
  },
}

const ss_sampleMetadata = {
  id: '1',
  type: 'sample_metadata',
  attributes: {
    cohort: 'Cohort 1',
    concentration: 50,
    volume: 100,
  },
}

const ss_facultySponsor = {
  id: '1',
  type: 'faculty_sponsors',
  attributes: {
    name: 'Faculty Sponsor 1',
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
      // Both samples have the same external_id, so they will be grouped together
      cy.intercept(
        '/api/v2/samples?filter[uuid]=123&include=sample_metadata,studies.study_metadata.faculty_sponsor',
        {
          statusCode: 200,
          body: {
            data: [ss_sample],
            included: [ss_sampleMetadata, ss_study, ss_studyMetadata, ss_facultySponsor],
          },
        },
      )
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

      cy.get('#sampleReportTable').contains('Pacbio_HiFi')
      cy.get('#sampleReportTable').contains('Pacbio_HiFi_mplx')

      cy.get('#download').click()

      const time = new Date().toLocaleDateString().replace(/\//g, '_')
      cy.readFile(`${Cypress.config('downloadsFolder')}/traction_sample_report_${time}.csv`).then(
        (csv) => {
          csv = csv.split('\n')
          expect(csv[0]).to.include(
            '"Date of Sample Collection","Sample ID","Sanger Sample ID","Supplier Sample Name","Cohort","Study Number","Study Name","Cost Code","Species","Supplied Concentration (ng/uL)","Supplied Volume (uL)","Submitting Faculty","Library Type","Sample Type"\r',
          )
          expect(csv[1]).to.include(
            '"2025-06-23","2","id-123","Supplier B","Cohort 1","1","Study 1","aCostCodeExample","human","50","100","Faculty Sponsor 1","Pacbio_HiFi",""\r',
          )
          expect(csv[2]).to.include(
            '"2025-06-23","2","id-123","Supplier B","Cohort 1","1","Study 1","","human","50","100","Faculty Sponsor 1","Pacbio_HiFi_mplx",""',
          )
        },
      )

      // Clean up the downloaded file
      cy.task('deleteFolder', Cypress.config('downloadsFolder'))
    })

    it('Unsuccessfully - when the sample does not exist in traction', () => {
      cy.intercept('v1/pacbio/requests?filter[sample_name]=sample-1&include=sample', {
        statusCode: 200,
        body: { data: [], included: [] },
      })
      cy.get('#sampleInput').type('sample-1')
      cy.get('#searchSamples').click()
      cy.contains('No samples found in Traction with the provided input')
      cy.contains('No samples added yet')
    })

    it('Unsuccessfully - when the traction server returns an error', () => {
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
      cy.contains('Error fetching samples from Traction: InternalServerError A failure occured')
      cy.contains('No samples added yet')
    })

    it('Unsuccessfully - when the sample does not exist in sequencescape', () => {
      cy.intercept('v1/pacbio/requests?filter[sample_name]=sample-1&include=sample', {
        statusCode: 200,
        body: {
          data: [request],
          included: [sample],
        },
      })
      cy.intercept(
        '/api/v2/samples?filter[uuid]=123&include=sample_metadata,studies.study_metadata.faculty_sponsor',
        {
          statusCode: 200,
          body: {
            data: [],
            included: [],
          },
        },
      )
      cy.get('#sampleInput').type('sample-1')
      cy.get('#searchSamples').click()
      cy.contains('No samples found in Sequencescape with the provided input')
      cy.contains('No samples added yet')
    })

    it('Unsuccessfully - when the sequencescape server returns an error', () => {
      cy.intercept('v1/pacbio/requests?filter[sample_name]=sample-1&include=sample', {
        statusCode: 200,
        body: {
          data: [request],
          included: [sample],
        },
      })
      cy.intercept(
        '/api/v2/samples?filter[uuid]=123&include=sample_metadata,studies.study_metadata.faculty_sponsor',
        {
          statusCode: 422,
          body: {
            errors: {
              InternalServerError: ['A failure occured'],
            },
          },
        },
      )
      cy.get('#sampleInput').type('sample-1')
      cy.get('#searchSamples').click()
      cy.contains(
        'Error fetching samples from Sequencescape: InternalServerError A failure occured',
      )
      cy.contains('No samples added yet')
    })
  })
})
