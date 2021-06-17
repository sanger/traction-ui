describe('Pacbio Run Create view', () => {
  it('Creates a run successfully', () => {
    cy.visit('#/pacbio/runs')
    cy.get('button')
      .contains('New Run')
      .click()
  })
})
