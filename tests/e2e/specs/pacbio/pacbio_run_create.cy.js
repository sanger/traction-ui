import RequestFactory from '../../../support/factoryHelper.js'

const smrtLinkVersionRequestFactory = RequestFactory('tractionPacbioSmrtLinkVersions', false)

describe('Pacbio Run Create view', () => {
  beforeEach(() => {
    cy.intercept('/v1/pacbio/runs?page[size]=25&page[number]=1&include=plates', {
      fixture: 'tractionPacbioRuns.json',
    })
    cy.intercept('/v1/pacbio/smrt_link_versions', {
      statusCode: 201,
      body: smrtLinkVersionRequestFactory.content,
    })

    // Find the pool being searched for by barcode
    cy.intercept(
      '/v1/pacbio/tubes?filter[barcode]=TRAC-2-22&include=pools.libraries.request,pools.requests,pools.used_aliquots.tag,libraries.used_aliquots.request,libraries.used_aliquots.tag&fields[requests]=sample_name&fields[tags]=group_id',
      {
        fixture: 'tractionPacbioTubeWithPool.json',
      },
    )

    // Find the library being searched for by barcode
    cy.intercept(
      '/v1/pacbio/tubes?filter[barcode]=TRAC-2-20&include=pools.libraries.request,pools.requests,pools.used_aliquots.tag,libraries.used_aliquots.request,libraries.used_aliquots.tag&fields[requests]=sample_name&fields[tags]=group_id',
      {
        fixture: 'tractionPacbioTubeWithLibrary.json',
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

  it('Creates a Sequel IIe run successfully - v11', () => {
    const dataTransfer = new DataTransfer()

    // Checks the PacbioRunInfoEdit component
    cy.visit('#/pacbio/runs')
    cy.get('[data-action=new-run]').contains('New Run').click()
    cy.get('[data-attribute="system_name"]').select('Sequel IIe')
    cy.get('[data-attribute="smrt_link_version"]').select('v11')
    cy.get('.pacbioRunInfoEdit')
      .get('[data-attribute="dna_control_complex_box_barcode"]')
      .type('Lxxxxx101717600123199')

    // Type in the barcode of the pool/library being searched, click search
    cy.get('#labware-finder-input').type('TRAC-2-22')
    cy.get('button').contains('Search').click()

    // Add the plate metadata
    cy.get('[data-attribute="sequencing-kit-box-barcode-1"]').type('Lxxxxx101826100123199')

    // Get the pool being searched
    cy.get('[data-attribute="selected-pool-library-list"]')
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

  it('Creates a Revio run successfully - v12_revio', () => {
    const dataTransfer = new DataTransfer()

    // Checks the PacbioRunInfoEdit component
    cy.visit('#/pacbio/runs')
    cy.get('[data-action=new-run]').contains('New Run').click()
    cy.get('[data-attribute="system_name"]').select('Revio')
    cy.get('[data-attribute="smrt_link_version"]').select('v12_revio')

    // Type in the barcode of the pool/library being searched, click search
    cy.get('#labware-finder-input').type('TRAC-2-22')
    cy.get('button').contains('Search').click()

    // Add the plate metadata
    cy.get('[data-attribute="sequencing-kit-box-barcode-1"]').type('Lxxxxx101826100123199')
    // Get the pool being searched
    cy.get('[data-attribute="selected-pool-library-list"]')
      // this obviously gets quite a lot into implementation but at least it works!
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    // Plate 1
    cy.get('[data-attribute=pacbio-run-plate-1]')
      .children()
      .get('[data-attribute=pacbio-run-well]')
      .first()
      .trigger('drop', { dataTransfer: dataTransfer, force: true })
      .trigger('click')
    cy.get('[data-attribute="movie-acquisition-time"]').select('24.0')
    cy.get('[data-attribute="pre-extension-time"]').type('3')
    cy.get('[data-attribute="include-base-kinetics"]').select('True')
    cy.get('[data-attribute="polymerase-kit"]').type('12345')
    cy.get('[data-attribute="library-concentration"]').type('0.75')
    cy.get('#update').click()

    // Add the plate metadata
    cy.get('[data-attribute="sequencing-kit-box-barcode-2"]').type('Lxxxxx101826100123199')
    // Get the pool being searched
    cy.get('[data-attribute="selected-pool-library-list"]')
      // this obviously gets quite a lot into implementation but at least it works!
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    // Plate 2
    cy.get('[data-attribute=pacbio-run-plate-2]')
      .children()
      .get('[data-attribute=pacbio-run-well]')
      .last()
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

  it('Creates a Revio run successfully - v13_revio', () => {
    const dataTransfer = new DataTransfer()

    // Checks the PacbioRunInfoEdit component
    cy.visit('#/pacbio/runs')
    cy.get('[data-action=new-run]').contains('New Run').click()
    cy.get('[data-attribute="system_name"]').select('Revio')
    cy.get('[data-attribute="smrt_link_version"]').select('v13_revio')

    // Type in the barcode of the pool/library being searched, click search
    cy.get('#labware-finder-input').type('TRAC-2-22')
    cy.get('button').contains('Search').click()

    // Add the plate metadata
    cy.get('[data-attribute="sequencing-kit-box-barcode-1"]').type('Lxxxxx101826100123199')
    // Get the pool being searched
    cy.get('[data-attribute="selected-pool-library-list"]')
      // this obviously gets quite a lot into implementation but at least it works!
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    // Plate 1
    cy.get('[data-attribute=pacbio-run-plate-1]')
      .children()
      .get('[data-attribute=pacbio-run-well]')
      .first()
      .trigger('drop', { dataTransfer: dataTransfer, force: true })
      .trigger('click')
    cy.get('[data-attribute="movie-acquisition-time"]').select('24.0')
    cy.get('[data-attribute="pre-extension-time"]').type('3')
    cy.get('[data-attribute="include-base-kinetics"]').select('True')
    cy.get('[data-attribute="polymerase-kit"]').type('12345')
    cy.get('[data-attribute="library-concentration"]').type('0.75')
    cy.get('#update').click()

    // Add the plate metadata
    cy.get('[data-attribute="sequencing-kit-box-barcode-2"]').type('Lxxxxx101826100123199')
    // Get the pool being searched
    cy.get('[data-attribute="selected-pool-library-list"]')
      // this obviously gets quite a lot into implementation but at least it works!
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    // Plate 2
    cy.get('[data-attribute=pacbio-run-plate-2]')
      .children()
      .get('[data-attribute=pacbio-run-well]')
      .last()
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

  it('Creates a run unsuccessfully', () => {
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
    cy.get('[data-attribute="system_name"]').select('Sequel IIe')
    cy.get('[data-attribute="dna_control_complex_box_barcode"]').type('Lxxxxx101717600123199')

    // Type in the barcode of the pool/library being searched, click search
    cy.get('#labware-finder-input').type('TRAC-2-22')
    cy.get('button').contains('Search').click()

    // Add the plate metadata
    cy.get('[data-attribute="sequencing-kit-box-barcode-1"]').type('Lxxxxx101826100123199')

    // Get the pool being searched
    cy.get('[data-attribute="selected-pool-library-list"]')
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

  it('Allows for the selection of well defaults', () => {
    cy.intercept('/v1/pacbio/runs/wells', {
      statusCode: 201,
      body: { data: {} },
    })

    cy.visit('#/pacbio/runs')
    cy.get('[data-action=new-run]').contains('New Run').click()
    cy.get('#system-name').select('Sequel IIe')
    cy.get('[data-attribute="smrt_link_version"]').select('v11')
    cy.get('.pacbioRunInfoEdit')
      .get('#dna-control-complex-box-barcode')
      .type('Lxxxxx101717600123199')

    // Set the default values
    cy.get('[data-attribute="default-movie-time"]').select('15.0')
    cy.get('[data-attribute="default-pre-extension-time"]').clear().type(3)
    cy.get('[data-attribute="default-loading-target-p1-plus-p2"]').clear().type('0.75')
    cy.get('[data-attribute="default-binding-kit-box-barcode"]').type('12345')
    cy.get('[data-attribute="default-ccs-analysis-output-include-kinetics-information"]').select(
      'Yes',
    )
    cy.get('[data-attribute="default-ccs-analysis-output-include-low-quality-reads"]').select('Yes')
    cy.get('[data-attribute="default-demultiplex-barcodes"]').select('Do Not Generate')
    cy.get('[data-attribute="default-include-fivemc-calls-in-cpg-motifs"]').select('No')

    // Add the plate metadata
    cy.get('[data-attribute="sequencing-kit-box-barcode-1"]').type('Lxxxxx101826100123199')

    // Click the first well
    cy.get('[data-attribute=pacbio-run-well]').first().trigger('click')

    cy.get('[data-attribute=modal]').within(() => {
      cy.get('[data-attribute="movie-time"]').contains('15.0')
      cy.get('[data-attribute="binding-kit-box-barcode"]').should('have.value', '12345')
      cy.get('[data-attribute="pre-extension-time"]').should('have.value', '3')
      cy.get('[data-attribute="loading-target-p1-plus-p2"]').should('have.value', '0.75')
      cy.get('[data-attribute="ccs-analysis-output-include-kinetics-information"]').contains('Yes')
      cy.get('[data-attribute="ccs-analysis-output-include-low-quality-reads"]').contains('Yes')
      cy.get('[data-attribute="demultiplex-barcodes"]').contains('Do Not Generate')
      cy.get('[data-attribute="include-fivemc-calls-in-cpg-motifs"]').contains('No')
    })
  })

  it('Resets the run ', () => {
    const dataTransfer = new DataTransfer()

    // Checks the PacbioRunInfoEdit component
    cy.visit('#/pacbio/runs')
    cy.get('[data-action=new-run]').contains('New Run').click()
    cy.get('[data-attribute="system_name"]').select('Sequel IIe')
    cy.get('[data-attribute="smrt_link_version"]').select('v13_sequel_iie')
    cy.get('.pacbioRunInfoEdit')
      .get('[data-attribute="dna_control_complex_box_barcode"]')
      .type('Lxxxxx101717600123199')

    // Type in the barcode of the pool/library being searched, click search
    cy.get('#labware-finder-input').type('TRAC-2-22')
    cy.get('button').contains('Search').click()

    // Add the plate metadata
    cy.get('[data-attribute="sequencing-kit-box-barcode-1"]').type('Lxxxxx101826100123199')
    // Get the pool being searched
    cy.get('[data-attribute="selected-pool-library-list"]')
      // this obviously gets quite a lot into implementation but at least it works!
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    // Plate 1
    cy.get('[data-attribute=pacbio-run-plate-1]')
      .children()
      .get('[data-attribute=pacbio-run-well]')
      .first()
      .trigger('drop', { dataTransfer: dataTransfer, force: true })

    cy.get('#reset').click()
    cy.contains('[data-type=run-validation-message]', 'Run has been reset')

    // After resetting check values are back to default
    cy.get('[data-attribute="system_name"]').contains('Revio')
    cy.get('[data-attribute="system_name"]').select('Sequel IIe')
    cy.get('[data-attribute="smrt_link_version"]').select('v11')
    cy.get('[data-attribute="dna_control_complex_box_barcode"]').should('have.value', '')
    cy.get('[data-attribute="sequencing-kit-box-barcode-1"]').should('have.value', '')
    // bg-gray-100 is the default colour of the well
    cy.get('[data-attribute=pacbio-run-well]').first().should('have.class', 'bg-gray-100')
  })
})
