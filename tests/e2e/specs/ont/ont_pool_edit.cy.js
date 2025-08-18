import OntTagSetFactory from '../../../factories/OntTagSetFactory.js'
import PrinterFactory from '../../../factories/PrinterFactory.js'
import OntPoolFactory from '../../../factories/OntPoolFactory.js'

describe('ONT Pool Edit', () => {
  beforeEach(() => {
    cy.wrap(PrinterFactory()).as('printerFactory')
    cy.get('@printerFactory').then((printerFactory) => {
      cy.intercept('GET', '/v1/printers', {
        statusCode: 200,
        body: printerFactory.content,
      })
    })

    cy.wrap(OntTagSetFactory()).as('ontTagSetFactory')
    cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
      cy.intercept('GET', '/v1/ont/tag_sets?include=tags', {
        statusCode: 200,
        body: ontTagSetFactory.content,
      })
    })
    cy.wrap(OntPoolFactory()).as('ontPoolFactory')
    cy.get('@ontPoolFactory').then((ontPoolFactory) => {
      cy.intercept(
        'v1/ont/pools?page[size]=25&page[number]=1&include=tube,libraries.tag,libraries.request',
        {
          statusCode: 200,
          body: ontPoolFactory.content,
        },
      )
    })
    cy.wrap(OntPoolFactory({ count: 1 })).as('singleOntPoolFactory')
    cy.get('@singleOntPoolFactory').then((singleOntPoolFactory) => {
      cy.intercept(
        'v1/ont/pools/1?include=libraries.tag.tag_set,libraries.source_plate.wells.requests,libraries.source_tube.requests,libraries.request,tube',
        {
          statusCode: 200,
          body: singleOntPoolFactory.content,
        },
      )
    })
    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
    })
  })
  it('updates pool information on clicking requests table rows', () => {
    cy.visit('#/ont/pools')
    cy.get('#pool-index').within(() => {
      cy.get('[data-action=edit-pool]').first().click()
    })

    cy.get('[data-type=plate-item]').should('be.visible')
    cy.get('#Requests').click()

    cy.get('[data-type=pool-library-list]')
      .find('[data-testid=row]')
      .its('length')
      .then((selectedListLength) => {
        // Deselect row globally
        cy.get('#selectedList').should('be.visible').find('#source_identifier').first().click()
        // Assert new length
        cy.get('[data-type=pool-library-list]')
          .find('[data-testid=row]')
          .should('have.length', selectedListLength - 1)

        // Select row globally
        cy.get('#selectedList').find('#source_identifier').first().click()
        cy.get('[data-type=pool-library-list]')
          .find('[data-testid=row]')
          .should('have.length', selectedListLength)
      })
  })

  it('Updates a pool successfully', () => {
    cy.visit('#/ont/pools')
    cy.get('#pool-index').within(() => {
      cy.get('[data-action=edit-pool]').first().click()
    })
    cy.get('[data-type=plate-item]').should('be.visible')
    cy.get('[data-attribute=tag-set-name]').should('be.visible')
    cy.get('[data-type=pool-edit]').within(() => {
      cy.get('[data-attribute=barcode]').should('have.length.greaterThan', 0)
      cy.get('[data-attribute=kit-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    cy.intercept('/v1/ont/pools/1', {
      statusCode: 200,
      body: {},
    })
    cy.get('[data-action=update-pool]').click()
    cy.contains('[data-type=pool-create-message]', 'Pool successfully updated')
  })

  it('Will not update a pool if there is an error', () => {
    cy.visit('#/ont/pools')
    cy.get('#pool-index').within(() => {
      cy.get('[data-action=edit-pool]').first().click()
    })
    cy.get('[data-type=plate-item]').should('be.visible')
    cy.get('[data-attribute=tag-set-name]').should('be.visible')
    cy.get('[data-type=pool-library-edit]').each(($pool) => {
      cy.wrap($pool).within(() => {
        cy.get('[data-attribute=insert-size-error-icon]').should('be.visible')
        cy.get('[data-attribute=insert-size-error-icon]').within(() => {
          cy.get('[data-attribute=pass]').should('be.visible')
        })
        cy.get('[data-attribute=insert-size]').clear()
        cy.get('[data-attribute=insert-size-error-icon]').should('not.exist')
      })
    })
    cy.get('[data-action=update-pool]').click()
    cy.get('[data-type=pool-library-edit]').each(($pool) => {
      cy.wrap($pool).within(() => {
        cy.get('[data-attribute=insert-size-error-icon]').should('be.visible')
        cy.get('[data-attribute=insert-size-error-icon]').within(() => {
          cy.get('[data-attribute=fail]').should('be.visible')
        })
      })
    })
    cy.contains('[data-type=pool-create-message]', 'The pool is invalid')
  })
})
