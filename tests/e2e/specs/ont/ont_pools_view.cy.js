describe('Ont pools view', () => {
  beforeEach(() => {
    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
      features: {
        enable_custom_table: { enabled: true },
      },
    })
  })
  it('Visits the ont pools url', () => {
    cy.intercept('v1/ont/pools?include=tube,libraries.tag,libraries.request', {
      fixture: 'tractionOntPools.json',
    })
    cy.visit('#/ont/pools')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue')
      .children()
      .should('contain', 'Barcode')
      .and('contain', 'Pool ID')
      .and('contain', 'Sample Name')
    cy.get('#pool-index').find('tr').should('have.length', '4')

    cy.get('#id').invoke('text').should('match', /\d+/)
    cy.get('#barcode').invoke('text').should('include', 'TRAC')
    cy.get('#source_identifier').invoke('text').should('match', /\w+/)
    cy.get('#volume').invoke('text').should('match', /\d+/)
    cy.get('#concentration').invoke('text').should('match', /\d+/)
    cy.get('#kit_barcode').invoke('text').should('match', /\w+/)
    cy.get('#insert_size').invoke('text').should('match', /\d+/)
    cy.get('#final_library_amount').invoke('text').should('match', /\d+/)
  })
})
