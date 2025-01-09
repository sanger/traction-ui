// https://docs.cypress.io/api/introduction/api.html

describe('Visit Home Page', () => {
  beforeEach(() => {
    cy.withFlags({
      dpl_478_enable_qc_results_upload: { enabled: true },
    })
  })

  it('Visits the app root url', () => {
    cy.visit('/')
    // Nav bar links
    cy.contains('Label Printing')
    cy.contains('QC Results Upload')
    cy.contains('Reception')
    cy.contains('LabWhere Reception')

    // Home page contents
    cy.contains('Traction')
    cy.contains('Pipelines')
    cy.contains('Tools')
    cy.contains('Documentation')
  })
})
