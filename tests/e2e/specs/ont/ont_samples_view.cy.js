import OntRequestFactory from '../../../factories/OntRequestFactory.js'

describe('Ont samples view', () => {
  beforeEach(() => {
    cy.wrap(OntRequestFactory()).as('ontRequestFactory')
    cy.get('@ontRequestFactory').then((ontRequestFactory) => {
      cy.intercept('/v1/ont/requests?page[size]=25&page[number]=1', {
        statusCode: 200,
        body: ontRequestFactory.content,
      })
    })
    // Stub labware request
    cy.get('@ontRequestFactory')
      .then((ontRequestFactory) => {
        const labwhereUrl = Cypress.env('VITE_LABWHERE_BASE_URL')
        cy.intercept(`${labwhereUrl}/api/labwares/searches`, {
          statusCode: 200,
          body: [
            {
              barcode: ontRequestFactory.content.data[0].attributes.source_identifier.split(':')[0],
              created_at: 'Tuesday September 16 2025 10:29',
              updated_at: 'Tuesday September 16 2025 10:29',
              location: {
                id: 432,
                name: 'box-test',
              },
            },
          ],
        })
      })
      .as('labwareRequest')
  })

  it('Visits the ont samples url', () => {
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
      'sample_retention_instruction',
      'created_at',
    ]
    // Iterate over the column IDs and verify each has a length greater than 0
    columnKeys.forEach((columnKey) => {
      cy.get(`#${columnKey}`).should('have.length.greaterThan', 0)
    })

    // Handle location column separately due to labware request stub
    cy.wait('@labwareRequest').its('response.statusCode').should('eq', 200)
    // Currently these tables have invalid HTML (multiple elements with same ID)
    // so we have to use 'td#location' instead of '#location' to get all matching table cells
    cy.get('td#location').should('have.length.greaterThan', 0)
    cy.get('td#location').first().should('contain', 'box-test')
  })

  it('successfully edits a request', () => {
    const id = OntRequestFactory().storeData.ids[0]
    const costCode = 'NEW_COST_CODE'

    cy.intercept('PATCH', `/v1/ont/requests/${id}`, {
      statusCode: 200,
      body: {
        data: {
          id,
          attributes: {
            cost_code: costCode,
          },
        },
      },
    })

    cy.visit('#/ont/samples')

    cy.get(`[data-action=edit-request-${id}]`).click()
    cy.get(`[data-type="ont-request-edit-${id}"]`).within(() => {
      cy.get('[data-attribute=cost-code]').clear().type(costCode)
      cy.get('[data-action=update-request]').click()
    })
    cy.get('@ontRequestFactory').then((ontRequestFactory) => {
      const sampleName = ontRequestFactory.storeData.resources[id].sample_name
      cy.contains(`Sample ${sampleName} updated successfully`)
    })
    cy.get(`[data-type="ont-request-edit-${id}"]`).should('not.exist')
  })

  it('fails if request is not updated successfully', () => {
    const id = OntRequestFactory().storeData.ids[0]
    const costCode = 'NEW_COST_CODE'

    cy.intercept('PATCH', `/v1/ont/requests/${id}`, {
      statusCode: 422,
      body: {
        errors: [
          {
            title: 'Invalid cost code',
            detail: 'Invalid cost code',
          },
        ],
      },
    })

    cy.visit('#/ont/samples')

    cy.get(`[data-action=edit-request-${id}]`).click()
    cy.get(`[data-type="ont-request-edit-${id}"]`).within(() => {
      cy.get('[data-attribute=cost-code]').clear().type(costCode)
      cy.get('[data-action=update-request]').click()
    })
    cy.get('@ontRequestFactory').then((ontRequestFactory) => {
      const sampleName = ontRequestFactory.storeData.resources[id].sample_name
      cy.contains(`Error updating sample ${sampleName}: Invalid cost code`)
    })
  })
})
