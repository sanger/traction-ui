import PacbioTagSetFactory from '../../../factories/PacbioTagSetFactory.js'
import MultiPoolFactory from '../../../factories/MultiPoolFactory.js'

describe('Flexible pooling new', () => {
  beforeEach(() => {
    cy.wrap(PacbioTagSetFactory()).as('pacbioTagSetFactory')
    cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
      cy.intercept('GET', '/v1/pacbio/tag_sets?include=tags', {
        statusCode: 200,
        body: pacbioTagSetFactory.content,
      })
    })

    cy.wrap(MultiPoolFactory.single()).as('singleMultiPoolFactory')
    cy.get('@singleMultiPoolFactory').then((singleMultiPoolFactory) => {
      cy.intercept('GET', '/v1/multi_pools/1?include=multi_pool_positions', {
        statusCode: 200,
        body: singleMultiPoolFactory.content,
      })
    })
    cy.visit('#/flexible-pool/1')
  })

  it('loads the flexible pooling edit page', () => {
    cy.visit('#/flexible-pool/1')

    // Check sections
    cy.contains('Flexible pooling')

    cy.contains('Setup')
    // Users cannot edit the setup of an existing flexible pool currently
    cy.get('[data-testid="pipeline-select"]').should('be.disabled')
    cy.get('[data-testid="pooling-layout-select"]').should('be.disabled')
    cy.get('[data-testid="csv-file-input"]').should('be.disabled')
    cy.get('[data-testid="flexible-pooling-template"]').contains('CSV template')

    cy.contains('Pooling')
    cy.get('[data-attribute^="flexible-pool-well-"]').should('have.length', 96)

    // Check there are two successfully loaded pools in the layout
    cy.get('@singleMultiPoolFactory').then((singleMultiPoolFactory) => {
      Object.values(singleMultiPoolFactory.storeData.multi_pool_positions).forEach((mpp) => {
        cy.get(`[data-attribute="flexible-pool-well-${mpp.position}"]`).should(
          'contain',
          mpp.pool_barcode,
        )
        cy.get(`[data-attribute="flexible-pool-well-${mpp.position}"]`).should(
          'have.class',
          'bg-success',
        )
      })
    })

    // Actions section should be hidden
    cy.contains('Actions')
    cy.get('[data-testid="reset-btn"]').should('not.exist')
    cy.get('[data-testid="create-btn"]').should('not.exist')
  })

  it('navigates to the correct pool when a well is clicked', () => {
    cy.visit('#/flexible-pool/1')

    cy.get('@singleMultiPoolFactory').then((singleMultiPoolFactory) => {
      const mpp = Object.values(singleMultiPoolFactory.storeData.multi_pool_positions)[0]
      cy.get(`[data-attribute="flexible-pool-well-${mpp.position}"]`).click()
      cy.url().should('include', `/pacbio/pool/${mpp.pool_id}`)
    })
  })
})
