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

    cy.get('#printLabels').should('be.disabled')

    cy.get('#barcode_input').type('aBarcode')
    cy.get('#suffix_selection').select('L (Lysed)')
    cy.get('#number_of_labels').type(3)
    cy.get('#printer_choice').select('stub')
    cy.get('#copies').type(2)

    cy.get('#printLabels').should('not.be.disabled')
    cy.get('#printLabels').click()

    cy.contains('Print Labels')
    cy.contains('List of barcodes to be printed:')
    cy.contains('Number of labels:')
    cy.contains('aBarcode-L1')
    cy.contains('aBarcode-L2')
    cy.contains('aBarcode-L3')
    cy.contains('Printer: stub')
    cy.contains('Copies: 2')

    cy.contains('OK').should('not.be.disabled')
  })
})
