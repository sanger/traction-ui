describe('ONT Pool Edit', () => {
  beforeEach(() => {
    cy.intercept(
      'v1/ont/pools?page[size]=25&page[number]=1&include=tube,libraries.tag,libraries.request',
      {
        fixture: 'tractionOntPools.json',
      },
    )
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
    })
  })
  it('updates pool information on clicking requests table rows', () => {
    cy.visit('#/ont/pools')
    cy.get('#pool-index').within(() => {
      cy.get('[data-action=edit-pool]').first().click()
    })
    cy.get('[data-type=plate-item]').should('be.visible')
    cy.get('#Requests').click()
    //Select row in requests
    let selectedListLength = 0
    cy.get('[data-type=pool-library-list]').within(() => {
      cy.get('[data-testid=row]')
        .its('length')
        .then((length) => {
          selectedListLength = length
        })
    })
    cy.get('#selectedList').within(() => {
      cy.get('#source_identifier').first().click()
    })
    cy.get('[data-type=pool-library-list]').within(() => {
      cy.get('[data-testid=row]').should('have.length', selectedListLength + 1)
    })
    //Deselect row requests
    cy.get('#selectedList').within(() => {
      cy.get('#source_identifier').first().click()
    })
    cy.get('[data-type=pool-library-list]').within(() => {
      cy.get('[data-testid=row]').should('have.length', selectedListLength)
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
    cy.intercept('/v1/ont/pools/9', {
      statusCode: 200,
    })
    cy.get('[data-action=update-pool]').click()
    cy.contains('[data-type=pool-create-message]', 'Pool successfully updated')
  })

  // In some cases we check an element exists instead of being visible as the table may have overflowed
  // causing it to exist but not be visible directly on the screen
  it('Will not update a pool if there is an error', () => {
    cy.visit('#/ont/pools')
    cy.get('#pool-index').within(() => {
      cy.get('[data-action=edit-pool]').first().click()
    })
    cy.get('[data-type=plate-item]').should('be.visible')
    cy.get('[data-attribute=tag-set-name]').should('be.visible')
    cy.get('[data-type=pool-library-edit]').each(($pool) => {
      cy.wrap($pool).within(() => {
        cy.get('[data-attribute=insert-size-error-icon]').should('exist')
        cy.get('[data-attribute=insert-size-error-icon]').within(() => {
          cy.get('[data-attribute=pass]').should('exist')
        })
        cy.get('[data-attribute=insert-size]').clear()
        cy.get('[data-attribute=insert-size-error-icon]').should('not.exist')
      })
    })
    cy.get('[data-action=update-pool]').click()
    cy.get('[data-type=pool-library-edit]').each(($pool) => {
      cy.wrap($pool).within(() => {
        cy.get('[data-attribute=insert-size-error-icon]').should('exist')
        cy.get('[data-attribute=insert-size-error-icon]').within(() => {
          cy.get('[data-attribute=fail]').should('exist')
        })
      })
    })
    cy.contains('[data-type=pool-create-message]', 'The pool is invalid')
  })
})
