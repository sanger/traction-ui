import PacbioTagSetFactory from '../../../factories/PacbioTagSetFactory.js'
import PrinterFactory from '../../../factories/PrinterFactory.js'
import TractionPacbioSamplesFactory from '../../../factories/TractionPacbioSamplesFactory.js'

describe('Pacbio library creation from sample', () => {
  beforeEach(() => {
    cy.wrap(PacbioTagSetFactory()).as('pacbioTagSetFactory')
    cy.wrap(PrinterFactory()).as('printerFactory')
    cy.wrap(TractionPacbioSamplesFactory()).as('tractionPacbioSamplesFactory')
  })

  it('Visits the pacbio samples url', () => {
    cy.get('@tractionPacbioSamplesFactory').then((tractionPacbioSamplesFactory) => {
      cy.intercept('/v1/pacbio/requests?page[size]=25&page[number]=1', {
        statusCode: 200,
        body: tractionPacbioSamplesFactory.content.data,
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
    cy.intercept('/v1/pacbio/libraries?include=tube,primary_aliquot', {
      fixture: 'tractionPacbioLibrary.json',
    })
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
    cy.contains('Created library with barcode TRAC-2-1465')
  })
})
