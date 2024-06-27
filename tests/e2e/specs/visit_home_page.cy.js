// https://docs.cypress.io/api/introduction/api.html

describe('Visit Home Page', () => {
  beforeEach(() => {
    cy.withFlags({
      dpl_478_enable_qc_results_upload: { enabled: true },
    })
  })

  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('Home')
    cy.contains('Label Printing')
    cy.contains('QC Results Upload')
    cy.contains('Dashboard')
    cy.contains('PacBio')
    cy.contains('ONT')
  })
})
