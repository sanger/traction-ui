import OntInstrumentFactory from '../../../factories/OntInstrumentFactory.js'
import OntRunFactory from '../../../factories/OntRunFactory.js'
import OntPoolFactory from '../../../factories/OntPoolFactory.js'

describe('ONT Run page', () => {
  beforeEach(() => {
    cy.wrap(OntInstrumentFactory()).as('ontInstrumentFactory')
    cy.wrap(OntRunFactory()).as('ontRunFactory')
    cy.wrap(OntPoolFactory()).as('ontPoolFactory')
    cy.wrap(OntPoolFactory({ count: 1 })).as('singleOntPoolFactory')

    cy.get('@ontInstrumentFactory').then((ontInstrumentFactory) => {
      cy.intercept('GET', '/v1/ont/instruments', {
        statusCode: 200,
        body: ontInstrumentFactory.content,
      })
    })
    cy.get('@ontRunFactory').then((ontRunFactory) => {
      cy.intercept('GET', '/v1/ont/runs?page[size]=25&page[number]=1&include=instrument', {
        statusCode: 200,
        body: ontRunFactory.content,
      })
    })
    cy.get('@singleOntPoolFactory').then((singleOntPoolFactory) => {
      cy.intercept('v1/ont/pools?filter[barcode]=TRAC-2-42', {
        statusCode: 200,
        body: { data: [singleOntPoolFactory.content.data] },
      })
      console.log(singleOntPoolFactory.content)
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

    cy.contains('Enter a valid Pool barcode')
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
