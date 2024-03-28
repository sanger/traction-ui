describe('Pacbio Pools view', () => {
  it('Visits the pacbio pools url', () => {
    cy.intercept(
      'v1/pacbio/pools?page[size]=25&page[number]=1&include=tube,libraries.tag,libraries.request&fields[requests]=sample_name&fields[tubes]=barcode&fields[tags]=group_id&fields[libraries]=request,tag,run_suitability',
      {
        fixture: 'tractionPacbioPoolsV1.json',
      },
    )
    cy.intercept('flipper/api/actors/User', {
      flipper_id: 'User',
      features: {
        multiplexing_phase_2_pool_with_aliquots: { enabled: false },
      },
    })
    cy.visit('#/pacbio/pools')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue')
      .children()
      .should('contain', 'Pool Barcode')
      .and('contain', 'Sample Name')
    cy.get('#pool-index>tbody').contains('tr', '2')

    // is there a better way? don't want to tie values to fixtures
    cy.get('#id').invoke('text').should('match', /\d+/)
    cy.get('#barcode').invoke('text').should('include', 'TRAC')
    cy.get('#source_identifier').invoke('text').should('match', /\w+/)
    cy.get('#volume').invoke('text').should('match', /\d+/)
    cy.get('#concentration').invoke('text').should('match', /\d+/)
    cy.get('#template_prep_kit_box_barcode').invoke('text').should('match', /\w+/)
    cy.get('#insert_size').invoke('text').should('match', /\d+/)
  })
})
