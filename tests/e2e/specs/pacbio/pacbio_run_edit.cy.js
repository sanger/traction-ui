describe('Pacbio Run Edit view', () => {
  beforeEach(() => {
    cy.intercept('/v1/pacbio/runs', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.intercept('/v1/pacbio/runs/7?include=plate.wells.pools.tube', {
      fixture: 'tractionPacbioRun.json',
    })
    cy.intercept(
      '/v1/pacbio/pools?filter[barcode]=TRAC-2-1&include=tube,libraries.tag,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id&fields[libraries]=request,tag,run_suitability',
      {
        fixture: 'pacbioPool.json',
      },
    )
    cy.intercept(
      '/v1/pacbio/pools?include=tube,libraries.tag,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id&fields[libraries]=request,tag,run_suitability',
      {
        fixture: 'tractionPacbioPools.json',
      },
    )
    cy.intercept('/v1/pacbio/runs/7?include=plate.wells.pools.libraries', {
      fixture: 'tractionPacbioRun.json',
    })
    cy.intercept('/v1/pacbio/runs/7', {
      fixture: 'tractionPacbioRun.json',
    })
    cy.intercept('/v1/pacbio/smrt_link_versions', {
      fixture: 'tractionPacbioSmrtLinkVersions.json',
    })
  })

  it('Updates a run successfully', () => {
    cy.intercept('/v1/pacbio/runs/wells/6', {
      statusCode: 200,
      body: { data: {} },
    })

    cy.visit('#/pacbio/runs')
    cy.get('#editRun-7').click()
    cy.get('ellipse').first().click()
    cy.get('#movieTime').select('15.0')
    cy.get('#loadingTarget').invoke('val')
    cy.get('#updateBtn').click()
    cy.get('button').contains('Update').click()
  })

  it('will not create a run if there is an error', () => {
    cy.intercept('/v1/pacbio/runs/wells/6', {
      statusCode: 422,
      body: {
        data: {
          errors: {
            on_plate_loading_concentration: ["can't be blank"],
          },
        },
      },
    })

    cy.visit('#/pacbio/runs')
    cy.get('#editRun-7').click()
    cy.get('ellipse').first().click()
    cy.get('#onPlateLoadingConc').clear()
    cy.get('#updateBtn').click()
    cy.get('ellipse').first().should('have.class', 'filled')
    cy.get('button').contains('Update').click()
    cy.contains(
      '[data-type=run-validation-message]',
      "Failed to create run in Traction: on_plate_loading_concentration can't be blank",
    )
  })
})
