// https://docs.cypress.io/api/introduction/api.html

describe('ONT Run page', () => {
  beforeEach(() => {
    cy.intercept('/v1/ont/instruments', {
      fixture: 'tractionOntInstruments.json',
    })
    cy.visit('#/ont/run/new')
  })

  it('Shows the correct information', () => {
    cy.get('#instrument-selection').select('GXB02004')
    cy.get('#flowcell-id-1')
    cy.get('#state-selection').select('Pending')

    cy.contains('ONT Run')
    cy.contains('1. Run Information')
    cy.contains('2. Run Instrument Flowcells')
  })
})
