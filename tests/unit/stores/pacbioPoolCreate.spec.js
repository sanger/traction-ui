import { createPinia, setActivePinia, Data } from '@support/testHelper.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import useRootStore from '@/stores'
import { dataToObjectById, groupIncludedByResource } from '@/api/JsonApi.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { payload } from '@/store/traction/pacbio/poolCreate/pool.js'
import { newResponse } from '@/api/ResponseHelper.js'
import * as jsonapi from '@/api/JsonApi'
import { before } from 'lodash-es'

describe('usePacbioPoolCreateStore', () => {
  const tagSets = {
    1: {
      id: '1',
      name: 'tagSet1',
      uuid: 'uuid1',
      pipeline: 'pipeline1',
      tags: [],
    },
    2: {
      id: '2',
      name: 'tagSet2',
      uuid: 'uuid2',
      pipeline: 'pipeline1',
      tags: [],
    },
  }
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('getters', () => {
    let store
    beforeEach(() => {
      store = usePacbioPoolCreateStore()
    })
    it('returns plateList', () => {
      const plates = {
        1: {
          barcode: 'DN1',
          id: '1',
          type: 'plates',
          wells: {},
        },
        2: {
          barcode: 'DN2',
          id: '2',
          type: 'plates',
          wells: {},
        },
      }
      const expected = [
        {
          barcode: 'DN1',
          id: '1',
          type: 'plates',
          wells: {},
          selected: true,
        },
        {
          barcode: 'DN2',
          id: '2',
          type: 'plates',
          wells: {},
        },
      ]
      store.resources.plates = plates
      store.selected.plates = { 1: { id: '1', selected: true } }
      expect(store.plateList).toEqual(expected)
    })
    it('returns tubeList', () => {
      const tubes = {
        1: {
          barcode: 'NT1',
          id: '1',
          type: 'tubes',
          wells: [],
        },
        2: {
          barcode: 'NT2',
          id: '2',
          type: 'tubes',
          wells: [],
        },
      }
      const expected = [
        {
          barcode: 'NT1',
          id: '1',
          type: 'tubes',
          wells: [],
          selected: true,
        },
        {
          barcode: 'NT2',
          id: '2',
          type: 'tubes',
          wells: [],
        },
      ]
      store.resources.tubes = tubes
      store.selected.tubes = { 1: { id: '1', selected: true } }
      expect(store.tubeList).toEqual(expected)
    })
    it('returns the selected tag set', () => {
      const tagSet = { id: '1' }
      const pacbioRootStore = usePacbioRootStore()
      pacbioRootStore.tagState.tagSets = tagSets
      store.selected.tagSet = tagSet
      expect(store.selectedTagSet).toEqual(tagSets['1'])
    })
    it('return the selected plates', () => {
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
    it('returns the selected requests', () => {
      const payload = Data.PacbioRequestsRequest.data
      const requestResources = payload.data
      const { wells: wellResources, tubes: tubeResources } = groupIncludedByResource(
        payload.included,
      )
      const requests = dataToObjectById({ data: requestResources, includeRelationships: true })
      const wells = dataToObjectById({ data: wellResources, includeRelationships: true })
      const tubes = dataToObjectById({ data: tubeResources, includeRelationships: true })

      // When selecting a request with append the id with an underscore. This ensures
      // keys are maintained in insertion order, not numeric order. This allow our requests
      // to maintain the order in which they were selected
      const libraries = {
        _136: {
          pacbio_request_id: '136',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        }, // A selected request
        _3: {
          pacbio_request_id: '3',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        }, // A selected request
        _40: {
          pacbio_request_id: '40',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        }, // A selected request
      }

      store.resources = {
        ...store.resources,
        requests,
        wells,
        tubes,
      }
      store.libraries = libraries
      expect(store.selectedRequests).toEqual([
        { ...requests['40'], selected: true },
        { ...requests['136'], selected: true },
        { ...requests['3'], selected: true },
      ])
    })
    describe('well list', () => {
      const wells = {
        1: { id: '1', position: 'A1' },
        2: { id: '2', position: 'B1' },
        3: { id: '3', position: 'C1' },
        4: { id: '4', position: 'D1' },
        5: { id: '5', position: 'E1' },
      }
      it('returns all wells', () => {
        store.resources.wells = wells
        expect(store.wellList()).toEqual(wells.values)
      })

      it('when specific wells when ids are included', () => {
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
        _3: {
          pacbio_request_id: '3',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
        _4: {
          pacbio_request_id: '4',
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

      it('returns all requests', () => {
        store.resources.requests = requests
        store.libraries = libraries
        expect(store.requestList()).toEqual(mergedRequests)
      })

      it('returns specific requests when ids are included', () => {
        store.resources.requests = requests
        store.libraries = libraries
        const ids = ['1', '2', '3']
        expect(store.requestList(ids).length).toEqual(ids.length)
      })
    })
    it('returns libraryItems', () => {
      const libraries = {
        _3: {
          pacbio_request_id: '3',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
        _4: {
          pacbio_request_id: '4',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
      }
      store.libraries = libraries
      expect(store.libraryItem('3')).toEqual(libraries['_3'])
    })

    describe('poolItem', () => {
      const pool = {
        id: 1,
        template_prep_kit_box_barcode: 'ABC1',
        volume: '1',
        concentration: '1',
        insert_size: '100',
      }

      it('returns the correct data', () => {
        store.pool = pool
        expect(store.poolItem).toEqual(pool)
      })

      it('when the pool does not exist', () => {
        store.pool = undefined
        expect(store.poolItem).toEqual({})
      })
    })

    describe('tubeItem', () => {
      const tube = {
        id: 1,
        barcode: 'TRAC-1',
      }

      it('returns the correct data', () => {
        store.tube = tube
        expect(store.tubeItem).toEqual(tube)
      })

      it('when the tube does not exist', () => {
        store.tube = undefined
        expect(store.tubeItem).toEqual({})
      })
    })
  })
  describe('actions', () => {
    let store, pacbioRootStore, rootStore
    beforeEach(() => {
      store = usePacbioPoolCreateStore()
      pacbioRootStore = usePacbioRootStore()
      rootStore = useRootStore()
    })

    describe('autoTagPlate', () => {
      beforeEach(() => {
        store.$state = Data.AutoTagStore
        pacbioRootStore.tagState.tagSets = Data.AutoTagStore.resources.tagSets
        pacbioRootStore.tagState.tags = Data.AutoTagStore.resources.tags
      })
      it('will not update libraries when given with invalid values', () => {
        const initialLibraries = { ...store.libraries }
        store.autoTagPlate({})
        expect(store.libraries).toEqual(initialLibraries)
      })
      it('updates all libraries of same plate with a new tag ', () => {
        const initialLibraries = { ...store.libraries }
        store.autoTagPlate({ pacbio_request_id: '1', tag_id: '130' })
        expect(store.libraries).not.toEqual(initialLibraries)
      })

      it('applies tags to wells on the same plate with a higher column index when autoTag is true', async () => {
        const library = { pacbio_request_id: '13', tag_id: '130' }
        const updateLibrary = vi.fn()
        store.updateLibrary = updateLibrary
        await store.autoTagPlate(library)
        // We update the changed well
        expect(updateLibrary).toHaveBeenCalledWith({
          pacbio_request_id: '37',
          tag_id: '132',
        })

        // We don't update earlier wells
        expect(updateLibrary).not.toHaveBeenCalledWith(
          expect.objectContaining({
            pacbio_request_id: '1',
          }),
        )

        // We don't update unselected wells
        expect(updateLibrary).not.toHaveBeenCalledWith(
          expect.objectContaining({
            pacbio_request_id: '25', // C1
          }),
        )

        // Including the next column
        expect(updateLibrary).toHaveBeenCalledWith({
          pacbio_request_id: '2', // A2
          tag_id: '137',
        })
        // But not another plate
        expect(updateLibrary).not.toHaveBeenCalledWith(
          expect.objectContaining({
            pacbio_request_id: '61', // B1
          }),
        )
        expect(updateLibrary).not.toHaveBeenCalledWith(
          expect.objectContaining({
            pacbio_request_id: '73', // C1
          }),
        )
        // or a tube
        expect(updateLibrary).not.toHaveBeenCalledWith(
          expect.objectContaining({
            pacbio_request_id: '96',
          }),
        )
        expect(updateLibrary).not.toHaveBeenCalledWith(
          expect.objectContaining({
            pacbio_request_id: '97',
          }),
        )

        // In total we expect to update 8 wells in this case
        expect(updateLibrary).toHaveBeenCalledTimes(5)
      })
    })
    describe('autoTagTube', () => {
      beforeEach(() => {
        store.$state = Data.AutoTagStore
        pacbioRootStore.tagState.tagSets = Data.AutoTagStore.resources.tagSets
        pacbioRootStore.tagState.tags = Data.AutoTagStore.resources.tags
      })
      it('will not update libraries when given with invalid values', () => {
        const initialLibraries = { ...store.libraries }
        store.autoTagTube({})
        expect(store.libraries).toEqual(initialLibraries)
      })
      it('updates all libraries of same tube with a new tag ', () => {
        const initialLibraries = { ...store.libraries }
        store.autoTagTube({ pacbio_request_id: '97', tag_id: '130' })
        expect(store.libraries).not.toEqual(initialLibraries)
        expect(store.libraries['_98'].tag_id).toEqual('131')
        expect(store.libraries['_99'].tag_id).toEqual('132')
      })

      it('applies tags to tubes with a higher index when autoTag is true', async () => {
        const updateLibrary = vi.fn()
        store.updateLibrary = updateLibrary
        const library = { pacbio_request_id: '98', tag_id: '130' }
        // const selectedRequests = Object.values(store.libraries).map(
        //   ({ pacbio_request_id }) => store.resources.requests[pacbio_request_id],
        // )
        await store.autoTagTube(library)
        // We don't update earlier wells
        expect(updateLibrary).not.toHaveBeenCalledWith(
          expect.objectContaining({
            pacbio_request_id: '1',
          }),
        )

        // We don't update earlier tubes
        expect(updateLibrary).not.toHaveBeenCalledWith(
          expect.objectContaining({
            pacbio_request_id: '97',
          }),
        )
        // We don't update unselected wells
        expect(updateLibrary).not.toHaveBeenCalledWith(
          expect.objectContaining({
            pacbio_request_id: '25', // C1
          }),
        )
        // We do update tubes with higher ids
        expect(updateLibrary).toHaveBeenCalledWith(
          expect.objectContaining({
            pacbio_request_id: '99', // D1
            tag_id: '131',
          }),
        )
        // In total we expect ot update 2 tubes in this case
        expect(updateLibrary).toHaveBeenCalledTimes(1)
      })
    })
    describe('requestForPlate', () => {
      beforeEach(() => {
        store.$state = Data.AutoTagStore
        store.selected.plates = {}
        store.selectPlate = vi.fn()
      })
      it('returns the request for a given plate', () => {
        const request = store.requestsForPlate('DN1', 'A1')
        expect(request).toEqual({ success: true, requestIds: ['1'] })
        expect(store.selectPlate).toBeCalledWith({ id: '1', selected: true })
      })
      it('gives an error when the plate is not found', () => {
        const request = store.requestsForPlate('DN55', 'A1')
        expect(request).toEqual({
          success: false,
          errors:
            'DN55 could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.',
        })
        expect(store.selectPlate).not.toBeCalled()
      })
      it('gives an error when the well is not found', () => {
        const request = store.requestsForPlate('DN1', 'A16')
        expect(request).toEqual({
          success: false,
          errors: 'A well named A16 could not be found on DN1',
        })
        expect(store.selectPlate).toBeCalledWith({ id: '1', selected: true })
      })
    })
    describe('requestForTube', () => {
      beforeEach(() => {
        store.$state = Data.AutoTagStore
        store.selected.tubes = {}
        store.selectTube = vi.fn()
      })

      it('returns the request for a given tube', () => {
        const request = store.requestsForTube('3980000001795')
        expect(request).toEqual({ success: true, requestIds: ['97'] })
        expect(store.selectTube).toBeCalledWith({ id: '1', selected: true })
      })
      it('gives an error when the tube is not found', () => {
        const request = store.requestsForPlate('DN55')
        expect(store.selectTube).not.toBeCalled()
        expect(request).toEqual({
          success: false,
          errors:
            'DN55 could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.',
        })
      })
    })

    describe('findRequestsForSource', () => {
      beforeEach(() => {
        store.$state = Data.AutoTagStore
        store.requestsForPlate = vi.fn()
        store.requestsForTube = vi.fn()
      })
      it('returns the requests for a plate', () => {
        store.findRequestsForSource({ barcode: 'DN1', wellName: 'A1' })
        expect(store.requestsForPlate).toBeCalledWith('DN1', 'A1')
      })
      it('returns the requests for a tube', () => {
        store.findRequestsForSource({ barcode: '3980000001795' })
        expect(store.requestsForTube).toBeCalledWith('3980000001795')
      })
    })
    describe('selectWellRequests', () => {
      beforeEach(() => {
        store.$state = Data.AutoTagStore
        store.selectRequest = vi.fn()
      })
      it('selects the requests for a given well', () => {
        store.selectWellRequests('1')
        expect(store.selectRequest).toBeCalledWith({ id: '1', selected: false })
      })
    })
    describe('updateLibrary', () => {
      beforeEach(() => {
        store.$state = Data.AutoTagStore
      })
      it('updates the library with the given values', () => {
        store.updateLibrary({ pacbio_request_id: '1', tag_id: '130' })
        expect(store.libraries['_1'].tag_id).toEqual('130')
      })
      it('will not update the library when given no pacbio_request_id given', () => {
        const initialLibrary = { ...store.libraries['_1'] }
        store.updateLibrary({ tag_id: '130' })
        expect(store.libraries['_1']).toEqual(initialLibrary)
      })
    })
    describe('desselectPlateAndContents', () => {
      it('deselects the plate and its contents', () => {
        store.$state = Data.AutoTagStore
        store.selectPlate = vi.fn()
        store.selectRequest = vi.fn()
        store.deselectPlateAndContents('1')
        expect(store.selectPlate).toBeCalledWith({ id: '1', selected: false })
        expect(store.selectRequest).toBeCalledTimes(48)
      })
    })
    describe('desselectTubeAndContents', () => {
      beforeEach(() => {
        store.$state = Data.AutoTagStore
        store.selectTube = vi.fn()
        store.selectRequest = vi.fn()
      })
      it('deselects the tube and its contents', () => {
        store.deselectTubeAndContents('TRAC-2-2')
        expect(store.selectTube).toBeCalledWith({ id: '2', selected: false })
        expect(store.selectRequest).toBeCalledWith({ id: '98', selected: false })
      })
      it('will not deselect the tube when given invalid barcode', () => {
        store.deselectTubeAndContents('TRAC-2-22')
        expect(store.selectTube).not.toBeCalled()
        expect(store.selectRequest).not.toBeCalled()
      })
    })

    describe('createPool', () => {
      let create
      beforeEach(() => {
        create = vi.fn()
        rootStore.api = { traction: { pacbio: { pools: { create } } } }
      })
      const library1 = {
        pacbio_request_id: '1',
        tag_id: '1',
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      }

      const library2 = {
        pacbio_request_id: '2',
        tag_id: '2',
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      }

      const pool = {
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      }

      // pool should be successfully created
      // for now: create a pool state with a simple success message
      it('when the pool is valid', async () => {
        const mockResponse = {
          status: '201',
          data: { data: {}, included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1' } }] },
        }
        const libraries = { _1: library1, _2: library2 }
        store.libraries = libraries
        store.pool = pool
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
        const mockResponse = {
          status: '422',
          data: { data: { errors: { error1: ['There was an error'] } } },
        }
        store.libraries = { _1: library1, _2: library2 }
        create.mockRejectedValue({ response: mockResponse })
        const expectedResponse = newResponse({ ...mockResponse, success: false })
        const { success, errors } = await store.createPool()
        expect(success).toBeFalsy()
        expect(errors).toEqual(expectedResponse.errors)
      })

      // validate libraries fails
      // request is not sent
      // commit is not called
      it('when the pool is invalid', async () => {
        store.libraries = { _1: library1, _2: { ...library2, concentration: '' } }
        const { success, errors } = await store.createPool()
        expect(create).not.toHaveBeenCalled()
        expect(success).toBeFalsy()
        expect(errors).toEqual('The pool is invalid')
      })
    })

    describe('updatePool', () => {
      const library1 = {
        id: '10',
        pacbio_request_id: '1',
        tag_id: '1',
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      }

      const library2 = {
        id: '20',
        pacbio_request_id: '2',
        tag_id: '2',
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      }

      const pool = {
        id: '1',
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      }

      let update, libraries
      beforeEach(() => {
        update = vi.fn()
        rootStore.api = { traction: { pacbio: { pools: { update } } } }
        libraries = { _1: library1, _2: library2 }
        store.libraries = libraries
        store.pool = pool
      })

      // pool should be successfully created
      // for now: create a pool state with a simple success message
      it('when the pool is valid', async () => {
        const mockResponse = {
          status: '201',
          data: { data: {}, included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1' } }] },
        }

        update.mockResolvedValue(mockResponse)
        const { success } = await store.updatePool()
        expect(update).toHaveBeenCalledWith(payload({ libraries, pool }))
        expect(success).toBeTruthy()
      })

      it('when there is an error', async () => {
        const mockResponse = {
          status: '422',
          data: { data: { errors: { error1: ['There was an error'] } } },
        }
        update.mockRejectedValue({ response: mockResponse })
        const expectedResponse = newResponse({ ...mockResponse, success: false })
        const { success, errors } = await store.updatePool()
        expect(success).toBeFalsy()
        expect(errors).toEqual(expectedResponse.errors)
      })

      // validate libraries fails
      // request is not sent
      // commit is not called
      it('when the pool is invalid', async () => {
        store.libraries = { _1: library1, _2: { ...library2, concentration: '' } }
        const { success, errors } = await store.updatePool()
        expect(update).not.toHaveBeenCalled()
        expect(success).toBeFalsy()
        expect(errors).toEqual('The pool is invalid')
      })
    })

    describe('populateLibrariesFromPool', () => {
      let find
      beforeEach(() => {
        find = vi.fn()
        rootStore.api = { traction: { pacbio: { pools: { find } } } }
        const pacbioRootStore = usePacbioRootStore()
        pacbioRootStore.tagState.tagSets = Data.TractionPacbioTagSets.data.data
        pacbioRootStore.tagState.tags = Data.TractionPacbioTagSets.data.included
        store.selected = { tagset: {}, plates: {} }
      })
      it('handles success', async () => {
        find.mockResolvedValue(Data.TractionPacbioPool)
        const { success } = await store.populateLibrariesFromPool()

        expect(store.pool).toEqual(Data.TractionPacbioPool.data.data)

        const library_pools = Data.TractionPacbioPool.data.included.slice(0, 1)
        const requests = Data.TractionPacbioPool.data.included.slice(100, 148)
        const plates = Data.TractionPacbioPool.data.included.slice(3, 4)
        const wells = Data.TractionPacbioPool.data.included.slice(4, 100)
        const tubes = Data.TractionPacbioPool.data.included.slice(148, 149)

        const libraries = jsonapi.dataToObjectById({
          data: library_pools,
          includeRelationships: true,
        })
        const value = Object.values(libraries)[0]
        expect(store.libraries[`_${value.request}`]).toEqual({
          ...value,
          pacbio_request_id: value.request,
          tag_id: value.tag,
        })
        expect(store.resources.requests).toEqual(
          jsonapi.dataToObjectById({ data: requests, includeRelationships: true }),
        )
        expect(store.resources.plates).toEqual(
          jsonapi.dataToObjectById({ data: plates, includeRelationships: true }),
        )
        expect(store.resources.wells).toEqual(
          jsonapi.dataToObjectById({ data: wells, includeRelationships: true }),
        )
        expect(store.resources.tubes).toEqual({})
        expect(store.tube).toEqual(tubes[0])

        expect(success).toEqual(true)
      })

      it('handles failure', async () => {
        find.mockRejectedValue({
          data: { data: [] },
          status: 500,
          statusText: 'Internal Server Error',
        })
        const { success } = await store.populateLibrariesFromPool()
        expect(success).toEqual(false)
      })
    })

    describe('applyTags', () => {
      beforeEach(() => {
        store.$state = Data.AutoTagStore
        pacbioRootStore.tagState.tagSets = Data.AutoTagStore.resources.tagSets
        pacbioRootStore.tagState.tags = Data.AutoTagStore.resources.tags
      })

      it('applies a single tag when autoTag is false', async () => {
        const library = { pacbio_request_id: '13', tag_id: '130' }
        const autoTag = false
        store.updateLibrary = vi.fn()
        store.autoTagPlate = vi.fn()
        store.autoTagTube = vi.fn()

        await store.applyTags({ library, autoTag })
        // We update the changed well
        expect(store.updateLibrary).toHaveBeenCalledWith({
          pacbio_request_id: '13',
          tag_id: '130',
        })
        expect(store.autoTagPlate).not.toHaveBeenCalled()
        expect(store.autoTagTube).not.toHaveBeenCalled()
      })
      it('calls autoTagPlate when autoTag is true and the library given has a request with well', async () => {
        const library = { pacbio_request_id: '13', tag_id: '130' }
        const autoTag = true
        store.updateLibrary = vi.fn()
        store.autoTagPlate = vi.fn()
        store.autoTagTube = vi.fn()
        await store.applyTags({ library, autoTag })
        expect(store.updateLibrary).toHaveBeenCalledWith({
          pacbio_request_id: '13',
          tag_id: '130',
        })
        expect(store.autoTagPlate).toHaveBeenCalledWith(library)
        expect(store.autoTagTube).not.toHaveBeenCalled()
      })
      it('calls autoTagTube when autoTag is true and the library given has a request with no well attribute', async () => {
        const library = { pacbio_request_id: '97', tag_id: '130' }
        const autoTag = true
        store.updateLibrary = vi.fn()
        store.autoTagPlate = vi.fn()
        store.autoTagTube = vi.fn()
        await store.applyTags({ library, autoTag })
        expect(store.updateLibrary).toHaveBeenCalledWith({
          pacbio_request_id: '97',
          tag_id: '130',
        })
        expect(store.autoTagTube).toHaveBeenCalledWith(library)
        expect(store.autoTagPlate).not.toHaveBeenCalled()
      })
    })

    describe('updateLibraryFromCsvRecord', () => {
      const info = {
        lines: 3,
        records: 2,
      }
      beforeEach(() => {
        store.$reset()
        store.$state = Data.AutoTagStore
        store.selected = { ...store.selected, plates: {}, tubes: {} }
        store.updateLibrary = vi.fn()
        rootStore.addCSVLogMessage = vi.fn()
        pacbioRootStore.tagState.tagSets = {
          3: {
            id: '3',
            type: 'tag_sets',
            name: 'Sequel_48_Microbial_Barcoded_OHA_v1',
            uuid: 'c808dbb2-a26b-cfae-0a16-c3e7c3b8d7fe',
            pipeline: 'pacbio',
            tags: [
              { id: '129', type: 'tags', oligo: 'TCTGTATCTCTATGTGT', group_id: 'bc1007T' },
              { id: '130', type: 'tags', oligo: 'CAGAGAGATATCTCTGT', group_id: 'bc1023T' },
              { id: '131', type: 'tags', oligo: 'CATGTAGAGCAGAGAGT', group_id: 'bc1024T' },
              { id: '132', type: 'tags', oligo: 'CACAGAGACACGCACAT', group_id: 'bc1026T' },
              { id: '133', type: 'tags', oligo: 'CTCACACTCTCTCACAT', group_id: 'bc1027T' },
              { id: '134', type: 'tags', oligo: 'CTCTGCTCTGACTCTCT', group_id: 'bc1028T' },
            ],
          },
        }
        pacbioRootStore.tagState.tags = {
          129: { id: '129', type: 'tags', oligo: 'TCTGTATCTCTATGTGT', group_id: 'bc1007T' },
          130: { id: '130', type: 'tags', oligo: 'CAGAGAGATATCTCTGT', group_id: 'bc1023T' },
          131: { id: '131', type: 'tags', oligo: 'CATGTAGAGCAGAGAGT', group_id: 'bc1024T' },
          132: { id: '132', type: 'tags', oligo: 'CACAGAGACACGCACAT', group_id: 'bc1026T' },
          133: { id: '133', type: 'tags', oligo: 'CTCACACTCTCTCACAT', group_id: 'bc1027T' },
          134: { id: '134', type: 'tags', oligo: 'CTCTGCTCTGACTCTCT', group_id: 'bc1028T' },
        }
      })
      it('updates the corresponding library', async () => {
        const record = {
          source: 'DN1:A10',
          tag: 'bc1024T',
          genome_size: 6.3,
          insert_size: 15230,
          concentration: 13,
          volume: 15,
        }

        store.updateLibraryFromCsvRecord({ record, info })

        expect(store.updateLibrary).toHaveBeenCalledWith(
          expect.objectContaining({
            pacbio_request_id: '10',
            tag_id: '131',
            insert_size: 15230,
            concentration: 13,
            volume: 15,
          }),
        )
      })

      it('updates the corresponding library for tubes', async () => {
        const record = {
          source: 'TRAC-2-2',
          tag: 'bc1024T',
          genome_size: 6.3,
          insert_size: 15230,
          concentration: 13,
          volume: 15,
        }

        store.updateLibraryFromCsvRecord({ record, info })

        expect(store.updateLibrary).toHaveBeenCalledWith(
          expect.objectContaining({
            pacbio_request_id: '98',
            tag_id: '131',
            insert_size: 15230,
            concentration: 13,
            volume: 15,
          }),
        )
      })

      it('records an error when source is missing', async () => {
        const record = {
          tag: 'bc1024T',
          genome_size: 6.3,
          insert_size: 15230,
          concentration: 13,
          volume: 15,
        }
        store.updateLibraryFromCsvRecord({ record, info })

        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(info, 'has no source')
      })

      it('records an error when the plate cant be found', async () => {
        const record = {
          source: 'DN34:A10',
        }

        store.updateLibraryFromCsvRecord({ record, info })

        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(
          info,
          'DN34 could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.',
        )
      })
      it('records an error when the well cant be found', async () => {
        const record = {
          source: 'DN1:X13',
        }
        store.updateLibraryFromCsvRecord({ record, info })

        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(
          info,
          'A well named X13 could not be found on DN1',
        )
      })

      it('records an error when the tag cant be found', () => {
        const record = {
          source: 'DN1:A1',
          tag: 'bc1001_BAK8A_OA',
        }

        store.updateLibraryFromCsvRecord({ record, info })

        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(
          info,
          'Could not find a tag named bc1001_BAK8A_OA in selected tag group',
        )
      })

      it('flags the plate as selected', () => {
        const record = {
          source: 'DN1:A1',
          tag: 'bc1001_BAK8A_OA',
        }

        store.selectPlate = vi.fn()

        store.updateLibraryFromCsvRecord({ record, info })
        expect(store.selectPlate).toHaveBeenCalledWith({
          id: '1',
          selected: true,
        })
      })

      it('notifies of request addition', () => {
        const record = {
          source: 'DN1:A3',
          tag: 'bc1024T',
          genome_size: 6.3,
          insert_size: 15230,
          concentration: 13,
          volume: 15,
        }
        store.updateLibrary = vi.fn()
        store.updateLibraryFromCsvRecord({ record, info })

        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(
          info,
          'Added DN1:A3 to pool',
          'info',
        )
        expect(store.updateLibrary).toBeCalled()
      })

      it('does not notifies of request update', async () => {
        const record = {
          source: 'DN1:A1',
          genome_size: 6.3,
          insert_size: 15230,
          concentration: 13,
          volume: 15,
        }

        store.updateLibrary = vi.fn()
        store.updateLibraryFromCsvRecord({ record, info })

        expect(rootStore.addCSVLogMessage).not.toHaveBeenCalledWith(
          info,
          'Added DN1:A1 to pool',
          'info',
        )
        expect(store.updateLibrary).toBeCalled()
      })
    })

    describe('findPacbioPlate', () => {
      const get = vi.fn()
      beforeEach(() => {
        rootStore.api = { traction: { pacbio: { plates: { get } } } }
        store.selectPlate = vi.fn()
      })
      it('returns the plate that fits the valid plate barcode', async () => {
        get.mockResolvedValue(Data.PacbioPlateRequest)

        const { success } = await store.findPacbioPlate({ barcode: 'GEN-1680611780-1' })

        expect(store.selectPlate).toHaveBeenCalledWith({ id: '1', selected: true })
        expect(store.resources.plates).toEqual(
          jsonapi.dataToObjectById({
            data: Data.PacbioPlateRequest.data.data,
            includeRelationships: true,
          }),
        )
        const wells = Data.PacbioPlateRequest.data.included.slice(0, 8)
        expect(store.resources.wells).toEqual(
          jsonapi.dataToObjectById({ data: wells, includeRelationships: true }),
        )
        const requests = Data.PacbioPlateRequest.data.included.slice(8, 16)
        expect(store.resources.requests).toEqual(
          jsonapi.dataToObjectById({ data: requests, includeRelationships: true }),
        )

        expect(success).toEqual(true)
      })

      it('returns an error and an empty list when plate barcode cannot be found', async () => {
        get.mockResolvedValue({ data: { data: [] } })

        const { success, errors } = await store.findPacbioPlate({ barcode: 'fake-barcode' })
        expect(errors).toEqual(['Unable to find plate with barcode: fake-barcode'])
        expect(success).toEqual(false)
      })

      it('returns an error and an empty list when plate barcode is not provided', async () => {
        const { success, errors } = await store.findPacbioPlate({ barcode: '' })
        expect(errors).toEqual(['Please provide a plate barcode'])
        expect(success).toEqual(false)
      })
    })

    describe('findPacbioTube', () => {
      const get = vi.fn()
      beforeEach(() => {
        rootStore.api = { traction: { pacbio: { tubes: { get } } } }
        store.selectPlate = vi.fn()
      })
      it('returns the tube that fits the valid tube barcode', async () => {
        get.mockResolvedValue(Data.PacbioTubeRequest)
        store.selectTube = vi.fn()

        const { success } = await store.findPacbioTube({ barcode: 'GEN-1680611780-6' })

        expect(store.selectTube).toHaveBeenCalledWith({ id: '1', selected: true })
        expect(store.resources.tubes).toEqual(
          jsonapi.dataToObjectById({
            data: Data.PacbioTubeRequest.data.data,
            includeRelationships: true,
          }),
        )
        const requests = Data.PacbioTubeRequest.data.included.slice(0, 1)
        expect(store.resources.requests).toEqual(
          jsonapi.dataToObjectById({ data: requests, includeRelationships: true }),
        )
        expect(success).toEqual(true)
      })

      it('returns an error and an empty list when tube barcode cannot be found', async () => {
        get.mockResolvedValue({ data: { data: [] } })

        const { success, errors } = await store.findPacbioTube({ barcode: 'fake-barcode' })
        expect(errors).toEqual(['Unable to find tube with barcode: fake-barcode'])
        expect(success).toEqual(false)
      })

      it('returns an error and an empty list when tube barcode is not provided', async () => {
        const { success, errors } = await store.findPacbioTube({ barcode: '' })
        expect(errors).toEqual(['Please provide a tube barcode'])
        expect(success).toEqual(false)
      })
    })

    describe('selectPlate', () => {
      it('selects a plate by default', () => {
        store.selected = {
          plates: {
            2: { id: '2', selected: true },
          },
        }
        store.selectPlate({ id: '1' })
        /*
        We expect the plate to be recorded in the selected plates it should:
        - Be selected
        - Not disrupt other plates in the store
        */
        expect(store.selected.plates).toEqual({
          1: { id: '1', selected: true },
          2: { id: '2', selected: true },
        })
      })
      it('deselects a plate when selected is false', () => {
        store.selected = {
          plates: {
            2: { id: '2', selected: true },
          },
        }
        store.selectPlate({ id: '2', selected: false })
        //We expect the plate to be removed in the selected plates
        expect(store.selected.plates).toEqual({})
      })
    })
    describe('selectTube', () => {
      it('selects a tube by default', () => {
        store.selected = {
          tubes: {
            2: { id: '2', selected: true },
          },
        }
        store.selectTube({ id: '1' })
        /*
        We expect the plate to be recorded in the selected plates it should:
        - Be selected
        - Not disrupt other tubes in the store
        */
        expect(store.selected.tubes).toEqual({
          1: { id: '1', selected: true },
          2: { id: '2', selected: true },
        })
      })
      it('deselects a tube when selected is false', () => {
        store.selected = {
          tubes: {
            2: { id: '2', selected: true },
          },
        }
        store.selectTube({ id: '2', selected: false })
        //We expect the tube to be removed in the selected plates
        expect(store.selected.tubes).toEqual({})
      })
    })
    describe('selectRequest', () => {
      it('selects a request by default', () => {
        store.selectRequest({ id: '1' })

        store.libraries = {
          _2: {
            pacbio_request_id: '2',
            tag_id: null,
            template_prep_kit_box_barcode: null,
            volume: null,
            concentration: null,
            insert_size: null,
          },
        }
        /*
        We expect the plate to be recorded in the selected plates it should:
        - Be selected
        - Not disrupt other libraries in the store
        */
        expect(store.libraries).toEqual({
          _1: {
            pacbio_request_id: '1',
            tag_id: null,
            template_prep_kit_box_barcode: null,
            volume: null,
            concentration: null,
            insert_size: null,
          },
          _2: {
            pacbio_request_id: '2',
            tag_id: null,
            template_prep_kit_box_barcode: null,
            volume: null,
            concentration: null,
            insert_size: null,
          },
        })
      })
      it('deselects a tube when selected is false', () => {
        store.libraries = {
          _1: { pacbio_request_id: '1', tag_id: '1' },
        }
        store.selectRequest({ id: '1', tag_id: '1', selected: false })
        //We expect the tube to be removed in the selected plates
        expect(store.libraries).toEqual({})
      })
    })

    describe('selectTagSet', () => {
      it('selects a tag set', () => {
        store.selectTagSet('1')
        expect(store.selected.tagset).toEqual({ id: '1' })
      })
    })

    describe('clearPoolData', () => {
        it('clears the pool data', () => {
            store.li
            store.clearPoolData()
            expect(store.resources).toEqual({
            requests: {},
            plates: {},
            wells: {},
            tubes: {},
            })
        })

    })
  })
})
