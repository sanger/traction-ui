describe('Pacbio Pool Edit', () => {
  beforeEach(() => {
    cy.intercept(
      'v1/pacbio/pools?include=tube,libraries.tag,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id&fields[libraries]=request,tag,run_suitability',
      {
        fixture: 'tractionPacbioPools.json',
      },
    )
    cy.intercept(
      'v1/pacbio/pools/1?include=libraries.tag.tag_set,libraries.source_plate.wells.requests,libraries.request,tube',
      {
        fixture: 'tractionPacbioPool.json',
      },
    )
    cy.intercept('/v1/pacbio/tag_sets?include=tags', {
      fixture: 'tractionPacbioTagSets.json',
    })

    cy.intercept('/v1/pacbio/plates?include=wells.requests', {
      fixture: 'pacbioPlatesRequest.json',
    })

    cy.withFlags({
      enable_custom_form: { enabled: true },
      enable_custom_alert: { enabled: true },
    })
  })

  it('updates pool information on clicking requests table rows', () => {
    cy.visit('#/pacbio/pools')
    cy.get('#pool-index').within(() => {
      cy.get('#edit-pool').first().click()
    })
    cy.get('[data-type=plate-item]').should('be.visible')
    cy.get('#Requests').click()
    cy.get('[data-type=pool-library-list]').within(() => {
      cy.get('[data-testid=row]').should('have.length', 2)
    })
    cy.get('#selectedList').within(() => {
      cy.get('#source_identifier').first().click()
    })
    cy.get('[data-type=pool-library-list]').within(() => {
      cy.get('[data-testid=row]').should('have.length', 3)
    })
    //Deselect row requests
    cy.get('#selectedList').within(() => {
      cy.get('#source_identifier').first().click()
    })
    cy.get('[data-type=pool-library-list]').within(() => {
      cy.get('[data-testid=row]').should('have.length', 2)
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
