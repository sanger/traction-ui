import PacbioTagSetFactory from '../../../factories/PacbioTagSetFactory.js'
import PrinterFactory from '../../../factories/PrinterFactory.js'

import PacbioPlatesRequestFactory from '../../../factories/PacbioPlatesRequestFactory.js'

describe('Pacbio Pool Edit', () => {
  beforeEach(() => {
    cy.wrap(PacbioTagSetFactory()).as('pacbioTagSetFactory')
    cy.wrap(PrinterFactory()).as('printerFactory')

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.intercept('GET', '/v1/pacbio/tag_sets?include=tags', {
        statusCode: 200,
        body: pacbioTagSetFactory.content,
      })
    })

    cy.intercept(
      'v1/pacbio/pools?page[size]=25&page[number]=1&include=tube,used_aliquots.tag,used_aliquots.source,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id',
      {
        fixture: 'tractionPacbioPools.json',
      },
    )

    // move to factory as it calls tag set data.
    cy.intercept(
      'v1/pacbio/pools/1?include=used_aliquots.tag.tag_set,requests.tube,tube,libraries.tube,libraries.request,requests.plate.wells.requests',
      {
        fixture: 'tractionPacbioPool.json',
      },
    )

    cy.wrap(PacbioPlatesRequestFactory()).as('pacbioPlateRequestFactory')
    cy.get('@pacbioPlateRequestFactory').then((pacbioPlateRequestFactory) => {
      cy.intercept('GET', '/v1/pacbio/plates?include=wells.requests', {
        statusCode: 200,
        body: pacbioPlateRequestFactory.content,
      })
    })

    cy.get('@printerFactory').then((printerFactory) => {
      cy.intercept('GET', '/v1/printers', {
        statusCode: 200,
        body: printerFactory.content,
      })
    })
  })

  it('updates pool information on clicking requests table rows', () => {
    cy.visit('#/pacbio/pools')
    cy.get('#pool-index').within(() => {
      cy.get('#edit-pool').first().click()
    })
    cy.get('[data-type=plate-item]').should('be.visible')
    cy.get('[data-attribute=table-check-box]').click()
    cy.get('[data-type=pool-library-list]').within(() => {
      cy.get('[data-testid=row]').should('have.length', 3)
    })

    cy.get('[data-attribute^="request-checkbox"]').eq(1).click()
    cy.get('[data-type=pool-library-list]').within(() => {
      cy.get('[data-testid=row]').should('have.length', 4)
    })

    cy.get('[data-attribute="request-sample-name"]').first().click()
    cy.get('[data-type="pool-aliquot-edit"]')
      .first()
      .invoke('attr', 'class')
      .should('contain', 'border-4 border-purple-500')

    //Deselect row requests
    cy.get('[data-attribute^="request-checkbox"]').eq(1).click()
    cy.get('[data-type=pool-library-list]').within(() => {
      cy.get('[data-testid=row]').should('have.length', 3)
    })
  })
  it('Updates a pool successfully', () => {
    cy.visit('#/pacbio/pools')
    cy.get('#pool-index').within(() => {
      cy.get('#edit-pool').first().click()
    })

    cy.get('[data-type=plate-item]').should('be.visible')
    cy.get('[data-attribute=tag-set-name]').should('be.visible')
    cy.get('[data-type=pool-edit]').within(() => {
      cy.get('[data-attribute=barcode]').should('have.length.greaterThan', 0)
      cy.get('[data-attribute=template-prep-kit-box-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    cy.intercept('/v1/pacbio/pools/242', {
      statusCode: 200,
    })
    cy.get('[data-action=update-pool]').click()
    cy.contains('[data-type=pool-create-message]', 'Pool successfully updated')
  })

  it('Will not update a pool if there is an error', () => {
    cy.visit('#/pacbio/pools')
    cy.get('#pool-index').within(() => {
      cy.get('#edit-pool').first().click()
    })
    cy.get('[data-type=plate-item]').should('be.visible')
    cy.get('[data-attribute=tag-set-name]').should('be.visible')
    cy.get('[data-type=pool-aliquot-edit]')
      .first()
      .within(() => {
        cy.get('[data-attribute=available-volume-div]').contains('6')
        cy.get('[data-attribute=volume-error-icon]').should('be.visible')
        cy.get('[data-attribute=volume-error-icon]').within(() => {
          cy.get('[data-attribute=pass]').should('be.visible')
        })
        cy.get('[data-attribute=volume]').clear().type('8')
        cy.get('[data-attribute=volume-error]').within(() => {
          cy.contains('must be less or equal to available volume')
        })
        cy.get('[data-attribute=volume-error-icon]').within(() => {
          cy.get('[data-attribute=fail]').should('be.visible')
        })
      })
    cy.get('[data-action=update-pool]').click()

    cy.contains('[data-type=pool-create-message]', 'The pool is invalid')
  })
})
