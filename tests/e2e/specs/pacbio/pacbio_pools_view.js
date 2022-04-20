describe('Pacbio Pools view', () => {
  it('Visits the pacbio pools url', () => {
    cy.intercept(
      'v1/pacbio/pools?include=tube,libraries.tag,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id&fields[libraries]=request,tag',
      {
        fixture: 'tractionPacbioPools.json',
      },
    )
    cy.visit('#/pacbio/pools')
    cy.get('#pool-index>tbody').contains('tr', '2')
    cy.get('.pool')
      .first()
      .within(() => {
        // is there a better way? don't want to tie values to fixtures
        cy.get('.pool-id').invoke('text').should('match', /\d+/)
        cy.get('.barcode').invoke('text').should('include', 'TRAC')
        cy.get('.source-identifier').invoke('text').should('match', /\w+/)
        cy.get('.volume').invoke('text').should('match', /\d+/)
        cy.get('.concentration').invoke('text').should('match', /\d+/)
        cy.get('.template-prep-kit-box-barcode').invoke('text').should('match', /\w+/)
        cy.get('.insert-size').invoke('text').should('match', /\d+/)
      })
  })
})
