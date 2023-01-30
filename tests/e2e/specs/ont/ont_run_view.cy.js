describe('ONT Run page', () => {
  beforeEach(() => {
    cy.intercept('/v1/ont/instruments', {
      fixture: 'tractionOntInstruments.json',
    })
    cy.intercept('v1/ont/pools?filter[barcode]=TRAC-1-2', {
      statusCode: 200,
      fixture: 'tractionOntPool.json',
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
    cy.get('#pool-id-1').type('TRAC-1-2')

    cy.get('#create').should('be.enabled')
    cy.get('#create').click()

    cy.get('#run-index').contains('tr', '5')
  })

  it('Handles validation', () => {
    cy.intercept('POST', '/v1/ont/runs', {
      statusCode: 201,
      fixture: 'tractionOntRunCreateSuccess.json',
    })
    cy.intercept('v1/ont/pools?filter[barcode]=UNKNOWN', {
      statusCode: 200,
      fixture: 'emptyData.json',
    })

    cy.visit('#/ont/run/new')

    cy.get('#instrument-selection').select('GXB02004')
    cy.get('#state-selection').select('Pending')

    cy.get('#flowcell-id-1').type('123ABC')
    cy.contains('Enter at valid Flowcell ID (3 letters then at least 3 numbers)')

    cy.get('#pool-id-1').type('Unknown')
    cy.contains('Enter a valid Pool Library barcode')

    cy.get('#create').should('be.disabled')
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
    cy.get('#pool-id-1').type('TRAC-1-2')

    cy.get('#flowcell-id-2').type('ABC123')
    cy.get('#pool-id-2').type('TRAC-1-2')

    cy.get('#create').should('be.enabled')
    cy.get('#create').click()

    cy.contains('flowcell_id ABC123 at position x1 is duplicated in the same run')
  })
})
