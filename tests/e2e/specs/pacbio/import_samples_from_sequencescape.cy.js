const sequencescapeRequest =
  '/api/v2/labware?filter[barcode]=DN9000002A,NT1O&include=receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study&fields[plates]=labware_barcode,receptacles&fields[tubes]=labware_barcode,receptacles&fields[wells]=position,aliquots&fields[receptacles]=aliquots&fields[samples]=sample_metadata,name,uuid&fields[sample_metadata]=sample_common_name&fields[studies]=uuid&fields[aliquots]=study,library_type,sample'

describe('Import samples from Sequencescape', () => {
  it('Successfully', () => {
    cy.visit('#/pacbio/sequencescape-reception')
    cy.contains('Scan Barcodes')
    cy.get('#barcodes').type('DN9000002A\nNT1O')
    cy.get('#cost_code').type('aCostCodeExample')
    cy.intercept(
      {
        url: '/api/v2/labware*',
        query: {
          'filter[barcode]': 'DN9000002A,NT1O',
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
    cy.intercept('POST', '/v1/pacbio/plates', { fixture: 'tractionPlates.json' }).as('postPayload')
    cy.intercept('POST', '/v1/pacbio/requests', { fixture: 'tractionPacbioRequest.json' }).as(
      'postPayload',
    )

    cy.get('#createTractionPlates').click()
    cy.contains('Labware created with barcodes DN9000002A,NT1O')

    cy.fixture('tractionPacbioPlateCreate').then(({ data }) => {
      cy.wait('@postPayload').its('request.body').should('deep.equal', data)
    })
  })

  it('Unsuccessfully - when the plates do not exist', () => {
    cy.visit('#/pacbio/sequencescape-reception')
    cy.contains('Scan Barcodes')
    cy.get('#barcodes').type('DN9000002A\nNT1O')
    cy.intercept(sequencescapeRequest, {
      statusCode: 200,
      body: { data: [] },
    })
    cy.get('#createTractionPlates').click()
    cy.contains('Labware could not be retrieved from Sequencescape')
  })

  it('Unsuccessfully - when there is an error from traction', () => {
    cy.visit('#/pacbio/sequencescape-reception')
    cy.contains('Scan Barcodes')
    cy.get('#barcodes').type('DN9000002A\nNT1O')
    cy.intercept(sequencescapeRequest, {
      fixture: 'sequencescapeLabware.json',
    })
    cy.intercept('/v1/pacbio/plates', {
      statusCode: 422,
      body: { errors: [{ title: 'plates', detail: 'There was an error.' }] },
    })
    cy.intercept('/v1/pacbio/requests', {
      statusCode: 422,
      body: { errors: [{ title: 'tubes', detail: 'There was an error.' }] },
    })
    cy.get('#createTractionPlates').click()
    cy.contains('plates There was an error., tubes There was an error.')
  })
})
