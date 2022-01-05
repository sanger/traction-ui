describe('Import samples from Sequencescape', () => {
  it('Successfully', () => {
    cy.visit('#/pacbio/plate-reception')
    cy.contains('Barcodes:')
    cy.get('#barcodes').type('DN804974W')
    cy.intercept(
      '/api/v2/plates?filter[barcode]=DN804974W&include=wells.aliquots.sample.sample_metadata,wells.aliquots.study',
      {
        fixture: 'sequencescapePlates.json',
      },
    )
    cy.intercept('POST', '/v1/pacbio/plates', { fixture: 'tractionPlates.json' }).as('postPayload')

    cy.get('#createTractionPlates').click()
    cy.fixture('tractionPacbioPlateCreate').then(({ data }) => {
      cy.wait('@postPayload').its('request.body').should('deep.equal', data)
    })

    cy.contains('Plates created with barcodes DN804974W')
  })

  it('Unsuccessfully - when the plates do not exist', () => {
    cy.visit('#/pacbio/plate-reception')
    cy.contains('Barcodes:')
    cy.get('#barcodes').type('DN804974W')
    cy.intercept(
      '/api/v2/plates?filter[barcode]=DN804974W&include=wells.aliquots.sample.sample_metadata,wells.aliquots.study',
      {
        statusCode: 200,
        body: { data: [] },
      },
    )
    cy.get('#createTractionPlates').click()
    cy.contains('Plates could not be retrieved from Sequencescape')
  })

  it('Unsuccessfully - when there is an error from traction', () => {
    cy.visit('#/pacbio/plate-reception')
    cy.contains('Barcodes:')
    cy.get('#barcodes').type('DN804974W')
    cy.intercept(
      '/api/v2/plates?filter[barcode]=DN804974W&include=wells.aliquots.sample.sample_metadata,wells.aliquots.study',
      {
        fixture: 'sequencescapePlates.json',
      },
    )
    cy.intercept('/v1/pacbio/plates', {
      statusCode: 422,
      body: { data: { errors: { error1: ['There was an error.'] } } },
    })
    cy.get('#createTractionPlates').click()
    cy.contains('error1 There was an error.')
  })
})
