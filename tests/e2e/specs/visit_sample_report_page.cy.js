import PacbioRequestFactory from '../../factories/PacbioRequestFactory.js'

// Data for mocked Sequencescape responses
const ssSample = {
  id: '2',
  type: 'samples',
  attributes: {
    uuid: 'external-id-122',
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

const ssSample2 = {
  id: '2',
  type: 'samples',
  attributes: {
    uuid: 'external-id-123',
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

const ssStudy = {
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

const ssStudyMetadata = {
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

const ssSampleMetadata = {
  id: '1',
  type: 'sample_metadata',
  attributes: {
    cohort: 'Cohort 1',
    concentration: 50,
    volume: 100,
  },
}

const ssFacultySponsor = {
  id: '1',
  type: 'faculty_sponsors',
  attributes: {
    name: 'Faculty Sponsor 1',
  },
}

describe('Sample Report page', () => {
  beforeEach(() => {
    cy.wrap(PacbioRequestFactory({ includeRelationships: true })).as('pacbioRequestFactory')

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
      cy.get('@pacbioRequestFactory').then((pacbioRequestFactory) => {
        cy.intercept('v1/pacbio/requests?filter[sample_name]=sample-1&include=sample', {
          statusCode: 200,
          body: {
            data: [pacbioRequestFactory.content.data[0]],
            // Sample included
            included: [pacbioRequestFactory.content.included[7]],
          },
        })
      })
      cy.intercept('v1/pacbio/requests?filter[source_identifier]=sample-1&include=sample', {
        statusCode: 200,
        body: {
          data: [],
          included: [],
        },
      })
      cy.intercept(
        '/api/v2/samples?filter[uuid]=external-id-122&include=sample_metadata,studies.study_metadata.faculty_sponsor',
        {
          statusCode: 200,
          body: {
            data: [ssSample],
            included: [ssSampleMetadata, ssStudy, ssStudyMetadata, ssFacultySponsor],
          },
        },
      )
      cy.get('#sampleInput').type('sample-1')
      cy.get('#searchSamples').click()

      cy.get('@pacbioRequestFactory').then((pacbioRequestFactory) => {
        cy.intercept('v1/pacbio/requests?filter[sample_name]=sample-2&include=sample', {
          statusCode: 200,
          body: {
            data: [pacbioRequestFactory.content.data[1]],
            // Sample included
            included: [pacbioRequestFactory.content.included[8]],
          },
        })
      })
      cy.intercept(
        '/api/v2/samples?filter[uuid]=external-id-123&include=sample_metadata,studies.study_metadata.faculty_sponsor',
        {
          statusCode: 200,
          body: {
            data: [ssSample2],
            included: [ssSampleMetadata, ssStudy, ssStudyMetadata, ssFacultySponsor],
          },
        },
      )
      cy.intercept('v1/pacbio/requests?filter[source_identifier]=sample-2&include=sample', {
        statusCode: 200,
        body: {
          data: [],
          included: [],
        },
      })
      cy.get('#sampleInput').type('sample-2')
      // Simulate pressing Enter to add the sample
      cy.get('#sampleInput').type('{enter}')

      // Check some sample data is displayed
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
            '"2021-01-01","2","id-123","Supplier Name","Cohort 1","1","Study 1","cost-code-1","human","50","100","Faculty Sponsor 1","Pacbio_HiFi","donor-id-123"\r',
          )
          expect(csv[2]).to.include(
            '"2021-01-03","2","id-123","Supplier Name 2","Cohort 1","1","Study 1","cost-code-2","human","50","100","Faculty Sponsor 1","Pacbio_HiFi_mplx","donor-id-123"',
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
      cy.intercept('v1/pacbio/requests?filter[source_identifier]=sample-1&include=sample', {
        statusCode: 200,
        body: {
          data: [],
          included: [],
        },
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
      cy.intercept('v1/pacbio/requests?filter[source_identifier]=sample-1&include=sample', {
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
      cy.get('@pacbioRequestFactory').then((pacbioRequestFactory) => {
        cy.intercept('v1/pacbio/requests?filter[sample_name]=sample-1&include=sample', {
          statusCode: 200,
          body: {
            data: [pacbioRequestFactory.content.data[0]],
            included: [pacbioRequestFactory.content.included[7]],
          },
        })
      })
      cy.intercept('v1/pacbio/requests?filter[source_identifier]=sample-1&include=sample', {
        statusCode: 200,
        body: {
          data: [],
          included: [],
        },
      })
      cy.intercept(
        '/api/v2/samples?filter[uuid]=external-id-122&include=sample_metadata,studies.study_metadata.faculty_sponsor',
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
      cy.get('@pacbioRequestFactory').then((pacbioRequestFactory) => {
        cy.intercept('v1/pacbio/requests?filter[sample_name]=sample-1&include=sample', {
          statusCode: 200,
          body: {
            data: [pacbioRequestFactory.content.data[0]],
            included: [pacbioRequestFactory.content.included[7]],
          },
        })
      })
      cy.intercept('v1/pacbio/requests?filter[source_identifier]=sample-1&include=sample', {
        statusCode: 200,
        body: {
          data: [],
          included: [],
        },
      })
      cy.intercept(
        '/api/v2/samples?filter[uuid]=external-id-122&include=sample_metadata,studies.study_metadata.faculty_sponsor',
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
