import { successfulResponse, failedResponse } from '@support/testHelper.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'
import useRootStore from '@/stores'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OntPlateFactory from '@tests/factories/OntPlateFactory.js'
import OntPoolFactory from '@tests/factories/OntPoolFactory.js'
import OntTagSetFactory from '@tests/factories/OntTagSetFactory.js'
import OntAutoTagFactory from '@tests/factories/OntAutoTagFactory.js'
import OntTubeFactory from '@tests/factories/OntTubeFactory.js'
import { payload } from '@/stores/utilities/ontPool.js'

const ontPlateFactory = OntPlateFactory()
const ontPoolFactory = OntPoolFactory()
const ontTagSetFactory = OntTagSetFactory()
const ontAutoTagFactory = OntAutoTagFactory()
const singleOntPoolFactory = OntPoolFactory({ count: 1 })
const singleOntPlateFactory = OntPlateFactory({ count: 1 })
const singleOntTubeFactory = OntTubeFactory({ count: 1 })

const tagSets = {
  1: {
    id: '1',
    name: 'tagSet1',
    pipeline: 'pipeline1',
    tags: [],
  },
  2: {
    id: '2',
    name: 'tagSet2',
    pipeline: 'pipeline1',
    tags: [],
  },
}

describe('useOntPoolCreateStore', () => {
  let store

  beforeEach(() => {
    store = useOntPoolCreateStore()
  })

  describe('getters', () => {
    describe('poolItem', () => {
      const pool = {
        id: 1,
        volume: '1',
        kit_barcode: 'ABC1',
        concentration: '1',
        insert_size: '100',
      }

      it('returns the correct data', () => {
        store.pooling.pool = pool
        expect(store.poolItem).toEqual(pool)
      })

      it('when the pool does not exist', () => {
        store.pooling.pool = undefined
        expect(store.poolItem).toEqual({})
      })
    })

    describe('tubeItem', () => {
      const tube = {
        id: 1,
        barcode: 'GEN-1668092750-4',
      }
      it('returns the tube data', () => {
        store.pooling.tube = tube
        expect(store.tubeItem).toEqual(tube)
      })

      it('when the tube does not exist', () => {
        store.pooling.tube = undefined
        expect(store.tubeItem).toEqual({})
      })
    })

    describe('libraryItem', () => {
      // When selecting a request with append the id with an underscore. This ensures
      // keys are maintained in insertion order, not numeric order. This allow our requests
      // to maintain the order in which they were selected
      const libraries = {
        3: {
          ont_request_id: '3',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
        4: {
          ont_request_id: '4',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
      }

      it('returns a library', () => {
        store.pooling.libraries = libraries
        expect(store.libraryItem('3')).toEqual(libraries['3'])
      })
    })

    describe('selectedPlates', () => {
      it('returns a list of the selected plates', () => {
        const plates = {
          1: {
            barcode: 'DN1',
            id: '1',
            type: 'plates',
            wells: {},
          },
        }
        store.selected.plates = plates
        expect(store.selectedPlates).toEqual(Object.values(plates))
      })
    })

    describe('selectedTubes', () => {
      it('returns the list of the selected tubes', () => {
        const tubes = {
          1: {
            barcode: 'DN1',
            id: '1',
            type: 'tube',
          },
        }
        store.selected.tubes = tubes
        expect(store.selectedTubes).toEqual(Object.values(tubes))
      })
    })

    describe('wellList', () => {
      const wells = {
        1: { id: '1', position: 'A1' },
        2: { id: '2', position: 'B1' },
        3: { id: '3', position: 'C1' },
        4: { id: '4', position: 'D1' },
        5: { id: '5', position: 'E1' },
      }
      it('returns a list of all fetched wells', () => {
        store.resources.wells = wells
        expect(store.wellList()).toEqual(wells.values)
      })

      it('when ids are included', () => {
        store.resources.wells = wells
        const ids = ['1', '2', '3']
        expect(store.wellList(ids).length).toEqual(ids.length)
      })
    })

    describe('requestList', () => {
      const requests = {
        1: { id: '1', name: 'request1' },
        2: { id: '2', name: 'request2' },
        3: { id: '3', name: 'request3' },
        4: { id: '4', name: 'request4' },
        5: { id: '5', name: 'request5' },
      }

      const libraries = {
        3: {
          ont_request_id: '3',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
        4: {
          ont_request_id: '4',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
      }

      const mergedRequests = [
        { id: '1', name: 'request1', selected: false },
        { id: '2', name: 'request2', selected: false },
        { id: '3', name: 'request3', selected: true },
        { id: '4', name: 'request4', selected: true },
        { id: '5', name: 'request5', selected: false },
      ]

      it('returns a list of all fetched requests', () => {
        store.resources.requests = requests
        store.pooling.libraries = libraries
        expect(store.requestList()).toEqual(mergedRequests)
      })

      it('when ids are included', () => {
        store.resources.requests = requests
        store.pooling.libraries = libraries
        const ids = ['1', '2', '3']
        expect(store.requestList(ids).length).toEqual(ids.length)
      })
    })
    describe('tagSetList', () => {
      it('returns a list of all fetched tagSet', () => {
        store.resources.tagSets = tagSets
        expect(store.tagSetList).toEqual(Object.values(tagSets))
      })
    })

    describe('tagList', () => {
      const tags = {
        1: { id: '1', name: 'tag1' },
        2: { id: '2', name: 'tag2' },
        3: { id: '3', name: 'tag3' },
        4: { id: '4', name: 'tag4' },
        5: { id: '5', name: 'tag5' },
      }
      it('returns a list of all fetched tagSet', () => {
        store.resources.tags = tags
        expect(store.tagList()).toEqual(tags.values)
      })
      it('when ids are included', () => {
        store.resources.tags = tags
        const ids = ['1', '2', '3']
        expect(store.tagList(ids).length).toEqual(ids.length)
      })
    })

    describe('selectedTagSet', () => {
      it('returns the selected tag set', () => {
        const tagSet = { id: '1' }
        store.selected.tagSet = tagSet
        store.resources.tagSets = tagSets
        expect(store.selectedTagSet).toEqual(tagSets['1'])
      })
    })

    describe('selectedRequests', () => {
      const libraries = {
        8: {
          ont_request_id: '8',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        }, // a selected request
        7: {
          ont_request_id: '7',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        }, // a selected request
        6: {
          ont_request_id: '6',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        }, // a selected request
      }

      it('returns an array of request resources that have been selected', () => {
        store.pooling.libraries = libraries
        store.resources = ontPlateFactory.storeData.resources
        const expectedSelectedRequests = Object.values(libraries).map((library) => ({
          ...ontPlateFactory.storeData.resources.requests[library.ont_request_id],
          selected: true,
        }))
        expect(store.selectedRequests).toEqual(expectedSelectedRequests)
      })
    })

    describe('pools', () => {
      it('returns an array of request resources that have been selected', () => {
        store.resources = ontPoolFactory.storeData.resources
        expect(store.pools.length).toEqual(
          Object.values(ontPoolFactory.storeData.resources.pools).length,
        )
      })
    })
  })

  describe('actions', () => {
    let rootStore

    beforeEach(() => {
      rootStore = useRootStore()
    })

    describe('fetchOntPools', () => {
      it('handles success', async () => {
        const get = vi.fn()
        rootStore.api = { traction: { ont: { pools: { get } } } }
        get.mockResolvedValue(ontPoolFactory.responses.fetch)
        const { success } = await store.fetchOntPools()
        expect(store.resources.pools).toEqual(ontPoolFactory.storeData.resources.pools)
        expect(success).toEqual(true)
      })

      it('handles failure', async () => {
        const get = vi.fn()
        rootStore.api = { traction: { ont: { pools: { get } } } }
        get.mockResolvedValue(failedResponse)
        const { success } = await store.fetchOntPools()
        expect(success).toEqual(false)
      })
    })

    describe('fetchOntTagSets', () => {
      it('handles success', async () => {
        const get = vi.fn()
        rootStore.api = { traction: { ont: { tag_sets: { get } } } }
        get.mockResolvedValue(ontTagSetFactory.responses.fetch)
        const { success } = await store.fetchOntTagSets()
        expect(store.resources.tagSets).toEqual(ontTagSetFactory.storeData.tagSets)
        expect(store.resources.tags).toEqual(ontTagSetFactory.storeData.tags)
        expect(success).toEqual(true)
      })

      it('handles failure', async () => {
        const get = vi.fn()
        rootStore.api = { traction: { ont: { tag_sets: { get } } } }
        get.mockResolvedValue(failedResponse)
        const { success } = await store.fetchOntTagSets()
        expect(success).toEqual(false)
      })
    })

    describe('selectWellRequests', () => {
      it('selects requests if unselected', async () => {
        store.$state = {
          resources: {
            wells: {
              1: { id: '1', type: 'wells', position: 'A1', requests: ['2'] },
            },
          },
          pooling: {
            libraries: {},
          },
        }
        store.selectWellRequests('1')

        expect(store.pooling.libraries).toEqual({
          2: {
            ont_request_id: '2',
            tag_id: null,
            kit_barcode: null,
            volume: null,
            concentration: null,
            insert_size: null,
          },
        })
      })

      it('deselects requests if selected', async () => {
        store.$state = {
          resources: {
            wells: {
              1: { id: '1', type: 'wells', position: 'A1', requests: ['2'] },
            },
          },
          pooling: {
            libraries: {
              2: { ont_request_id: '2' },
            },
          },
        }
        await store.selectWellRequests('1')
        expect(store.pooling.libraries).toEqual({})
      })
    })

    describe('deselectPlateAndContents', () => {
      it('selects requests if unselected', async () => {
        store.$state = {
          ...store.$state,
          resources: {
            ...store.resources,
            plates: {
              1: { id: 1, wells: ['10'] },
              2: { id: 2, wells: ['20'] },
            },
            wells: {
              10: { id: '1', type: 'wells', position: 'A1', requests: ['100', '300'] },
              20: { id: '1', type: 'wells', position: 'A1', requests: ['200', '400'] },
            },
          },
          selected: {
            plates: { 1: { id: 1, selected: true }, 2: { id: 2, selected: true } },
            requests: {
              100: { id: '100', selected: true },
              300: { id: '300', selected: true },
              200: { id: '200', selected: true },
              400: { id: '400', selected: true },
            },
          },
          pooling: {
            libraries: {
              100: { id: '100', selected: true },
              300: { id: '300', selected: true },
              200: { id: '200', selected: true },
              400: { id: '400', selected: true },
            },
          },
        }
        await store.deselectPlateAndContents('1')
        expect(store.selected.plates).toEqual({ 2: { id: 2, selected: true } })
        expect(store.pooling.libraries).toEqual({
          200: { id: '200', selected: true },
          400: { id: '400', selected: true },
        })
      })
    })

    describe('deselectTubeAndContents', () => {
      it('deselects a tube and its contents', async () => {
        store.$state = {
          ...store.$state,
          resources: {
            ...store.resources,
            tubes: {
              1: { id: '1', barcode: 'GEN-1668092750-1', requests: ['100', '200'] },
              2: { id: '2', barcode: 'GEN-1668092750-2', requests: ['300', '400'] },
            },
            requests: {
              100: { id: '100', selected: true },
              200: { id: '200', selected: true },
              300: { id: '300', selected: true },
              400: { id: '400', selected: true },
            },
          },
          selected: {
            tubes: {
              1: { id: '1', selected: true },
              2: { id: '2', selected: true },
            },
          },
        }
        await store.deselectTubeAndContents('GEN-1668092750-1')
        expect(store.selected.tubes).toEqual({ 2: { id: '2', selected: true } })
        expect(store.resources.requests).toEqual({
          300: { id: '300', selected: true },
          400: { id: '400', selected: true },
        })
      })
    })

    describe('create or update pool', () => {
      const library1 = {
        ont_request_id: '1',
        tag_id: '1',
        kit_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      }

      const library2 = {
        ont_request_id: '2',
        tag_id: '2',
        kit_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      }

      const pool = {
        kit_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      }

      describe('createPool', () => {
        // pool should be successfully created
        it('when the pool is valid', async () => {
          const mockResponse = successfulResponse({
            data: {},
            included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1' } }],
          })
          const create = vi.fn()
          rootStore.api = { traction: { ont: { pools: { create } } } }
          const libraries = { 1: library1, 2: library2 }
          store.$state = { pooling: { libraries, pool } }
          create.mockResolvedValue(mockResponse)
          const { success, barcode } = await store.createPool()
          expect(create).toHaveBeenCalledWith({
            data: payload({ libraries, pool }),
            include: expect.anything(),
          })
          expect(success).toBeTruthy()
          expect(barcode).toEqual('TRAC-1')
        })

        it('when there is an error', async () => {
          const mockResponse = failedResponse(422)
          const create = vi.fn(() => Promise.resolve(mockResponse))
          rootStore.api = { traction: { ont: { pools: { create } } } }
          const libraries = { 1: library1, 2: library2 }
          store.$state = { pooling: { libraries, pool } }
          const { success, errors } = await store.createPool()
          expect(success).toBeFalsy
          expect(errors).toEqual(mockResponse.errorSummary)
        })

        // validate libraries fails
        // request is not sent
        it('when the pool is invalid', async () => {
          const create = vi.fn()
          rootStore.api = { traction: { ont: { pools: { create } } } }
          const libraries = { 1: library1, 2: { ...library2, concentration: '' } }
          store.$state = { pooling: { libraries, pool } }
          const { success, errors } = await store.createPool()
          expect(create).not.toHaveBeenCalled()
          expect(success).toBeFalsy()
          console.Conso
          expect(errors).toEqual('The pool is invalid')
        })
      })

      describe('updatePool', () => {
        // pool should be successfully created
        it('when the pool is valid', async () => {
          const mockResponse = successfulResponse({
            data: {},
            included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1' } }],
          })
          const update = vi.fn()
          rootStore.api = { traction: { ont: { pools: { update } } } }
          const libraries = { 1: library1, 2: library2 }

          store.$state = { pooling: { libraries, pool } }
          update.mockResolvedValue(mockResponse)
          const { success } = await store.updatePool()
          expect(update).toHaveBeenCalledWith(payload({ libraries, pool }))
          expect(success).toBeTruthy()
        })

        it('when there is an error', async () => {
          const mockResponse = failedResponse(422)
          const update = vi.fn(() => Promise.resolve(mockResponse))
          rootStore.api = { traction: { ont: { pools: { update } } } }
          const { success, errors } = await store.updatePool()
          const libraries = { 1: library1, 2: library2 }
          store.$state = { pooling: { libraries, pool } }
          expect(success).toBeFalsy
          expect(errors).toEqual(mockResponse.errorSummary)
        })

        // validate libraries fails
        // request is not sent
        it('when the pool is invalid', async () => {
          const update = vi.fn()
          rootStore.api = { traction: { ont: { pools: { update } } } }
          const libraries = { 1: library1, 2: { ...library2, concentration: '' } }
          store.$state = { pooling: { libraries, pool } }
          const { success, errors } = await store.updatePool()
          expect(update).not.toHaveBeenCalled()
          expect(success).toBeFalsy()
          expect(errors).toEqual('The pool is invalid')
        })
      })
    })

    describe('applyTags', () => {
      beforeEach(() => {
        store.$state = { ...ontAutoTagFactory.storeData }
      })

      const startLibrary = { ont_request_id: '1', tag_id: '385' }

      it('applies a single tag when autoTag is false', async () => {
        await store.applyTags(startLibrary, false)
        // Update the changed well
        expect(store.pooling.libraries[startLibrary.ont_request_id]).toEqual({
          ont_request_id: '1',
          tag_id: '385',
        })
      })

      it('applies tags to wells on the same plate with a higher column index when autoTag is true', async () => {
        await store.applyTags(startLibrary, true)

        expect(store.pooling.libraries[startLibrary.ont_request_id]).toEqual({
          ont_request_id: '1',
          tag_id: '385',
        })
        const selectedTagSetTags =
          ontAutoTagFactory.storeData.resources.tagSets[
            ontAutoTagFactory.storeData.selected.tagSet.id
          ].tags
        // Verify that the tag_ids are updated incrementally
        let startingTagIndex = selectedTagSetTags.indexOf(startLibrary.tag_id)
        Object.values(store.pooling.libraries).forEach((library) => {
          if (library.tag_id !== null) {
            expect(selectedTagSetTags.indexOf(library.tag_id)).toBeGreaterThanOrEqual(
              startingTagIndex,
            )
          }
        })
      })

      it('applies tags to tubes with a higher index when autoTag is true', async () => {
        const autoTag = true
        const library = { ont_request_id: '192', tag_id: '385' }

        await store.applyTags(library, autoTag)
        const libraries = Object.values(store.pooling.libraries).filter(
          (lib) => Number(lib.ont_request_id) > Number(library.ont_request_id),
        )
        libraries.forEach((lib, index) => {
          const actualTagId = Number(library.tag_id) + index + 1
          expect(lib.tag_id).toBe(String(actualTagId))
        })
      })
    })

    describe('updateLibraryFromCsvRecord', () => {
      const info = {
        lines: 3,
        records: 2,
      }
      beforeEach(() => {
        store.$state = ontAutoTagFactory.storeData
        vi.spyOn(store, 'selectedTagSet', 'get').mockReturnValue({
          id: '8',
          type: 'tags',
          name: 'ont_native',
          pipeline: 'ont',
          tags: [
            { id: '385', type: 'tags', oligo: 'CACAAAGACACCGACAACTTTCTT', group_id: 'NB01' },
            { id: '386', type: 'tags', oligo: 'ACAGACGACTACAAACGGAATCGA', group_id: 'NB02' },
            { id: '387', type: 'tags', oligo: 'CCTGGTAACTGGGACACAAGACTC', group_id: 'NB03' }, // info
            { id: '388', type: 'tags', oligo: 'TAGGGAAACACGATAGAATCCGAA', group_id: 'NB04' },
            { id: '389', type: 'tags', oligo: 'AAGGTTACACAAACCCTGGACAAG', group_id: 'NB05' },
            { id: '390', type: 'tags', oligo: 'GACTACTTTCTGCCTTTGCGAGAA', group_id: 'NB06' },
          ],
        })
        rootStore.addCSVLogMessage = vi.fn()
      })
      it('updates the corresponding library', async () => {
        const record = {
          source: 'GEN-1668092750-1:C1',
          tag: 'NB03',
          insert_size: 12345,
          concentration: 10,
          volume: 20,
        }

        store.updateLibraryFromCsvRecord({ record, info })
        expect(store.pooling.libraries).toEqual(
          expect.objectContaining({
            3: {
              ont_request_id: '3',
              tag_id: '387',
              insert_size: 12345,
              concentration: 10,
              volume: 20,
            },
          }),
        )
      })

      it('updates the corresponsing library for tubes', async () => {
        const record = {
          source: 'GEN-1668092750-5',
          tag: 'NB03',
          insert_size: 12345,
          concentration: 10,
          volume: 20,
        }

        store.updateLibraryFromCsvRecord({ record, info })

        expect(store.pooling.libraries).toEqual(
          expect.objectContaining({
            193: {
              ont_request_id: '193',
              tag_id: '387',
              insert_size: 12345,
              concentration: 10,
              volume: 20,
            },
          }),
        )
      })

      it('records an error when source is missing', async () => {
        const record = {
          tag: 'NB03',
          insert_size: 12345,
          concentration: 10,
          volume: 20,
        }
        store.updateLibraryFromCsvRecord({ record, info })
        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(info, 'has no source')
      })

      it('records an error when the plate cant be found', async () => {
        const record = {
          source: 'GEN-1111111111-1:A1',
        }

        store.updateLibraryFromCsvRecord({ record, info })

        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(
          info,
          'GEN-1111111111-1 could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.',
        )
      })

      it('records an error when the well cant be found', async () => {
        const record = {
          source: 'GEN-1668092750-1:X1',
        }

        store.updateLibraryFromCsvRecord({ record, info })
        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(
          info,
          'A well named X1 could not be found on GEN-1668092750-1',
        )
      })

      it('records an error when the tag cant be found', async () => {
        const record = {
          source: 'GEN-1668092750-2:B1',
          tag: 'NB100',
        }

        store.updateLibraryFromCsvRecord({ record, info })

        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(
          info,
          'Could not find a tag named NB100 in selected tag group',
        )
      })

      it('flags the plate as selected', async () => {
        const record = {
          source: 'GEN-1668092750-1:A1',
          tag: 'NB01',
        }

        store.updateLibraryFromCsvRecord({ record, info })
        expect(store.selected.plates).toEqual(
          expect.objectContaining({ 1: { id: '1', selected: true } }),
        )
      })

      it('notifies of request addition', async () => {
        const record = {
          source: 'GEN-1668092750-1:F1',
          tag: 'NB03',
          insert_size: 12345,
          concentration: 10,
          volume: 20,
        }

        store.updateLibraryFromCsvRecord({ record, info })
        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(
          info,
          'Added GEN-1668092750-1:F1 to pool',
          'info',
        )
      })
    })

    describe('selectPlate', () => {
      it('selects a plate by default', () => {
        store.$state = {
          ...store.$state,
          resources: {
            ...store.resources,
            plates: {
              1: { id: '1', wells: ['10'] },
              2: { id: '2', wells: ['20'] },
            },
          },
          selected: {
            plates: { 2: { id: '2', selected: true } },
          },
        }
        store.selectPlate('1')
        expect(store.selected.plates).toEqual({
          1: { id: '1', selected: true },
          2: { id: '2', selected: true },
        })
      })

      it('unselects plates', () => {
        // mock state
        store.$state = {
          ...store.$state,
          resources: {
            ...store.resources,
            plates: {
              1: { id: '1', wells: ['10'] },
              2: { id: '2', wells: ['20'] },
            },
          },
          selected: {
            plates: { 1: { id: '1', selected: true }, 2: { id: '2', selected: true } },
          },
        }
        // apply mutation
        store.selectPlate('2', false)
        expect(store.selected.plates).toEqual({ 1: { id: '1', selected: true } })
      })
    })

    describe('selectTube', () => {
      it('selects a tube by default', () => {
        store.$state = {
          ...store.$state,
          resources: {
            ...store.resources,
            tubes: {
              2: { id: '2' },
            },
          },
          selected: {
            tubes: {
              2: { id: '2', selected: true },
            },
          },
        }

        store.selectTube('1')
        expect(store.selected.tubes).toEqual({
          1: { id: '1', selected: true },
          2: { id: '2', selected: true },
        })
      })

      it('unselects tubes', () => {
        store.$state = {
          ...store.$state,
          resources: {
            ...store.resources,
            tubes: {
              2: { id: '2' },
            },
          },
          selected: {
            tubes: {
              2: { id: '2', selected: true },
            },
          },
        }
        // apply mutation
        store.selectTube('2', false)
        expect(store.selected.tubes).toEqual({})
      })
    })

    describe('selectRequest', () => {
      it('selects a request by default', () => {
        // mock state
        store.$state = {
          ...store.$state,
          pooling: {
            libraries: {
              2: {
                ont_request_id: '2',
                tag_id: null,
                kit_barcode: null,
                volume: null,
                concentration: null,
                insert_size: null,
              },
            },
          },
        }

        store.selectRequest('1')
        expect(store.pooling.libraries).toEqual({
          2: {
            ont_request_id: '2',
            tag_id: null,
            kit_barcode: null,
            volume: null,
            concentration: null,
            insert_size: null,
          },
          1: {
            ont_request_id: '1',
            tag_id: null,
            kit_barcode: null,
            volume: null,
            concentration: null,
            insert_size: null,
          },
        })
      })

      it('unselects requests', () => {
        store.$state = {
          ...store.$state,
          pooling: {
            libraries: {
              2: {
                ont_request_id: '2',
                tag_id: null,
                kit_barcode: null,
                volume: null,
                concentration: null,
                insert_size: null,
              },
            },
          },
        }
        // apply mutation
        store.selectRequest('2', false)
        expect(store.pooling.libraries).toEqual({})
      })
    })

    describe('clearPoolData', () => {
      it('clears the pool data', () => {
        store.clearPoolData()
        expect(store.resources).toEqual({
          requests: {},
          plates: {},
          wells: {},
          tubes: {},
          libraries: {},
          tagSets: {},
          tags: {},
          pools: {},
        })
      })
    })

    describe('setPoolData', () => {
      it('returns when the pool id is not a number', async () => {
        const find = vi.fn()
        rootStore.api = { traction: { ont: { pools: { find } } } }
        find.mockResolvedValue(singleOntPoolFactory.responses.fetch)
        // apply action
        const { success, errors } = await store.setPoolData('new')
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })
      it('sets the pool data for the given pool id', async () => {
        const find = vi.fn()
        rootStore.api = { traction: { ont: { pools: { find } } } }
        find.mockResolvedValue(singleOntPoolFactory.responses.fetch)
        const { success } = await store.setPoolData(3)
        expect(store.pooling.pool).toEqual(singleOntPoolFactory.storeData.pooling.pool)
        expect(store.pooling.libraries).toEqual(singleOntPoolFactory.storeData.pooling.libraries)
        expect(store.pooling.tube).toEqual(singleOntPoolFactory.storeData.pooling.tube)
        expect(store.resources.tubes).toEqual(singleOntPoolFactory.storeData.resources.tubes)
        expect(store.resources.requests).toEqual(singleOntPoolFactory.storeData.resources.requests)
        expect(store.resources.plates).toEqual(singleOntPoolFactory.storeData.resources.plates)
        expect(store.resources.wells).toEqual(singleOntPoolFactory.storeData.resources.wells)
        expect(store.selected.tagSet).toEqual(singleOntPoolFactory.storeData.selected.tagSet)

        expect(Object.keys(store.selected.plates)).toEqual(
          Object.keys(singleOntPoolFactory.storeData.resources.plates),
        )
        expect(Object.keys(store.selected.tubes)).toEqual(
          Object.keys(singleOntPoolFactory.storeData.resources.tubes),
        )

        expect(success).toEqual(true)
      })

      it('only clears the pool data when the id is not a number', async () => {
        const find = vi.fn()
        rootStore.api = { traction: { ont: { pools: { find } } } }
        find.mockResolvedValue(singleOntPoolFactory.responses.fetch)

        const { success, errors } = await store.setPoolData('new')
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })
    })

    describe('findOntPlate', () => {
      it('returns the plate that fits the valid plate barcode', async () => {
        const get = vi.fn()
        rootStore.api = { traction: { ont: { plates: { get } } } }
        get.mockResolvedValue(singleOntPlateFactory.responses.fetch)

        const { success } = await store.findOntPlate({
          barcode: singleOntPlateFactory.content.data[0].attributes.barcode,
        })

        expect(store.resources.plates).toEqual(singleOntPlateFactory.storeData.resources.plates)
        expect(store.resources.wells).toEqual(singleOntPlateFactory.storeData.resources.wells)
        expect(store.resources.requests).toEqual(singleOntPlateFactory.storeData.resources.requests)

        const id = singleOntPlateFactory.content.data[0].id
        expect(store.selected.plates[id]).toEqual({ id, selected: true })
        expect(success).toEqual(true)
      })

      it('returns an error and an empty list when plate barcode cannot be found', async () => {
        const get = vi.fn()
        rootStore.api = { traction: { ont: { plates: { get } } } }
        get.mockResolvedValue(successfulResponse({ statusCode: 200 }))

        const { success, errors } = await store.findOntPlate({ barcode: 'fake-barcode' })
        expect(errors).toEqual(['Unable to find plate with barcode: fake-barcode'])
        expect(success).toEqual(false)
      })

      it('returns an error and an empty list when plate barcode is not provided', async () => {
        const { success, errors } = await store.findOntPlate({ barcode: '' })
        expect(errors).toEqual(['Please provide a plate barcode'])
        expect(success).toEqual(false)
      })

      it('adds the plate to the resources if some exist', async () => {
        const resources = {
          plates: {
            9999: { id: '9999', wells: ['9999'] },
          },
          wells: { 9999: { id: '9999', position: 'A1', requests: ['9999'] } },
          requests: { 9999: { id: '9999', name: 'request9999' } },
        }

        store.$state = { ...store.$state, resources: { ...resources } }

        const get = vi.fn()
        rootStore.api = { traction: { ont: { plates: { get } } } }
        get.mockResolvedValue(singleOntPlateFactory.responses.fetch)

        const { success } = await store.findOntPlate({
          barcode: singleOntPlateFactory.content.data[0].attributes.barcode,
        })

        expect(store.resources.plates).toEqual({
          ...singleOntPlateFactory.storeData.resources.plates,
          ...resources.plates,
        })
        expect(store.resources.wells).toEqual({
          ...singleOntPlateFactory.storeData.resources.wells,
          ...resources.wells,
        })
        expect(store.resources.requests).toEqual({
          ...singleOntPlateFactory.storeData.resources.requests,
          ...resources.requests,
        })

        const id = singleOntPlateFactory.content.data[0].id
        expect(store.selected.plates[id]).toEqual({ id, selected: true })
        expect(success).toEqual(true)
      })
    })

    describe('findOntTube', () => {
      it('returns the tube that fits the valid tube barcode', async () => {
        const get = vi.fn()
        rootStore.api = { traction: { ont: { tubes: { get } } } }

        get.mockResolvedValue(singleOntTubeFactory.responses.fetch)

        const { success } = await store.findOntTube({
          barcode: singleOntTubeFactory.content.data[0].attributes.barcode,
        })

        expect(store.resources.tubes).toEqual(singleOntTubeFactory.storeData.tubes)
        expect(store.resources.requests).toEqual(singleOntTubeFactory.storeData.resources.requests)

        const id = singleOntTubeFactory.content.data[0].id
        expect(store.selected.tubes[id]).toEqual({ id, selected: true })
        expect(success).toEqual(true)
      })

      it('returns an error and an empty list when tube barcode cannot be found', async () => {
        const get = vi.fn()
        rootStore.api = { traction: { ont: { tubes: { get } } } }
        get.mockResolvedValue(successfulResponse({ statusCode: 200 }))

        const { success, errors } = await store.findOntTube({ barcode: 'fake-barcode' })
        expect(errors).toEqual(['Unable to find tube with barcode: fake-barcode'])
        expect(success).toEqual(false)
      })

      it('returns an error and an empty list when tube barcode is not provided', async () => {
        const { success, errors } = await store.findOntTube({ barcode: '' })
        expect(errors).toEqual(['Please provide a tube barcode'])
        expect(success).toEqual(false)
      })

      it('adds the tube to the resources if some exist', async () => {
        const resources = {
          tubes: {
            9999: { id: '9999', barcode: 'GEN-9999' },
          },
          requests: { 9999: { id: '9999', name: 'request9999' } },
        }

        store.$state = { ...store.$state, resources: { ...resources } }

        const get = vi.fn()
        rootStore.api = { traction: { ont: { tubes: { get } } } }
        get.mockResolvedValue(singleOntTubeFactory.responses.fetch)

        const { success } = await store.findOntTube({
          barcode: singleOntTubeFactory.content.data[0].attributes.barcode,
        })

        expect(store.resources.tubes).toEqual({
          ...singleOntTubeFactory.storeData.tubes,
          ...resources.tubes,
        })
        expect(store.resources.requests).toEqual({
          ...singleOntTubeFactory.storeData.resources.requests,
          ...resources.requests,
        })

        const id = singleOntTubeFactory.content.data[0].id
        expect(store.selected.tubes[id]).toEqual({ id, selected: true })
        expect(success).toEqual(true)
      })
    })

    describe('updatePoolingLibrary', () => {
      it('updates the library in the pooling state', () => {
        const library = {
          ont_request_id: '1',
          tag_id: '1',
          kit_barcode: 'ABC1',
          volume: 1,
          concentration: 1,
          insert_size: 100,
        }
        store.updatePoolingLibrary(library)
        expect(store.pooling.libraries['1']).toEqual(library)
      })
    })
  })
})
