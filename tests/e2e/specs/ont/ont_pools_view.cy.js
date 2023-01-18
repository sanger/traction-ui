describe('Ont pools view', () => {
  it('Visits the ont pools url', () => {
    cy.intercept('v1/ont/pools?include=tube,libraries.tag,libraries.request', {
      fixture: 'tractionOntPools.json',
    })
    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
      features: {
        dpl_279_ont_libraries_and_pools: { enabled: true },
      },
    })
    cy.visit('#/ont/pools')
    cy.get('#pool-index').find('tr').should('have.length', '4')
    cy.get('.pool')
      .first()
      .within(() => {
        cy.get('.pool-id').invoke('text').should('match', /\d+/)
        cy.get('.barcode').invoke('text').should('include', 'TRAC')
        cy.get('.source-identifier').invoke('text').should('match', /\w+/)
        cy.get('.volume').invoke('text').should('match', /\d+/)
        cy.get('.concentration').invoke('text').should('match', /\d+/)
        cy.get('.kit-barcode').invoke('text').should('match', /\w+/)
        cy.get('.insert-size').invoke('text').should('match', /\d+/)
        cy.get('.final-library-amount').invoke('text').should('match', /\d+/)
      })
  })
})
