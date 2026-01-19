describe('Flexible pooling new', () => {
  beforeEach(() => {
    cy.withFlags({
      flexible_pooling: { enabled: true },
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
    cy.get('[data-testid="flexible-pooling-template"]').contains('Download CSV template')

    cy.contains('Pooling')
    // Temporary check for 96 run wells until we have a custom well
    cy.get('[data-attribute="pacbio-run-well"]').should('have.length', 96)

    cy.contains('Actions')
    cy.get('[data-testid="reset-btn"]').contains('Reset')
    cy.get('[data-testid="create-btn"]').contains('Create Flexible Pool')
  })

  describe('Successfully', () => {
    // Add tests for successfully creating a flexible pool here
  })
})
