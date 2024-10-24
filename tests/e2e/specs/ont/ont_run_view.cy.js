import OntRunsFactory from '../../../factories/OntRunsFactory.js'
import OntInstrumentsFactory from '../../../factories/OntInstrumentsFactory.js'
import OntPoolFactory from '../../../factories/OntPoolFactory.js'

describe('ONT Run page', () => {
  beforeEach(() => {
    cy.wrap(OntRunsFactory()).as('ontRunsFactory')
    cy.wrap(OntInstrumentsFactory()).as('ontInstrumentsFactory')
    cy.wrap(OntPoolFactory()).as('ontPoolFactory')
    cy.wrap(OntPoolFactory({ all: false, first: 1 })).as('singleOntPoolFactory')

    cy.get('@ontInstrumentsFactory').then((ontInstrumentsFactory) => {
      cy.intercept('GET', '/v1/ont/instruments', {
        statusCode: 200,
        body: ontInstrumentsFactory.content,
      })
    })
    cy.get('@ontRunsFactory').then((ontRunsFactory) => {
      cy.intercept('GET', '/v1/ont/runs?page[size]=25&page[number]=1&include=instrument', {
        statusCode: 200,
        body: ontRunsFactory.content,
      })
    })
    cy.get('@singleOntPoolFactory').then((singleOntPoolFactory) => {
      cy.intercept('v1/ont/pools?filter[barcode]=TRAC-2-42', {
        statusCode: 200,
        body: singleOntPoolFactory.content,
      })
    })
    cy.get('@ontPoolFactory').then((ontPoolFactory) => {
      cy.intercept('/v1/ont/pools?include=tube,libraries.tag,libraries.request', {
        statusCode: 200,
        body: ontPoolFactory.content,
      })
    })
    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
    })
  })

  it('Shows the correct information', () => {
    cy.visit('#/ont/run/new')

    cy.contains('ONT Run')
    cy.contains('1. Run Information')
    cy.contains('2. Run Instrument Flowcells')

    cy.get('#create').should('be.visible')
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
    cy.get('#pool-id-1').type('TRAC-2-42')
    // Wait 500ms to allow debounce function to be called and validate input
    cy.wait(500)

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
    cy.contains('Enter a valid Flowcell ID (3 letters then at least 3 numbers)')

    cy.get('#pool-id-1').type('Unknown')
    // Wait 500ms to allow debounce function to be called and validate input
    cy.wait(500)

    cy.contains('Enter a valid Pool Library barcode')
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
    cy.get('#pool-id-1').type('TRAC-2-42')
    // Wait 500ms to allow debounce function to be called and validate input
    cy.wait(500)

    cy.get('#flowcell-id-2').type('ABC123')
    cy.get('#pool-id-2').type('TRAC-2-42')
    // Wait 500ms to allow debounce function to be called and validate input
    cy.wait(500)

    cy.get('#create').should('be.enabled')
    cy.get('#create').click()

    cy.contains('flowcell_id ABC123 at position x1 is duplicated in the same run')
  })
})
