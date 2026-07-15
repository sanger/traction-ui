import PacbioTagSetFactory from '../../../factories/PacbioTagSetFactory.js'
import PacbioPlateFactory from '../../../factories/PacbioPlateFactory.js'
import PacbioTubeFactory from '../../../factories/PacbioTubeFactory.js'

describe('Flexible pooling new', () => {
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
    cy.visit('#/flexible-pool/new')
  })

  it('loads the flexible pooling create page', () => {
    cy.visit('#/flexible-pool/new')

    // Check sections
    cy.contains('Flexible pooling')

    cy.contains('Setup')
    cy.get('[data-testid="pipeline-select"]').select('Pacbio')
    cy.get('[data-testid="pooling-layout-select"]').select('Plate')
    cy.get('[data-testid="csv-file-input"]').should('exist')
    cy.get('[data-testid="flexible-pooling-template"]').contains('CSV template')

    cy.contains('Pooling')
    cy.get('[data-attribute^="flexible-pool-well"]').should('have.length', 96)

    cy.contains('Actions')
    cy.get('[data-testid="reset-btn"]').contains('Reset')
    cy.get('[data-testid="create-btn"]').contains('Create Flexible Pool')
  })

  describe('Successfully', () => {
    it('creates a flexible pool and navigates to its page', () => {
      cy.get('[data-attribute="flexible-pool-well-1"]').click()

      cy.get('#labware-finder-input').type('GEN-1680611780-1{enter}')
      // Add a library tube
      cy.get('#labware-finder-input').type('TRAC-2-20{enter}')

      cy.get('[data-type=selected-labware-item]').should('have.length', 2)

      cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
        cy.get('[data-type=tag-set-list]').select(
          pacbioTagSetFactory.storeData.selected.tagSet.name,
        )
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

      cy.intercept('POST', '/v1/multi_pools', {
        statusCode: 201,
        body: {
          data: {
            id: 1,
            type: 'multi_pools',
            attributes: {
              pool_method: 'Plate',
              pipeline: 'pacbio',
              number_of_pools: 1,
              created_at: '2026/03/09 11:09',
            },
          },
        },
      })

      cy.intercept('GET', 'v1/multipools/.?include=multi_pool_positions', {
        statusCode: 200,
        body: {
          data: {
            attributes: {
              pool_method: 'Plate',
              pipeline: 'pacbio',
              number_of_pools: 1,
              created_at: '2026/03/09 11:09',
            },
          },
          included: [
            {
              id: '1',
              type: 'multi_pool_positions',
              attributes: {
                position: 1,
                pool_id: 46,
                pool_type: 'Pacbio::Pool',
                created_at: '2026/03/09 11:09',
              },
              relationships: {
                multi_pool: {
                  data: {
                    type: 'multi_pools',
                    id: '1',
                  },
                },
              },
            },
          ],
        },
      })

      cy.get('[data-action=create-individual-pool]').click()
      cy.get('[data-testid=backToMultiPool]').click()
      cy.get('[data-testid=create-btn]').click()

      cy.get('[data-attribute="message"][data-type="error-message"]').should(
        'have.class',
        'success-message',
      )
      cy.get('[data-attribute="message"][data-type="error-message"]').should(
        'contain.text',
        'Flexible pool successfully',
      )
    })
  })
})
