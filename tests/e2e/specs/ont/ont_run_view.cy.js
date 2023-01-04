// https://docs.cypress.io/api/introduction/api.html

describe('ONT Run page', () => {
  beforeEach(() => {
    cy.visit('#/ont/run/new')

    cy.get('#instrument-selection').select('Minion')
    cy.get('#state-selection').select('Pending')
  })

  it('Shows the correct information', () => {
    cy.contains('1. Run Information')
    cy.contains('2. Add Pools')
    cy.contains('3. Run Instrument Flowcells')
  })
})
