import PacbioTagSetFactory from '../../../factories/PacbioTagSetFactory.js'

describe('Flexible pooling new', () => {
  beforeEach(() => {
    cy.withFlags({
      flexible_pooling: { enabled: true },
    })
    cy.wrap(PacbioTagSetFactory()).as('pacbioTagSetFactory')
  })

  describe('successfully', () => {
    it('successfully creates a multi pool when the file is valid', () => {
      cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
        cy.intercept('GET', '/v1/pacbio/tag_sets?include=tags*', {
          statusCode: 200,
          body: pacbioTagSetFactory.content,
        })
      })
      cy.intercept(
        'GET',
        '/v1/pacbio/libraries?filter[barcode]=GEN-SOURCE:A1&include=request,tube',
        {
          statusCode: 200,
          body: {
            data: [],
            included: [],
          },
        },
      )
      cy.intercept(
        'GET',
        'v1/pacbio/requests?filter[source_identifier]=GEN-SOURCE:A1&include=plate.wells,well,tube',
        {
          statusCode: 200,
          body: {
            data: [
              {
                id: '1',
                type: 'requests',
                attributes: {
                  source_identifier: 'GEN-SOURCE:A1',
                },
                relationships: {
                  plate: {
                    data: {
                      id: '1',
                      type: 'plates',
                    },
                    links: {
                      related: '/v1/pacbio/requests/1/plate',
                    },
                  },
                  wells: {
                    data: [
                      {
                        id: '1',
                        type: 'wells',
                      },
                    ],
                    links: {
                      related: '/v1/pacbio/requests/1/wells',
                    },
                  },
                },
              },
            ],
            included: [
              {
                id: '1',
                type: 'plates',
                attributes: {
                  barcode: 'GEN-PLATE-001',
                },
              },
              {
                id: '1',
                type: 'wells',
                attributes: {
                  position: 'A1',
                },
                relationships: {
                  plate: {
                    data: {
                      id: '1',
                      type: 'plates',
                    },
                    links: {
                      related: '/v1/pacbio/wells/1/plate',
                    },
                  },
                },
              },
            ],
          },
        },
      )

      cy.intercept('POST', '/v1/multi_pools', {
        statusCode: 201,
        body: {
          data: {
            id: '1',
            type: 'multi_pools',
            attributes: {
              pipeline: 'Pacbio',
              pool_method: 'plate',
            },
          },
        },
      })

      cy.visit('#/flexible-pool/new')

      // Upload CSV file
      //Create a file from PacbioLibraryBatchFactory and attach it to the input
      const csvContent = [
        'Pool Number,Source Identifier,Tag Set,Tag,Template Prep Kit Box Barcode,Volume (uL),Concentration (ng/uL),Insert Size',
        '1,GEN-SOURCE:A1,,,TPK-BOX:12345,10,20,500',
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const file = new File([blob], 'multi_pool.csv', { type: 'text/csv' })

      // Attach the generated CSV file
      cy.get('[data-testid="csv-file-input"]').attachFile({
        fileContent: file,
        fileName: 'multi_pool.csv',
        mimeType: 'text/csv',
      })

      // TODO: check there is one green / valid pool

      cy.contains('[data-attribute="message"]', 'CSV file successfully processed')

      cy.get('[data-testid="create-btn"]').click()
      cy.contains('[data-attribute="message"]', 'Flexible pool successfully created with barcode')
    })

    it('successfully uploads even when some non-required data is missing', () => {
      cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
        cy.intercept('GET', '/v1/pacbio/tag_sets?include=tags*', {
          statusCode: 200,
          body: pacbioTagSetFactory.content,
        })
      })
      cy.intercept(
        'GET',
        '/v1/pacbio/libraries?filter[barcode]=GEN-SOURCE:A1&include=request,tube',
        {
          statusCode: 200,
          body: {
            data: [],
            included: [],
          },
        },
      )
      cy.intercept(
        'GET',
        'v1/pacbio/requests?filter[source_identifier]=GEN-SOURCE:A1&include=plate.wells,well,tube',
        {
          statusCode: 200,
          body: {
            data: [
              {
                id: '1',
                type: 'requests',
                attributes: {
                  source_identifier: 'GEN-SOURCE:A1',
                },
                relationships: {
                  plate: {
                    data: {
                      id: '1',
                      type: 'plates',
                    },
                    links: {
                      related: '/v1/pacbio/requests/1/plate',
                    },
                  },
                  wells: {
                    data: [
                      {
                        id: '1',
                        type: 'wells',
                      },
                    ],
                    links: {
                      related: '/v1/pacbio/requests/1/wells',
                    },
                  },
                },
              },
            ],
            included: [
              {
                id: '1',
                type: 'plates',
                attributes: {
                  barcode: 'GEN-PLATE-001',
                },
              },
              {
                id: '1',
                type: 'wells',
                attributes: {
                  position: 'A1',
                },
                relationships: {
                  plate: {
                    data: {
                      id: '1',
                      type: 'plates',
                    },
                    links: {
                      related: '/v1/pacbio/wells/1/plate',
                    },
                  },
                },
              },
            ],
          },
        },
      )

      cy.intercept('POST', '/v1/multi_pools', {
        statusCode: 201,
        body: {
          data: {
            id: '1',
            type: 'multi_pools',
            attributes: {
              pipeline: 'Pacbio',
              pool_method: 'plate',
            },
          },
        },
      })

      cy.visit('#/flexible-pool/new')

      // Upload CSV file
      //Create a file from PacbioLibraryBatchFactory and attach it to the input
      // This has missing volume
      const csvContent = [
        'Pool Number,Source Identifier,Tag Set,Tag,Template Prep Kit Box Barcode,Volume (uL),Concentration (ng/uL),Insert Size',
        '1,GEN-SOURCE:A1,,,TPK-BOX:12345,,20,500',
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const file = new File([blob], 'multi_pool.csv', { type: 'text/csv' })

      // Attach the generated CSV file
      cy.get('[data-testid="csv-file-input"]').attachFile({
        fileContent: file,
        fileName: 'multi_pool.csv',
        mimeType: 'text/csv',
      })

      // TODO: check there is one red / invalid pool

      cy.contains('[data-attribute="message"]', 'CSV file successfully processed')

      // TODO: check the create button is disabled
      //   cy.get('[data-testid="create-btn"]').isDisabled() // create button should be disabled because volume is missing for a sub pool
    })
  })

  describe('unsuccessfully', () => {
    it('shows an error message when the file is empty', () => {
      const csvContent =
        'Pool Number,Source Identifier,Tag Set,Tag,Template Prep Kit Box Barcode,Volume (uL),Concentration (ng/uL),Insert Size\n'
      cy.visit('#/flexible-pool/new')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const file = new File([blob], 'multi_pool.csv', { type: 'text/csv' })
      cy.get('[data-testid="csv-file-input"]').attachFile({
        fileContent: file,
        fileName: 'multi_pool.csv',
        mimeType: 'text/csv',
      })
      cy.contains('[data-attribute="message"]', 'The provided csv file is empty')
    })

    it('shows an error message when the file is missing required columns', () => {
      const csvContent =
        'Pool Number,Source Identifier,Tag Set,Tag,Template Prep Kit Box Barcode,Volume (uL),Concentration (ng/uL)\n1,GEN-SOURCE:A1,,,TPK-BOX:12345,10,20\n'
      cy.visit('#/flexible-pool/new')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const file = new File([blob], 'multi_pool.csv', { type: 'text/csv' })
      cy.get('[data-testid="csv-file-input"]').attachFile({
        fileContent: file,
        fileName: 'multi_pool.csv',
        mimeType: 'text/csv',
      })
      cy.contains('[data-attribute="message"]', 'Header "Insert Size" not found in CSV')
    })

    it('shows an error message when the pool number is invalid', () => {
      const csvContent = [
        'Pool Number,Source Identifier,Tag Set,Tag,Template Prep Kit Box Barcode,Volume (uL),Concentration (ng/uL),Insert Size',
        'A,GEN-SOURCE:A1,,,TPK-BOX:12345,10,20,500',
      ].join('\n')
      cy.visit('#/flexible-pool/new')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const file = new File([blob], 'multi_pool.csv', { type: 'text/csv' })
      cy.get('[data-testid="csv-file-input"]').attachFile({
        fileContent: file,
        fileName: 'multi_pool.csv',
        mimeType: 'text/csv',
      })
      cy.contains(
        '[data-attribute="message"]',
        'Invalid pool number on line 2, pool number must be a number',
      )
    })

    it('shows an error message when the source identifier is missing', () => {
      const csvContent = [
        'Pool Number,Source Identifier,Tag Set,Tag,Template Prep Kit Box Barcode,Volume (uL),Concentration (ng/uL),Insert Size',
        '1,,,TPK-BOX:12345,10,20,500',
      ].join('\n')
      cy.visit('#/flexible-pool/new')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const file = new File([blob], 'multi_pool.csv', { type: 'text/csv' })
      cy.get('[data-testid="csv-file-input"]').attachFile({
        fileContent: file,
        fileName: 'multi_pool.csv',
        mimeType: 'text/csv',
      })
      cy.contains('[data-attribute="message"]', 'Missing source identifier on line 2')
    })

    it('shows an error message when the source identifier is not found in the service', () => {
      const csvContent = [
        'Pool Number,Source Identifier,Tag Set,Tag,Template Prep Kit Box Barcode,Volume (uL),Concentration (ng/uL),Insert Size',
        '1,GEN-SOURCE:NOTFOUND,,,TPK-BOX:12345,10,20,500',
      ].join('\n')

      cy.intercept(
        'GET',
        '/v1/pacbio/libraries?filter[barcode]=GEN-SOURCE:NOTFOUND&include=request,tube',
        {
          statusCode: 200,
          body: {
            data: [],
            included: [],
          },
        },
      )

      cy.intercept(
        'GET',
        'v1/pacbio/requests?filter[source_identifier]=GEN-SOURCE:NOTFOUND&include=plate.wells,well,tube',
        {
          statusCode: 200,
          body: {
            data: [],
            included: [],
          },
        },
      )

      cy.visit('#/flexible-pool/new')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const file = new File([blob], 'multi_pool.csv', { type: 'text/csv' })
      cy.get('[data-testid="csv-file-input"]').attachFile({
        fileContent: file,
        fileName: 'multi_pool.csv',
        mimeType: 'text/csv',
      })
      cy.contains(
        '[data-attribute="message"]',
        'Error building pool number 1: Unable to find labware with source identifier GEN-SOURCE:NOTFOUND',
      )
    })

    it('shows an error message when the tag set is not a valid tag set', () => {
      const csvContent = [
        'Pool Number,Source Identifier,Tag Set,Tag,Template Prep Kit Box Barcode,Volume (uL),Concentration (ng/uL),Insert Size',
        '1,GEN-SOURCE:A1,INVALID_TAG_SET,TAG1,TPK-BOX:12345,10,20,500',
      ].join('\n')

      cy.get('@pacbioTagSetFactory').then((pacbioTagSetFactory) => {
        cy.intercept('GET', '/v1/pacbio/tag_sets?include=tags*', {
          statusCode: 200,
          body: pacbioTagSetFactory.content,
        })
      })

      cy.visit('#/flexible-pool/new')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const file = new File([blob], 'multi_pool.csv', { type: 'text/csv' })
      cy.get('[data-testid="csv-file-input"]').attachFile({
        fileContent: file,
        fileName: 'multi_pool.csv',
        mimeType: 'text/csv',
      })
      cy.contains(
        '[data-attribute="message"]',
        'Error building pool number 1: Tag set INVALID_TAG_SET not found',
      )
    })

    it('shows an error message when the multiple tag sets are used in a single pool', () => {
      const csvContent = [
        'Pool Number,Source Identifier,Tag Set,Tag,Template Prep Kit Box Barcode,Volume (uL),Concentration (ng/uL),Insert Size',
        '1,GEN-SOURCE:A1,TAGSET1,TAG1,TPK-BOX:12345,10,20,500',
        '1,GEN-SOURCE:A1,TAGSET2,TAG2,TPK-BOX:12345,10,20,500',
      ].join('\n')

      cy.visit('#/flexible-pool/new')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const file = new File([blob], 'multi_pool.csv', { type: 'text/csv' })
      cy.get('[data-testid="csv-file-input"]').attachFile({
        fileContent: file,
        fileName: 'multi_pool.csv',
        mimeType: 'text/csv',
      })

      cy.contains(
        '[data-attribute="message"]',
        'Error building pool number 1: Multiple tag sets found. Please ensure all records in the pool have the same tag set.',
      )
    })
  })
})
