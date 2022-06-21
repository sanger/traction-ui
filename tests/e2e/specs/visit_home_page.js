// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('localhost:3000/')
    cy.contains('Dashboard')
  })
})
