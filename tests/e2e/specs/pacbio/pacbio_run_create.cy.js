describe('Pacbio Run Create view', () => {
  beforeEach(() => {
    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
    })
    cy.intercept('/v1/pacbio/runs', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.intercept('/v1/pacbio/smrt_link_versions', {
      fixture: 'tractionPacbioSmrtLinkVersions.json',
    })

    // Find the pool being searched for by barcode
    cy.intercept(
      '/v1/pacbio/pools?filter[barcode]=TRAC-2-2&include=tube,libraries.tag,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id&fields[libraries]=request,tag,run_suitability',
      {
        fixture: 'pacbioPool.json',
      },
    )

    // Message on successful creation or edit of the run
    cy.intercept('POST', '/v1/pacbio/runs', {
      statusCode: 201,
      body: {
        data: {},
      },
    })
  })

  it('Creates a run successfully - v11', () => {
    const dataTransfer = new DataTransfer()

    // Checks the PacbioRunInfoEdit component
    cy.visit('#/pacbio/runs')
    cy.get('[data-action=new-run]').contains('New Run').click()
    cy.get('[data-attribute="sequencing_kit_box_barcode"]').type('Lxxxxx101826100123199')
    cy.get('.pacbioRunInfoEdit')
      .get('[data-attribute="dna_control_complex_box_barcode"]')
      .type('Lxxxxx101717600123199')
    cy.get('[data-attribute="system_name"]').select('Sequel IIe')
    cy.get('[data-attribute="smrt_link_version"]').select('v11')
    // TODO: calling it  list group item is not specific enough

    // Get the PacbioPoolList component, type in the barcode of the pool being searched, click search
    cy.get('#labware-finder-input').type('TRAC-2-2')
    cy.get('button').contains('Search').click()

    // Get the pool being searched
    cy.get('[data-attribute="selected-pool-list"]')
      // this obviously gets quite a lot into implementation but at least it works!
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    cy.get('[data-attribute=pacbio-run-well]')
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

    cy.get('#update').click()
    cy.get('button').contains('Create').click()
    cy.contains('[data-type=run-create-message]', 'Run successfully created')
  })

  it('Creates a run successfully - v12', () => {
    const dataTransfer = new DataTransfer()

    // Checks the PacbioRunInfoEdit component
    cy.visit('#/pacbio/runs')
    cy.get('[data-action=new-run]').contains('New Run').click()
    cy.get('[data-attribute="sequencing_kit_box_barcode"]').type('Lxxxxx101826100123199')
    cy.get('.pacbioRunInfoEdit')
      .get('[data-attribute="dna_control_complex_box_barcode"]')
      .type('Lxxxxx101717600123199')
    cy.get('[data-attribute="system_name"]').select('Revio')
    cy.get('[data-attribute="smrt_link_version"]').select('v12_revio')
    // TODO: calling it  list group item is not specific enough

    // Get the PacbioPoolList component, type in the barcode of the pool being searched, click search
    cy.get('#labware-finder-input').type('TRAC-2-2')
    cy.get('button').contains('Search').click()

    // Get the pool being searched
    cy.get('[data-attribute="selected-pool-list"]')
      // this obviously gets quite a lot into implementation but at least it works!
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    cy.get('[data-attribute=pacbio-run-well]')
      .first()
      .trigger('drop', { dataTransfer: dataTransfer, force: true })
      .trigger('click')
    cy.get('[data-attribute="movie-acquisition-time"]').select('24.0')
    cy.get('[data-attribute="pre-extension-time"]').type('3')
    cy.get('[data-attribute="include-base-kinetics"]').select('True')
    cy.get('[data-attribute="polymerase-kit"]').type('12345')
    cy.get('[data-attribute="library-concentration"]').type('0.75')

    cy.get('#update').click()
    cy.get('button').contains('Create').click()
    cy.contains('[data-type=run-create-message]', 'Run successfully created')
  })

  it('creates a run unsuccessfully', () => {
    cy.intercept('POST', '/v1/pacbio/runs', {
      statusCode: 422,
      body: {
        data: {
          errors: {
            error1: ['some error'],
          },
        },
      },
    })
    const dataTransfer = new DataTransfer()

    // Checks the PacbioRunInfoEdit component
    cy.visit('#/pacbio/runs')
    cy.get('[data-action=new-run]').contains('New Run').click()
    cy.get('[data-attribute="sequencing_kit_box_barcode"]').type('Lxxxxx101826100123199')
    cy.get('[data-attribute="dna_control_complex_box_barcode"]').type('Lxxxxx101717600123199')
    cy.get('[data-attribute="system_name"]').select('Sequel IIe')

    // Get the PacbioPoolList component, type in the barcode of the pool being searched, click search
    cy.get('#labware-finder-input').type('TRAC-2-2')
    cy.get('button').contains('Search').click()

    // Get the pool being searched
    cy.get('[data-attribute="selected-pool-list"]')
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    cy.get('[data-attribute=pacbio-run-well]')
      .first()
      .trigger('drop', { dataTransfer: dataTransfer, force: true })

    cy.get('button').contains('Create').click()
    cy.contains(
      '[data-type=run-create-message]',
      'Failed to create run in Traction: error1 some error',
    )
  })

  // need to work out why it can't find binding kit box barcode
  it.skip('allows for the selection of well defaults', () => {
    cy.intercept('/v1/pacbio/runs/wells', {
      statusCode: 201,
      body: { data: {} },
    })
    const dataTransfer = new DataTransfer()

    cy.visit('#/pacbio/runs')
    cy.get('[data-action=new-run]').contains('New Run').click()
    cy.get('#sequencing-kit-box-barcode').type('Lxxxxx101826100123199')
    cy.get('.pacbioRunInfoEdit')
      .get('#dna-control-complex-box-barcode')
      .type('Lxxxxx101717600123199')
    cy.get('#system-name').select('Sequel IIe')
    cy.get('[data-attribute="smrt-link-version"]').select('v11')

    cy.get('.pacbioRunWellDefaultEdit').within(() => {
      cy.get('[data-attribute="default-movie-time"]').select('15.0')
      cy.get('[data-attribute="default-generate-hifi"]').select('Do Not Generate')
      cy.get('[data-attribute="default-binding-kit-box-barcode"]').type('12345')
      cy.get('[data-attribute="default-loading-target-p1-plus-p2"]').type('0.75')
      cy.get('[data-attribute="default-pre-extension-time"]').clear()
      cy.get('[data-attribute="default-pre-extension-time"]').type(3)
    })

    // TODO: calling it  list group item is not specific enough
    cy.get('[data-attribute="selected-pool-list"]')
      // this obviously gets quite a lot into implementation but at least it works!
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    cy.get('[data-attribute=pacbio-run-well]')
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
