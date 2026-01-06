// https://docs.cypress.io/api/introduction/api.html

describe('Visit Home Page', () => {
  beforeEach(() => {
    cy.withFlags({
      batch_pooling: { enabled: true },
    })
  })

  it('Visits the app root url', () => {
    cy.visit('/')
    // Nav bar links
    cy.contains('Label Printing')
    cy.contains('QC Results Upload')
    cy.contains('Reception')
    cy.contains('LabWhere Reception')
    cy.contains('Sample Report')
    cy.contains('Batch Pooling')

    // Home page contents
    cy.contains('Traction')
    cy.contains('Pipelines')
    cy.contains('Tools')
    cy.contains('Documentation')
  })
})
