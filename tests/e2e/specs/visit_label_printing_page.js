// https://docs.cypress.io/api/introduction/api.html

describe('Label Printing page', () => {
  it('Visits the app url', () => {
    cy.visit('#/label-printing')
    cy.contains('Barcode:')
    cy.contains('Suffix:')
    cy.contains('Number of labels:')
    cy.contains('Choice of Printer:')
    cy.contains('Reset')
    cy.contains('Print Labels')
  })
})
