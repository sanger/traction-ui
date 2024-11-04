import PacbioSmrtLinkVersionFactory from '../../../factories/PacbioSmrtLinkVersionFactory.js'
import PacbioRunFactory from '../../../factories/PacbioRunFactory.js'

describe('Pacbio Run Edit view', () => {
  beforeEach(() => {
    cy.wrap(PacbioRunFactory()).as('pacbioRunFactory')
    cy.get('@pacbioRunFactory').then((pacbioRunFactory) => {
      cy.intercept('/v1/pacbio/runs?page[size]=25&page[number]=1&include=plates', {
        statusCode: 200,
        body: pacbioRunFactory.content,
      })
    })
    cy.intercept('GET', '/v1/pacbio/smrt_link_versions', {
      statusCode: 200,
      body: PacbioSmrtLinkVersionFactory().content,
    })
  })

  it('Updates a Revio run successfully', () => {
    cy.intercept('PATCH', '/v1/pacbio/runs/1581', {
      statusCode: 200,
      body: {
        data: {},
      },
    })

    // Get the existing revio run to be edited
    cy.wrap(PacbioRunFactory({ findBy: 'Revio' })).as('revioRunFactory')
    cy.get('@revioRunFactory').then((revioRunFactory) => {
      cy.intercept(
        '/v1/pacbio/runs/1581?include=plates.wells.used_aliquots,plates.wells.libraries.tube,plates.wells.pools.tube,plates.wells.libraries.request,plates.wells.pools.requests,plates.wells.pools.libraries.request,plates.wells.pools.used_aliquots.tag,plates.wells.libraries.used_aliquots.tag,smrt_link_version',
        {
          statusCode: 200,
          body: revioRunFactory.content,
        },
      )
    })

    cy.visit('#/pacbio/runs')
    cy.get('#actions').within(() => {
      cy.get('#editRun-1581').click()
    })
    cy.get('[data-attribute=pacbio-run-well]').first().click()
    cy.get('[data-attribute="movie-acquisition-time"]').select('24.0')
    cy.get('[data-attribute="pre-extension-time"]').type('3')
    cy.get('[data-attribute="include-base-kinetics"]').select('True')
    cy.get('#update').click()
    cy.get('button').contains('Update').click()
    cy.contains('[data-type=run-create-message]', 'Run successfully updated')
  })

  it('Updates a Sequel IIe run successfully', () => {
    cy.intercept('PATCH', '/v1/pacbio/runs/1503', {
      statusCode: 200,
      body: {
        data: {},
      },
    })

    // Get the existing Sequel IIe run to be edited
    cy.wrap(PacbioRunFactory({ findBy: 'Sequel IIe' })).as('sequelRunFactory')
    cy.get('@sequelRunFactory').then((sequelRunFactory) => {
      cy.intercept(
        'v1/pacbio/runs/1503?include=plates.wells.used_aliquots,plates.wells.libraries.tube,plates.wells.pools.tube,plates.wells.libraries.request,plates.wells.pools.requests,plates.wells.pools.libraries.request,plates.wells.pools.used_aliquots.tag,plates.wells.libraries.used_aliquots.tag,smrt_link_version',
        {
          statusCode: 200,
          body: sequelRunFactory.content,
        },
      )
    })

    cy.visit('#/pacbio/runs')
    cy.get('#editRun-1503').click()
    cy.get('[data-attribute=pacbio-run-well]').first().click()
    cy.get('[data-attribute="movie-time"]').select('24.0')
    cy.get('[data-attribute="pre-extension-time"]').type('3')
    cy.get('[data-attribute="ccs-analysis-output-include-kinetics-information"]').select('Yes')
    cy.get('#update').click()
    cy.get('button').contains('Update').click()
    cy.contains('[data-type=run-create-message]', 'Run successfully updated')
  })

  it('will not create a run if there is an error', () => {
    // Get the existing revio run to be edited
    cy.wrap(PacbioRunFactory({ findBy: 'Revio' })).as('revioRunFactory')
    cy.get('@revioRunFactory').then((revioRunFactory) => {
      cy.intercept(
        '/v1/pacbio/runs/1581?include=plates.wells.used_aliquots,plates.wells.libraries.tube,plates.wells.pools.tube,plates.wells.libraries.request,plates.wells.pools.requests,plates.wells.pools.libraries.request,plates.wells.pools.used_aliquots.tag,plates.wells.libraries.used_aliquots.tag,smrt_link_version',
        {
          statusCode: 200,
          body: revioRunFactory.content,
        },
      )
    })

    cy.intercept('PATCH', '/v1/pacbio/runs/1581', {
      statusCode: 422,
      body: {
        errors: {
          sequencing_kit_box_barcode: ["can't be blank"],
        },
      },
    })

    cy.visit('#/pacbio/runs')
    cy.get('#actions').within(() => {
      cy.get('#editRun-1581').click()
    })
    cy.get('[data-attribute="sequencing-kit-box-barcode-1"]').clear()
    cy.get('button').contains('Update').click()
    cy.contains(
      '[data-type=run-create-message]',
      "Failed to create run in Traction: sequencing_kit_box_barcode can't be blank",
    )
  })
})
