import OntRequestFactory from '../../../factories/OntRequestFactory.js'

describe('Ont samples view', () => {
  beforeEach(() => {
    cy.withFlags({
      rust_labwhere_service: { enabled: false },
    })
  })
  it('Visits the ont samples url', () => {
    cy.wrap(OntRequestFactory()).as('ontRequestFactory')
    cy.get('@ontRequestFactory').then((ontRequestFactory) => {
      cy.intercept('/v1/ont/requests?page[size]=25&page[number]=1', {
        statusCode: 200,
        body: ontRequestFactory.content,
      })
    })
    cy.visit('#/ont/samples')
    // Check filters are visible
    cy.get('#filterInput').should('be.visible')
    cy.get('#filterValue').should('be.visible')
    cy.get('#filterValue')
      .children()
      .should('contain', 'Sample ID (Request)')
      .and('contain', 'Sample name')
      .and('contain', 'Source barcode')

    cy.get('@ontRequestFactory').then((ontRequestFactory) => {
      cy.get('#samples-table')
        .find('tr')
        .should('have.length', ontRequestFactory.content.data.length + 1)
    })
    // Define an array of all column keys
    const columnKeys = [
      'id',
      'source_identifier',
      'sample_name',
      'library_type',
      'data_type',
      'number_of_flowcells',
      'cost_code',
      'external_study_id',
      'location',
      'sample_retention_instruction',
      'created_at',
    ]
    // Iterate over the column IDs and verify each has a length greater than 0
    columnKeys.forEach((columnKey) => {
      cy.get(`#${columnKey}`).should('have.length.greaterThan', 0)
    })
  })
})
