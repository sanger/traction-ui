describe('Pacbio Run Create view', () => {
  beforeEach(() => {
    cy.intercept(
      {
        url: '/flipper/api/actors/User',
      },
      {
        statusCode: 200,
        body: {
          flipper_id: 'User',
          features: {
            enable_custom_select: true,
          },
        },
      },
    )
    cy.intercept('/v1/pacbio/runs', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.intercept('/v1/pacbio/smrt_link_versions', {
      fixture: 'tractionPacbioSmrtLinkVersions.json',
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
      '/v1/pacbio/pools?include=tube,libraries.tag,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id&fields[libraries]=request,tag,run_suitability',
      {
        fixture: 'tractionPacbioPools.json',
      },
    )
  })

  it('Creates a run successfully - v10', () => {
    cy.intercept('/v1/pacbio/runs/wells', {
      statusCode: 201,
      body: { data: {} },
    })
    const dataTransfer = new DataTransfer()

    cy.visit('#/pacbio/runs')
    cy.get('button').contains('New Run').click()
    cy.get('#sequencing-kit-box-barcode').type('Lxxxxx101826100123199')
    cy.get('.pacbioRunInfoEdit')
      .get('#dna-control-complex-box-barcode')
      .type('Lxxxxx101717600123199')
    cy.get('#system-name').select('Sequel IIe')
    cy.get('[data-attribute="smrt-link-version"]').select('v10')
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
    cy.get('[data-attribute="movie-time"]').select('15.0')
    cy.get('[data-attribute="on-plate-loading-concentration"]').type('2')
    cy.get('[data-attribute="generate-hifi"]').select('Do Not Generate')
    cy.get('[data-attribute="binding-kit-box-barcode"]').type('12345')
    cy.get('[data-attribute="loading-target-p1-plus-p2"]').type('0.75')
    cy.get('[data-attribute="pre-extension-time"]').type(3)
    cy.get('#updateBtn').click()
    cy.get('button').contains('Create').click()
    // TODO: we need a success message.
  })

  it('Creates a run successfully - v11', () => {
    cy.intercept('/v1/pacbio/runs/wells', {
      statusCode: 201,
      body: { data: {} },
    })
    const dataTransfer = new DataTransfer()

    cy.visit('#/pacbio/runs')
    cy.get('button').contains('New Run').click()
    cy.get('#sequencing-kit-box-barcode').type('Lxxxxx101826100123199')
    cy.get('.pacbioRunInfoEdit')
      .get('#dna-control-complex-box-barcode')
      .type('Lxxxxx101717600123199')
    cy.get('#system-name').select('Sequel IIe')
    cy.get('[data-attribute="smrt-link-version"]').select('v11')
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
    cy.get('[data-attribute="movie-time"]').select('15.0')
    cy.get('[data-attribute="on-plate-loading-concentration"]').type('2')
    cy.get('[data-attribute="demultiplex-barcodes"]').select('Do Not Generate')
    cy.get('[data-attribute="binding-kit-box-barcode"]').type('12345')
    cy.get('[data-attribute="loading-target-p1-plus-p2"]').type('0.75')
    cy.get('[data-attribute="pre-extension-time"]').type(3)
    cy.get('[data-attribute="ccs-analysis-output-include-kinetics-information"]').select('Yes')
    cy.get('[data-attribute="ccs-analysis-output-include-low-quality-reads"]').select('No')
    cy.get('[data-attribute="include-fivemc-calls-in-cpg-motifs"]').select('Yes')

    cy.get('#updateBtn').click()
    cy.get('button').contains('Create').click()
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
    cy.intercept('DELETE', '/v1/pacbio/runs/7', { statusCode: 200 }).as('deleteRun')
    const dataTransfer = new DataTransfer()

    cy.visit('#/pacbio/runs')
    cy.get('button').contains('New Run').click()
    cy.get('#sequencing-kit-box-barcode').type('Lxxxxx101826100123199')
    cy.get('#dna-control-complex-box-barcode').type('Lxxxxx101717600123199')
    cy.get('#system-name').select('Sequel IIe')
    cy.get('.list-group-item')
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    cy.get('ellipse').first().trigger('drop', { dataTransfer: dataTransfer, force: true })
    cy.get('button').contains('Create').click()
    cy.contains(
      '[data-type=run-validation-message]',
      'Failed to create run in Traction: error1 some error',
    )
    // Ensure we made the request
    cy.wait('@deleteRun')
  })

  // need to work out why it can't find binding kit box barcode
  it.skip('allows for the selection of well defaults', () => {
    cy.intercept('/v1/pacbio/runs/wells', {
      statusCode: 201,
      body: { data: {} },
    })
    const dataTransfer = new DataTransfer()

    cy.visit('#/pacbio/runs')
    cy.get('button').contains('New Run').click()
    cy.get('#sequencing-kit-box-barcode').type('Lxxxxx101826100123199')
    cy.get('.pacbioRunInfoEdit')
      .get('#dna-control-complex-box-barcode')
      .type('Lxxxxx101717600123199')
    cy.get('#system-name').select('Sequel IIe')
    cy.get('[data-attribute="smrt-link-version"]').select('v10')

    cy.get('.pacbioRunWellDefaultEdit').within(() => {
      cy.get('[data-attribute="default-movie-time"]').select('15.0')
      cy.get('[data-attribute="default-generate-hifi"]').select('Do Not Generate')
      cy.get('[data-attribute="default-binding-kit-box-barcode"]').type('12345')
      cy.get('[data-attribute="default-loading-target-p1-plus-p2"]').type('0.75')
      cy.get('[data-attribute="default-pre-extension-time"]').clear()
      cy.get('[data-attribute="default-pre-extension-time"]').type(3)
    })

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

    cy.get('.modal-body').within(() => {
      cy.get('[data-attribute="movie-time"]').contains('15.0')
      cy.get('[data-attribute="generate-hifi"]').contains('Do Not Generate')
      cy.get('[data-attribute="binding-kit-box-barcode"]').should('contain', '12345')
      cy.get('[data-attribute="pre-extension-time"]').contains('3')

      cy.get('[data-attribute="loading-target-p1-plus-p2"]').contains('0.75')
    })
  })
})
