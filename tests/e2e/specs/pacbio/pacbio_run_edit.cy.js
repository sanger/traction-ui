describe('Pacbio Run Edit view', () => {
  beforeEach(() => {
    cy.intercept('/v1/pacbio/runs', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.intercept('/v1/pacbio/smrt_link_versions', {
      fixture: 'tractionPacbioSmrtLinkVersions.json',
    })

    // Get the existing run to be edited
    cy.intercept(
      'v1/pacbio/runs/7?include=plates.wells.pools.tube,plates.wells.pools.libraries.tag,plates.wells.pools.libraries.request,smrt_link_version',
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
    cy.get('[data-attribute=pacbio-run-well]').first().click()
    cy.get('[data-attribute="movie-acquisition-time"]').select('24.0')
    cy.get('[data-attribute="include-base-kinetics"]').select('True')
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
            sequencing_kit_box_barcode: ["can't be blank"],
          },
        },
      },
    })

    cy.visit('#/pacbio/runs')
    cy.get('#actions').within(() => {
      cy.get('#editRun-7').click()
    })
    cy.get('[data-attribute="sequencing_kit_box_barcode"]').clear()
    cy.get('button').contains('Update').click()
    cy.contains(
      '[data-type=run-create-message]',
      "Failed to create run in Traction: sequencing_kit_box_barcode can't be blank",
    )
  })
})
