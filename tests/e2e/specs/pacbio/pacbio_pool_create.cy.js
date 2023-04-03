describe('Pacbio Pool Create', () => {
  beforeEach(() => {
    cy.intercept('/v1/pacbio/tag_sets?include=tags', {
      fixture: 'tractionPacbioTagSets.json',
    })

    cy.intercept('/v1/pacbio/requests?include=well.plate,tube', {
      fixture: 'pacbioRequestsRequest.json',
    })
  })

  it('Creates a pool successfully', () => {
    cy.visit('#/pacbio/pool/new')
    cy.contains('Pool')
    cy.get('[data-type=plate-list]').find('[data-action=select-plate]').first().click()
    cy.get('[data-input=plate-find]').type('DN814567Q{enter}')

    cy.get('[data-type=plate-item]').should('have.length', 2)

    cy.get('[data-type=tag-set-list]').select('IsoSeq_v1')
    cy.get('[data-attribute=tag-set-name]').click()
    cy.get('[data-attribute=group-id]').should('have.length', 12)

    cy.get('[data-type=selected-plate-list]').within(() => {
      cy.get('[data-type=plate-item]').first()
      cy.get('ellipse').first().click()
    })
    cy.get('[data-type=pool-library-edit]').should('have.length', 1)
    // and samples that have failed qc should not be selectable
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
    cy.get('[data-type=plate-list]').find('button').first().click()
    cy.get('[data-input=plate-find]').type('DN814567Q{enter}')

    cy.get('[data-type=plate-item]').should('have.length', 2)

    cy.get('[data-type=tag-set-list]').select('IsoSeq_v1')
    cy.get('[data-attribute=group-id]').should('have.length', 12)

    cy.get('[data-type=selected-plate-list]').within(() => {
      cy.get('[data-type=plate-item]').first()
      cy.get('ellipse').first().click()
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

  it('can automate creation of large pools', () => {
    cy.visit('#/pacbio/pool/new')
    cy.contains('Pool')
    cy.get('[data-type=plate-list]').find('[data-action=select-plate]').first().click()
    cy.get('[data-input=plate-find]').type('DN814567Q{enter}')

    cy.get('[data-type=plate-item]').should('have.length', 2)

    cy.get('[data-type=tag-set-list]').select('IsoSeq_v1')
    cy.get('[data-attribute=group-id]').should('have.length', 12)

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
      // We select in two separate steps as it lets us validate that selection
      // is 'sticky'.
      cy.get('[data-type=plate-item]')
        .last()
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

    const orderedElements = ['DN814327C:A1', 'DN814327C:A2', 'DN814567Q:A1', 'DN814567Q:B1']

    cy.get('#qcFileInput').attachFile('pacbio.csv')
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
      .filter(':contains("DN814327C:A1")')
      .find('[data-type=tag-list]')
      .select('bc1002')
    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("DN814327C:A2")')
      .find('[data-type=tag-list]')
      .should('have.value', '258')

    // We don't want to flow beyond the first plate
    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("DN814567Q:A1")')
      .find('[data-type=tag-list]')
      .should('have.value', '')
    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("DN814567Q:B1")')
      .find('[data-type=tag-list]')
      .should('have.value', '')

    // We can then select the second plate independently
    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("DN814567Q:A1")')
      .find('[data-type=tag-list]')
      .select('bc1003')
    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("DN814567Q:B1")')
      .find('[data-type=tag-list]')
      .should('have.value', '252')

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
    cy.get('[data-type=plate-list]').find('[data-action=select-plate]').first().click()
    cy.get('[data-input=plate-find]').type('DN814567Q{enter}')

    cy.get('[data-type=plate-item]').should('have.length', 2)

    cy.get('[data-type=tag-set-list]').select('IsoSeq_v1')
    cy.get('[data-attribute=group-id]').should('have.length', 12)

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
      // We select in two separate steps as it lets us validate that selection
      // is 'sticky'.
      cy.get('[data-type=plate-item]')
        .last()
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

    const orderedElements = ['DN814327C:A1', 'DN814327C:A2', 'DN814567Q:A1', 'DN814567Q:B1']

    cy.get('#qcFileInput').attachFile('pacbioAndTags.csv')
    // Validate the order
    cy.get('[data-type=pool-library-edit]').each((el, index) => {
      cy.wrap(el).within(() => {
        const expectedElement = orderedElements[index]
        cy.get('[data-attribute=request-source-identifier]').contains(expectedElement)
      })
    })

    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("DN814327C:A1")')
      .find('[data-type=tag-list]')
      .should('have.value', '250')

    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("DN814327C:A2")')
      .find('[data-type=tag-list]')
      .should('have.value', '251')

    // We can then select the second plate independently
    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("DN814567Q:A1")')
      .find('[data-type=tag-list]')
      .should('have.value', '252')
    cy.get('[data-type=pool-library-edit]')
      .filter(':contains("DN814567Q:B1")')
      .find('[data-type=tag-list]')
      .should('have.value', '253')

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
