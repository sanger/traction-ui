const sequencescapeRequest =
  '/api/v2/labware?filter[barcode]=DN9000002A,NT1O&include=receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study&fields[plates]=labware_barcode,receptacles&fields[tubes]=labware_barcode,receptacles&fields[wells]=position,aliquots&fields[receptacles]=aliquots&fields[samples]=sample_metadata,name,uuid&fields[sample_metadata]=sample_common_name&fields[studies]=uuid&fields[aliquots]=study,library_type,sample'

describe('Import samples from Sequencescape', () => {
  beforeEach(() => {
    cy.withFlags({
      dpl_277_enable_general_reception: { enabled: true },
    })
    cy.intercept('v1/library_types?fields[library_types]=name,pipeline', {
      fixture: 'tractionLibraryTypes.json',
    })
  })

  it('Successfully', () => {
    cy.visit('#/reception')
    cy.get('[data-type="source-list"]').select('Sequencescape')
    cy.contains('Scan barcodes')
    cy.get('#barcodes').type('DN9000002A\nNT1O')
    cy.get('#cost_code').type('aCostCodeExample')
    cy.get('[data-attribute=estimate_of_gb_required]').type('3')
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
    cy.intercept('POST', '/v1/receptions', { fixture: 'tractionPacbioRequest.json' }).as(
      'postPayload',
    )

    cy.contains('Import 2 labware into PacBio from Sequencescape')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('Imported 3 requests from Sequencescape')

    cy.fixture('receptionCreateSourceSequencescape').then(({ data }) => {
      cy.log('@postPayload')
      cy.wait('@postPayload').its('request.body').should('deep.equal', data)
    })
  })

  it('Unsuccessfully - when the plates do not exist', () => {
    cy.visit('#/reception')
    cy.contains('Scan barcodes')
    cy.get('#barcodes').type('DN9000002A\nNT1O')
    cy.intercept(sequencescapeRequest, {
      statusCode: 200,
      body: { data: [] },
    })
    cy.contains('Import 2 labware into PacBio from Sequencescape')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('Labware could not be retrieved from Sequencescape')
  })

  it('Unsuccessfully - when there is an error from traction', () => {
    cy.visit('#/reception')
    cy.contains('Scan barcodes')
    cy.get('#barcodes').type('DN9000002A\nNT1O')
    cy.intercept(sequencescapeRequest, {
      fixture: 'sequencescapeLabware.json',
    })
    cy.intercept('/v1/receptions', {
      statusCode: 422,
      body: { errors: [{ title: 'receptions', detail: 'There was an error.' }] },
    })
    cy.contains('Import 2 labware into PacBio from Sequencescape')
    cy.get('[data-action="import-labware"]').click()
    cy.contains('There was an error.')
  })
})
