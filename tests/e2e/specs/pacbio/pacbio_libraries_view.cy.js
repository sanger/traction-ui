import PacbioTagSetFactory from '../../../factories/PacbioTagSetFactory.js'
import PrinterFactory from '../../../factories/PrinterFactory.js'
import PacbioLibraryFactory from '../../../factories/PacbioLibraryFactory.js'

describe('Pacbio Libraries view', () => {
  beforeEach(() => {
    cy.wrap(PacbioTagSetFactory()).as('pacbioTagSetFactory')
    cy.wrap(PrinterFactory()).as('printerFactory')
    cy.wrap(PacbioLibraryFactory()).as('pacbioLibraryFactory')

    cy.get('@pacbioLibraryFactory').then((pacbioLibraryFactory) => {
      cy.intercept('/v1/pacbio/libraries?page[size]=25&page[number]=1&include=request,tag', {
        statusCode: 200,
        body: pacbioLibraryFactory.content,
      })
    })
    cy.get('@printerFactory').then((printerFactory) => {
      cy.intercept('GET', '/v1/printers', {
        statusCode: 200,
        body: printerFactory.content,
      })
    })
    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.intercept('GET', '/v1/pacbio/tag_sets?include=tags', {
        statusCode: 200,
        body: pacbioTagSetFactory.content,
      })
    })

    // Stub labwhere request
    cy.get('@pacbioLibraryFactory').then((pacbioLibraryFactory) => {
      const labwhereUrl = Cypress.env('VITE_LABWHERE_BASE_URL')
      cy.intercept(`${labwhereUrl}/api/labwares/searches`, {
        statusCode: 200,
        body: [
          {
            barcode: pacbioLibraryFactory.content.data[0].attributes.barcode,
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

  it('Visits the pacbio libraries url', () => {
    cy.visit('#/pacbio/libraries')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue')
      .children()
      .should('contain', 'Barcode')
      .and('contain', 'Sample Name')
      .and('contain', 'Source')
    cy.get('#library-index').contains('tr', '5')
    cy.get('[data-attribute=id]').first().should('have.length.above', 0)
    cy.get('[data-attribute=sample_name]').first().should('have.length.greaterThan', 0)
    cy.get('[data-attribute=barcode]').first().should('have.length.greaterThan', 0)
    cy.get('[data-attribute=source_identifier]').first().should('have.length.greaterThan', 0)
    cy.get('[data-attribute=volume]').first().should('have.length.greaterThan', 0)
    cy.get('[data-attribute=available_volume]').first().should('have.length.greaterThan', 0)
    cy.get('[data-attribute=concentration]').first().should('have.length.greaterThan', 0)
    cy.get('[data-attribute=template_prep_kit_box_barcode]')
      .first()
      .should('have.length.greaterThan', 0)
    cy.get('[data-attribute=insert_size]').first().should('have.length.greaterThan', 0)
    cy.get('button').filter(':contains("Edit")').should('have.length.greaterThan', 0)

    // Handle location column separately to confirm labwhere call is working
    cy.get('[data-attribute=location]').last().should('contain', 'box-test')
  })

  // it would be better to use the factory to get the values.
  it('allows editing a library and updates the library values', () => {
    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.intercept('PATCH', '/v1/pacbio/libraries/725', {
        statusCode: 200,
        body: {
          data: {
            id: '725',
            attributes: {
              concentration: 2.0,
              template_prep_kit_box_barcode: 'LK54321',
              volume: 3.0,
              available_volume: 3.0,
              insert_size: 200,
              tag_id: pacbioTagSetFactory.storeData.selected.tag.id,
              barcode: 'TRAC-2-725',
            },
          },
        },
      })
    })

    cy.visit('#/pacbio/libraries')
    //When clicking on edit again on a library with no  tag
    cy.get('#edit-btn-725').click()
    //It should show the form to edit the library with the values with an empty tag
    cy.get('#libraryForm').should('be.visible')
    cy.get('#library-volume').should('have.value', '1')
    cy.get('#library-concentration').should('have.value', '1')
    cy.get('#library-insertSize').should('have.value', '100')
    cy.get('#library-templatePrepKitBoxBarcode').should('have.value', 'LK12345')
    cy.get('#tag-set-input').should('have.value', '')
    cy.get('#tag-input').should('be.disabled')

    //It should update the library values
    cy.get('#library-volume').focus().should('not.be.disabled').clear()
    cy.get('#library-volume').clear().type('3')
    cy.get('#library-concentration').clear().type('2')
    cy.get('#library-insertSize').clear().type('200')
    cy.get('#library-templatePrepKitBoxBarcode').clear().type('LK54321')
    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.get('#tag-set-input').select(pacbioTagSetFactory.storeData.selected.tagSet.name)
      cy.get('#tag-input').select(pacbioTagSetFactory.storeData.selected.tag.group_id)
    })
    cy.get('#update-btn').click()
    cy.contains('Updated library with barcode TRAC-2-725')
    cy.get('#libraryForm').should('not.exist')

    //It should display updated values in table
    cy.get('[data-attribute=volume]').first().should('have.text', '3')
    cy.get('[data-attribute=available_volume]').first().should('have.text', '3')
    cy.get('[data-attribute=concentration]').first().should('have.text', '2')
    cy.get('[data-attribute=template_prep_kit_box_barcode]').first().should('have.text', 'LK54321')
    cy.get('[data-attribute=insert_size]').first().should('have.text', '200')
    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.get('[data-attribute=tag_group_id]')
        .first()
        .should('have.text', pacbioTagSetFactory.storeData.selected.tag.group_id)
    })
  })

  it('Allows multiple library deletion', () => {
    cy.intercept('DELETE', '/v1/pacbio/libraries/724', {
      statusCode: 204,
    })

    cy.intercept('DELETE', '/v1/pacbio/libraries/725', {
      statusCode: 204,
    })

    cy.visit('#/pacbio/libraries')
    cy.get('#library-index').contains('tr', '5')

    // Click the first two table rows
    cy.get('#library-index').find('tbody tr').first().click()
    cy.get('#library-index').find('tbody tr').eq(1).click()

    cy.get('#deleteLibraries').click()
    cy.get('[data-attribute=confirm-delete-libraries-button]').first().contains('Yes').click()
    cy.get('[data-attribute=message]').first().contains('Libraries 725, 724 successfully deleted ')
  })
})
