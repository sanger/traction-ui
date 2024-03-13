import { Data } from '@support/testHelper'
import actions from '@/store/traction/pacbio/poolCreate/actions'
import defaultState from '@/store/traction/pacbio/poolCreate/state'
import { newResponse } from '@/api/ResponseHelper'
import { payload } from '@/store/traction/pacbio/poolCreate/pool'

// dpl_989_ui feature flag is used to generate pool payload so we mock it
vi.mock('@/api/FeatureFlag', () => ({
  checkFeatureFlag: vi.fn().mockReturnValue(false),
}))

describe('actions.js', () => {
  const {
    fetchPacbioTagSets,
    selectWellRequests,
    deselectPlateAndContents,
    deselectTubeAndContents,
    selectTubeAndContents,
    createPool,
    updatePool,
    populateLibrariesFromPool,
    applyTags,
    updateLibraryFromCsvRecord,
    findPacbioPlate,
    findPacbioTube,
  } = actions

  // handles success and failure are switched - fix after asking
  describe('fetchPacbioTagSets', () => {
    it('handles success', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { pacbio: { tag_sets: { get } } } } }
      get.mockResolvedValue(Data.PacbioTagSets)
      // apply action
      const { success } = await fetchPacbioTagSets({ commit, rootState })
      // assert result
      expect(commit).toHaveBeenCalledWith('populateTagSets', Data.PacbioTagSets.data.data)
      expect(commit).toHaveBeenCalledWith('populateTags', Data.PacbioTagSets.data.included)
      expect(success).toEqual(true)
    })

    it('handles failure', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { pacbio: { tag_sets: { get } } } } }
      get.mockRejectedValue({
        data: { data: [] },
        status: 500,
        statusText: 'Internal Server Error',
      })
      // apply action
      const { success } = await fetchPacbioTagSets({ commit, rootState })
      // assert result
      expect(commit).not.toHaveBeenCalled()
      expect(success).toEqual(false)
    })
  })

  describe('populateLibrariesFromPool', () => {
    it('handles success', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const find = vi.fn()
      const rootState = { api: { traction: { pacbio: { pools: { find } } } } }
      find.mockResolvedValue(Data.TractionPacbioPoolV1)
      // apply action
      const { success } = await populateLibrariesFromPool({ commit, rootState })

      // assert result (Might make sense to pull these into separate tests)
      expect(commit).toHaveBeenCalledWith(
        'populatePoolAttributes',
        Data.TractionPacbioPoolV1.data.data,
      )
      expect(commit).toHaveBeenCalledWith(
        'populateLibraries',
        Data.TractionPacbioPoolV1.data.included.slice(0, 1),
      )
      expect(commit).toHaveBeenCalledWith(
        'populateRequests',
        Data.TractionPacbioPoolV1.data.included.slice(100, 148),
      )
      expect(commit).toHaveBeenCalledWith(
        'populateWells',
        Data.TractionPacbioPoolV1.data.included.slice(4, 100),
      )
      expect(commit).toHaveBeenCalledWith(
        'populatePlates',
        Data.TractionPacbioPoolV1.data.included.slice(3, 4),
      )
      expect(commit).toHaveBeenCalledWith('selectTagSet', expect.objectContaining({ id: '1' }))

      expect(commit).toHaveBeenCalledWith(
        'selectPlate',
        expect.objectContaining({ id: '1', selected: true }),
      )

      expect(commit).toHaveBeenCalledWith(
        'populatePoolTube',
        Data.TractionPacbioPoolV1.data.included.slice(-1)[0],
      )

      expect(success).toEqual(true)
    })

    it('handles failure', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const find = vi.fn()
      const rootState = { api: { traction: { pacbio: { pools: { find } } } } }
      find.mockRejectedValue({
        data: { data: [] },
        status: 500,
        statusText: 'Internal Server Error',
      })
      // apply action
      const { success } = await populateLibrariesFromPool({ commit, rootState })
      // assert result (Might make sense to pull these into separate tests)
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
        libraries: {
          _2: { pacbio_request_id: '2' },
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
            _100: { id: '100', selected: true },
            _300: { id: '300', selected: true },
          },
        },
      }
      // apply action
      await deselectPlateAndContents({ commit, state }, '1')
      // assert result
      expect(commit).toHaveBeenCalledWith('selectPlate', { id: '1', selected: false })
      expect(commit).toHaveBeenCalledWith('selectRequest', { id: '100', selected: false })
      expect(commit).toHaveBeenCalledWith('selectRequest', { id: '300', selected: false })
      // We don't want to select any unselected requests
      expect(commit).not.toHaveBeenCalledWith('selectRequest', { id: '200', selected: true })
    })
  })

  describe('deselectTubeAndContents', () => {
    it('deselects requests if unselected', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        resources: {
          ...defaultStateObject.resources,
          tubes: {
            1: { id: 1, barcode: 'tube-1', requests: ['100', '300'] },
            2: { id: 2, barcode: 'tube-2', requests: ['200', '400'] },
          },
        },
        selected: {
          ...defaultStateObject.selected,
          requests: {
            _100: { id: '100', selected: true },
            _300: { id: '300', selected: true },
          },
        },
      }
      // apply action
      await deselectTubeAndContents({ commit, state }, 'tube-1')
      // assert result
      expect(commit).toHaveBeenCalledWith('selectTube', { id: 1, selected: false })
      expect(commit).toHaveBeenCalledWith('selectRequest', { id: '100', selected: false })
      expect(commit).toHaveBeenCalledWith('selectRequest', { id: '300', selected: false })
      // We don't want to select any unselected requests
      expect(commit).not.toHaveBeenCalledWith('selectRequest', { id: '200', selected: true })
    })
  })

  describe('selectTubeAndContents', () => {
    it('selects requests if unselected', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        resources: {
          ...defaultStateObject.resources,
          tubes: {
            1: { id: 1, requests: ['100', '300'] },
            2: { id: 2, requests: ['200', '400'] },
          },
        },
        selected: {
          ...defaultStateObject.selected,
          requests: {
            _100: { id: '100', selected: true },
            _300: { id: '300', selected: true },
          },
        },
      }
      // apply action
      await selectTubeAndContents({ commit, state }, '1')
      // assert result
      expect(commit).toHaveBeenCalledWith('selectTube', { id: '1', selected: true })
      expect(commit).toHaveBeenCalledWith('selectRequest', { id: '100', selected: true })
      expect(commit).toHaveBeenCalledWith('selectRequest', { id: '300', selected: true })
      // We don't want to select any unselected requests
      expect(commit).not.toHaveBeenCalledWith('selectRequest', { id: '200', selected: true })
    })
  })

  describe('createPool', () => {
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
      const create = vi.fn()
      const rootState = { api: { traction: { pacbio: { pools: { create } } } } }
      const libraries = { _1: library1, _2: library2 }
      create.mockResolvedValue(mockResponse)
      const { success, barcode } = await createPool({ rootState, state: { libraries, pool } })
      expect(create).toHaveBeenCalledWith({
        data: await payload({ libraries, pool }),
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
      const create = vi.fn()
      const rootState = { api: { traction: { pacbio: { pools: { create } } } } }
      const libraries = { _1: library1, _2: library2 }
      create.mockRejectedValue({ response: mockResponse })
      const expectedResponse = newResponse({ ...mockResponse, success: false })
      const { success, errors } = await createPool({ rootState, state: { libraries, pool } })
      expect(success).toBeFalsy()
      expect(errors).toEqual(expectedResponse.errors)
    })

    // validate libraries fails
    // request is not sent
    // commit is not called
    it('when the pool is invalid', async () => {
      const commit = vi.fn()
      const create = vi.fn()
      const rootState = { api: { traction: { pacbio: { pools: { create } } } } }
      const libraries = { _1: library1, _2: { ...library2, concentration: '' } }
      const { success, errors } = await createPool({
        commit,
        rootState,
        state: { libraries, pool },
      })
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

    // pool should be successfully created
    // for now: create a pool state with a simple success message
    it('when the pool is valid', async () => {
      const mockResponse = {
        status: '201',
        data: { data: {}, included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1' } }] },
      }
      const update = vi.fn()
      const rootState = { api: { traction: { pacbio: { pools: { update } } } } }
      const libraries = { _1: library1, _2: library2 }
      update.mockResolvedValue(mockResponse)
      const { success } = await updatePool({ rootState, state: { libraries, pool } })
      expect(update).toHaveBeenCalledWith(await payload({ libraries, pool }))
      expect(success).toBeTruthy()
    })

    it('when there is an error', async () => {
      const mockResponse = {
        status: '422',
        data: { data: { errors: { error1: ['There was an error'] } } },
      }
      const update = vi.fn(() => Promise.reject({ response: mockResponse }))
      const rootState = { api: { traction: { pacbio: { pools: { update } } } } }
      const libraries = { _1: library1, _2: library2 }
      const expectedResponse = newResponse({ ...mockResponse, success: false })
      const { success, errors } = await updatePool({ rootState, state: { libraries, pool } })
      expect(success).toBeFalsy()
      expect(errors).toEqual(expectedResponse.errors)
    })

    // validate libraries fails
    // request is not sent
    // commit is not called
    it('when the pool is invalid', async () => {
      const commit = vi.fn()
      const update = vi.fn()
      const rootState = { api: { traction: { pacbio: { pools: { update } } } } }
      const libraries = { _1: library1, _2: { ...library2, concentration: '' } }
      const { success, errors } = await updatePool({
        commit,
        rootState,
        state: { libraries, pool },
      })
      expect(update).not.toHaveBeenCalled()
      expect(success).toBeFalsy()
      expect(errors).toEqual('The pool is invalid')
    })
  })

  describe('applyTags', () => {
    const state = Data.AutoTagStoreV1
    // Starting in B1
    const library = { pacbio_request_id: '13', tag_id: '130' }

    it('applies a single tag when autoTag is false', async () => {
      const commit = vi.fn()
      // Starting in B1
      const autoTag = false

      await applyTags({ commit, state }, { library, autoTag })
      // We update the changed well
      expect(commit).toHaveBeenCalledWith('updateLibrary', {
        pacbio_request_id: '13',
        tag_id: '130',
      })
      // But nothing else
      expect(commit).toHaveBeenCalledTimes(1)

      // We don't update earlier wells
      expect(commit).not.toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({ pacbio_request_id: '1' }),
      )
    })

    it('applies tags to wells on the same plate with a higher column index when autoTag is true', async () => {
      const commit = vi.fn()
      const autoTag = true

      await applyTags(
        {
          commit,
          state,
        },
        {
          library,
          autoTag,
        },
      )

      // We update the changed well
      expect(commit).toHaveBeenCalledWith('updateLibrary', {
        pacbio_request_id: '13',
        tag_id: '130',
      })

      // We don't update earlier wells
      expect(commit).not.toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          pacbio_request_id: '1',
        }),
      )
      // We don't update unselected wells
      expect(commit).not.toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          pacbio_request_id: '25', // C1
        }),
      )
      // We do update wells further down the plate
      expect(commit).toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          pacbio_request_id: '37', // D1
          tag_id: '132',
        }),
      )
      // Including the next column
      expect(commit).toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          pacbio_request_id: '2', // A2
          tag_id: '137',
        }),
      )
      // But not another plate
      expect(commit).not.toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          pacbio_request_id: '61', // B1
        }),
      )
      expect(commit).not.toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          pacbio_request_id: '73', // C1
        }),
      )
      // or a tube
      expect(commit).not.toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          pacbio_request_id: '96',
        }),
      )
      expect(commit).not.toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          pacbio_request_id: '97',
        }),
      )

      // In total we expect to update 8 wells in this case
      expect(commit).toHaveBeenCalledTimes(6)
    })

    it('applies tags to tubes with a higher index when autoTag is true', async () => {
      const commit = vi.fn()
      const autoTag = true
      const library = { pacbio_request_id: '98', tag_id: '130' }

      const selectedRequests = Object.values(state.libraries).map(
        ({ pacbio_request_id }) => state.resources.requests[pacbio_request_id],
      )
      await applyTags(
        {
          commit,
          state,
          getters: {
            selectedRequests,
          },
        },
        {
          library,
          autoTag,
        },
      )

      // We update the changed well
      expect(commit).toHaveBeenCalledWith('updateLibrary', {
        pacbio_request_id: '98',
        tag_id: '130',
      })

      // We don't update earlier wells
      expect(commit).not.toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          pacbio_request_id: '1',
        }),
      )

      // We don't update earlier tubes
      expect(commit).not.toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          pacbio_request_id: '97',
        }),
      )
      // We don't update unselected wells
      expect(commit).not.toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          pacbio_request_id: '25', // C1
        }),
      )
      // We do update tubes with higher ids
      expect(commit).toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          pacbio_request_id: '99', // D1
          tag_id: '131',
        }),
      )

      // In total we expect ot update 2 tubes in this case
      expect(commit).toHaveBeenCalledTimes(2)
    })
  })

  describe('updateLibraryFromCsvRecord', () => {
    const state = Data.AutoTagStoreV1
    const info = {
      lines: 3,
      records: 2,
    }
    const getters = {
      selectedTagSet: {
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

    it('updates the corresponding library', async () => {
      const commit = vi.fn()
      const record = {
        source: 'DN1:A10',
        tag: 'bc1024T',
        genome_size: 6.3,
        insert_size: 15230,
        concentration: 13,
        volume: 15,
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'updateLibrary',
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
      const commit = vi.fn()
      const record = {
        source: 'TRAC-2-2',
        tag: 'bc1024T',
        genome_size: 6.3,
        insert_size: 15230,
        concentration: 13,
        volume: 15,
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'updateLibrary',
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
      const commit = vi.fn()
      const record = {
        tag: 'bc1024T',
        genome_size: 6.3,
        insert_size: 15230,
        concentration: 13,
        volume: 15,
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
        source: 'DN34:A10',
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'traction/addMessage',
        {
          type: 'danger',
          message:
            'Library 2 on line 3: DN34 could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.',
        },
        { root: true },
      )
    })

    it('records an error when the well cant be found', async () => {
      const commit = vi.fn()
      const record = {
        source: 'DN1:X13',
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'traction/addMessage',
        {
          type: 'danger',
          message: 'Library 2 on line 3: A well named X13 could not be found on DN1',
        },
        { root: true },
      )
    })

    it('records an error when the tag cant be found', async () => {
      const commit = vi.fn()
      const record = {
        source: 'DN1:A1',
        tag: 'bc1001_BAK8A_OA',
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'traction/addMessage',
        {
          type: 'danger',
          message:
            'Library 2 on line 3: Could not find a tag named bc1001_BAK8A_OA in selected tag group',
        },
        { root: true },
      )
    })

    it('flags the plate as selected', async () => {
      const commit = vi.fn()
      const record = {
        source: 'DN1:A1',
        tag: 'bc1001_BAK8A_OA',
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
        source: 'DN1:A3',
        tag: 'bc1024T',
        genome_size: 6.3,
        insert_size: 15230,
        concentration: 13,
        volume: 15,
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).toHaveBeenCalledWith(
        'traction/addMessage',
        {
          type: 'info',
          message: 'Library 2 on line 3: Added DN1:A3 to pool',
        },
        { root: true },
      )
    })

    it('does not notifies of request update', async () => {
      const commit = vi.fn()
      const record = {
        source: 'DN1:A1',
        genome_size: 6.3,
        insert_size: 15230,
        concentration: 13,
        volume: 15,
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

      expect(commit).not.toHaveBeenCalledWith(
        'traction/addMessage',
        {
          type: 'info',
          message: 'Library 2 on line 3: Added DN1:A1 to pool',
        },
        { root: true },
      )
    })
  })

  describe('findPacbioPlate', () => {
    it('returns the plate that fits the valid plate barcode', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { pacbio: { plates: { get } } } } }

      get.mockResolvedValue(Data.PacbioPlateRequest)

      const { success } = await findPacbioPlate(
        { commit, rootState },
        { barcode: 'GEN-1680611780-1' },
      )

      expect(commit).toHaveBeenCalledWith('selectPlate', { id: '1', selected: true })
      expect(commit).toHaveBeenCalledWith('populatePlates', Data.PacbioPlateRequest.data.data)
      expect(commit).toHaveBeenCalledWith(
        'populateWells',
        Data.PacbioPlateRequest.data.included.slice(0, 8),
      )
      expect(commit).toHaveBeenCalledWith(
        'populateRequests',
        Data.PacbioPlateRequest.data.included.slice(8, 16),
      )

      expect(success).toEqual(true)
    })

    it('returns an error and an empty list when plate barcode cannot be found', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { pacbio: { plates: { get } } } } }

      get.mockResolvedValue({ data: { data: [] } })

      const { success, errors } = await findPacbioPlate(
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
      const rootState = { api: { traction: { pacbio: { plates: { get } } } } }

      const { success, errors } = await findPacbioPlate({ commit, rootState }, { barcode: '' })
      expect(errors).toEqual(['Please provide a plate barcode'])
      expect(success).toEqual(false)
    })
  })

  describe('findPacbioTube', () => {
    it('returns the tube that fits the valid tube barcode', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { pacbio: { tubes: { get } } } } }

      get.mockResolvedValue(Data.PacbioTubeRequest)

      const { success } = await findPacbioTube(
        { commit, rootState },
        { barcode: 'GEN-1680611780-6' },
      )

      expect(commit).toHaveBeenCalledWith('selectTube', { id: '1', selected: true })
      expect(commit).toHaveBeenCalledWith('populateTubes', Data.PacbioTubeRequest.data.data)
      expect(commit).toHaveBeenCalledWith(
        'populateRequests',
        Data.PacbioTubeRequest.data.included.slice(0, 1),
      )

      expect(success).toEqual(true)
    })

    it('returns an error and an empty list when tube barcode cannot be found', async () => {
      // mock commit
      const commit = vi.fn()
      // mock dependencies
      const get = vi.fn()
      const rootState = { api: { traction: { pacbio: { tubes: { get } } } } }

      get.mockResolvedValue({ data: { data: [] } })

      const { success, errors } = await findPacbioTube(
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
      const rootState = { api: { traction: { pacbio: { tubes: { get } } } } }

      const { success, errors } = await findPacbioTube({ commit, rootState }, { barcode: '' })
      expect(errors).toEqual(['Please provide a tube barcode'])
      expect(success).toEqual(false)
    })
  })
})
