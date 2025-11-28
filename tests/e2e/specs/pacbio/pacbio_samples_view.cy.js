import PacbioTagSetFactory from '../../../factories/PacbioTagSetFactory.js'
import PrinterFactory from '../../../factories/PrinterFactory.js'
import PacbioRequestFactory from '../../../factories/PacbioRequestFactory.js'
import PacbioLibraryFactory from '../../../factories/PacbioLibraryFactory.js'
import LibraryTypeFactory from '../../../factories/LibraryTypeFactory.js'

describe('Pacbio samples view', () => {
  beforeEach(() => {
    cy.withFlags({
      rust_labwhere_service: { enabled: false },
    })
    cy.wrap(PacbioTagSetFactory()).as('pacbioTagSetFactory')
    cy.wrap(PrinterFactory()).as('printerFactory')
    cy.wrap(LibraryTypeFactory()).as('libraryTypeFactory')
    cy.wrap(PacbioRequestFactory({ includeRelationships: false })).as('pacbioRequestFactory')
    cy.wrap(PacbioLibraryFactory({ count: 1 })).as('pacbioLibraryFactory')

    cy.get('@pacbioRequestFactory').then((pacbioRequestFactory) => {
      cy.intercept('/v1/pacbio/requests?page[size]=25&page[number]=1', {
        statusCode: 200,
        body: pacbioRequestFactory.content,
      })
    })

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.intercept('/v1/pacbio/tag_sets?include=tags', {
        statusCode: 200,
        body: pacbioTagSetFactory.content,
      })
    })

    cy.get('@printerFactory').then((printerFactory) => {
      cy.intercept('GET', '/v1/printers', {
        statusCode: 200,
        body: printerFactory.content,
      })
    })

    cy.get('@libraryTypeFactory').then((libraryTypeFactory) => {
      cy.intercept('/v1/library_types', {
        statusCode: 200,
        body: libraryTypeFactory.content,
      })
    })

    cy.intercept('/v1/pacbio/libraries?include=primary_aliquot', {
      statusCode: 200,
      body: {
        data: {
          attributes: {
            barcode: 'TRAC-2-721',
          },
        },
      },
    })

    // Stub labwhere request
    cy.get('@pacbioRequestFactory').then((pacbioRequestFactory) => {
      const labwhereUrl = Cypress.env('VITE_LABWHERE_BASE_URL')
      cy.intercept(`${labwhereUrl}/api/labwares/searches`, {
        statusCode: 200,
        body: [
          {
            barcode:
              pacbioRequestFactory.content.data[0].attributes.source_identifier.split(':')[0],
            created_at: 'Tuesday September 16 2025 10:29',
            updated_at: 'Tuesday September 16 2025 10:29',
            location: {
              id: 432,
              name: 'box-test',
            },
          },
        ],
      })
    })
  })

  it('Visits the pacbio samples url and displays data', () => {
    cy.visit('#/pacbio/samples')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue')
      .children()
      .should('contain', 'Source')
      .and('contain', 'Species')
      .and('contain', 'Name')

    cy.get('@pacbioRequestFactory').then((pacbioRequestFactory) => {
      cy.get('#samples-table')
        .find('tr')
        .should('have.length', pacbioRequestFactory.content.data.length + 1)
    })
    // Define an array of all column keys
    const columnKeys = [
      'id',
      'sample_name',
      'sample_species',
      'source_identifier',
      'sample_retention_instruction',
      'created_at',
    ]
    // Iterate over the column IDs and verify each has a length greater than 0
    columnKeys.forEach((columnKey) => {
      cy.get(`[data-attribute=${columnKey}]`).first().should('have.length.greaterThan', 0)
    })

    // Handle location column separately to confirm labwhere call is working
    cy.get('[data-attribute=location]').last().should('contain', 'box-test')
  })

  it('creates a library  successfully', () => {
    cy.visit('#/pacbio/samples')
    cy.get('#samples-table').contains('td', '5')
    cy.get('#samples-table').first().click()
    cy.get('#pacbioLibraryCreate').click()
    cy.get('#libraryForm').should('be.visible')

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.get('#tag-set-input').select(pacbioTagSetFactory.storeData.selected.tagSet.name)
      cy.get('#tag-input').select(pacbioTagSetFactory.storeData.selected.tag.group_id)
    })

    cy.get('#library-volume').type(1)
    cy.get('#library-concentration').type(1)
    cy.get('#library-templatePrepKitBoxBarcode').type('012345678901234567890')
    cy.get('#library-insertSize').type(1)
    cy.get('#create-btn').click()
    cy.get('#libraryForm').should('not.exist')
    cy.contains('Created library with barcode TRAC-2-721')
  })

  it('edits a sample successfully', () => {
    // Stub the PATCH request for updating a sample
    // N.B. Use a wildcard for the sample ID so we don't tie the test to a specific fixture
    cy.intercept('PATCH', '/v1/pacbio/requests/*', {
      statusCode: 200,
      body: {
        data: {},
      },
    })
    cy.visit('#/pacbio/samples')
    cy.get('#samples-table').contains('td', '5')
    cy.get('[data-attribute="sample-edit"]').first().click()
    cy.get('[data-attribute="modal"]').should('be.visible')
    cy.get('[data-attribute="library-type-list"]').select('Pacbio_HiFi_mplx')
    cy.get('#estimateOfGBRequired').type(1)
    cy.get('#numberOfSMRTCells').type('2')
    cy.get('#costCode').type(123)
    cy.get('[data-attribute="update-sample-btn"]').click()
    cy.get('[data-attribute="modal"]').should('not.exist')
    cy.contains('Sample updated')
  })
})
