import { Data } from '@support/testHelper'
import actions from '@/store/traction/ont/pools/actions'
import { describe, expect, it } from 'vitest'
import Contracts from './contracts'
import defaultState from '@/store/traction/ont/pools/state'
import { payload } from '@/store/traction/ont/pools/pool'
import { newResponse } from '@/api/ResponseHelper'

describe('actions.js', () => {
  const {
    fetchOntRequests,
    fetchOntPools,
    fetchOntTagSets,
    selectWellRequests,
    deselectPlateAndContents,
    createPool,
    updatePool,
    applyTags,
    updateLibraryFromCsvRecord,
    setPoolData,
    findOntPlate,
    findOntTube,
  } = actions

  describe('fetchOntRequests', () => {
    it('handles success', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { ont: { requests: { get } } } } }
      get.mockResolvedValue(Data.TractionOntRequests)
      // apply action
      const { success } = await actions.fetchOntRequests({ commit, rootState })
      // assert result (Might make sense to pull these into separate tests)
      expect(commit).toHaveBeenCalledWith(
        'setRequests',
        Contracts.requests.populateRequestsParameters,
      )
      expect(success).toEqual(true)
    })

    it('handles failure', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { ont: { requests: { get } } } } }
      get.mockRejectedValue({
        data: { data: [] },
        status: 500,
        statusText: 'Internal Server Error',
      })
      // apply action
      const { success } = await fetchOntRequests({ commit, rootState })
      // assert result (Might make sense to pull these into separate tests)
      expect(commit).not.toHaveBeenCalled()
      expect(success).toEqual(false)
    })
  })

  describe('fetchOntPools', () => {
    it('handles success', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { ont: { pools: { get } } } } }
      get.mockResolvedValue(Data.TractionOntPools)
      // apply action
      const { success } = await actions.fetchOntPools({ commit, rootState })
      // assert result (Might make sense to pull these into separate tests)
      expect(commit).toHaveBeenCalledWith('setPools', Data.TractionOntPools.data.data)
      expect(commit).toHaveBeenCalledWith(
        'populateTubes',
        Data.TractionOntPools.data.included.slice(0, 3),
      )
      expect(commit).toHaveBeenCalledWith(
        'populateTags',
        Data.TractionOntPools.data.included.slice(22, 29),
      )
      expect(commit).toHaveBeenCalledWith(
        'populateLibraries',
        Data.TractionOntPools.data.included.slice(3, 22),
      )
      expect(commit).toHaveBeenCalledWith(
        'populateRequests',
        Data.TractionOntPools.data.included.slice(29, 39),
      )
      expect(success).toEqual(true)
    })

    it('handles failure', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { ont: { pools: { get } } } } }
      get.mockRejectedValue({
        data: { data: [] },
        status: 500,
        statusText: 'Internal Server Error',
      })
      // apply action
      const { success } = await fetchOntPools({ commit, rootState })
      // assert result (Might make sense to pull these into separate tests)
      expect(commit).not.toHaveBeenCalled()
      expect(success).toEqual(false)
    })
  })

  describe('fetchOntTagSets', () => {
    it('handles success', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { ont: { tag_sets: { get } } } } }
      get.mockResolvedValue(Data.TractionOntTagSets)
      // apply action
      const { success } = await fetchOntTagSets({ commit, rootState })
      // assert result
      expect(commit).toHaveBeenCalledWith(
        'populateTagSets',
        Contracts.tagSets.populateTagSetParameters,
      )
      expect(commit).toHaveBeenCalledWith('populateTags', Contracts.tags.populateTagParameters)
      expect(success).toEqual(true)
    })

    it('handles failure', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { ont: { tag_sets: { get } } } } }
      get.mockRejectedValue({
        data: { data: [] },
        status: 500,
        statusText: 'Internal Server Error',
      })
      // apply action
      const { success } = await fetchOntTagSets({ commit, rootState })
      // assert result
      expect(commit).not.toHaveBeenCalled()
      expect(success).toEqual(false)
    })
  })

  describe('selectWellRequests', () => {
    it('selects requests if unselected', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        resources: {
          ...defaultStateObject.resources,
          wells: {
            1: { id: '1', type: 'wells', position: 'A1', requests: ['2'] },
          },
        },
      }
      // apply action
      await selectWellRequests({ commit, state }, '1')
      // assert result
      expect(commit).toHaveBeenCalledWith('selectRequest', { id: '2', selected: true })
    })

    it('deselects requests if selected', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        resources: {
          ...defaultStateObject.resources,
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
      // apply action
      await selectWellRequests({ commit, state }, '1')
      // assert result
      expect(commit).toHaveBeenCalledWith('selectRequest', { id: '2', selected: false })
    })
  })

  describe('deselectPlateAndContents', () => {
    it('selects requests if unselected', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        resources: {
          ...defaultStateObject.resources,
          plates: {
            1: { id: 1, wells: ['10', '20'] },
          },
          wells: {
            10: { id: '1', type: 'wells', position: 'A1', requests: ['100', '300'] },
            20: { id: '1', type: 'wells', position: 'A1', requests: ['200', '400'] },
          },
        },
        selected: {
          ...defaultStateObject.selected,
          requests: {
            100: { id: '100', selected: true },
            300: { id: '300', selected: true },
          },
        },
      }
      // apply action
      await deselectPlateAndContents({ commit, state }, '1')
      // assert result
      expect(commit).toHaveBeenCalledWith('selectPlate', { id: '1', selected: false })
      expect(commit).toHaveBeenCalledWith('selectRequest', { id: '100', selected: false })
      expect(commit).toHaveBeenCalledWith('selectRequest', { id: '300', selected: false })
      // we don't want to select any unselected requests
      expect(commit).not.toHaveBeenCalledWith('selectRequest', { id: '200', selected: true })
    })
  })

  describe('createPool', () => {
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
      //final_library_amount: 100
    }

    // pool should be successfully created
    it('when the pool is valid', async () => {
      // mock response
      const mockResponse = {
        status: '201',
        data: { data: {}, included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1' } }] },
      }
      // mock dependencies
      const create = vi.fn()
      const rootState = { api: { traction: { ont: { pools: { create } } } } }
      const libraries = { 1: library1, 2: library2 }
      create.mockResolvedValue(mockResponse)
      const { success, barcode } = await createPool({
        rootState,
        state: { pooling: { libraries, pool } },
      })
      expect(create).toHaveBeenCalledWith({
        data: payload({ libraries, pool }),
        include: expect.anything(),
      })
      expect(success).toBeTruthy()
      expect(barcode).toEqual('TRAC-1')
    })

    it('when there is an error', async () => {
      // mock response
      const mockResponse = {
        status: '422',
        data: { data: { errors: { error1: ['There was an error'] } } },
      }
      // mock dependencies
      const update = vi.fn(() => Promise.reject({ response: mockResponse }))
      const rootState = { api: { traction: { ont: { pools: { update } } } } }
      const libraries = { 1: library1, 2: library2 }
      const expectedResponse = newResponse({ ...mockResponse, success: false })
      const { success, errors } = await updatePool({
        rootState,
        state: { pooling: { libraries, pool } },
      })
      expect(success).toBeFalsy
      expect(errors).toEqual(expectedResponse.errors)
    })

    // validate libraries fails
    // request is not sent
    // commit is not called
    it('when the pool is invalid', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const create = vi.fn()
      const rootState = { api: { traction: { ont: { pools: { create } } } } }
      const libraries = { 1: library1, 2: { ...library2, concentration: '' } }
      const { success, errors } = await createPool({
        commit,
        rootState,
        state: { pooling: { libraries, pool } },
      })
      expect(create).not.toHaveBeenCalled()
      expect(success).toBeFalsy()
      expect(errors).toEqual('The pool is invalid')
    })
  })

  describe('updatePool', () => {
    const library1 = {
      id: '10',
      ont_request_id: '1',
      tag_id: '1',
      kit_barcode: 'ABC1',
      volume: 1,
      concentration: 1,
      insert_size: 100,
    }

    const library2 = {
      id: '20',
      ont_request_id: '2',
      tag_id: '2',
      kit_barcode: 'ABC1',
      volume: 1,
      concentration: 1,
      insert_size: 100,
    }

    const pool = {
      id: '1',
      kit_barcode: 'ABC1',
      volume: 1,
      concentration: 1,
      insert_size: 100,
    }

    // pool should be successfully created
    it('when the pool is valid', async () => {
      // mock response
      const mockResponse = {
        status: '201',
        data: { data: {}, included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1' } }] },
      }
      // mock dependencies
      const update = vi.fn()
      const rootState = { api: { traction: { ont: { pools: { update } } } } }
      const libraries = { 1: library1, 2: library2 }
      update.mockResolvedValue(mockResponse)
      const { success } = await updatePool({ rootState, state: { pooling: { libraries, pool } } })
      expect(update).toHaveBeenCalledWith(payload({ libraries, pool }))
      expect(success).toBeTruthy()
    })

    it('when there is an error', async () => {
      // mock response
      const mockResponse = {
        status: '422',
        data: { data: { errors: { error1: ['There was an error'] } } },
      }
      // mock dependencies
      const update = vi.fn(() => Promise.reject({ response: mockResponse }))
      const rootState = { api: { traction: { ont: { pools: { update } } } } }
      const libraries = { 1: library1, 2: library2 }
      const expectedResponse = newResponse({ ...mockResponse, success: false })
      const { success, errors } = await updatePool({
        rootState,
        state: { pooling: { libraries, pool } },
      })
      expect(success).toBeFalsy
      expect(errors).toEqual(expectedResponse.errors)
    })

    // validate libraries fails
    // request is not sent
    // commit is not called
    it('when the pool is invalid', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const update = vi.fn()
      const rootState = { api: { traction: { ont: { pools: { update } } } } }
      const libraries = { 1: library1, 2: { ...library2, concentration: '' } }
      const { success, errors } = await updatePool({
        commit,
        rootState,
        state: { pooling: { libraries, pool } },
      })
      expect(update).not.toHaveBeenCalled()
      expect(success).toBeFalsy()
      expect(errors).toEqual('The pool is invalid')
    })
  })

  describe('applyTags', () => {
    const state = Data.OntAutoTagStore
    const library = { ont_request_id: '13', tag_id: '385' } // Starting in E2

    it('applies a single tag when autoTag is false', async () => {
      const commit = vi.fn()
      const autoTag = false

      await applyTags({ commit, state }, { library, autoTag })
      // Update the changed well
      expect(commit).toHaveBeenCalledWith('updatePoolingLibrary', {
        ont_request_id: '13',
        tag_id: '385',
      })
      // But nothing else
      expect(commit).toHaveBeenCalledTimes(1)

      // We don't update higher up requests
      expect(commit).not.toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({ ont_request_id: '3' }),
      )
    })

    it('applies tags to wells on the same plate with a higher column index when autoTag is true', async () => {
      const commit = vi.fn()
      const autoTag = true

      await applyTags({ state, commit }, { library, autoTag })

      // Update the changed well
      expect(commit).toHaveBeenCalledWith('updatePoolingLibrary', {
        ont_request_id: '13',
        tag_id: '385',
      })

      // We don't update earlier wells
      expect(commit).not.toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({
          ont_request_id: '3',
        }),
      )

      // We don't update unselected wells
      expect(commit).not.toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({
          ont_request_id: '1', // A1
        }),
      )

      // We update wells further down the plate
      expect(commit).toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({
          ont_request_id: '14', //F2
          tag_id: '386',
        }),
      )

      // We update wells in the next column
      expect(commit).toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({
          ont_request_id: '17', // A4
          tag_id: '389',
        }),
      )

      // But not another plate
      expect(commit).not.toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({
          ont_request_id: '61', //B1
        }),
      )

      // or a tube
      expect(commit).not.toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({
          ont_request_id: '192', // a tube
        }),
      )

      // In total we expect to update wells in this case
      expect(commit).toHaveBeenCalledTimes(5)
    })

    it('applies tags to tubes with a higher index when autoTag is true', async () => {
      const commit = vi.fn()
      const autoTag = true
      const library = { ont_request_id: '193', tag_id: '385' }

      const selectedRequests = Object.values(state.pooling.libraries).map(
        ({ ont_request_id }) => state.resources.requests[ont_request_id],
      )

      await applyTags({ commit, state, getters: { selectedRequests } }, { library, autoTag })

      // Update the changed tube request
      expect(commit).toHaveBeenCalledWith('updatePoolingLibrary', {
        ont_request_id: '193',
        tag_id: '385',
      })

      // We don't update earlier wells
      expect(commit).not.toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({
          ont_request_id: '13',
        }),
      )

      // We don't update earlier tubes
      expect(commit).not.toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({
          ont_request_id: '192',
        }),
      )

      // We don't update unselected wells
      expect(commit).not.toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({
          ont_request_id: '1',
        }),
      )

      // We do update tubes with higher ids
      expect(commit).toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({
          ont_request_id: '194',
          tag_id: '386',
        }),
      )

      // In total we expect to update 2 tubes in this case
      expect(commit).toHaveBeenCalledTimes(2)
    })
  })

  describe('updateLibraryFromCsvRecord', () => {
    const state = Data.OntAutoTagStore
    const info = {
      lines: 3,
      records: 2,
    }
    const getters = {
      selectedTagSet: {
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
      },
    }

    it('updates the corresponding library', async () => {
      const commit = vi.fn()
      const record = {
        source: 'GEN-1668092750-1:C1',
        tag: 'NB03',
        insert_size: 12345,
        concentration: 10,
        volume: 20,
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({
          ont_request_id: '3',
          tag_id: '387',
          insert_size: 12345,
          concentration: 10,
          volume: 20,
        }),
      )
    })

    it('updates the corresponsing library for tubes', async () => {
      const commit = vi.fn()
      const record = {
        source: 'GEN-1668092750-5',
        tag: 'NB03',
        insert_size: 12345,
        concentration: 10,
        volume: 20,
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'updatePoolingLibrary',
        expect.objectContaining({
          ont_request_id: '193',
          tag_id: '387',
          insert_size: 12345,
          concentration: 10,
          volume: 20,
        }),
      )
    })

    it('records an error when source is missing', async () => {
      const commit = vi.fn()
      const record = {
        tag: 'NB03',
        insert_size: 12345,
        concentration: 10,
        volume: 20,
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'traction/addMessage',
        {
          type: 'danger',
          message: 'Library 2 on line 3: has no source',
        },
        { root: true },
      )
    })

    it('records an error when the plate cant be found', async () => {
      const commit = vi.fn()
      const record = {
        source: 'GEN-1111111111-1:A1',
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'traction/addMessage',
        {
          type: 'danger',
          message:
            'Library 2 on line 3: GEN-1111111111-1 could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.',
        },
        { root: true },
      )
    })

    it('records an error when the well cant be found', async () => {
      const commit = vi.fn()
      const record = {
        source: 'GEN-1668092750-1:X1',
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'traction/addMessage',
        {
          type: 'danger',
          message: 'Library 2 on line 3: A well named X1 could not be found on GEN-1668092750-1',
        },
        { root: true },
      )
    })

    it('records an error when the tag cant be found', async () => {
      const commit = vi.fn()
      const record = {
        source: 'GEN-1668092750-2:B1',
        tag: 'NB100',
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'traction/addMessage',
        {
          type: 'danger',
          message: 'Library 2 on line 3: Could not find a tag named NB100 in selected tag group',
        },
        { root: true },
      )
    })

    it('flags the plate as selected', async () => {
      const commit = vi.fn()
      const record = {
        source: 'GEN-1668092750-1:A1',
        tag: 'NB01',
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith('selectPlate', {
        id: '1',
        selected: true,
      })
    })

    it('notifies of request addition', async () => {
      const commit = vi.fn()
      const record = {
        source: 'GEN-1668092750-1:F1',
        tag: 'NB03',
        insert_size: 12345,
        concentration: 10,
        volume: 20,
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'traction/addMessage',
        {
          type: 'info',
          message: 'Library 2 on line 3: Added GEN-1668092750-1:F1 to pool',
        },
        { root: true },
      )
    })

    it('does not notify of request updates', async () => {
      const commit = vi.fn()
      const record = {
        // source: '',
        insert_size: 12345,
        concentration: 10,
        volume: 20,
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).not.toHaveBeenCalledWith(
        'traction/addMessage',
        {
          type: 'info',
          message: 'Library 2 on line 3: Added ... to pool.',
        },
        { root: true },
      )
    })
  })

  describe('setPoolData', () => {
    it('sets the pool data for the given pool id', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const find = vi.fn()
      const rootState = { api: { traction: { ont: { pools: { find } } } } }
      find.mockResolvedValue(Data.TractionOntPool)
      // apply action
      const { success } = await setPoolData({ commit, rootState }, 3)

      // assert result
      expect(commit).toHaveBeenCalledWith('clearPoolData')
      expect(commit).toHaveBeenCalledWith('populatePoolAttributes', Data.TractionOntPool.data.data)
      expect(commit).toHaveBeenCalledWith(
        'populatePoolingLibraries',
        Data.TractionOntPool.data.included.slice(0, 2),
      )
      expect(commit).toHaveBeenCalledWith(
        'populatePoolingTube',
        Data.TractionOntPool.data.included.slice(-1)[0],
      )
      expect(commit).toHaveBeenCalledWith(
        'populateRequests',
        Data.TractionOntPool.data.included.slice(101, 196),
      )
      expect(commit).toHaveBeenCalledWith(
        'populateWells',
        Data.TractionOntPool.data.included.slice(6, 101),
      )
      expect(commit).toHaveBeenCalledWith(
        'populatePlates',
        Data.TractionOntPool.data.included.slice(5, 6),
      )
      expect(commit).toHaveBeenCalledWith(
        'populateTubes',
        Data.TractionOntPool.data.included.slice(-1),
      )
      expect(commit).toHaveBeenCalledWith(
        'selectTagSet',
        Data.TractionOntPool.data.included.slice(4, 5)[0],
      )

      expect(success).toEqual(true)
    })

    it('only clears the pool data when the id is not a number', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const find = vi.fn()
      const rootState = { api: { traction: { ont: { pools: { find } } } } }
      find.mockResolvedValue(Data.TractionOntPool)

      const { success, errors } = await setPoolData({ commit, rootState }, 'new')
      expect(commit).toHaveBeenLastCalledWith('clearPoolData')

      expect(success).toEqual(true)
      expect(errors).toEqual([])
    })
  })

  describe('findOntPlate', () => {
    it('returns the plate that fits the valid plate barcode', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { ont: { plates: { get } } } } }

      get.mockResolvedValue(Data.OntPlateRequest)

      const { success } = await findOntPlate({ commit, rootState }, { barcode: 'GEN-1668092750-1' })

      expect(commit).toHaveBeenCalledWith('selectPlate', { id: '1', selected: true })
      expect(commit).toHaveBeenCalledWith('populatePlates', Data.OntPlateRequest.data.data)
      expect(commit).toHaveBeenCalledWith(
        'populateWells',
        Data.OntPlateRequest.data.included.slice(0, 8),
      )
      expect(commit).toHaveBeenCalledWith(
        'populateRequests',
        Data.OntPlateRequest.data.included.slice(8, 16),
      )

      expect(success).toEqual(true)
    })

    it('returns an error and an empty list when plate barcode cannot be found', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { ont: { plates: { get } } } } }

      get.mockResolvedValue({ data: { data: [] } })

      const { success, errors } = await findOntPlate(
        { commit, rootState },
        { barcode: 'fake-barcode' },
      )
      expect(errors).toEqual(['Unable to find plate with barcode: fake-barcode'])
      expect(success).toEqual(false)
    })

    it('returns an error and an empty list when plate barcode is not provided', async () => {
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { ont: { plates: { get } } } } }

      const { success, errors } = await findOntPlate({ commit, rootState }, { barcode: '' })
      expect(errors).toEqual(['Please provide a plate barcode'])
      expect(success).toEqual(false)
    })
  })

  describe('findOntTube', () => {
    it('returns the tube that fits the valid tube barcode', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { ont: { tubes: { get } } } } }

      get.mockResolvedValue(Data.OntTubeRequest)

      const { success } = await findOntTube({ commit, rootState }, { barcode: 'GEN-1668092750-4' })

      expect(commit).toHaveBeenCalledWith('selectTube', { id: '2', selected: true })
      expect(commit).toHaveBeenCalledWith('populateTubes', Data.OntTubeRequest.data.data)
      expect(commit).toHaveBeenCalledWith(
        'populateRequests',
        Data.OntTubeRequest.data.included.slice(0, 1),
      )

      expect(success).toEqual(true)
    })

    it('returns an error and an empty list when tube barcode cannot be found', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { ont: { tubes: { get } } } } }

      get.mockResolvedValue({ data: { data: [] } })

      const { success, errors } = await findOntTube(
        { commit, rootState },
        { barcode: 'fake-barcode' },
      )
      expect(errors).toEqual(['Unable to find tube with barcode: fake-barcode'])
      expect(success).toEqual(false)
    })

    it('returns an error and an empty list when tube barcode is not provided', async () => {
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { ont: { tubes: { get } } } } }

      const { success, errors } = await findOntTube({ commit, rootState }, { barcode: '' })
      expect(errors).toEqual(['Please provide a tube barcode'])
      expect(success).toEqual(false)
    })
  })
})
