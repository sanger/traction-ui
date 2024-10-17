import OntTagSetFactory from '../../../factories/OntTagSetFactory.js'
import OntPlateFactory from '../../../factories/OntPlateFactory.js'

// TODO: A lot of this is still brittle
// The tags and tags in plates need to be the same
// The tags in the csv need to be the same
describe('Ont Pool Create', () => {
  beforeEach(() => {
    cy.wrap(OntTagSetFactory()).as('ontTagSetFactory')
    cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
      cy.intercept('GET', '/v1/ont/tag_sets?include=tags', {
        statusCode: 200,
        body: ontTagSetFactory.content,
      })
    })

    cy.wrap(OntPlateFactory({ all: false, first: 1 })).as('ontPlateFactory')

    // tags are hardcoded. This should be moved to a factory.
    cy.get('@ontPlateFactory').then((ontPlateFactory) => {
      cy.intercept('/v1/ont/plates?filter[barcode]=GENSAMPLE-1668092750-1&include=wells.requests', {
        statusCode: 200,
        body: ontPlateFactory.content,
      })
    })

    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
    })
  })

  it('Creates a pool successfully', () => {
    cy.visit('#/ont/pool/new')
    cy.contains('Pool')
    cy.get('#labware-finder-input').type('GENSAMPLE-1668092750-1')
    cy.get('[data-action=find-labware]').click()

    cy.get('[data-type=plate-item]').should('have.length', 1)

    cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
      cy.get('[data-type=tag-set-list').select(ontTagSetFactory.storeData.selected.tagSet.name)
      cy.get('[data-attribute=tag-set-name]').click()
      cy.get('[data-attribute=group-id]').should(
        'have.length',
        ontTagSetFactory.storeData.selected.tagSet.tags.length,
      )
    })

    cy.get('[data-type=selected-plate-list]').within(() => {
      cy.get('[data-type=plate-item]').first()
      cy.get('ellipse').first().click()
    })
    cy.get('[data-type=pool-library-edit]').should('have.length', 1)
    // and samples that have failed qc should not be selectable
    cy.get('[data-type=pool-library-edit]').within(() => {
      cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
        cy.get('[data-type=tag-list]').select(ontTagSetFactory.storeData.selected.tag.group_id)
      })
      cy.get('[data-attribute=kit-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    cy.intercept('/v1/ont/pools?include=tube', {
      statusCode: 201,
      body: {
        data: {},
        included: [
          {
            id: '1',
            type: 'tubes',
            attributes: {
              barcode: 'TRAC-1',
            },
          },
        ],
      },
    })
    cy.get('[data-action=create-pool').click()
    cy.contains('[data-type=pool-create-message]', 'Pool successfully created')
  })

  it('Will not create a pool if there is an error', () => {
    cy.visit('#/ont/pool/new')
    cy.contains('Pool')
    cy.get('#labware-finder-input').type('GENSAMPLE-1668092750-1')
    cy.get('[data-action=find-labware]').click()

    cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
      cy.get('[data-type=tag-set-list').select(ontTagSetFactory.storeData.selected.tagSet.name)
    })

    cy.get('[data-type=selected-plate-list]').within(() => {
      cy.get('[data-type=plate-item]').first()
      cy.get('ellipse').first().click()
    })
    cy.get('[data-type=pool-library-edit]').should('have.length', 1)
    cy.get('[data-type=pool-library-edit]').within(() => {
      cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
        cy.get('[data-type=tag-list]').select(ontTagSetFactory.storeData.selected.tag.group_id)
      })
      cy.get('[data-attribute=kit-barcode]').type('ABC1')
      cy.get('[data-attribute=volume]').type('1')
      cy.get('[data-attribute=concentration]').type('10.0')
      cy.get('[data-attribute=insert-size]').type('100')
    })
    cy.intercept('/v1/ont/pools?include=tube', {
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
    cy.visit('#/ont/pool/new')
    cy.contains('Pool')
    cy.get('#labware-finder-input').type('GENSAMPLE-1668092750-1')
    cy.get('[data-action=find-labware]').click()
    cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
      cy.get('[data-type=tag-set-list').select(ontTagSetFactory.storeData.selected.tagSet.name)
    })

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
    cy.get('[data-type=pool-library-edit]').should('have.length', 8)

    const orderedElements = [
      'GEN-1668092750-1:A1',
      'GEN-1668092750-1:B1',
      'GEN-1668092750-1:C1',
      'GEN-1668092750-1:D1',
      'GEN-1668092750-1:E1',
      'GEN-1668092750-1:F1',
      'GEN-1668092750-1:G1',
      'GEN-1668092750-1:H1',
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

    cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
      const selected = ontTagSetFactory.storeData.selected
      const tagList = selected.tags.first(2)
      cy.get('[data-type=pool-library-edit]')
        .filter(':contains("GEN-1668092750-1:A1")')
        .find('[data-type=tag-list]')
        .select(tagList[0].group_id)
      cy.get('[data-type=pool-library-edit]')
        .filter(':contains("GEN-1668092750-1:B1")')
        .find('[data-type=tag-list]')
        .should('have.value', tagList[1].id)
    })

    cy.intercept('/v1/ont/pools?include=tube', {
      statusCode: 201,
      body: {
        data: {},
        included: [
          {
            id: '1',
            type: 'tubes',
            attributes: {
              barcode: 'TRAC-1',
            },
          },
        ],
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
    cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
      cy.get('[data-type=tag-set-list').select(ontTagSetFactory.storeData.selected.tagSet.name)
    })

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
    cy.get('[data-type=pool-library-edit]').should('have.length', 8)

    const orderedElements = [
      'GEN-1668092750-1:A1',
      'GEN-1668092750-1:B1',
      'GEN-1668092750-1:C1',
      'GEN-1668092750-1:D1',
      'GEN-1668092750-1:E1',
      'GEN-1668092750-1:F1',
      'GEN-1668092750-1:G1',
      'GEN-1668092750-1:H1',
    ]
    // can we create this dynamically?
    cy.get('#qcFileInput').attachFile('ontAndTags.csv')
    // Validate the order
    cy.get('[data-type=pool-library-edit]').each((el, index) => {
      cy.wrap(el).within(() => {
        const expectedElement = orderedElements[index]
        cy.get('[data-attribute=request-source-identifier]').contains(expectedElement)
      })
    })

    // this is brittle as tags are hard coded in file
    cy.get('@ontTagSetFactory').then((ontTagSetFactory) => {
      const selected = ontTagSetFactory.storeData.selected
      const tagList = selected.tags.first(8)

      cy.get('[data-type=pool-library-edit]')
        .filter(':contains("GEN-1668092750-1:A1")')
        .find('[data-type=tag-list]')
        .should('have.value', tagList[0].id)
      cy.get('[data-type=pool-library-edit]')
        .filter(':contains("GEN-1668092750-1:B1")')
        .find('[data-type=tag-list]')
        .should('have.value', tagList[1].id)
      cy.get('[data-type=pool-library-edit]')
        .filter(':contains("GEN-1668092750-1:C1")')
        .find('[data-type=tag-list]')
        .should('have.value', tagList[2].id)
      cy.get('[data-type=pool-library-edit]')
        .filter(':contains("GEN-1668092750-1:D1")')
        .find('[data-type=tag-list]')
        .should('have.value', tagList[3].id)
      cy.get('[data-type=pool-library-edit]')
        .filter(':contains("GEN-1668092750-1:E1")')
        .find('[data-type=tag-list]')
        .should('have.value', tagList[4].id)
      cy.get('[data-type=pool-library-edit]')
        .filter(':contains("GEN-1668092750-1:F1")')
        .find('[data-type=tag-list]')
        .should('have.value', tagList[5].id)
      cy.get('[data-type=pool-library-edit]')
        .filter(':contains("GEN-1668092750-1:G1")')
        .find('[data-type=tag-list]')
        .should('have.value', tagList[6].id)
      cy.get('[data-type=pool-library-edit]')
        .filter(':contains("GEN-1668092750-1:H1")')
        .find('[data-type=tag-list]')
        .should('have.value', tagList[7].id)
    })

    cy.intercept('/v1/ont/pools?include=tube', {
      statusCode: 201,
      body: {
        data: {},
        included: [
          {
            id: '1',
            type: 'tubes',
            attributes: {
              barcode: 'TRAC-1',
            },
          },
        ],
      },
    })
    cy.get('[data-action=create-pool').click()
    cy.contains('[data-type=pool-create-message]', 'Pool successfully created')
  })
})
