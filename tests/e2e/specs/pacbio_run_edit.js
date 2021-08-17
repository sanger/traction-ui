describe('Pacbio Run Edit view', () => {
  beforeEach(() => {
    cy.intercept('/v1/pacbio/runs?include=plate.wells.pools.tube', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.intercept('/v1/pacbio/runs/7?include=plate.wells.pools.tube', {
      fixture: 'tractionPacbioRun.json',
    })
    cy.intercept(
      '/v1/pacbio/pools?include=tube,libraries.tag,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id&fields[libraries]=request,tag',
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
  })

  it('Updates a run successfully', () => {
    cy.intercept('/v1/pacbio/runs/wells/6', {
      statusCode: 200,
      body: { data: {} },
    })

    cy.visit('#/pacbio/runs')
    cy.get('#editRun-7').click()
    cy.get('ellipse')
      .first()
      .click()
      .get('#movieTime')
      .select('15.0')
      .get('#updateWellBtn')
      .click()
    cy.get('button')
      .contains('Update')
      .click()
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
    cy.get('ellipse')
      .first()
      .click()
      .get('#movieTime')
      .select('15.0')
      .get('#onPlateLoadingConc')
      .clear()
      .get('#updateWellBtn')
      .click()
    cy.get('ellipse')
      .first()
      .should('have.class', 'filled')
    cy.get('button')
      .contains('Update')
      .click()
    cy.contains(
      '[data-type=run-validation-message]',
      "Failed to create run in Traction: on_plate_loading_concentration can't be blank",
    )
  })
})
