describe('Print samples from Sequencescape Tubes', () => {
  beforeEach(() => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Sequencescape Tubes')
    cy.contains('Scan barcodes')
    cy.intercept(
      {
        url: '/api/v2/labware*',
        query: {
          'filter[barcode]': '3980000001795',
          include: 'receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study',
          'fields[plates]': 'labware_barcode,receptacles',
          'fields[tubes]': 'labware_barcode,receptacles',
          'fields[aliquots]': 'study,library_type,sample',
          'fields[receptacles]': 'aliquots',
          'fields[sample_metadata]': 'sample_common_name',
          'fields[samples]': 'sample_metadata,name,uuid',
          'fields[studies]': 'uuid',
          'fields[wells]': 'position,aliquots',
        },
      },
      {
        fixture: 'sequencescapeLabware.json',
      },
    )

    cy.get('#barcodes').type('3980000001795\n')
    cy.get('#print-barcodes').should('have.value', 'NT1O')
    cy.get('#printer-choice').select('stub')
  })
  it('successfully prints', () => {
    cy.intercept('/v2/print_jobs', {
      statusCode: 200,
      body: {
        message: 'Successful',
      },
    })
    cy.get('#print-button').click()
    cy.contains('Barcode(s) successfully printed')
  })
  it('print request is unsuccessful, failed response', () => {
    cy.intercept('/v2/print_jobs', {
      statusCode: 422,
      body: {
        errors: [
          {
            source: {
              pointer: 'api/label',
            },
            detail: 'is invalid',
          },
        ],
      },
    })
    cy.get('#print-button').click()
    cy.contains('api/label is invalid')
  })
})
