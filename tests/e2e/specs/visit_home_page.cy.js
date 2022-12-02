// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('Home')
    cy.contains('Label Printing')
    cy.contains('Extraction QC')
    cy.contains('Dashboard')
    cy.contains('Saphyr')
    cy.contains('PacBio')
    cy.contains('ONT')
  })
})
