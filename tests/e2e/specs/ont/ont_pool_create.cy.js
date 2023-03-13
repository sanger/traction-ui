describe('Ont Pool Create', () => {
  beforeEach(() => {
    cy.intercept('/v1/ont/tag_sets?include=tags', {
      fixture: 'tractionOntTagSets.json',
    })

    cy.intercept('/v1/ont/plates?filter[barcode]=GENSAMPLE-1668092750-1&include=wells.requests', {
      fixture: 'tractionOntPlate.json',
    })

    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
      features: {
        dpl_281_ont_create_sequencing_runs: { enabled: true },
        dpl_279_ont_libraries_and_pools: { enabled: true },
        enable_custom_table: { enabled: true },
      },
    })
  })

  it('Creates a pool successfully', () => {
    cy.visit('#/ont/pool/new')
    cy.contains('Pool')
    cy.get('#labware-finder-input').type('GENSAMPLE-1668092750-1')
    cy.get('[data-action=find-labware]').click()

    cy.get('[data-type=plate-item]').should('have.length', 1)

    cy.get('[data-type=tag-set-list]').select('ONT_native')
    cy.get('[data-attribute=tag-set-name]').click()
    cy.get('[data-attribute=group-id]').should('have.length', 96)

    //TODO: add at least one more sample
    cy.get('[data-type=selected-plate-list]').within(() => {
      cy.get('[data-type=plate-item]').first()
      cy.get('ellipse').first().click()
    })
    cy.get('[data-type=pool-library-edit]').should('have.length', 1)
    // and samples that have failed qc should not be selectable
    // TODO: Is this brittle? Need to know the data.
    cy.get('[data-type=pool-library-edit]').within(() => {
      cy.get('[data-type=tag-list]').select('NB01')
      cy.get('[data-attribute=kit-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    cy.intercept('/v1/ont/pools?include=tube', {
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
    }).as('postPayload')
    cy.get('[data-action=create-pool').click()
    cy.contains('[data-type=pool-create-message]', 'Pool successfully created')
    cy.fixture('tractionOntSinglePoolCreate').then(({ data }) => {
      cy.wait('@postPayload').its('request.body').should('deep.equal', data)
    })
  })

  it('Will not create a pool if there is an error', () => {
    cy.visit('#/ont/pool/new')
    cy.contains('Pool')
    cy.get('#labware-finder-input').type('GENSAMPLE-1668092750-1')
    cy.get('[data-action=find-labware]').click()
    cy.get('[data-type=tag-set-list]').select('ONT_native')

    cy.get('[data-type=selected-plate-list]').within(() => {
      cy.get('[data-type=plate-item]').first()
      cy.get('ellipse').first().click()
    })
    cy.get('[data-type=pool-library-edit]').should('have.length', 1)
    cy.get('[data-type=pool-library-edit]').within(() => {
      cy.get('[data-type=tag-list]').select('NB01')
      cy.get('[data-attribute=kit-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    cy.intercept('/v1/ont/pools?include=tube', {
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

  it('can automate creation of large pools', () => {
    cy.visit('#/ont/pool/new')
    cy.contains('Pool')
    cy.get('#labware-finder-input').type('GENSAMPLE-1668092750-1')
    cy.get('[data-action=find-labware]').click()
    cy.get('[data-type=tag-set-list]').select('ONT_native')

    // Bulk sample addition
    cy.get('[data-type=selected-plate-list]').within(() => {
      cy.get('[data-type=plate-item]')
        .first()
        .trigger('mousedown', {
          position: 'topLeft',
        })
        .trigger('mousemove', {
          position: 'bottomRight',
        })
        .trigger('mouseup', {
          position: 'bottomRight',
        })
    })
    cy.get('[data-type=pool-library-edit]').should('have.length', 4)

    const orderedElements = [
      'GEN-1668092750-1:A1',
      'GEN-1668092750-1:B1',
      'GEN-1668092750-1:C1',
      'GEN-1668092750-1:D1',
    ]

    cy.get('#qcFileInput').attachFile('ont.csv')
    // Validate the order
    cy.get('[data-type=pool-library-edit]').each((el, index) => {
      cy.wrap(el).within(() => {
        const expectedElement = orderedElements[index]
        cy.get('[data-attribute=request-source-identifier]').contains(expectedElement)
      })
    })

    // Auto-tagging
    cy.get('[data-attribute=check-box]').click()

    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("GEN-1668092750-1:A1")')
      .find('[data-type=tag-list]')
      .select('NB01')
    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("GEN-1668092750-1:B1")')
      .find('[data-type=tag-list]')
      .should('have.value', '386')

    cy.intercept('/v1/ont/pools?include=tube', {
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

  it('can populate tags from csv', () => {
    cy.visit('#/ont/pool/new')
    cy.contains('Pool')
    cy.get('#labware-finder-input').type('GENSAMPLE-1668092750-1')
    cy.get('[data-action=find-labware]').click()
    cy.get('[data-type=tag-set-list]').select('ONT_native')

    // Bulk sample addition
    cy.get('[data-type=selected-plate-list]').within(() => {
      cy.get('[data-type=plate-item]')
        .first()
        .trigger('mousedown', {
          position: 'topLeft',
        })
        .trigger('mousemove', {
          position: 'bottomRight',
        })
        .trigger('mouseup', {
          position: 'bottomRight',
        })
    })
    cy.get('[data-type=pool-library-edit]').should('have.length', 4)

    const orderedElements = [
      'GEN-1668092750-1:A1',
      'GEN-1668092750-1:B1',
      'GEN-1668092750-1:C1',
      'GEN-1668092750-1:D1',
    ]

    cy.get('#qcFileInput').attachFile('ontAndTags.csv')
    // Validate the order
    cy.get('[data-type=pool-library-edit]').each((el, index) => {
      cy.wrap(el).within(() => {
        const expectedElement = orderedElements[index]
        cy.get('[data-attribute=request-source-identifier]').contains(expectedElement)
      })
    })

    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("GEN-1668092750-1:A1")')
      .find('[data-type=tag-list]')
      .should('have.value', '386')
    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("GEN-1668092750-1:B1")')
      .find('[data-type=tag-list]')
      .should('have.value', '387')
    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("GEN-1668092750-1:C1")')
      .find('[data-type=tag-list]')
      .should('have.value', '388')
    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("GEN-1668092750-1:D1")')
      .find('[data-type=tag-list]')
      .should('have.value', '389')

    cy.intercept('/v1/ont/pools?include=tube', {
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
})
