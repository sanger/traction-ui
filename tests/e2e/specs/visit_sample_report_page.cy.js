import PacbioRequestFactory from '../../factories/PacbioRequestFactory.js'
import SequencescapeStudyFactory from '../../factories/SequencescapeStudyFactory.js'

describe('Sample Report page', () => {
  beforeEach(() => {
    cy.wrap(PacbioRequestFactory({ includeRelationships: true })).as('pacbioRequestFactory')
    cy.wrap(SequencescapeStudyFactory()).as('sequencescapeStudyFactory')

    cy.visit('#/sample-report')
  })

  it('Shows the correct components', () => {
    cy.contains('Sample report')
    cy.contains('Select samples')
    cy.contains('Preview')
    cy.contains('No samples added yet')
    cy.get('[data-attribute=sample-input]').should('exist')
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

      cy.get('@sequencescapeStudyFactory').then((sequencescapeStudyFactory) => {
        cy.intercept(
          '/api/v2/studies?filter[uuid]=fec8a1fa-b9e2-11e9-9123-fa163e99b035&include=study_metadata.faculty_sponsor',
          {
            statusCode: 200,
            body: {
              data: [sequencescapeStudyFactory.content.data[0]],
              included: [
                sequencescapeStudyFactory.content.included[0],
                sequencescapeStudyFactory.content.included[1],
              ],
            },
          },
        )
      })
      cy.get('[data-attribute=sample-input]').type('sample-1')
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
      // We don't need to intercept SS request here as it is the same as above
      cy.intercept('v1/pacbio/requests?filter[source_identifier]=sample-2&include=sample', {
        statusCode: 200,
        body: {
          data: [],
          included: [],
        },
      })
      cy.get('[data-attribute=sample-input]').type('sample-2')
      // Simulate pressing Enter to add the sample
      cy.get('[data-attribute=sample-input]').type('{enter}')

      // Check some sample data is displayed
      cy.get('#sampleReportTable').contains('Pacbio_HiFi')
      cy.get('#sampleReportTable').contains('Pacbio_HiFi_mplx')

      cy.get('#download').click()

      const time = new Date().toLocaleDateString().replace(/\//g, '_')
      cy.readFile(`${Cypress.config('downloadsFolder')}/traction_sample_report_${time}.csv`).then(
        (csv) => {
          csv = csv.split('\n')
          expect(csv[0]).to.include(
            '"Sample ID","Supplier Sample Name","Study Number","Study Name","Cost Code","Species","Submitting Faculty","Library Type","Number of Donors"\r',
          )
          expect(csv[1]).to.include(
            '"","sample_DN814327C_A1","1","Study 1","cost-code-1","human","Faculty Sponsor 1","Pacbio_HiFi","2"\r',
          )
          expect(csv[2]).to.include(
            '"","sample_DN814327C_A2","1","Study 1","cost-code-2","human","Faculty Sponsor 1","Pacbio_HiFi_mplx","3"',
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
      cy.get('[data-attribute=sample-input]').type('sample-1')
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
      cy.get('[data-attribute=sample-input]').type('sample-1')
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
        '/api/v2/studies?filter[uuid]=fec8a1fa-b9e2-11e9-9123-fa163e99b035&include=study_metadata.faculty_sponsor',
        {
          statusCode: 200,
          body: {
            data: [],
            included: [],
          },
        },
      )
      cy.get('[data-attribute=sample-input]').type('sample-1')
      cy.get('#searchSamples').click()
      cy.contains('No studies found in Sequencescape with the provided input')
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
        '/api/v2/studies?filter[uuid]=fec8a1fa-b9e2-11e9-9123-fa163e99b035&include=study_metadata.faculty_sponsor',
        {
          statusCode: 422,
          body: {
            errors: {
              InternalServerError: ['A failure occured'],
            },
          },
        },
      )
      cy.get('[data-attribute=sample-input]').type('sample-1')
      cy.get('#searchSamples').click()
      cy.contains(
        'Error fetching studies from Sequencescape: InternalServerError A failure occured',
      )
      cy.contains('No samples added yet')
    })
  })
})
