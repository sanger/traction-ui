describe('Pacbio Pool Edit', () => {
  beforeEach(() => {
    cy.intercept(
      'v1/pacbio/pools?include=tube,libraries.tag,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id&fields[libraries]=request,tag',
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
  })

  it('Updates a pool successfully', () => {
    cy.visit('#/pacbio/pools')
    cy.get('.pool')
      .first()
      .find('[data-action=edit-pool]')
      .click()
    cy.get('[data-type=plate-item]').should('be.visible')
    cy.get('[data-type=tag-set-item]').should('be.visible')
    cy.get('[data-type=pool-edit]').within(() => {
      cy.get('[data-attribute=barcode]').should('have.length.greaterThan', 0)
      cy.get('[data-attribute=template-prep-kit-box-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    cy.get('[data-action=update-pool]').click()
    // TODO: need to give this a better name
    cy.contains('[data-type=pool-create-message]', 'Pool successfully updated')
  })

  it('Will not update a pool if there is an error', () => {
    // when I visit the pools page
    // and I click on edit pool
    // I should see the pool barcode
    // and the plate
    // and the correct tag set
    // and I remove the insert size
    // and I click on update pool
    // I should see pool not valid
  })
})
