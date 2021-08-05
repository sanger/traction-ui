describe('Pacbio Run Create view', () => {
  it('Creates a run successfully', () => {
    const dataTransfer = new DataTransfer()

    cy.intercept('/v1/pacbio/runs?include=plate.wells.pools.tube', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.visit('#/pacbio/runs')
    cy.intercept(
      '/v1/pacbio/pools?include=tube,libraries.tag,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id&fields[libraries]=request,tag',
      {
        fixture: 'tractionPacbioPools.json',
      },
    )
    cy.get('button')
      .contains('New Run')
      .click()
    cy.get('#sequencing-kit-box-barcode').type('Lxxxxx101826100123199')
    cy.get('#dna-control-complex-box-barcode').type('Lxxxxx101717600123199')
    cy.get('#system-name').select('Sequel IIe')
    // TODO: calling it  list group item is not specific enough
    cy.get('.list-group-item')
      // this obviously gets quite a lot into implementation but at least it works!
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    // again better to rename this item to make it more descriptive
    cy.get('ellipse')
      .first()
      .trigger('drop', { dataTransfer: dataTransfer, force: true })
      .trigger('click')
      .get('#movieTime')
      .select('15.0')
      .get('#onPlateLoadingConc')
      .type('2')
      .get('#insertSize')
      .type('10')
      .get('#generateHiFi')
      .select('Do Not Generate')
      .get('#bindingKitBoxBarcode')
      .type('12345')
      .get('button')
      .contains('Update')
      .click()
    // lots of complex calls. Maybe we only need one.
    cy.intercept('/v1/pacbio/runs', {
      statusCode: 201,
      body: {
        data: {
          id: '1',
          type: 'runs',
          links: {
            self: '/v1/pacbio/runs/1',
          },
        },
      },
    })
    cy.intercept('/v1/pacbio/runs/plates', {
      statusCode: 201,
      body: {
        data: {
          id: 1,
          type: 'plates',
          links: {
            self: '/v1/pacbio/runs/plates/1',
          },
        },
      },
    })
    cy.intercept('/v1/pacbio/runs/wells', {
      statusCode: 201,
      body: { data: {} },
    })
    cy.get('button')
      .contains('Create')
      .click()

    // TODO: we need a success message.
  })
})
