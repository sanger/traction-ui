describe('Pacbio Run Edit view', () => {
  beforeEach(() => {
    cy.withFlags({
      enable_custom_table: { enabled: true },
      enable_custom_form: { enabled: true },
    })
    cy.intercept('/v1/pacbio/runs', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.intercept('/v1/pacbio/smrt_link_versions', {
      fixture: 'tractionPacbioSmrtLinkVersions.json',
    })

    // Get the existing run to be edited
    cy.intercept(
      'v1/pacbio/runs/7?include=plate.wells.pools.tube,plate.wells.pools.libraries.tag,plate.wells.pools.libraries.request,smrt_link_version',
      {
        fixture: 'tractionPacbioRun.json',
      },
    )
  })

  it('Updates a run successfully', () => {
    cy.intercept('PATCH', '/v1/pacbio/runs/7', {
      statusCode: 200,
      body: {
        data: {},
      },
    })

    cy.visit('#/pacbio/runs')
    cy.get('#actions').within(() => {
      cy.get('#editRun-7').click()
    })
    cy.get('ellipse').first().click()
    cy.get('[data-attribute="movie-time"]').select('15.0')
    cy.get('[data-attribute="loading-target-p1-plus-p2"]').invoke('val')
    cy.get('#update').click()
    cy.get('button').contains('Update').click()
    cy.contains('[data-type=run-create-message]', 'Run successfully updated')
  })

  it('will not create a run if there is an error', () => {
    cy.intercept('PATCH', '/v1/pacbio/runs/7', {
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
    cy.get('#actions').within(() => {
      cy.get('#editRun-7').click()
    })
    cy.get('ellipse').first().click()
    cy.get('[data-attribute="on-plate-loading-concentration"]').clear()
    cy.get('#update').click()
    cy.get('ellipse').first().should('have.class', 'filled')
    cy.get('button').contains('Update').click()
    cy.contains(
      '[data-type=run-create-message]',
      "Failed to create run in Traction: on_plate_loading_concentration can't be blank",
    )
  })
})
