describe('ONT Run page', () => {
  beforeEach(() => {
    cy.intercept('/v1/ont/instruments', {
      fixture: 'tractionOntInstruments.json',
    })
    cy.intercept('v1/ont/pools?include=tube,libraries.tag,libraries.request', {
      fixture: 'tractionOntPools.json',
    })
    cy.intercept('/v1/ont/runs?include=instrument', {
      fixture: 'tractionOntRuns.json',
    })
  })

  it('Shows the correct information', () => {
    cy.visit('#/ont/run/new')

    cy.contains('ONT Run')
    cy.contains('1. Run Information')
    cy.contains('2. Run Instrument Flowcells')

    cy.get('#create').should('be.disabled')
  })

  it('Redirects to the runs list page if run create succeeds', () => {
    cy.intercept('POST', '/v1/ont/runs', {
      statusCode: 201,
      fixture: 'tractionOntRunCreateSuccess.json',
    })

    cy.visit('#/ont/run/new')

    cy.get('#instrument-selection').select('GXB02004')
    cy.get('#state-selection').select('Pending')

    cy.get('#flowcell-id-1').type('ABC123')
    cy.get('#pool-id-1').type('Unknown')

    cy.get('#create').should('be.enabled')
    cy.get('#create').click()

    cy.get('#run-index').contains('tr', '5')
  })

  it('Shows an error message if run create fails', () => {
    cy.intercept('POST', '/v1/ont/runs', {
      statusCode: 422,
      fixture: 'tractionOntRunCreateError.json',
    })

    cy.visit('#/ont/run/new')

    cy.get('#instrument-selection').select('GXB02004')
    cy.get('#state-selection').select('Pending')

    cy.get('#flowcell-id-1').type('ABC123')
    cy.get('#pool-id-1').type('Unknown')

    cy.get('#create').should('be.enabled')
    cy.get('#create').click()

    cy.contains('pool at position 1 is required')
  })
})
