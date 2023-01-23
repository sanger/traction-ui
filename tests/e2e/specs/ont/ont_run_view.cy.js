// https://docs.cypress.io/api/introduction/api.html

describe('ONT Run page', () => {
  beforeEach(() => {
    cy.intercept('/v1/ont/instruments', {
      fixture: 'tractionOntInstruments.json',
    })
    cy.visit('#/ont/run/new')
  })

  it('Shows the correct information', () => {
    cy.contains('ONT Run')
    cy.contains('1. Run Information')
    cy.contains('2. Run Instrument Flowcells')

    cy.get('#create').should('be.disabled')

    cy.get('#instrument-selection').select('GXB02004')
    cy.get('#state-selection').select('Pending')

    cy.get('#flowcell-id-1').type('ABC123')
    cy.get('#pool-id-1').type('12345')

    cy.get('#create').should('be.enabled')
  })
})
