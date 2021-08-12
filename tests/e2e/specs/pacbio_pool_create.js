describe('Pacbio Pool Create', () => {
  beforeEach(() => {
    cy.intercept('/v1/pacbio/tag_sets?include=tags', {
      fixture: 'tractionPacbioTagSets.json',
    })

    cy.intercept('/v1/pacbio/plates?include=wells.requests', {
      fixture: 'pacbioPlatesRequest.json',
    })
  })

  it('Creates a pool successfully', () => {
    cy.visit('#/pacbio/pool/new')
    cy.contains('Pool')
    cy.get('[data-type=labware-list]')
      .find('[data-action=select-labware]')
      .first()
      .click()
    cy.get('[data-input=labware-find]').type('DN814567Q{enter}')

    cy.get('[data-type=plate-item]').should('have.length', 2)

    cy.get('[data-type=tag-set-list]').select('IsoSeq_v1')
    cy.get('[data-attribute=group-id]').should('have.length', 12)

    //TODO: add at least one more sample
    cy.get('[data-type=selected-plate-list]').within(() => {
      cy.get('[data-type=plate-item]').first()
      cy.get('ellipse')
        .first()
        .click()
    })
    cy.get('[data-type=pool-library-edit]').should('have.length', 1)
    // and samples that have failed qc should not be selectable
    // TODO: Is this brittle? Need to know the data.
    cy.get('[data-type=pool-library-edit]').within(() => {
      cy.get('[data-type=tag-list]').select('bc1001')
      cy.get('[data-attribute=template-prep-kit-box-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    cy.intercept('/v1/pacbio/pools?include=tube', {
      statusCode: 201,
      body: {
        data: {
          pool: {
            id: '1',
            tube: {
              barcode: 'TRAC-1',
            },
          },
        },
      },
    })
    cy.get('[data-action=create-pool').click()
    cy.contains('[data-type=pool-create-message]', 'Pool successfully created')
  })

  it('Will not create a pool if there is an error', () => {
    cy.visit('#/pacbio/pool/new')
    cy.contains('Pool')
    cy.get('[data-type=labware-list]')
      .find('button')
      .first()
      .click()
    cy.get('[data-input=labware-find]').type('DN814567Q{enter}')

    cy.get('[data-type=plate-item]').should('have.length', 2)

    cy.get('[data-type=tag-set-list]').select('IsoSeq_v1')
    cy.get('[data-attribute=group-id]').should('have.length', 12)

    cy.get('[data-type=selected-plate-list]').within(() => {
      cy.get('[data-type=plate-item]').first()
      cy.get('ellipse')
        .first()
        .click()
    })
    cy.get('[data-type=pool-library-edit]').should('have.length', 1)
    cy.get('[data-type=pool-library-edit]').within(() => {
      cy.get('[data-type=tag-list]').select('bc1001')
      cy.get('[data-attribute=template-prep-kit-box-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    cy.intercept('/v1/pacbio/pools?include=tube', {
      statusCode: 422,
      body: {
        data: {
          errors: {
            error1: ['There was a problem'],
          },
        },
      },
    })
    cy.get('[data-action=create-pool').click()
    cy.contains('[data-type=pool-create-message]', 'error1 There was a problem')
  })
})
