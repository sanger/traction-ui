import PacbioTagSetFactory from '../../../factories/PacbioTagSetFactory.js'
import PrinterFactory from '../../../factories/PrinterFactory.js'
import PacbioLibraryFactory from '../../../factories/PacbioLibraryFactory.js'

describe('Pacbio Libraries view', () => {
  beforeEach(() => {
    cy.wrap(PacbioTagSetFactory()).as('pacbioTagSetFactory')
    cy.wrap(PrinterFactory()).as('printerFactory')
    cy.wrap(PacbioLibraryFactory()).as('pacbioLibraryFactory')

    cy.get('@pacbioLibraryFactory').then((pacbioLibraryFactory) => {
      cy.intercept('/v1/pacbio/libraries?page[size]=25&page[number]=1&include=request,tag,tube', {
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
    cy.get('#id').should('have.length.above', 0)
    cy.get('#sample_name').should('have.length.greaterThan', 0)
    cy.get('#barcode').should('have.length.greaterThan', 0)
    cy.get('#source_identifier').should('have.length.greaterThan', 0)
    cy.get('#volume').should('have.length.greaterThan', 0)
    cy.get('#concentration').should('have.length.greaterThan', 0)
    cy.get('#template_prep_kit_box_barcode').should('have.length.greaterThan', 0)
    cy.get('#insert_size').should('have.length.greaterThan', 0)
    cy.get('button').filter(':contains("Edit")').should('have.length.greaterThan', 0)
  })

  // it would be better to use the factory to get the values.
  it('allows editing a library and updates the library values', () => {
    cy.intercept('PATCH', '/v1/pacbio/libraries/722', {
      statusCode: 200,
      body: {
        data: {},
      },
    })
    cy.visit('#/pacbio/libraries')
    //When clicking on edit again on a librray with no  tag
    cy.get('#show_details').within(() => {
      cy.get('#edit-btn-722').click()
    })
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
    cy.get('#library-volume').clear().type('2')
    cy.get('#library-concentration').clear().type('2')
    cy.get('#library-insertSize').clear().type('200')
    cy.get('#library-templatePrepKitBoxBarcode').clear().type('LK54321')
    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.get('#tag-set-input').select(pacbioTagSetFactory.storeData.selected.tagSet.name)
      cy.get('#tag-input').select(pacbioTagSetFactory.storeData.selected.tag.group_id)
    })
    cy.get('#update-btn').click()
    cy.contains('Updated library with barcode TRAC-2-722')
    cy.get('#libraryForm').should('not.exist')

    //It should display updated values in table
    cy.get('#volume').first().should('have.text', '2')
    cy.get('#concentration').first().should('have.text', '2')
    cy.get('#template_prep_kit_box_barcode').first().should('have.text', 'LK54321')
    cy.get('#insert_size').first().should('have.text', '200')
    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.get('#tag_group_id')
        .first()
        .should('have.text', pacbioTagSetFactory.storeData.selected.tag.group_id)
    })
  })
})
