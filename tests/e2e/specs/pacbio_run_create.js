describe('Pacbio Run Create view', () => {
  beforeEach(() => {
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
    cy.intercept(
      '/v1/pacbio/pools?include=tube,libraries.tag,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id&fields[libraries]=request,tag',
      {
        fixture: 'tractionPacbioPools.json',
      },
    )
    cy.intercept('/v1/pacbio/runs?include=plate.wells.pools.tube', {
      fixture: 'tractionPacbioRuns.json',
    })
  })

  it('Creates a run successfully', () => {
    cy.intercept('/v1/pacbio/runs/wells', {
      statusCode: 201,
      body: { data: {} },
    })
    const dataTransfer = new DataTransfer()

    cy.visit('#/pacbio/runs')
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
    cy.get('#movieTime').select('15.0')
    cy.get('#onPlateLoadingConc').type('2')
    cy.get('#generateHiFi').select('Do Not Generate')
    cy.get('#bindingKitBoxBarcode').type('12345')
    cy.get('#updateWellBtn').click()
    cy.get('button')
      .contains('Create')
      .click()
    // TODO: we need a success message.
  })

  it('creates a run unsuccessfully', () => {
    cy.intercept('/v1/pacbio/runs/wells', {
      statusCode: 422,
      body: {
        data: {
          errors: {
            error1: ['some error'],
          },
        },
      },
    })
    cy.intercept('/v1/pacbio/runs/1', {})
    const dataTransfer = new DataTransfer()

    cy.visit('#/pacbio/runs')
    cy.get('button')
      .contains('New Run')
      .click()
    cy.get('#sequencing-kit-box-barcode').type('Lxxxxx101826100123199')
    cy.get('#dna-control-complex-box-barcode').type('Lxxxxx101717600123199')
    cy.get('#system-name').select('Sequel IIe')
    cy.get('.list-group-item')
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    cy.get('ellipse')
      .first()
      .trigger('drop', { dataTransfer: dataTransfer, force: true })
    cy.get('button')
      .contains('Create')
      .click()
    cy.contains(
      '[data-type=run-validation-message]',
      'Failed to create run in Traction: error1 some error',
    )
  })
})
