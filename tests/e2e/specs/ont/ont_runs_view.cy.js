import OntRunFactory from '../../../factories/OntRunFactory.js'

describe('ONT Runs view', () => {
  it('Visits the ont runs url', () => {
    cy.wrap(OntRunFactory()).as('ontRunFactory')
    cy.get('@ontRunFactory').then((ontRunFactory) => {
      cy.intercept('GET', '/v1/ont/runs?page[size]=25&page[number]=1&include=instrument', {
        statusCode: 200,
        body: ontRunFactory.content,
      })
    })
    cy.visit('#/ont/runs')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue').children().should('contain', 'State').and('contain', 'Experiment ID')

    cy.get('#run-index').contains('tr', '5')
    cy.get('[data-attribute=id]').first().invoke('text').should('match', /\d+/)
    cy.get('[data-attribute=experiment_name]').first().invoke('text').should('include', 'ONTRUN-')
    cy.get('[data-attribute=state]').first().invoke('text').should('match', /\w+/)
    cy.get('[data-attribute=instrument_name]').first().invoke('text').should('match', /\w+/)
    cy.get('[data-attribute=created_at]').first().invoke('text').should('match', /\d+/)
    cy.get('[data-attribute=actions]').first().invoke('text').should('include', 'Edit').and('include', 'Sample Sheet')
  })

  it('displays the ONT run page with correct data when clicking on edit run', () => {
    cy.wrap(OntRunFactory()).as('ontRunFactory')
    cy.get('@ontRunFactory').then((ontRunFactory) => {
      cy.intercept('GET', '/v1/ont/runs?page[size]=25&page[number]=1&include=instrument', {
        statusCode: 200,
        body: ontRunFactory.content,
      })
    })

    cy.wrap(OntRunFactory({ findBy: 'flowcells' })).as('ontRunFactoryWithFlowcells')
    cy.get('@ontRunFactoryWithFlowcells').then((ontRunFactoryWithFlowcells) => {
      cy.intercept('GET', '/v1/ont/runs/2?include=flowcells.pool', {
        statusCode: 200,
        body: ontRunFactoryWithFlowcells.content,
      })
    })

    cy.visit('#/ont/runs')
    cy.get('#editRun-2').click()

    // Check that the URL is correct
    cy.url().should('include', '#/ont/run/2')
    cy.get('#flowcell-id-1').invoke('val').should('eq', 'ABC1234')
    cy.get('#pool-id-1').invoke('val').should('eq', 'TRAC-2-34')
  })
})
