// https://docs.cypress.io/api/introduction/api.html

describe('Visit Home Page', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    // Nav bar links
    cy.get('[data-attribute="tools-menu"]').should('exist')
    cy.get('[data-attribute="pacbio-menu"]').should('exist')
    cy.get('[data-attribute="ont-menu"]').should('exist')

    // Click on the tools menu to reveal the dropdown items
    cy.get('[data-attribute="tools-menu"]').click()
    cy.contains('Label Printing')
    cy.contains('QC Results Upload')
    cy.contains('Reception')
    cy.contains('LabWhere Reception')
    cy.contains('Sample Report')
    cy.contains('Flexible Pooling')

    // Dashboard contents
    cy.contains('Traction')
    cy.get('[data-attribute="pipelines-section"]').should('exist')
    cy.get('[data-attribute="tools-section"]').should('exist')
    cy.get('[data-attribute="documentation-section"]').should('exist')
  })
})
