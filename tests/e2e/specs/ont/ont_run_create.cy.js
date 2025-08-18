import OntInstrumentFactory from '../../../factories/OntInstrumentFactory.js'
import OntRunFactory from '../../../factories/OntRunFactory.js'
import OntPoolFactory from '../../../factories/OntPoolFactory.js'

describe('ONT Run create View', () => {
  beforeEach(() => {
    cy.wrap(OntInstrumentFactory()).as('ontInstrumentFactory')
    cy.wrap(OntRunFactory()).as('ontRunFactory')
    cy.wrap(OntPoolFactory()).as('ontPoolFactory')
    cy.wrap(OntPoolFactory({ count: 1 })).as('singleOntPoolFactory')
    cy.wrap(OntRunFactory({ count: 1 })).as('singleOntRunFactory')

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
    })
    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
    })
  })

  it('Creates a new run', () => {
    cy.intercept('POST', '/v1/ont/runs', {
      statusCode: 201,
      body: {
        data: {},
      },
    })

    cy.visit('#/ont/run/new')

    cy.get('#instrument-selection').select('GXB02004')
    cy.get('#state-selection').select('Pending')
    cy.get('#rebasecalling-selection').select('None')

    cy.get('#flowcell-id-1').type('ABC123')
    cy.get('#pool-id-1').type('TRAC-2-42')
    // Wait 500ms to allow debounce function to be called and validate input
    cy.wait(500)

    cy.get('#create').should('be.enabled')
    cy.get('#create').click()

    cy.get('#run-index').contains('tr', '5')
  })

  it('Validates a new run', () => {
    cy.intercept('POST', '/v1/ont/runs', {
      statusCode: 201,
      body: {
        data: {},
      },
    })
    cy.intercept('v1/ont/pools?filter[barcode]=UNKNOWN', {
      statusCode: 200,
      body: {
        data: {},
      },
    })

    cy.visit('#/ont/run/new')

    cy.get('#instrument-selection').select('GXB02004')
    cy.get('#state-selection').select('Pending')
    cy.get('#rebasecalling-selection').select('None')

    cy.get('#flowcell-id-1').type('123ABC')
    cy.contains('Enter a valid Flowcell ID (3 letters then at least 3 numbers)')

    cy.get('#pool-id-1').type('Unknown')
    // Wait 500ms to allow debounce function to be called and validate input
    cy.wait(500)

    cy.contains('Enter a valid Pool barcode')
  })

  it('Fails to create a new run if the flowcell ids are duplicated', () => {
    cy.intercept('POST', '/v1/ont/runs', {
      statusCode: 422,
      body: {
        errors: [
          {
            title: 'flowcell_id ABC123 at position x1 is duplicated in the same run',
            detail: 'flowcells - flowcell_id ABC123 at position x1 is duplicated in the same run',
          },
          {
            title: 'flowcell_id ABC123 at position x2 is duplicated in the same run',
            detail: 'flowcells - flowcell_id ABC123 at position x2 is duplicated in the same run',
          },
        ],
      },
    })

    cy.visit('#/ont/run/new')

    cy.get('#instrument-selection').select('GXB02004')
    cy.get('#state-selection').select('Pending')
    cy.get('#rebasecalling-selection').select('None')

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

  it('successfully updates a run', () => {
    cy.get('@singleOntRunFactory').then((singleOntRunFactory) => {
      cy.intercept('GET', '/v1/ont/runs/1?include=flowcells.pool', {
        statusCode: 200,
        body: singleOntRunFactory.content,
      })
    })

    cy.intercept('PATCH', '/v1/ont/runs/1', {
      statusCode: 200,
      body: {
        data: {},
      },
    })

    cy.visit('#/ont/run/1')

    cy.get('#state-selection').select('Completed')
    cy.get('#rebasecalling-selection').select('None')

    cy.get('#update').click()

    cy.get('#run-index').contains('tr', '5')
  })
})
