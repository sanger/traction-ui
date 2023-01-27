describe('ONT Pool Edit', () => {
  beforeEach(() => {
    cy.intercept('v1/ont/pools?include=tube,libraries.tag,libraries.request', {
      fixture: 'tractionOntPools.json',
    })
    cy.intercept(
      'v1/ont/pools/7?include=libraries.tag.tag_set,libraries.source_plate.wells.requests,libraries.source_tube.requests,libraries.request,tube',
      {
        fixture: 'tractionOntPoolWithIncludes.json',
      },
    )
    cy.intercept('/v1/ont/tag_sets?include=tags', {
      fixture: 'tractionOntTagSets.json',
    })
    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
      features: {
        dpl_279_ont_libraries_and_pools: { enabled: true },
      },
    })
  })

  it('Updates a pool successfully', () => {
    cy.visit('#/ont/pools')
    cy.get('.pool [data-action=edit-pool]').first().click()
    cy.get('[data-type=plate-item]').should('be.visible')
    cy.get('[data-attribute=tag-set-name]').should('be.visible')
    cy.get('[data-type=pool-edit]').within(() => {
      cy.get('[data-attribute=barcode]').should('have.length.greaterThan', 0)
      cy.get('[data-attribute=kit-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    cy.intercept('/v1/ont/pools/9', {
      statusCode: 200,
    })
    cy.get('[data-action=update-pool]').click()
    cy.contains('[data-type=pool-create-message]', 'Pool successfully updated')
  })

  it('Will not update a pool if there is an error', () => {
    cy.visit('#/ont/pools')
    cy.get('.pool [data-action=edit-pool]').first().click()
    cy.get('[data-type=plate-item]').should('be.visible')
    cy.get('[data-attribute=tag-set-name]').should('be.visible')
    cy.get('[data-type=pool-library-edit]').within(() => {
      cy.get('[data-attribute=insert-size-error-icon]').should('be.visible')
      cy.get('[data-attribute=insert-size-error-icon]').within(() => {
        cy.get('[data-attribute=pass]').should('be.visible')
      })
      cy.get('[data-attribute=insert-size]').clear()
      cy.get('[data-attribute=insert-size-error-icon]').should('not.exist')
    })
    cy.get('[data-action=update-pool]').click()
    cy.get('[data-type=pool-library-edit]').within(() => {
      cy.get('[data-attribute=insert-size-error-icon]').should('be.visible')
      cy.get('[data-attribute=insert-size-error-icon]').within(() => {
        cy.get('[data-attribute=fail]').should('be.visible')
      })
    })
    cy.contains('[data-type=pool-create-message]', 'The pool is invalid')
  })
})
