import PacbioTagSetFactory from '../../../factories/PacbioTagSetFactory.js'
import PacbioPlateFactory from '../../../factories/PacbioPlateFactory.js'
import PacbioTubeFactory from '../../../factories/PacbioTubeFactory.js'

describe('Pacbio Pool Create', () => {
  beforeEach(() => {
    cy.wrap(PacbioTagSetFactory()).as('pacbioTagSetFactory')

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.intercept('GET', '/v1/pacbio/tag_sets?include=tags', {
        statusCode: 200,
        body: pacbioTagSetFactory.content,
      })
    })

    cy.wrap(PacbioPlateFactory({ count: 1 })).as('pacbioPlateFactory')
    cy.get('@pacbioPlateFactory').then((pacbioPlateFactory) => {
      cy.intercept(
        'GET',
        '/v1/pacbio/plates?filter[barcode]=GEN-1680611780-1&include=wells.requests',
        {
          statusCode: 200,
          body: pacbioPlateFactory.content,
        },
      )
    })

    // The magic search input will check plates first before checking tubes so we need to intercept it
    cy.intercept('GET', '/v1/pacbio/plates?filter[barcode]=TRAC-2-20&include=wells.requests', {
      statusCode: 200,
      body: {
        data: {},
      },
    })
    cy.wrap(PacbioTubeFactory({ findBy: 'libraries' })).as('pacbioTubeFactory')
    cy.get('@pacbioTubeFactory').then((pacbioTubeFactory) => {
      cy.intercept(
        'GET',
        '/v1/pacbio/tubes?filter[barcode]=TRAC-2-20&include=requests,libraries.request',
        {
          statusCode: 200,
          body: pacbioTubeFactory.content,
        },
      )
    })
  })

  it('Creates a pool successfully', () => {
    cy.visit('#/pacbio/pool/new')
    cy.contains('Pool')
    // Add a plate
    cy.get('#labware-finder-input').type('GEN-1680611780-1{enter}')
    // Add a library tube
    cy.get('#labware-finder-input').type('TRAC-2-20{enter}')

    cy.get('[data-type=selected-labware-item]').should('have.length', 2)

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.get('[data-type=tag-set-list]').select(pacbioTagSetFactory.storeData.selected.tagSet.name)
      cy.get('[data-attribute=tag-set-name]').click()
      cy.get('[data-attribute=group-id]').should(
        'have.length',
        pacbioTagSetFactory.storeData.selected.tagSet.tags.length,
      )
    })

    cy.get('ellipse').first().click()
    cy.get('[data-attribute=traction-well]').first().click()

    cy.get('[data-type=pool-aliquot-edit]').should('have.length', 2)
    // Set pool metadata
    cy.get('[data-type="pool-edit"').within(() => {
      cy.get('[data-attribute=template-prep-kit-box-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    // and samples that have failed qc should not be selectable

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      const selected = pacbioTagSetFactory.storeData.selected
      const tagList = selected.tags.first(2)

      cy.get('[data-type=pool-aliquot-edit]')
        .first()
        .within(() => {
          cy.get('[data-type=tag-list]').select(tagList[0].group_id)
          cy.get('[data-attribute=template-prep-kit-box-barcode]').type('ABC1')
          cy.get('[data-attribute=volume]').type('1')
          cy.get('[data-attribute=concentration]').type('10.0')
          cy.get('[data-attribute=insert-size]').type('100')
        })

      // Check the library attributes are pre-populated
      cy.get('[data-type=pool-aliquot-edit]')
        .last()
        .within(() => {
          cy.get('[data-type=tag-list]').select(tagList[1].group_id)
          cy.get('[data-attribute=template-prep-kit-box-barcode]').should(
            'have.value',
            '029979102141700063023',
          )
          cy.get('[data-attribute=volume]').should('have.value', '20')
          cy.get('[data-attribute=concentration]').should('have.value', '1')
          cy.get('[data-attribute=insert-size]').should('have.value', '500')
        })
    })

    cy.intercept('POST', '/v1/pacbio/pools?include=tube', {
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
    cy.get('#labware-finder-input').type('GEN-1680611780-1{enter}')

    cy.get('[data-type=selected-labware-item]').should('have.length', 1)

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.get('[data-type=tag-set-list]').select(pacbioTagSetFactory.storeData.selected.tagSet.name)
      cy.get('[data-attribute=group-id]').should(
        'have.length',
        pacbioTagSetFactory.storeData.selected.tagSet.tags.length,
      )
    })

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
      cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
        cy.get('[data-type=tag-list]').select(pacbioTagSetFactory.storeData.selected.tag.group_id)
      })
      cy.get('[data-attribute=template-prep-kit-box-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    cy.intercept('POST', '/v1/pacbio/pools?include=tube', {
      statusCode: 422,
      body: {
        errors: {
          error1: ['There was a problem'],
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

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.get('[data-type=tag-set-list]').select(pacbioTagSetFactory.storeData.selected.tagSet.name)
      cy.get('[data-attribute=group-id]').should(
        'have.length',
        pacbioTagSetFactory.storeData.selected.tagSet.tags.length,
      )
    })

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
    cy.get('[data-type=pool-aliquot-edit]').should('have.length', 8)

    const orderedElements = [
      'GEN-1680611780-1:A1',
      'GEN-1680611780-1:B1',
      'GEN-1680611780-1:C1',
      'GEN-1680611780-1:D1',
      'GEN-1680611780-1:E1',
      'GEN-1680611780-1:F1',
      'GEN-1680611780-1:G1',
      'GEN-1680611780-1:H1',
    ]

    // how can we move this to the factory?
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

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      const selected = pacbioTagSetFactory.storeData.selected
      const tagList = selected.tags.first(2)

      cy.get('[data-type=pool-aliquot-edit]')
        .filter(':contains("GEN-1680611780-1:A1")')
        .find('[data-type=tag-list]')
        .select(tagList[0].group_id)
      cy.get('[data-type=pool-aliquot-edit]')
        .filter(':contains("GEN-1680611780-1:B1")')
        .find('[data-type=tag-list]')
        .should('have.value', tagList[1].id)
    })

    cy.intercept('POST', '/v1/pacbio/pools?include=tube', {
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

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.get('[data-type=tag-set-list]').select(pacbioTagSetFactory.storeData.selected.tagSet.name)
      cy.get('[data-attribute=group-id]').should(
        'have.length',
        pacbioTagSetFactory.storeData.selected.tagSet.tags.length,
      )
    })

    // Set pool metadata
    cy.get('[data-type="pool-edit"').within(() => {
      cy.get('[data-attribute=template-prep-kit-box-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })

    cy.get('#qcFileInput').attachFile('pacbioAndTags.csv')

    cy.get('[data-type=pool-aliquot-edit]').should('have.length', 4)

    const orderedElements = [
      'GEN-1680611780-1:A1',
      'GEN-1680611780-1:B1',
      'GEN-1680611780-1:C1',
      'GEN-1680611780-1:D1',
    ]

    // Validate the order
    cy.get('[data-type=pool-aliquot-edit]').each((el, index) => {
      cy.wrap(el).within(() => {
        const expectedElement = orderedElements[index]
        cy.get('[data-attribute=request-source-identifier]').contains(expectedElement)
      })
    })

    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      const selected = pacbioTagSetFactory.storeData.selected
      const tagList = selected.tags.first(2)

      cy.get('[data-type=pool-aliquot-edit]')
        .filter(':contains("GEN-1680611780-1:A1")')
        .find('[data-type=tag-list]')
        .should('have.value', tagList[0].id)

      cy.get('[data-type=pool-aliquot-edit]')
        .filter(':contains("GEN-1680611780-1:B1")')
        .find('[data-type=tag-list]')
        .should('have.value', tagList[1].id)
    })

    cy.intercept('POST', '/v1/pacbio/pools?include=tube', {
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
    cy.get('[data-testid=clear-alerts]').click()
    cy.get('[data-action=create-pool').click()
    cy.contains('[data-type=pool-create-message]', 'Pool successfully created')
  })
})
