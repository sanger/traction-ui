import PacbioSmrtLinkVersionFactory from '../../../factories/PacbioSmrtLinkVersionFactory.js'

describe('Pacbio Run Edit view', () => {
  beforeEach(() => {
    cy.intercept('/v1/pacbio/runs?page[size]=25&page[number]=1&include=plates', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.intercept('GET', '/v1/pacbio/smrt_link_versions', {
      statusCode: 200,
      body: PacbioSmrtLinkVersionFactory().content,
    })
  })

  it('Updates a Revio run successfully', () => {
    cy.intercept('PATCH', '/v1/pacbio/runs/17', {
      statusCode: 200,
      body: {
        data: {},
      },
    })

    // Get the existing revio run to be edited
    cy.intercept(
      '/v1/pacbio/runs/12?include=plates.wells.used_aliquots,plates.wells.libraries.tube,plates.wells.pools.tube,plates.wells.libraries.request,plates.wells.pools.requests,plates.wells.pools.libraries.request,plates.wells.pools.used_aliquots.tag,plates.wells.libraries.used_aliquots.tag,smrt_link_version',
      {
        fixture: 'tractionPacbioRevioRun.json',
      },
    )

    // get the tubes
    cy.intercept(
      '/v1/pacbio/tubes?filter[barcode]=TRAC-2-11,TRAC-2-20,TRAC-2-22,TRAC-2-24&include=pools.libraries.request,pools.requests,pools.used_aliquots.tag,libraries.used_aliquots.request,libraries.used_aliquots.tag&fields[requests]=sample_name&fields[tags]=group_id',
      {
        fixture: 'tractionPacbioRevioRunTubes.json',
      },
    )
    cy.visit('#/pacbio/runs')
    cy.get('#actions').within(() => {
      cy.get('#editRun-12').click()
    })
    cy.get('[data-attribute=pacbio-run-well]').first().click()
    cy.get('[data-attribute="movie-acquisition-time"]').select('24.0')
    cy.get('[data-attribute="pre-extension-time"]').type('3')
    cy.get('[data-attribute="include-base-kinetics"]').select('True')
    cy.get('[data-attribute="aliquot-volume"').type('10')
    cy.get('#update').click()
    cy.get('button').contains('Update').click()
    cy.contains('[data-type=run-create-message]', 'Run successfully updated')
  })

  it('Updates a Sequel IIe run successfully', () => {
    cy.intercept('PATCH', '/v1/pacbio/runs/18', {
      statusCode: 200,
      body: {
        data: {},
      },
    })

    // Get the existing Sequel IIe run to be edited
    cy.intercept(
      'v1/pacbio/runs/13?include=plates.wells.used_aliquots,plates.wells.libraries.tube,plates.wells.pools.tube,plates.wells.libraries.request,plates.wells.pools.requests,plates.wells.pools.libraries.request,plates.wells.pools.used_aliquots.tag,plates.wells.libraries.used_aliquots.tag,smrt_link_version',
      {
        fixture: 'tractionPacbioSequelIIeRun.json',
      },
    )

    // get the tubes
    cy.intercept(
      'v1/pacbio/tubes?filter[barcode]=TRAC-2-21&include=pools.libraries.request,pools.requests,pools.used_aliquots.tag,libraries.used_aliquots.request,libraries.used_aliquots.tag&fields[requests]=sample_name&fields[tags]=group_id',
      {
        fixture: 'tractionPacbioSequelIIeRunTubes.json',
      },
    )

    cy.visit('#/pacbio/runs')
    cy.get('#editRun-13').click()
    cy.get('[data-attribute=pacbio-run-well]').first().click()
    cy.get('[data-attribute="movie-time"]').select('24.0')
    cy.get('[data-attribute="pre-extension-time"]').type('3')
    cy.get('[data-attribute="ccs-analysis-output-include-kinetics-information"]').select('Yes')
    cy.get('[data-attribute="aliquot-volume"').type('10')
    cy.get('#update').click()
    cy.get('button').contains('Update').click()
    cy.contains('[data-type=run-create-message]', 'Run successfully updated')
  })

  it('will not create a run if there is an error', () => {
    // Get the existing revio run to be edited
    cy.intercept(
      '/v1/pacbio/runs/12?include=plates.wells.used_aliquots,plates.wells.libraries.tube,plates.wells.pools.tube,plates.wells.libraries.request,plates.wells.pools.requests,plates.wells.pools.libraries.request,plates.wells.pools.used_aliquots.tag,plates.wells.libraries.used_aliquots.tag,smrt_link_version',
      {
        fixture: 'tractionPacbioRevioRun.json',
      },
    )

    // get the tubes
    cy.intercept(
      '/v1/pacbio/tubes?filter[barcode]=TRAC-2-11,TRAC-2-20,TRAC-2-22,TRAC-2-24&include=pools.libraries.request,pools.requests,pools.used_aliquots.tag,libraries.used_aliquots.request,libraries.used_aliquots.tag&fields[requests]=sample_name&fields[tags]=group_id',
      {
        fixture: 'tractionPacbioRevioRunTubes.json',
      },
    )

    cy.intercept('PATCH', '/v1/pacbio/runs/17', {
      statusCode: 422,
      body: {
        data: {
          errors: {
            sequencing_kit_box_barcode: ["can't be blank"],
          },
        },
      },
    })

    cy.visit('#/pacbio/runs')
    cy.get('#actions').within(() => {
      cy.get('#editRun-12').click()
    })
    cy.get('[data-attribute="sequencing-kit-box-barcode-1"]').clear()
    cy.get('button').contains('Update').click()
    cy.contains(
      '[data-type=run-create-message]',
      "Failed to create run in Traction: sequencing_kit_box_barcode can't be blank",
    )
  })
})
