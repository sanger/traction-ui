import PacbioSmrtLinkVersionFactory from '../../../factories/PacbioSmrtLinkVersionFactory.js'
import PacbioRunFactory from '../../../factories/PacbioRunFactory.js'
import PacbioTubeFactory from '../../../factories/PacbioTubeFactory.js'

describe('Pacbio Run Create view', () => {
  beforeEach(() => {
    cy.wrap(PacbioRunFactory()).as('pacbioRunFactory')
    cy.get('@pacbioRunFactory').then((pacbioRunFactory) => {
      cy.intercept('GET', '/v1/pacbio/runs?page[size]=25&page[number]=1', {
        statusCode: 200,
        body: pacbioRunFactory.content,
      })
    })

    cy.intercept('GET', '/v1/pacbio/smrt_link_versions', {
      statusCode: 200,
      body: PacbioSmrtLinkVersionFactory().content,
    })

    // Find the pool being searched for by barcode
    cy.wrap(PacbioTubeFactory({ findBy: 'pools' })).as('pacbioTubeFactoryWithPool')
    cy.get('@pacbioTubeFactoryWithPool').then((pacbioTubeFactoryWithPool) => {
      cy.intercept(
        '/v1/pacbio/tubes?include=pools.libraries.request,pools.requests,pools.used_aliquots.tag,libraries.used_aliquots.request,libraries.used_aliquots.tag&fields[requests]=sample_name&fields[tags]=group_id&filter[barcode]=TRAC-2-22',
        {
          statusCode: 200,
          body: pacbioTubeFactoryWithPool.content,
        },
      )
    })

    // Find the library being searched for by barcode
    cy.wrap(PacbioTubeFactory({ findBy: 'libraries' })).as('pacbioTubeFactoryWithLibrary')
    cy.get('@pacbioTubeFactoryWithLibrary').then((pacbioTubeFactoryWithLibrary) => {
      cy.intercept(
        '/v1/pacbio/tubes?include=pools.libraries.request,pools.requests,pools.used_aliquots.tag,libraries.used_aliquots.request,libraries.used_aliquots.tag&fields[requests]=sample_name&fields[tags]=group_id&filter[barcode]=TRAC-2-20',
        {
          statusCode: 200,
          body: pacbioTubeFactoryWithLibrary.content,
        },
      )
    })

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
    cy.get('[data-attribute="loading-target-p1-plus-p2"]').clear().type('0.75')
    cy.get('[data-attribute="pre-extension-time"]').type(3)
    cy.get('[data-attribute="ccs-analysis-output-include-kinetics-information"]').select('Yes')
    cy.get('[data-attribute="ccs-analysis-output-include-low-quality-reads"]').select('No')
    cy.get('[data-attribute="include-fivemc-calls-in-cpg-motifs"]').select('Yes')
    cy.get('[data-attribute="aliquot-volume"]').clear().type('10')

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
    cy.get('[data-attribute="aliquot-volume"]').clear().type('10')
    cy.get('#update').click()

    cy.get('[data-attribute="message"]').within(() => {
      cy.get('[data-attribute="dismiss"]').click()
    })

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
    // this is related to the available volume of the library so better to use the data
    cy.get('[data-attribute="aliquot-volume"]').clear().type('10')

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
    // this is related to the available volume of the library so better to use the data
    cy.get('[data-attribute="aliquot-volume"]').clear().type('10')

    cy.get('#update').click()

    cy.get('[data-attribute="message"]').within(() => {
      cy.get('[data-attribute="dismiss"]').click()
    })

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
    cy.get('[data-attribute="aliquot-volume"]').clear().type('10')

    cy.get('#update').click()

    cy.get('button').contains('Create').click()
    cy.contains('[data-type=run-create-message]', 'Run successfully created')
  })

  it('Creates a Revio run successfully - v25_1_revio', () => {
    const dataTransfer = new DataTransfer()

    // Checks the PacbioRunInfoEdit component
    cy.visit('#/pacbio/runs')
    cy.get('[data-action=new-run]').contains('New Run').click()
    cy.get('[data-attribute="system_name"]').select('Revio')
    cy.get('[data-attribute="smrt_link_version"]').select('v25_1_revio')

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
    cy.get('[data-attribute="include-base-kinetics"]').select('True')
    cy.get('[data-attribute="library-concentration"]').type('0.75')
    // Adaptive loading is disabled on a per-well basis and controlled by the well defaults value
    cy.get('[data-attribute="use-adaptive-loading"]')
      .should('have.value', 'False')
      .and('be.disabled')
    cy.get('[data-attribute="full-resolution-base-qual"]').select('True')
    // this is related to the available volume of the library so better to use the data
    cy.get('[data-attribute="aliquot-volume"]').clear().type('10')

    cy.get('#update').click()

    cy.get('[data-attribute="message"]').within(() => {
      cy.get('[data-attribute="dismiss"]').click()
    })

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
    cy.get('[data-attribute="include-base-kinetics"]').select('True')
    cy.get('[data-attribute="library-concentration"]').type('0.75')
    // Adaptive loading is disabled on a per-well basis and controlled by the well defaults value
    cy.get('[data-attribute="use-adaptive-loading"]')
      .should('have.value', 'False')
      .and('be.disabled')

    cy.get('[data-attribute="full-resolution-base-qual"]').select('True')
    cy.get('[data-attribute="aliquot-volume"]').clear().type('10')

    cy.get('#update').click()

    cy.get('button').contains('Create').click()
    cy.contains('[data-type=run-create-message]', 'Run successfully created')
  })

  it('Creates a run unsuccessfully', () => {
    cy.intercept('POST', '/v1/pacbio/runs', {
      statusCode: 422,
      body: {
        errors: {
          error1: ['some error'],
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

  it('Correctly displays the available volume information for a library in a well', () => {
    const dataTransfer = new DataTransfer()

    //Create a well with library TRAC-2-20
    cy.visit('#/pacbio/runs')
    cy.get('[data-action=new-run]').contains('New Run').click()
    cy.get('#labware-finder-input').type('TRAC-2-20')
    cy.get('button').contains('Search').click()

    cy.get('[data-attribute="selected-pool-library-list"]')
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    cy.get('[data-attribute=pacbio-run-well]')
      .first()
      .trigger('drop', { dataTransfer: dataTransfer, force: true })
      .trigger('click')
    //It displays the correct volume information for the library in this context
    cy.get('[data-attribute=available-volume-badge]').contains('20')
    //Initialises the volume to available volume
    cy.get('[data-attribute="aliquot-volume"]').should('have.value', 20)
    cy.get('[data-attribute="aliquot-volume"]').clear().type('5')
    cy.get('#update').click()

    cy.get('[data-attribute="message"]').within(() => {
      cy.get('[data-attribute="dismiss"]').click()
    })

    //Create another well with same library TRAC-2-20
    cy.get('[data-attribute="selected-pool-library-list"]')
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    cy.get('[data-attribute=pacbio-run-well]')
      .eq(1)
      .trigger('drop', { dataTransfer: dataTransfer, force: true })
      .trigger('click')
    //It displays the correct volume information for the library in this context
    cy.get('[data-attribute=available-volume-badge]').contains(15)
    cy.get('[data-attribute="aliquot-volume"]').clear().type('10')
    cy.get('#update').click()

    cy.get('[data-attribute="message"]').within(() => {
      cy.get('[data-attribute="dismiss"]').click()
    })

    //Open the first well
    cy.get('[data-attribute=pacbio-run-well]').eq(0).trigger('click')
    //It should update the availble volume with the volume used in the second well
    cy.get('[data-attribute=available-volume-badge]').contains(10)
    //Once updated, the volume field displays the edited value
    cy.get('[data-attribute="aliquot-volume"]').should('have.value', '5')
    cy.get('#update').click()

    //Open the second well
    cy.get('[data-attribute=pacbio-run-well]').eq(1).trigger('click')
    //It should update the availble volume with the volume used in the first well
    cy.get('[data-attribute=available-volume-badge]').contains('15')
  })

  it('Correctly displays the available volume information for a pool in a well', () => {
    const dataTransfer = new DataTransfer()

    cy.visit('#/pacbio/runs')
    cy.get('[data-action=new-run]').contains('New Run').click()
    //Create a well with pool TRAC-2-22
    cy.get('#labware-finder-input').type('TRAC-2-22')
    cy.get('button').contains('Search').click()

    cy.get('[data-attribute="selected-pool-library-list"]')
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    cy.get('[data-attribute=pacbio-run-well]')
      .first()
      .trigger('drop', { dataTransfer: dataTransfer, force: true })
      .trigger('click')
    //It displays the correct volume information for the pool in this context
    cy.get('[data-attribute=available-volume-badge]').contains('20')
    //Initialises the volume to available volume
    cy.get('[data-attribute="aliquot-volume"]').should('have.value', 20)
    cy.get('[data-attribute="aliquot-volume"]').clear().type('5')
    cy.get('#update').click()

    cy.get('[data-attribute="message"]').within(() => {
      cy.get('[data-attribute="dismiss"]').click()
    })

    //Create another well with same pool TRAC-2-22
    cy.get('[data-attribute="selected-pool-library-list"]')
      .first()
      .trigger('dragstart', { dataTransfer: dataTransfer, force: true })
      .trigger('drag', { dataTransfer: dataTransfer, force: true })
    cy.get('[data-attribute=pacbio-run-well]')
      .eq(1)
      .trigger('drop', { dataTransfer: dataTransfer, force: true })
      .trigger('click')
    //It displays the correct volume information for the pool in this context
    cy.get('[data-attribute=available-volume-badge]').contains(15)
    cy.get('[data-attribute="aliquot-volume"]').clear().type('10')
    cy.get('#update').click()

    cy.get('[data-attribute="message"]').within(() => {
      cy.get('[data-attribute="dismiss"]').click()
    })

    //Open the first well
    cy.get('[data-attribute=pacbio-run-well]').eq(0).trigger('click')
    //It should update the availble volume with the volume used in the second well
    cy.get('[data-attribute=available-volume-badge]').contains(10)
    //Once updated, the volume field displays the edited value
    cy.get('[data-attribute="aliquot-volume"]').should('have.value', '5')
    cy.get('#update').click()

    //Open the second well
    cy.get('[data-attribute=pacbio-run-well]').eq(1).trigger('click')
    //It should update the availble volume with the volume used in the first well
    cy.get('[data-attribute=available-volume-badge]').contains('15')
  })
})
