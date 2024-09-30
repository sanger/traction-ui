import OntRunsFactory from '../../../factories/OntRunsFactory.js'
import OntRunFactory from '../../../factories/OntRunFactory.js'

describe('ONT Runs view', () => {
  it('Visits the ont runs url', () => {
    cy.wrap(OntRunsFactory()).as('ontRunsFactory')
    cy.get('@ontRunsFactory').then((ontRunsFactory) => {
      cy.intercept('GET', '/v1/ont/runs?page[size]=25&page[number]=1&include=instrument', {
        statusCode: 200,
        body: ontRunsFactory.content,
      })
    })
    cy.visit('#/ont/runs')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue').children().should('contain', 'State').and('contain', 'Experiment ID')

    cy.get('#run-index').contains('tr', '5')
    cy.get('#id').invoke('text').should('match', /\d+/)
    cy.get('#experiment_name').invoke('text').should('include', 'ONTRUN-')
    cy.get('#state').invoke('text').should('match', /\w+/)
    cy.get('#instrument_name').invoke('text').should('match', /\w+/)
    cy.get('#created_at').invoke('text').should('match', /\d+/)
    cy.get('#actions').invoke('text').should('include', 'Edit').and('include', 'Sample Sheet')
  })

  it('displays the ONT run page with correct data when clicking on edit run', () => {
    cy.wrap(OntRunsFactory()).as('ontRunsFactory')
    cy.wrap(OntRunFactory()).as('ontRunFactory')

    cy.get('@ontRunsFactory').then((ontRunsFactory) => {
      cy.intercept('GET', '/v1/ont/runs?page[size]=25&page[number]=1&include=instrument', {
        statusCode: 200,
        body: ontRunsFactory.content,
      })
    })

    cy.get('@ontRunFactory').then((ontRunFactory) => {
      cy.intercept('GET', '/v1/ont/runs/2?include=flowcells', {
        statusCode: 200,
        body: ontRunFactory.content,
      })
    })
    cy.intercept('v1/ont/pools?filter[barcode]=TRAC-1-2', {
      statusCode: 200,
      fixture: 'tractionOntPool.json',
    })
    cy.intercept('/v1/ont/pools?include=tube,libraries.tag,libraries.request', {
      fixture: 'tractionOntPools.json',
    })

    cy.visit('#/ont/runs')
    cy.get('#editRun-2').click()

    // Check that the URL is correct
    cy.url().should('include', '#/ont/run/2')
    cy.get('#flowcell-id-1').invoke('val').should('eq', 'ABC1234')
    cy.get('#pool-id-1').invoke('val').should('eq', 'TRAC-2-9')
  })
})
