import { successfulResponse, failedResponse } from '@support/testHelper.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import useRootStore from '@/stores'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { payload } from '@/stores/utilities/pacbioPool.js'
import { createUsedAliquot } from '@/stores/utilities/usedAliquot.js'
import PacbioTagSetFactory from '@tests/factories/PacbioTagSetFactory.js'
import PacbioPoolFactory from '@tests/factories/PacbioPoolFactory.js'
import PacbioAutoTagFactory from '@tests/factories/PacbioAutoTagFactory.js'
import PacbioPlateFactory from '@tests/factories/PacbioPlateFactory.js'
import PacbioTubeFactory from '@tests/factories/PacbioTubeFactory.js'

const pacbioTagSetFactory = PacbioTagSetFactory()
const pacbioPoolFactory = PacbioPoolFactory({ count: 1 })
const pacbioAutoTagFactory = PacbioAutoTagFactory()
const pacbioPlateFactory = PacbioPlateFactory({ count: 1 })
const pacbioTubeFactory = PacbioTubeFactory({ findBy: 'libraries', transformTubes: true })

vi.mock('@/api/FeatureFlag', () => ({
  checkFeatureFlag: vi.fn().mockReturnValue(true),
}))

describe('usePacbioPoolCreateStore', () => {
  describe('getters', () => {
    let store

    beforeEach(() => {
      store = usePacbioPoolCreateStore()
    })

    it('returns the selected tag set', () => {
      const pacbioRootStore = usePacbioRootStore()
      pacbioRootStore.tagSets = pacbioTagSetFactory.storeData.tagSets
      pacbioRootStore.tags = pacbioTagSetFactory.storeData.tags
      store.selected.tagSet = pacbioTagSetFactory.storeData.selected.tagSet
      expect(store.selectedTagSet).toEqual({
        ...pacbioTagSetFactory.storeData.selected.tagSet,
        tags: pacbioTagSetFactory.storeData.selected.tags.all,
      })
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

    it('returns the selected usedAliquots', () => {
      store.resources = {
        ...store.resources,
        ...pacbioPoolFactory.storeData.resources,
      }
      store.used_aliquots = pacbioPoolFactory.storeData.used_aliquots
      const selectedUsedAliquots = store.selectedUsedAliquots
      expect(selectedUsedAliquots.length).toEqual(Object.values(store.used_aliquots).length)
      selectedUsedAliquots.forEach((aliquot) => {
        expect(aliquot).toEqual({
          ...store.resources.requests[aliquot.request],
          ...store.used_aliquots[`_${aliquot.source_id}`],
          selected: true,
        })
      })
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
        1: { id: '1', name: 'request1', tube: '1' },
        2: { id: '2', name: 'request2', well: '2' },
        3: { id: '3', name: 'request3', well: '3' },
        4: { id: '4', name: 'request4', tube: '4' },
        5: { id: '5', name: 'request5', tube: '5' },
      }
      const used_aliquots = {
        _3: {
          source_id: '3',
          source_type: 'Pacbio::Request',
          requests: '3',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
        _4: {
          source_id: '4',
          source_type: 'Pacbio::Request',
          request: '4',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
      }

      const mergedRequests = [
        { id: '1', name: 'request1', selected: false, tube: '1' },
        { id: '2', name: 'request2', selected: false, well: '2' },
        { id: '3', name: 'request3', selected: true, well: '3' },
        { id: '4', name: 'request4', selected: true, tube: '4' },
        { id: '5', name: 'request5', selected: false, tube: '5' },
      ]

      it('returns all requests', () => {
        store.resources.requests = requests
        store.used_aliquots = used_aliquots
        expect(store.requestList()).toEqual(mergedRequests)
      })

      it('returns specific requests for a a used_aliquot when used_aliquot is given', () => {
        store.resources.requests = requests
        store.used_aliquots = used_aliquots
        const library = { source_id: '3', requests: ['3', '2'] }
        expect(store.requestList(library).length).toEqual(2)
      })
    })

    it('returns used_aliquotsItems', () => {
      const used_aliquots = {
        _3: {
          source_id: '3',
          source_type: 'Pacbio::Request',
          request: '3',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
        _4: {
          source_id: '4',
          source_type: 'Pacbio::Request',
          request: '4',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
      }
      store.used_aliquots = used_aliquots
      expect(store.usedAliquotItem('3')).toEqual(used_aliquots['_3'])
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
        store.$state = pacbioAutoTagFactory.storeData
        pacbioRootStore.tagSets = pacbioAutoTagFactory.storeData.resources.tagSets
        pacbioRootStore.tags = pacbioAutoTagFactory.storeData.resources.tags
      })

      it('will not update used_aliquots when given with invalid values', () => {
        const initialUsedAliquots = { ...store.used_aliquots }
        store.autoTagPlate({})
        expect(store.used_aliquots).toEqual(initialUsedAliquots)
      })

      it('updates all used_aliquots of same plate with a new tag ', () => {
        const initialUsedAliquots = { ...store.used_aliquots }
        store.autoTagPlate({ source_id: '1', request: '1', tag_id: '130' })
        expect(store.used_aliquots).not.toEqual(initialUsedAliquots)
      })

      it('applies tags to wells on the same plate with a higher column index when autoTag is true', async () => {
        const used_aliquot = { source_id: '13', request: '13', tag_id: '130' }
        store.updateUsedAliquot = vi.fn()
        await store.autoTagPlate(used_aliquot)
        // We update the changed well
        expect(store.updateUsedAliquot).toHaveBeenCalledWith({
          request: '37',
          tag_id: '132',
          source_id: '37',
          source_type: 'Pacbio::Request',
        })

        // We don't update earlier wells
        expect(store.updateUsedAliquot).not.toHaveBeenCalledWith(
          expect.objectContaining({
            request: '1',
          }),
        )

        // // We don't update unselected wells
        expect(store.updateUsedAliquot).not.toHaveBeenCalledWith(
          expect.objectContaining({
            request: '25', // C1
          }),
        )

        // // Including the next column
        expect(store.updateUsedAliquot).toHaveBeenCalledWith({
          request: '2', // A2
          tag_id: '137',
          source_id: '2',
          source_type: 'Pacbio::Request',
        })
        // But not another plate
        expect(store.updateUsedAliquot).not.toHaveBeenCalledWith(
          expect.objectContaining({
            request: '61', // B1
          }),
        )
        expect(store.updateUsedAliquot).not.toHaveBeenCalledWith(
          expect.objectContaining({
            request: '73', // C1
          }),
        )
        // or a tube
        expect(store.updateUsedAliquot).not.toHaveBeenCalledWith(
          expect.objectContaining({
            request: '96',
          }),
        )
        expect(store.updateUsedAliquot).not.toHaveBeenCalledWith(
          expect.objectContaining({
            request: '97',
          }),
        )

        // // In total we expect to update 8 wells in this case
        expect(store.updateUsedAliquot).toHaveBeenCalledTimes(5)
      })
    })

    describe('autoTagTube', () => {
      beforeEach(() => {
        store.$state = pacbioAutoTagFactory.storeData
        pacbioRootStore.tagSets = pacbioAutoTagFactory.storeData.resources.tagSets
        pacbioRootStore.tags = pacbioAutoTagFactory.storeData.resources.tags
      })

      it('will not update used_aliquots when given with invalid values', () => {
        const initialUsedAliquots = { ...store.used_aliquots }
        store.autoTagTube({})
        expect(store.used_aliquots).toEqual(initialUsedAliquots)
      })

      it('updates all used_aliquots of same tube with a new tag ', () => {
        store.autoTagTube({ source_id: '97', request: '97', tag_id: '130' })
        expect(store.used_aliquots['_98'].tag_id).toEqual('131')
        expect(store.used_aliquots['_99'].tag_id).toEqual('132')
      })

      it('applies tags to tubes with a higher index when autoTag is true', async () => {
        store.updateUsedAliquot = vi.fn()
        const used_aliquot = { source_id: '98', request: '98', tag_id: '130' }
        await store.autoTagTube(used_aliquot)
        // We don't update earlier wells
        expect(store.updateUsedAliquot).not.toHaveBeenCalledWith(
          expect.objectContaining({
            request: '1',
          }),
        )

        // We don't update earlier tubes
        expect(store.updateUsedAliquot).not.toHaveBeenCalledWith(
          expect.objectContaining({
            request: '97',
          }),
        )
        // // We don't update unselected wells
        expect(store.updateUsedAliquot).not.toHaveBeenCalledWith(
          expect.objectContaining({
            request: '25', // C1
          }),
        )
        // // We do update tubes with higher ids
        expect(store.updateUsedAliquot).toHaveBeenCalledWith(
          expect.objectContaining({
            request: '99', // D1
            tag_id: '131',
          }),
        )
        // // In total we expect ot update 2 tubes in this case
        expect(store.updateUsedAliquot).toHaveBeenCalledTimes(1)
      })
    })

    describe('requestForPlate', () => {
      beforeEach(() => {
        store.$state = pacbioAutoTagFactory.storeData
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
        store.$state = pacbioAutoTagFactory.storeData
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
        store.$state = pacbioAutoTagFactory.storeData
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
        store.$state = pacbioAutoTagFactory.storeData
        store.selectRequestInSource = vi.fn()
      })

      it('selects the requests for a given well', () => {
        store.selectWellRequests('1')
        expect(store.selectRequestInSource).toBeCalledWith({
          selected: false,
          request: '1',
          source_id: '1',
        })
      })
    })

    describe('updateUsedAliquot', () => {
      beforeEach(() => {
        store.$state = pacbioAutoTagFactory.storeData
      })

      it('updates the used_aliquot with the given values', () => {
        store.updateUsedAliquot({ request: '1', source_id: '1', tag_id: '130' })
        expect(store.used_aliquots['_1'].tag_id).toEqual('130')
      })

      it('will not update the used_aliquot when given no source_id given', () => {
        const initialUsedAliquot = { ...store.used_aliquots['_1'] }
        store.updateUsedAliquot({ tag_id: '130' })
        expect(store.used_aliquots['_1']).toEqual(initialUsedAliquot)
      })
    })

    describe('desselectPlateAndContents', () => {
      it('deselects the plate and its contents', () => {
        store.$state = pacbioAutoTagFactory.storeData
        store.selectPlate = vi.fn()
        store.selectRequestInSource = vi.fn()
        store.deselectPlateAndContents('1')
        expect(store.selectPlate).toBeCalledWith({ id: '1', selected: false })
        expect(store.selectRequestInSource).toBeCalledTimes(48)
      })
    })

    describe('desselectTubeAndContents', () => {
      beforeEach(() => {
        store.$state = pacbioAutoTagFactory.storeData
        store.selectTube = vi.fn()
        store.selectRequestInSource = vi.fn()
      })

      it('deselects the tube and its contents', () => {
        store.deselectTubeAndContents('2')
        expect(store.selectTube).toBeCalledWith({ id: '2', selected: false })
        expect(store.selectRequestInSource).toBeCalledWith({
          selected: false,
          request: '98',
          source_id: '98',
        })
      })

      it('will not deselect the tube when given invalid barcode', () => {
        store.deselectTubeAndContents('TRAC-2-22')
        expect(store.selectTube).not.toBeCalled()
        expect(store.selectRequestInSource).not.toBeCalled()
      })
    })

    describe('createPool', () => {
      let create

      beforeEach(() => {
        create = vi.fn()
        rootStore.api = { traction: { pacbio: { pools: { create } } } }
      })

      const used_aliquot1 = createUsedAliquot({
        source_id: '1',
        source_type: 'Pacbio::Request',
        request: '1',
        tag_id: '1',
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      })

      const used_aliquot2 = createUsedAliquot({
        source_id: '2',
        source_type: 'Pacbio::Request',
        request: '2',
        tag_id: '2',
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      })

      const pool = {
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      }

      // pool should be successfully created
      // for now: create a pool state with a simple success message
      it('when the pool is valid', async () => {
        const mockResponse = successfulResponse({
          data: { attributes: { barcode: 'TRAC-1' } },
        })
        const used_aliquots = {
          _1: used_aliquot1,
          _2: used_aliquot2,
        }
        store.used_aliquots = used_aliquots
        store.pool = pool
        create.mockResolvedValue(mockResponse)
        const { success, barcode } = await store.createPool()
        expect(create).toHaveBeenCalledWith({
          data: payload({ used_aliquots, pool }),
        })
        expect(success).toBeTruthy()
        expect(barcode).toEqual('TRAC-1')
      })

      it('when there is an error', async () => {
        const mockResponse = failedResponse(422)
        store.used_aliquots = { _1: used_aliquot1, _2: used_aliquot2 }
        store.pool = pool
        create.mockResolvedValue(mockResponse)
        const { success, errors } = await store.createPool()
        expect(success).toBeFalsy()
        expect(errors).toEqual(mockResponse.errorSummary)
      })

      // validate used_aliquots fails
      // request is not sent
      // commit is not called
      it('when the pool used_aliquots are invalid', async () => {
        let concentration = used_aliquot2.concentration
        used_aliquot2.concentration = ''
        store.used_aliquots = { _1: used_aliquot1, _2: { ...used_aliquot2 } }
        store.pool = pool
        const { success, errors } = await store.createPool()
        expect(create).not.toHaveBeenCalled()
        expect(success).toBeFalsy()
        expect(errors).toEqual('The pool is invalid')
        used_aliquot2.concentration = concentration
      })

      it('preserves the used aliquots source type', async () => {
        const used_aliquots = {
          _1: createUsedAliquot({
            source_id: '1',
            source_type: 'Pacbio::Library',
            request: '1',
            tag_id: '1',
            template_prep_kit_box_barcode: 'ABC1',
            volume: 1,
            concentration: 1,
            insert_size: 100,
          }),
        }
        store.used_aliquots = used_aliquots
        store.pool = pool
        await store.createPool()
        const playload = payload({ used_aliquots, pool })

        expect(create).toHaveBeenCalledWith({
          data: playload,
        })

        expect(playload.data.attributes.used_aliquots_attributes[0].source_type).toEqual(
          used_aliquots['_1'].source_type,
        )
      })

      it('when the pool is invalid', async () => {
        store.used_aliquots = { _1: used_aliquot1, _2: used_aliquot2 }
        store.pool = { template_prep_kit_box_barcode: '' }
        const { success, errors } = await store.createPool()
        expect(create).not.toHaveBeenCalled()
        expect(success).toBeFalsy()
        expect(errors).toEqual('The pool is invalid')
      })
    })

    describe('updatePool', () => {
      const used_aliquot1 = createUsedAliquot({
        id: '10',
        source_id: '1',
        source_type: 'Pacbio::Request',
        tag_id: '1',
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      })

      const used_aliquot2 = createUsedAliquot({
        id: '20',
        source_id: '2',
        source_type: 'Pacbio::Request',
        tag_id: '2',
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      })

      const pool = {
        id: '1',
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        insert_size: 100,
      }

      let update, used_aliquots

      beforeEach(() => {
        update = vi.fn()
        rootStore.api = { traction: { pacbio: { pools: { update } } } }
        used_aliquots = { _1: used_aliquot1, _2: used_aliquot2 }
        store.used_aliquots = used_aliquots
        store.pool = pool
      })

      // pool should be successfully created
      // for now: create a pool state with a simple success message
      it('when the pool is valid', async () => {
        const mockResponse = successfulResponse({
          data: {},
          included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1' } }],
        })
        update.mockResolvedValue(mockResponse)
        const { success } = await store.updatePool()
        expect(update).toHaveBeenCalledWith(payload({ used_aliquots, pool }))
        expect(success).toBeTruthy()
      })

      it('when there is an error', async () => {
        const mockResponse = failedResponse(422)
        update.mockResolvedValue(mockResponse)
        const { success, errors } = await store.updatePool()
        expect(success).toBeFalsy()
        expect(errors).toEqual(mockResponse.errorSummary)
      })

      // validate used_aliquots fails
      // request is not sent
      // commit is not called
      it('when the pool used_aliquots are invalid', async () => {
        store.used_aliquots = { _1: used_aliquot1, _2: { ...used_aliquot2, concentration: '' } }
        store.pool = pool
        const { success, errors } = await store.createPool()
        expect(update).not.toHaveBeenCalled()
        expect(success).toBeFalsy()
        expect(errors).toEqual('The pool is invalid')
      })

      it('when the pool is invalid', async () => {
        store.used_aliquots = { _1: used_aliquot1, _2: used_aliquot2 }
        store.pool = { template_prep_kit_box_barcode: '' }
        const { success, errors } = await store.createPool()
        expect(update).not.toHaveBeenCalled()
        expect(success).toBeFalsy()
        expect(errors).toEqual('The pool is invalid')
      })
    })

    describe('populateUsedAliquotsFromPool', () => {
      let find

      beforeEach(() => {
        find = vi.fn()
        rootStore.api = { traction: { pacbio: { pools: { find } } } }
        const pacbioRootStore = usePacbioRootStore()
        pacbioRootStore.tagSets = pacbioTagSetFactory.storeData.tagSets
        pacbioRootStore.tags = pacbioTagSetFactory.storeData.tags
        store.selected = { tagset: {}, plates: {}, tubes: {} }
      })

      it('handles success', async () => {
        find.mockResolvedValue(pacbioPoolFactory.responses.fetch)
        const { success } = await store.populateUsedAliquotsFromPool()

        expect(store.pool).toEqual(pacbioPoolFactory.storeData.pool)
        // we have to stringify this. Not sure why
        expect(JSON.stringify(store.used_aliquots)).toEqual(
          JSON.stringify(pacbioPoolFactory.storeData.used_aliquots),
        )
        expect(store.resources.requests).toEqual(pacbioPoolFactory.storeData.resources.requests)
        expect(store.resources.plates).toEqual(pacbioPoolFactory.storeData.resources.plates)
        expect(store.resources.wells).toEqual(pacbioPoolFactory.storeData.resources.wells)
        expect(store.resources.tubes).toEqual(pacbioPoolFactory.storeData.resources.tubes)
        expect(store.selected.tagSet).toEqual(pacbioPoolFactory.storeData.selected.tagSet)
        expect(success).toEqual(true)
      })

      // an extra check to ensure this data is added to the store
      it('adds the wells and pools data to the store', async () => {
        const pacbioPoolFactoryWithAllIncludedData = PacbioPoolFactory({
          count: 1,
          includeAll: true,
        })
        find.mockResolvedValue(pacbioPoolFactoryWithAllIncludedData.responses.fetch)
        const { success } = await store.populateUsedAliquotsFromPool()
        expect(store.resources.plates).toEqual(
          pacbioPoolFactoryWithAllIncludedData.storeData.resources.plates,
        )
        expect(Object.values(store.resources.plates).length).toBeGreaterThan(0)
        expect(store.resources.wells).toEqual(
          pacbioPoolFactoryWithAllIncludedData.storeData.resources.wells,
        )
        expect(Object.values(store.resources.plates).length).toBeGreaterThan(0)
        expect(success).toBeTruthy()
      })

      it('handles failure', async () => {
        find.mockResolvedValue(failedResponse(500))
        const { success } = await store.populateUsedAliquotsFromPool()
        expect(success).toEqual(false)
      })
    })

    describe('applyTags', () => {
      beforeEach(() => {
        store.$state = pacbioAutoTagFactory.storeData
        pacbioRootStore.tagSets = pacbioAutoTagFactory.storeData.resources.tagSets
        pacbioRootStore.tags = pacbioAutoTagFactory.storeData.resources.tags
      })

      it('applies a single tag when autoTag is false', async () => {
        const used_aliquots = { request: '13', tag_id: '130' }
        const autoTag = false
        store.updateUsedAliquot = vi.fn()
        store.autoTagPlate = vi.fn()
        store.autoTagTube = vi.fn()

        await store.applyTags({ used_aliquots, autoTag })
        // We update the changed well
        expect(store.updateUsedAliquot).toHaveBeenCalledWith({
          request: '13',
          tag_id: '130',
        })
        expect(store.autoTagPlate).not.toHaveBeenCalled()
        expect(store.autoTagTube).not.toHaveBeenCalled()
      })

      it('calls autoTagPlate when autoTag is true and the used_aliquot given has a request with well', async () => {
        const used_aliquots = { request: '13', tag_id: '130' }
        const autoTag = true
        store.updateUsedAliquot = vi.fn()
        store.autoTagPlate = vi.fn()
        store.autoTagTube = vi.fn()
        await store.applyTags({ used_aliquots, autoTag })
        expect(store.updateUsedAliquot).toHaveBeenCalledWith({
          request: '13',
          tag_id: '130',
        })
        expect(store.autoTagPlate).toHaveBeenCalledWith(used_aliquots)
        expect(store.autoTagTube).not.toHaveBeenCalled()
      })

      it('calls autoTagTube when autoTag is true and the used_aliquot given has a request with no well attribute', async () => {
        const used_aliquots = { request: '97', tag_id: '130' }
        const autoTag = true
        store.updateUsedAliquot = vi.fn()
        store.autoTagPlate = vi.fn()
        store.autoTagTube = vi.fn()
        await store.applyTags({ used_aliquots, autoTag })
        expect(store.updateUsedAliquot).toHaveBeenCalledWith({
          request: '97',
          tag_id: '130',
        })
        expect(store.autoTagTube).toHaveBeenCalledWith(used_aliquots)
        expect(store.autoTagPlate).not.toHaveBeenCalled()
      })
    })

    describe('updateUsedAliquotFromCsvRecord', () => {
      const info = {
        lines: 3,
        records: 2,
      }

      beforeEach(() => {
        store.$reset()
        store.$state = pacbioAutoTagFactory.storeData
        store.selected = { ...store.selected, plates: {}, tubes: {} }
        store.updateUsedAliquot = vi.fn()
        rootStore.addCSVLogMessage = vi.fn()
        pacbioRootStore.tagSets = {
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
        pacbioRootStore.tags = {
          129: { id: '129', type: 'tags', oligo: 'TCTGTATCTCTATGTGT', group_id: 'bc1007T' },
          130: { id: '130', type: 'tags', oligo: 'CAGAGAGATATCTCTGT', group_id: 'bc1023T' },
          131: { id: '131', type: 'tags', oligo: 'CATGTAGAGCAGAGAGT', group_id: 'bc1024T' },
          132: { id: '132', type: 'tags', oligo: 'CACAGAGACACGCACAT', group_id: 'bc1026T' },
          133: { id: '133', type: 'tags', oligo: 'CTCACACTCTCTCACAT', group_id: 'bc1027T' },
          134: { id: '134', type: 'tags', oligo: 'CTCTGCTCTGACTCTCT', group_id: 'bc1028T' },
        }
      })

      it('updates the corresponding used_aliquot', async () => {
        const record = {
          source: 'DN1:A10',
          tag: 'bc1024T',
          genome_size: 6.3,
          insert_size: 15230,
          concentration: 13,
          volume: 15,
        }

        store.updateUsedAliquotFromCsvRecord({ record, info })

        expect(store.updateUsedAliquot).toHaveBeenCalledWith(
          expect.objectContaining({
            request: '10',
            tag_id: '131',
            insert_size: 15230,
            concentration: 13,
            volume: 15,
            source_type: 'Pacbio::Request',
            validate: expect.any(Function),
          }),
        )
      })

      it('preserves the used_aliquots source type when present', async () => {
        const record = {
          source: 'DN1:A10',
          tag: 'bc1024T',
          genome_size: 6.3,
          insert_size: 15230,
          concentration: 13,
          source_type: 'Pacbio::Pool',
          type: 'pool',
          volume: 15,
        }

        store.updateUsedAliquotFromCsvRecord({ record, info })

        expect(store.updateUsedAliquot).toHaveBeenCalledWith(
          expect.objectContaining({
            request: '10',
            tag_id: '131',
            insert_size: 15230,
            concentration: 13,
            volume: 15,
            source_type: 'Pacbio::Pool',
            validate: expect.any(Function),
          }),
        )
      })

      it('defaults to attribute type when source type is absent', async () => {
        const record = {
          source: 'DN1:A10',
          tag: 'bc1024T',
          genome_size: 6.3,
          insert_size: 15230,
          concentration: 13,
          type: 'pools',
          volume: 15,
        }

        store.updateUsedAliquotFromCsvRecord({ record, info })

        expect(store.updateUsedAliquot).toHaveBeenCalledWith(
          expect.objectContaining({
            request: '10',
            tag_id: '131',
            insert_size: 15230,
            concentration: 13,
            volume: 15,
            source_type: 'Pacbio::Pool',
            validate: expect.any(Function),
          }),
        )
      })

      it('defaults to Pacbio::Request in the absence of source type and attribute type', async () => {
        const record = {
          source: 'DN1:A10',
          tag: 'bc1024T',
          genome_size: 6.3,
          insert_size: 15230,
          concentration: 13,
          volume: 15,
        }

        store.updateUsedAliquotFromCsvRecord({ record, info })

        expect(store.updateUsedAliquot).toHaveBeenCalledWith(
          expect.objectContaining({
            request: '10',
            tag_id: '131',
            insert_size: 15230,
            concentration: 13,
            volume: 15,
            source_type: 'Pacbio::Request',
            validate: expect.any(Function),
          }),
        )
      })

      it('updates the corresponding used_aliquot for tubes', async () => {
        const record = {
          source: 'TRAC-2-2',
          tag: 'bc1024T',
          genome_size: 6.3,
          insert_size: 15230,
          concentration: 13,
          volume: 15,
        }

        store.updateUsedAliquotFromCsvRecord({ record, info })

        expect(store.updateUsedAliquot).toHaveBeenCalledWith(
          expect.objectContaining({
            request: '98',
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
        store.updateUsedAliquotFromCsvRecord({ record, info })

        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(info, 'has no source')
      })

      it('records an error when the plate cant be found', async () => {
        const record = {
          source: 'DN34:A10',
        }

        store.updateUsedAliquotFromCsvRecord({ record, info })

        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(
          info,
          'DN34 could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.',
        )
      })

      it('records an error when the well cant be found', async () => {
        const record = {
          source: 'DN1:X13',
        }
        store.updateUsedAliquotFromCsvRecord({ record, info })

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

        store.updateUsedAliquotFromCsvRecord({ record, info })

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

        store.updateUsedAliquotFromCsvRecord({ record, info })
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
        store.updateUsedAliquot = vi.fn()
        store.updateUsedAliquotFromCsvRecord({ record, info })

        expect(rootStore.addCSVLogMessage).toHaveBeenCalledWith(
          info,
          'Added DN1:A3 to pool',
          'info',
        )
        expect(store.updateUsedAliquot).toBeCalled()
      })

      it('does not notifies of request update', async () => {
        const record = {
          source: 'DN1:A1',
          genome_size: 6.3,
          insert_size: 15230,
          concentration: 13,
          volume: 15,
        }

        store.updateUsedAliquot = vi.fn()
        store.updateUsedAliquotFromCsvRecord({ record, info })

        expect(rootStore.addCSVLogMessage).not.toHaveBeenCalledWith(
          info,
          'Added DN1:A1 to pool',
          'info',
        )
        expect(store.updateUsedAliquot).toBeCalled()
      })
    })

    describe('findPacbioPlate', () => {
      const get = vi.fn()

      beforeEach(() => {
        rootStore.api = { traction: { pacbio: { plates: { get } } } }
        store.selectPlate = vi.fn()
      })

      it('returns the plate that fits the valid plate barcode', async () => {
        get.mockResolvedValue(pacbioPlateFactory.responses.fetch)

        const id = Object.keys(pacbioPlateFactory.storeData.resources.plates)[0]
        const { success } = await store.findPacbioPlate({
          barcode: pacbioPlateFactory.storeData.resources.plates[id].barcode,
        })

        expect(store.selectPlate).toHaveBeenCalledWith({ id, selected: true })
        expect(store.resources.plates).toEqual(pacbioPlateFactory.storeData.resources.plates)
        expect(store.resources.wells).toEqual(pacbioPlateFactory.storeData.resources.wells)
        expect(store.resources.requests).toEqual(pacbioPlateFactory.storeData.resources.requests)

        expect(success).toEqual(true)
      })

      it('returns an error and an empty list when plate barcode cannot be found', async () => {
        get.mockResolvedValue({ data: [] })

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
        get.mockResolvedValue(pacbioTubeFactory.responses.fetch)
        store.selectTube = vi.fn()

        const id = Object.keys(pacbioTubeFactory.storeData.tubes)[0]

        const { success } = await store.findPacbioTube({
          barcode: pacbioTubeFactory.storeData.tubes[id].barcode,
        })

        expect(store.selectTube).toHaveBeenCalledWith({ id, selected: true })
        expect(success).toEqual(true)

        expect(store.resources.requests).toEqual(pacbioTubeFactory.storeData.requests)
        expect(store.resources.tubes).toEqual(pacbioTubeFactory.storeData.tubes)
      })

      it('returns an error and an empty list when tube barcode cannot be found', async () => {
        get.mockResolvedValue({ data: [] })

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

    describe('selectRequestInSource', () => {
      const attributeKeys = [
        'source_id',
        'tag_id',
        'template_prep_kit_box_barcode',
        'volume',
        'concentration',
        'insert_size',
        'source_type',
        'request',
      ]
      it('selects a request by default', () => {
        store.used_aliquots = {
          _2: createUsedAliquot({
            source_id: '2',
            source_type: 'Pacbio::Request',
            request: '2',
            tag_id: null,
            template_prep_kit_box_barcode: null,
            volume: null,
            concentration: null,
            insert_size: null,
          }),
        }
        store.resources.requests = {
          1: {
            tube: '2',
          },
        }
        store.selectRequestInSource({ request: '1', source_id: '1' })

        /*
        We expect the plate to be recorded in the selected plates it should:
        - Be selected
        - Not disrupt other used_aliquots in the store
        */

        expect({ ...store.used_aliquots['_1'].attributes(attributeKeys) }).toEqual({
          source_id: '1',
          tag_id: null,
          template_prep_kit_box_barcode: null,
          volume: null,
          concentration: null,
          insert_size: null,
          source_type: 'Pacbio::Request',
          request: '1',
        })
        expect({ ...store.used_aliquots['_2'].attributes(attributeKeys) }).toEqual({
          source_id: '2',
          source_type: 'Pacbio::Request',
          tag_id: null,
          template_prep_kit_box_barcode: null,
          volume: null,
          concentration: null,
          insert_size: null,
          request: '2',
        })
      })

      it('deselects a tube when selected is false', () => {
        store.used_aliquots = {
          _1: { source_id: '1', request: '1', tag_id: '1' },
        }
        store.selectRequestInSource({ request: '1', source_id: '1', tag_id: '1', selected: false })
        //We expect the tube to be removed in the selected plates
        expect(store.used_aliquots).toEqual({})
      })

      describe('when selecting a library', () => {
        it('updates template_prep_kit_box_barcode,volume,concentration,insert_size when tag_id is null', () => {
          store.used_aliquots = {
            _1: createUsedAliquot({
              source_id: '1',
              source_type: 'Pacbio::Request',
              request: '1',
              tag_id: null,
              template_prep_kit_box_barcode: null,
              volume: null,
              concentration: null,
              insert_size: null,
            }),
          }
          store.resources.requests = {
            1: {
              id: '1',
            },
          }
          store.resources.libraries = {
            2: {
              id: '2',
              type: 'libraries',
              template_prep_kit_box_barcode: 'ABC1',
              volume: 1,
              concentration: 1,
              insert_size: 100,
              request: '1',
              tag_id: null,
            },
          }
          store.selectRequestInSource({ request: '1', source_id: '2' })
          expect(store.used_aliquots['_2'].attributes(attributeKeys)).toEqual({
            source_id: '2',
            tag_id: null,
            template_prep_kit_box_barcode: 'ABC1',
            volume: 1,
            concentration: 1,
            insert_size: 100,
            source_type: 'Pacbio::Library',
            request: '1',
          })
          expect(store.used_aliquots['_1'].attributes(attributeKeys)).toEqual({
            source_id: '1',
            source_type: 'Pacbio::Request',
            request: '1',
            tag_id: null,
            template_prep_kit_box_barcode: null,
            volume: null,
            concentration: null,
            insert_size: null,
          })
        })

        it('updates library data and tag_id when tag_id is present and no tagset has been selected', () => {
          store.used_aliquots = {
            _2: createUsedAliquot({
              source_id: '2',
              source_type: 'Pacbio::Request',
              request: '2',
              tag_id: null,
              template_prep_kit_box_barcode: null,
              volume: null,
              concentration: null,
              insert_size: null,
            }),
          }
          store.resources.requests = {
            1: {
              id: '1',
            },
          }
          store.resources.libraries = {
            1: {
              id: '1',
              type: 'libraries',
              template_prep_kit_box_barcode: 'ABC1',
              volume: 1,
              concentration: 1,
              insert_size: 100,
              request: '1',
              tag_id: 129,
            },
          }
          pacbioRootStore.tagSets = {
            3: {
              id: '3',
              type: 'tag_sets',
              name: 'Sequel_48_Microbial_Barcoded_OHA_v1',
              uuid: 'c808dbb2-a26b-cfae-0a16-c3e7c3b8d7fe',
              pipeline: 'pacbio',
              tags: ['129', '130'],
            },
          }
          pacbioRootStore.tags = {
            129: { id: '129', type: 'tags', oligo: 'TCTGTATCTCTATGTGT', group_id: 'bc1007T' },
            130: { id: '130', type: 'tags', oligo: 'CAGAGAGATATCTCTGT', group_id: 'bc1023T' },
          }

          store.selected.tagSet = {}
          store.selectRequestInSource({ request: '1', source_id: '1' })

          expect(store.used_aliquots['_1'].attributes(attributeKeys)).toEqual({
            source_id: '1',
            tag_id: 129,
            template_prep_kit_box_barcode: 'ABC1',
            volume: 1,
            concentration: 1,
            insert_size: 100,
            request: '1',
            source_type: 'Pacbio::Library',
          })
          expect(store.used_aliquots['_2'].attributes(attributeKeys)).toEqual({
            source_id: '2',
            source_type: 'Pacbio::Request',
            request: '2',
            tag_id: null,
            template_prep_kit_box_barcode: null,
            volume: null,
            concentration: null,
            insert_size: null,
          })
          expect(store.selected.tagSet).toEqual({ id: '3' })
        })

        it('updates library data but not the tag_id when tag_id is present but not part of the selected tag set', () => {
          store.used_aliquots = {
            _2: createUsedAliquot({
              source_id: '2',
              source_type: 'Pacbio::Request',
              request: '2',
              tag_id: null,
              template_prep_kit_box_barcode: null,
              volume: null,
              concentration: null,
              insert_size: null,
            }),
          }
          store.resources.requests = {
            1: {
              id: '1',
            },
          }
          store.resources.libraries = {
            1: {
              id: '1',
              type: 'libraries',
              template_prep_kit_box_barcode: 'ABC1',
              volume: 1,
              concentration: 1,
              insert_size: 100,
              request: '1',
              tag_id: 131,
            },
          }
          pacbioRootStore.tagSets = {
            3: {
              id: '3',
              type: 'tag_sets',
              name: 'Sequel_48_Microbial_Barcoded_OHA_v1',
              uuid: 'c808dbb2-a26b-cfae-0a16-c3e7c3b8d7fe',
              pipeline: 'pacbio',
              tags: ['129', '130'],
            },
            4: {
              id: '4',
              type: 'tag_sets',
              name: 'Sequel_48_Microbial_Barcoded_OHA_v2',
              uuid: 'c808dbb2-a26b-cfae-0a16-c3e7c3b8d7fe',
              pipeline: 'pacbio',
              tags: ['131'],
            },
          }
          pacbioRootStore.tags = {
            129: { id: '129', type: 'tags', oligo: 'TCTGTATCTCTATGTGT', group_id: 'bc1007T' },
            130: { id: '130', type: 'tags', oligo: 'CAGAGAGATATCTCTGT', group_id: 'bc1023T' },
            131: { id: '130', type: 'tags', oligo: 'CAGAGAGATATCTCTGT', group_id: 'bc1023T' },
          }

          rootStore.addMessage = vi.fn()
          store.selectTagSet('3')
          store.selectRequestInSource({ request: '1', source_id: '1' })

          expect(store.used_aliquots['_1'].attributes(attributeKeys)).toEqual({
            source_id: '1',
            tag_id: null,
            template_prep_kit_box_barcode: 'ABC1',
            volume: 1,
            concentration: 1,
            insert_size: 100,
            request: '1',
            source_type: 'Pacbio::Library',
          })
          expect(store.used_aliquots['_2'].attributes(attributeKeys)).toEqual({
            source_id: '2',
            source_type: 'Pacbio::Request',
            request: '2',
            tag_id: null,
            template_prep_kit_box_barcode: null,
            volume: null,
            concentration: null,
            insert_size: null,
          })
          // Adds a warning message to root store
          expect(rootStore.addMessage).toHaveBeenCalledWith({
            message: 'Library tag not populated as bc1023T is not in the selected tag group',
            type: 'warning',
          })
        })
        it('defaults volume in used aliquot to available volume on selecting a request', () => {
          store.used_aliquots = {
            _2: createUsedAliquot({
              source_id: '2',
              source_type: 'Pacbio::Request',
              request: '2',
              tag_id: null,
              template_prep_kit_box_barcode: null,
              volume: null,
              concentration: null,
              insert_size: null,
            }),
          }
          store.resources.requests = {
            1: {
              id: '1',
            },
          }
          store.resources.libraries = {
            1: {
              id: '1',
              type: 'libraries',
              template_prep_kit_box_barcode: 'ABC1',
              volume: 15,
              concentration: 1,
              insert_size: 100,
              request: '1',
              tag_id: null,
              available_volume: 5,
            },
          }
          store.selectRequestInSource({ request: '1', source_id: '1' })
          expect(
            store.used_aliquots['_1'].attributes([...attributeKeys, 'available_volume', 'errors']),
          ).toEqual({
            source_id: '1',
            tag_id: null,
            template_prep_kit_box_barcode: 'ABC1',
            volume: 5,
            concentration: 1,
            insert_size: 100,
            request: '1',
            source_type: 'Pacbio::Library',
            available_volume: 5,
            errors: {},
          })
          expect(store.used_aliquots['_2'].attributes(attributeKeys)).toEqual({
            source_id: '2',
            source_type: 'Pacbio::Request',
            request: '2',
            tag_id: null,
            template_prep_kit_box_barcode: null,
            volume: null,
            concentration: null,
            insert_size: null,
          })
        })

        it('updates volume error in used aliquot when volume is greater than available volume', () => {
          store.used_aliquots = {
            _2: createUsedAliquot({
              source_id: '2',
              source_type: 'Pacbio::Request',
              request: '2',
              tag_id: null,
              template_prep_kit_box_barcode: null,
              volume: null,
              concentration: null,
              insert_size: null,
            }),
          }
          store.resources.requests = {
            1: {
              id: '1',
            },
          }
          store.resources.libraries = {
            1: {
              id: '1',
              type: 'libraries',
              template_prep_kit_box_barcode: 'ABC1',
              volume: 15,
              concentration: 1,
              insert_size: 100,
              request: '1',
              tag_id: null,
              available_volume: 5,
            },
          }
          store.selectRequestInSource({ request: '1', source_id: '1' })
          store.used_aliquots['_1'].volume = 15
          store.updateUsedAliquot(store.used_aliquots['_1'])
          store.validateUsedAliquot(store.used_aliquots['_1'], 'volume')

          expect(
            store.used_aliquots['_1'].attributes([...attributeKeys, 'available_volume', 'errors']),
          ).toEqual({
            source_id: '1',
            tag_id: null,
            template_prep_kit_box_barcode: 'ABC1',
            volume: 15,
            concentration: 1,
            insert_size: 100,
            request: '1',
            source_type: 'Pacbio::Library',
            available_volume: 5,
            errors: { volume: 'must be less or equal to available volume' },
          })
          expect(store.used_aliquots['_2'].attributes(attributeKeys)).toEqual({
            source_id: '2',
            source_type: 'Pacbio::Request',
            request: '2',
            tag_id: null,
            template_prep_kit_box_barcode: null,
            volume: null,
            concentration: null,
            insert_size: null,
          })
        })

        it('does not error in used aliquot when volume is less than available volume', () => {
          store.used_aliquots = {
            _2: createUsedAliquot({
              source_id: '2',
              source_type: 'Pacbio::Request',
              request: '2',
              tag_id: null,
              template_prep_kit_box_barcode: null,
              volume: null,
              concentration: null,
              insert_size: null,
            }),
          }
          store.resources.requests = {
            1: {
              id: '1',
            },
          }
          store.resources.libraries = {
            1: {
              id: '1',
              type: 'libraries',
              template_prep_kit_box_barcode: 'ABC1',
              volume: 1,
              concentration: 1,
              insert_size: 100,
              request: '1',
              tag_id: null,
              available_volume: 5,
            },
          }
          store.selectRequestInSource({ request: '1', source_id: '1' })
          store.used_aliquots['_1'].volume = 1
          store.updateUsedAliquot(store.used_aliquots['_1'])
          store.validateUsedAliquot(store.used_aliquots['_1'], 'volume')

          expect(
            store.used_aliquots['_1'].attributes([...attributeKeys, 'available_volume', 'errors']),
          ).toEqual({
            source_id: '1',
            tag_id: null,
            template_prep_kit_box_barcode: 'ABC1',
            volume: 1,
            concentration: 1,
            insert_size: 100,
            request: '1',
            source_type: 'Pacbio::Library',
            available_volume: 5,
            errors: {},
          })
        })
      })
    })

    describe('selectTagSet', () => {
      it('selects a tag set', () => {
        store.selectTagSet('1')
        expect(store.selected.tagSet).toEqual({ id: '1' })
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
        })
      })
    })
    describe('validateUsedAliquots', () => {
      it('will not set errors if the requested field is valid', () => {
        store.used_aliquots = {
          _2: createUsedAliquot({
            source_id: '2',
            tag_id: null,
            template_prep_kit_box_barcode: 'ABC1',
            volume: 1,
            concentration: 1,
            insert_size: 100,
            request: '1',
            source_type: 'Pacbio::Library',
          }),
        }
        store.validateUsedAliquot(store.used_aliquots['_2'], 'concentration')
        expect(store.used_aliquots['_2'].errors).toEqual({})
      })
      it('will remove if errors exist for the requested field and it is valid', () => {
        store.used_aliquots = {
          _2: createUsedAliquot({
            source_id: '2',
            tag_id: null,
            template_prep_kit_box_barcode: 'ABC1',
            volume: 1,
            concentration: 1,
            insert_size: 100,
            request: '2',
            source_type: 'Pacbio::Library',
            errors: { concentration: ['error'] },
          }),
        }
        store.validateUsedAliquot(store.used_aliquots['_2'], 'concentration')
        expect(store.used_aliquots['_2'].errors).toEqual({})
      })
      it('will add error if the requested field is invalid', () => {
        store.used_aliquots = {
          _2: createUsedAliquot({
            source_id: '2',
            tag_id: null,
            template_prep_kit_box_barcode: 'ABC1',
            volume: 1,
            concentration: 1,
            insert_size: 100,
            request: '2',
            source_type: 'Pacbio::Library',
            errors: { concentration: ['error'] },
          }),
        }
        store.validateUsedAliquot(store.used_aliquots['_2'], 'volume', '')
        expect(store.used_aliquots['_2'].errors).toEqual({
          concentration: ['error'],
          volume: 'must be present',
        })
      })
    })

    describe('validatePoolAttribute', () => {
      it('will not set errors if the requested field is valid', () => {
        store.pool = {
          volume: 0,
          concentration: 1,
          insert_size: 100,
          template_prep_kit_box_barcode: 'ABC1',
        }
        store.validatePoolAttribute('concentration')
        expect(store.pool.errors).toEqual({})
      })
      it('will remove if errors exist for the requested field and it is valid', () => {
        store.pool = {
          volume: 1,
          concentration: 1,
          insert_size: 100,
          template_prep_kit_box_barcode: 'ABC1',
          errors: { concentration: ['error'] },
        }
        store.validatePoolAttribute('concentration')
        expect(store.pool.errors).toEqual({})
      })
      it('will add error if the requested field is invalid', () => {
        store.pool = {
          volume: null,
          concentration: 1,
          insert_size: 100,
          template_prep_kit_box_barcode: 'ABC1',
          errors: { concentration: ['error'] },
        }
        store.validatePoolAttribute('volume')
        expect(store.pool.errors).toEqual({
          concentration: ['error'],
          volume: 'must be present',
        })
      })
      it('will add error if the volume is less than the used_volume', () => {
        store.pool = {
          volume: 2,
          used_volume: 4,
          concentration: 1,
          insert_size: 100,
          template_prep_kit_box_barcode: 'ABC1',
        }
        store.validatePoolAttribute('volume')
        expect(store.pool.errors).toEqual({
          volume: 'must be greater than used volume',
        })
      })
    })
  })
})
