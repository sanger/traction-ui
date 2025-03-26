import {
  validate,
  payload,
  assignLibraryRequestsToTubes,
  createUsedAliquotsAndMapToSourceId,
  assignRequestIdsToTubes,
  buildRunSuitabilityErrors,
  createUsedAliquotsFromState,
  addUsedAliquotsAndErrorsToPools,
} from '@/stores/utilities/pool'
import { expect, it } from 'vitest'
import { createUsedAliquot } from '@/stores/utilities/usedAliquot.js'
import { dataToObjectById } from '@/api/JsonApi'

describe('pool', () => {
  describe('validate', () => {
    it('returns true when all used_aliquots are valid and there are no duplicate tags', () => {
      const used_aliquots = {
        1: createUsedAliquot({
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '1',
          source_type: 'Pacbio:Request',
        }),
        2: createUsedAliquot({
          tag_id: 'tag2',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '2',
          source_type: 'Pacbio:Request',
        }),
      }
      // Setup a valid pool so validation doesnt fail on the pool
      const pool = {
        template_prep_kit_box_barcode: 'barcode1',
        volume: 10,
        concentration: 5,
        insert_size: 1,
      }
      expect(validate({ used_aliquots, pool })).toBe(true)
    })

    it('returns false when a library is missing a required attribute', () => {
      const used_aliquots = {
        1: createUsedAliquot({
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '1',
        }),
        2: createUsedAliquot({
          tag_id: 'tag2',
          volume: 10,
          concentration: 5,
          template_prep_kit_box_barcode: 'barcode1',
        }),
      }

      expect(validate({ used_aliquots, pool: {} })).toBe(false)
      expect(used_aliquots['2'].errors).toEqual({
        insert_size: 'must be present',
        source_id: 'must be present',
        source_type: 'must be present',
      })
    })

    it('returns false when a library volume is less than available volume', () => {
      const used_aliquots = {
        1: createUsedAliquot({
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '1',
          source_type: 'Pacbio:Request',
          available_volume: 5,
        }),
        2: createUsedAliquot({
          tag_id: 'tag2',
          volume: 10,
          concentration: 5,
          template_prep_kit_box_barcode: 'barcode1',
          insert_size: 1000,
          source_id: '1',
          source_type: 'Pacbio:Request',
        }),
      }

      expect(validate({ used_aliquots, pool: {} })).toBe(false)
      expect(used_aliquots['1'].errors).toEqual({
        volume: 'must be less or equal to available volume',
      })
    })

    it('returns false when there are duplicate tags', () => {
      const used_aliquots = {
        1: createUsedAliquot({
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '1',
          source_type: 'Pacbio:Request',
        }),
        2: createUsedAliquot({
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '1',
          source_type: 'Pacbio:Request',
        }),
      }
      expect(validate({ used_aliquots, pool: {} })).toBe(false)
      expect(used_aliquots['2'].errors).toEqual({ tag_id: 'duplicated' })
    })

    it('returns false when the pool has missing fields', () => {
      const pool = {
        insert_size: '',
        concentration: '',
        volume: '',
        template_prep_kit_box_barcode: '',
      }
      expect(validate({ used_aliquots: {}, pool })).toBe(false)
      expect(pool.errors).toEqual({
        insert_size: 'must be present',
        concentration: 'must be present',
        volume: 'must be present',
        template_prep_kit_box_barcode: 'must be present',
      })
    })

    it('returns false when the pool volume is less than used volume', () => {
      const pool = {
        insert_size: '',
        concentration: '',
        volume: '5',
        used_volume: '10',
        template_prep_kit_box_barcode: '',
      }
      expect(validate({ used_aliquots: {}, pool })).toBe(false)
      expect(pool.errors).toEqual({
        insert_size: 'must be present',
        concentration: 'must be present',
        volume: 'must be greater than used volume',
        template_prep_kit_box_barcode: 'must be present',
      })
    })

    it('returns true when the pool and used_aliquots are valid', () => {
      const used_aliquots = {
        1: createUsedAliquot({
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '1',
          source_type: 'Pacbio:Request',
        }),
        2: createUsedAliquot({
          tag_id: 'tag2',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '2',
          source_type: 'Pacbio:Request',
        }),
      }
      const pool = {
        insert_size: 100,
        concentration: 10,
        volume: 10,
        used_volume: 5,
        template_prep_kit_box_barcode: 'ABC1',
      }
      validate({ used_aliquots, pool })

      expect(
        Object.values(used_aliquots).every((library) => Object.keys(library.errors).length === 0),
      ).toBeTruthy()
      expect(Object.keys(pool.errors).length).toBe(0)
    })
  })

  describe('payload', () => {
    it('returns a payload object with the correct structure', () => {
      const used_aliquots = {
        1: createUsedAliquot({
          id: '1',
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1,
          source_id: '1',
          template_prep_kit_box_barcode: 'barcode1',
          source_type: 'Pacbio:Request',
        }),
        2: createUsedAliquot({
          id: '2',
          tag_id: 'tag2',
          volume: 10,
          concentration: 5,
          insert_size: 1,
          source_id: '1',
          template_prep_kit_box_barcode: 'barcode1',
          otherUsedAliquotAttribute: 'aliquotValue',
          source_type: 'Pacbio:Request',
        }),
      }
      const pool = {
        id: '1',
        template_prep_kit_box_barcode: 'barcode1',
        volume: 10,
        concentration: 5,
        insert_size: 1,
        otherPoolAttribute: 'poolValue',
      }

      const expected = {
        data: {
          type: 'pools',
          id: '1',
          attributes: {
            used_aliquots_attributes: [
              {
                id: '1',
                volume: 10,
                concentration: 5,
                insert_size: 1,
                source_id: '1',
                source_type: 'Pacbio:Request',
                tag_id: 'tag1',
                template_prep_kit_box_barcode: 'barcode1',
              },
              {
                id: '2',
                volume: 10,
                concentration: 5,
                insert_size: 1,
                source_id: '1',
                source_type: 'Pacbio:Request',
                tag_id: 'tag2',
                template_prep_kit_box_barcode: 'barcode1',
              },
            ],
            primary_aliquot_attributes: {
              template_prep_kit_box_barcode: 'barcode1',
              volume: 10,
              concentration: 5,
              insert_size: 1,
            },
            template_prep_kit_box_barcode: 'barcode1',
            volume: 10,
            concentration: 5,
            insert_size: 1,
          },
        },
      }

      const result = payload({ used_aliquots, pool })

      expect(result).toEqual(expected)
    })
  })

  describe('in flight modifications for fetching pools', () => {
    const libraries = [
      {
        id: '14160',
        type: 'libraries',
        attributes: {
          state: 'pending',
          volume: 51.6,
          concentration: 12.2,
          source_identifier: 'FS71986093',
          pacbio_request_id: 8951,
          tag_id: 601,
          used_volume: 7.5,
          available_volume: 44.1,
        },
        relationships: {
          request: {
            data: {
              type: 'requests',
              id: '8951',
            },
          },
          tag: {
            data: {
              type: 'tags',
              id: '601',
            },
          },
          tube: {
            data: {
              type: 'tubes',
              id: '11877',
            },
          },
          primary_aliquot: {
            data: {
              type: 'aliquots',
              id: '35029',
            },
          },
        },
      },
      {
        id: '14159',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159',
        },
        attributes: {
          volume: 22.3,
          concentration: 12.9,
          source_identifier: 'FS71986813',
          pacbio_request_id: 8950,
          tag_id: 600,
          used_volume: 7.5,
          available_volume: 14.8,
        },
        relationships: {
          request: {
            data: {
              type: 'requests',
              id: '8950',
            },
          },
          tag: {
            data: {
              type: 'tags',
              id: '600',
            },
          },
          tube: {
            data: {
              type: 'tubes',
              id: '11876',
            },
          },
          primary_aliquot: {
            data: {
              type: 'aliquots',
              id: '35027',
            },
          },
        },
      },
    ]

    const tubes = [
      {
        id: '11877',
        type: 'tubes',
        attributes: {
          barcode: 'TRAC-2-11877',
        },
        relationships: {
          libraries: {
            data: {
              type: 'libraries',
              id: '14160',
            },
          },
        },
      },
      {
        id: '11876',
        type: 'tubes',
        attributes: {
          barcode: 'TRAC-2-11876',
        },
        relationships: {
          libraries: {
            data: {
              type: 'libraries',
              id: '14159',
            },
          },
        },
      },
    ]

    const requests = [
      {
        id: '8951',
        type: 'requests',
        attributes: {
          library_type: 'Pacbio_HiFi',
          sample_name: 'DTOL15016450',
          barcode: 'FS71986093',
          source_identifier: 'FS71986093',
        },
        relationships: {},
      },
      {
        id: '8950',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          sample_name: 'DTOL15016449',
          barcode: 'FS71986813',
          source_identifier: 'FS71986813',
        },
        relationships: {},
      },
    ]

    const aliquots = [
      {
        id: '35493',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 14159,
          source_type: 'Pacbio::Library',
          used_by_id: 6011,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 7.5,
          concentration: 12.9,
          insert_size: 9933,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 600,
        },
        relationships: {
          tag: {
            data: {
              type: 'tags',
              id: '600',
            },
          },
          pool: {
            data: {
              type: 'pools',
              id: '6011',
            },
          },
        },
      },
      {
        id: '35494',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 14160,
          source_type: 'Pacbio::Library',
          used_by_id: 6011,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 7.5,
          concentration: 12.2,
          insert_size: 9360,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 601,
        },
        relationships: {
          tag: {
            data: {
              type: 'tags',
              id: '601',
            },
          },
          pool: {
            data: {
              type: 'pools',
              id: '6011',
            },
          },
        },
      },
    ]

    it('add requests to library tubes', () => {
      const storeLibraries = dataToObjectById({ data: libraries, includeRelationships: true })
      const storeRequests = dataToObjectById({ data: requests, includeRelationships: true })
      const storeTubes = assignLibraryRequestsToTubes({
        libraries: storeLibraries,
        requests: storeRequests,
        tubes,
      })

      Object.values(storeLibraries).forEach((library) => {
        const request = storeRequests[library.request]
        const tube = storeTubes[library.tube]
        expect(tube.requests).toEqual([request.id])
        expect(tube.source_id).toEqual(String(library.id))
      })
    })

    it('create the used aliquots and map to source id', () => {
      const storeLibraries = dataToObjectById({ data: libraries, includeRelationships: true })
      const usedAliquots = createUsedAliquotsAndMapToSourceId({
        libraries: storeLibraries,
        aliquots,
      })
      aliquots.forEach((aliquot) => {
        const usedAliquot = usedAliquots[`_${aliquot.attributes.source_id}`]
        expect(usedAliquot.tag_id).toEqual(String(aliquot.attributes.tag_id))
        // this is a bit painful. Once refactored this should be tested within usedAliquot.
        // but it adds an extra check.
        expect(usedAliquot.request).toEqual(storeLibraries[usedAliquot.source_id].request)
        expect(usedAliquot.available_volume).toEqual(
          parseFloat(
            storeLibraries[usedAliquot.source_id].available_volume + usedAliquot.volume,
          ).toFixed(2),
        )
      })
    })
  })

  describe('in flight modifications for fetching tubes', () => {
    const tubes = [
      {
        id: '20',
        type: 'tubes',
        attributes: {
          barcode: 'TRAC-2-20',
        },
        relationships: {
          pools: {
            data: [],
          },
          libraries: {
            data: {
              type: 'libraries',
              id: '30',
            },
          },
        },
      },
    ]

    const requests = [
      {
        id: '32',
        type: 'requests',
        attributes: {
          library_type: 'Pacbio_HiFi',
        },
        relationships: {},
      },
      {
        id: '33',
        type: 'requests',
        attributes: {
          library_type: 'Pacbio_HiFi',
        },
        relationships: {},
      },
      {
        id: '30',
        type: 'requests',
        attributes: {
          library_type: 'Pacbio_HiFi',
        },
        relationships: {},
      },
    ]

    const libraries = [
      {
        id: '30',
        type: 'libraries',
        attributes: {
          volume: 1,
          concentration: 1,
          source_identifier: 'GEN-1710774222-1:F4',
          pacbio_request_id: 30,
          available_volume: 20,
        },
        relationships: {
          request: {
            data: {
              type: 'requests',
              id: '30',
            },
          },
          tube: {
            data: {
              type: 'tubes',
              id: '20',
            },
          },
          primary_aliquot: {
            data: {
              type: 'aliquots',
              id: '314',
            },
          },
          used_aliquots: {
            data: [
              {
                type: 'aliquots',
                id: '315',
              },
            ],
          },
        },
      },
    ]

    it('when there are libraries', () => {
      const storeTubes = assignRequestIdsToTubes({ tubes, libraries, requests })
      const tube = Object.values(storeTubes)[0]
      expect(tube.requests).toEqual(requests.map((request) => request.id))
      expect(tube.source_id).toEqual(tubes[0].relationships.libraries.data.id)
    })

    it('when there are no libraries', () => {
      const storeTubes = assignRequestIdsToTubes({ tubes, requests })
      const tube = Object.values(storeTubes)[0]
      expect(tube.requests).not.toBeDefined()
      expect(tube.source_id).toEqual(tubes[0].id)
    })
  })

  describe('#buildRunSuitabilityErrors', () => {
    it('returns the correct errors', () => {
      const pool = {
        id: '2',
        type: 'pools',
        barcode: 'TRAC-2-2',
        run_suitability: {
          ready_for_run: false,
          formattedErrors: [
            "Pool insert_size - can't be blank",
            'Pool used_aliquots - is invalid',
            "Used aliquot 2 (Sample47) insert_size - can't be blank",
          ],
          errors: [
            {
              title: "can't be blank",
              detail: "insert_size - can't be blank",
              code: '100',
              source: {
                pointer: '/data/attributes/insert_size',
              },
            },
            {
              title: 'is invalid',
              detail: 'used_aliquots - is invalid',
              code: '100',
              source: {
                pointer: '/data/relationships/used_aliquots',
              },
            },
          ],
        },
      }

      const used_aliquots = [
        {
          id: '1',
          type: 'used_aliquots',
          sample_name: 'Sample48',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        {
          id: '2',
          type: 'used_aliquots',
          sample_name: 'Sample47',
          run_suitability: {
            ready_for_run: false,
            errors: [
              {
                title: "can't be blank",
                detail: "insert_size - can't be blank",
                code: '100',
                source: {
                  pointer: '/data/attributes/insert_size',
                },
              },
            ],
          },
        },
      ]

      const expected = [
        "Pool insert_size - can't be blank",
        'Pool used_aliquots - is invalid',
        "Used aliquot 2 (Sample47) insert_size - can't be blank",
      ]

      expect(buildRunSuitabilityErrors({ used_aliquots, pool })).toEqual(expected)
    })
  })

  describe('convert pools', () => {
    const state = {
      pools: {
        1: {
          id: '1',
          used_aliquots: ['1', '3'],
          tube: '1',
          type: 'pools',
          barcode: 'TRAC-2-1',
          source_identifier: 'DN1:A1',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          2: {
            id: '2',
            used_aliquots: ['2'],
            tube: '2',
            type: 'pools',
            source_identifier: 'DN1:B1',
            run_suitability: {
              ready_for_run: true,
              errors: [],
            },
          },
        },
      },
      used_aliquots: {
        1: {
          id: '1',
          source_id: '1',
          source_type: 'Pacbio::Request',
          tag: '26',
          type: 'used_aliquots',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        2: {
          id: '2',
          source_id: '2',
          source_type: 'Pacbio::Request',
          tag: '7',
          type: 'used_aliquots',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        3: {
          id: '3',
          source_id: '2',
          source_type: 'Pacbio::Library',
          tag: '26',
          type: 'used_aliquots',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
      },
      tags: {
        26: {
          group_id: 'bc1019',
          id: '26',
          type: 'tags',
        },
        7: { group_id: 'bc1011_BAK8A_OA', id: '7', type: 'tags' },
      },
      requests: {
        1: { id: '1', sample_name: 'Sample48', type: 'requests' },
        2: { id: '2', sample_name: 'Sample47', type: 'requests' },
      },

      libraries: {
        2: { id: '2', pacbio_request_id: '2', type: 'libraries' },
      },
      tubes: {
        1: { barcode: 'TRAC-2-1', id: '1', type: 'tubes' },
        2: { barcode: 'TRAC-2-2', id: '2', type: 'tubes' },
      },
    }

    it('#createUsedAliquotsFromState - will produce the correct used_aliquots for pools', () => {
      const expected = [
        {
          id: '1',
          type: 'used_aliquots',
          sample_name: 'Sample48',
          group_id: 'bc1019',
          run_suitability: { ready_for_run: true, errors: [] },
        },
        {
          id: '3',
          type: 'used_aliquots',
          sample_name: 'Sample47',
          group_id: 'bc1019',
          run_suitability: { ready_for_run: true, errors: [] },
        },
      ]
      expect(createUsedAliquotsFromState({ pool: state.pools[1], state })).toEqual(expected)
    })

    it('#addUsedAliquotsAndErrorsToPools - will produce the correct pools', () => {
      const expected = [
        {
          2: {
            id: '2',
            used_aliquots: ['2'],
            tube: '2',
            type: 'pools',
            source_identifier: 'DN1:B1',
            run_suitability: { ready_for_run: true, errors: [] },
          },
          id: '1',
          used_aliquots: [
            {
              id: '1',
              type: 'used_aliquots',
              sample_name: 'Sample48',
              group_id: 'bc1019',
              run_suitability: { ready_for_run: true, errors: [] },
            },
            {
              id: '3',
              type: 'used_aliquots',
              sample_name: 'Sample47',
              group_id: 'bc1019',
              run_suitability: { ready_for_run: true, errors: [] },
            },
          ],
          tube: '1',
          type: 'pools',
          source_identifier: 'DN1:A1',
          run_suitability: { ready_for_run: true, errors: [], formattedErrors: [] },
          barcode: 'TRAC-2-1',
        },
      ]
      expect(addUsedAliquotsAndErrorsToPools(state)).toEqual(expected)
    })
  })
})
