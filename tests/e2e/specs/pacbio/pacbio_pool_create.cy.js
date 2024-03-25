describe('Pacbio Pool Create', () => {
  beforeEach(() => {
    cy.intercept('/v1/pacbio/tag_sets?include=tags', {
      fixture: 'tractionPacbioTagSets.json',
    })

    cy.intercept('/v1/pacbio/plates?filter[barcode]=GEN-1680611780-1&include=wells.requests', {
      fixture: 'tractionPacbioPlate.json',
    })

    cy.intercept(
      'http://localhost:3100/v1/pacbio/tubes?filter[barcode]=TRAC-2-55&include=requests,libraries.request',
      {
        fixture: 'tractionPacbioTubeWithLibrary.json',
      },
    )

    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
      features: {
        dpl_989_ui: { enabled: true },
        multiplexing_phase_2_aliquot: { enabled: true },
      },
    })
  })

  it('Creates a pool successfully', () => {
    cy.visit('#/pacbio/pool/new')
    cy.contains('Pool')
    cy.get('#labware-finder-input').type('GEN-1680611780-1{enter}')

    cy.get('[data-type=selected-labware-item]').should('have.length', 1)

    cy.get('[data-type=tag-set-list]').select('IsoSeq_v1')
    cy.get('[data-attribute=tag-set-name]').click()
    cy.get('[data-attribute=group-id]').should('have.length', 12)

    cy.get('ellipse').first().click()
    cy.get('[data-type=pool-aliquot-edit]').should('have.length', 1)
    // Set pool metadata
    cy.get('[data-type="pool-edit"').within(() => {
      cy.get('[data-attribute=template-prep-kit-box-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    // and samples that have failed qc should not be selectable
    cy.get('[data-type=pool-aliquot-edit]').within(() => {
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
    }).as('postPayload')
    cy.get('[data-action=create-pool').click()
    cy.contains('[data-type=pool-create-message]', 'Pool successfully created')
    cy.fixture('tractionPacbioSinglePoolCreate').then(({ data }) => {
      cy.wait('@postPayload').its('request.body').should('deep.equal', data)
    })
  })

  it('Will not create a pool if there is an error', () => {
    cy.visit('#/pacbio/pool/new')
    cy.contains('Pool')
    cy.get('#labware-finder-input').type('GEN-1680611780-1{enter}')

    cy.get('[data-type=selected-labware-item]').should('have.length', 1)

    cy.get('[data-type=tag-set-list]').select('IsoSeq_v1')
    cy.get('[data-attribute=group-id]').should('have.length', 12)

    cy.get('ellipse').first().click()
    cy.get('[data-type=pool-aliquot-edit]').should('have.length', 1)
    // Set pool metadata
    cy.get('[data-type="pool-edit"').within(() => {
      cy.get('[data-attribute=template-prep-kit-box-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    cy.get('[data-type=pool-aliquot-edit]').within(() => {
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

  it('can automate creation of large pools', () => {
    cy.visit('#/pacbio/pool/new')
    cy.contains('Pool')
    cy.get('#labware-finder-input').type('GEN-1680611780-1{enter}')

    cy.get('[data-type=selected-labware-item]').should('have.length', 1)

    cy.get('[data-type=tag-set-list]').select('IsoSeq_v1')
    cy.get('[data-attribute=group-id]').should('have.length', 12)

    // Set pool metadata
    cy.get('[data-type="pool-edit"').within(() => {
      cy.get('[data-attribute=template-prep-kit-box-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })

    // Bulk sample addition
    cy.get('[data-type=selected-labware-item]')
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
    cy.get('[data-type=pool-aliquot-edit]').should('have.length', 4)

    const orderedElements = [
      'GEN-1680611780-1:A1',
      'GEN-1680611780-1:B1',
      'GEN-1680611780-1:C1',
      'GEN-1680611780-1:D1',
    ]

    cy.get('#qcFileInput').attachFile('pacbio.csv')
    // Validate the order
    cy.get('[data-type=pool-aliquot-edit]').each((el, index) => {
      cy.wrap(el).within(() => {
        const expectedElement = orderedElements[index]
        cy.get('[data-attribute=request-source-identifier]').contains(expectedElement)
      })
    })

    // Auto-tagging
    cy.get('[data-attribute=check-box]').click()

    cy.get('[data-type=pool-aliquot-edit]')
      .filter(':contains("GEN-1680611780-1:A1")')
      .find('[data-type=tag-list]')
      .select('bc1002')
    cy.get('[data-type=pool-aliquot-edit]')
      .filter(':contains("GEN-1680611780-1:B1")')
      .find('[data-type=tag-list]')
      .should('have.value', '251')

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

  it('can populate tags from csv', () => {
    cy.visit('#/pacbio/pool/new')
    cy.contains('Pool')
    cy.get('#labware-finder-input').type('GEN-1680611780-1{enter}')

    cy.get('[data-type=selected-labware-item]').should('have.length', 1)

    cy.get('[data-type=tag-set-list]').select('IsoSeq_v1')
    cy.get('[data-attribute=group-id]').should('have.length', 12)

    // Set pool metadata
    cy.get('[data-type="pool-edit"').within(() => {
      cy.get('[data-attribute=template-prep-kit-box-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })

    // Bulk sample addition
    cy.get('[data-type=selected-labware-item]')
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
    cy.get('[data-type=pool-aliquot-edit]').should('have.length', 4)

    const orderedElements = [
      'GEN-1680611780-1:A1',
      'GEN-1680611780-1:B1',
      'GEN-1680611780-1:C1',
      'GEN-1680611780-1:D1',
    ]

    cy.get('#qcFileInput').attachFile('pacbioAndTags.csv')
    // Validate the order
    cy.get('[data-type=pool-aliquot-edit]').each((el, index) => {
      cy.wrap(el).within(() => {
        const expectedElement = orderedElements[index]
        cy.get('[data-attribute=request-source-identifier]').contains(expectedElement)
      })
    })

    cy.get('[data-type=pool-aliquot-edit]')
      .filter(':contains("GEN-1680611780-1:A1")')
      .find('[data-type=tag-list]')
      .should('have.value', '250')

    cy.get('[data-type=pool-aliquot-edit]')
      .filter(':contains("GEN-1680611780-1:B1")')
      .find('[data-type=tag-list]')
      .should('have.value', '251')

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
  
})
