import { Data } from 'testHelper'
import actions from '@/store/traction/pacbio/poolCreate/actions'
import defaultState from '@/store/traction/pacbio/poolCreate/state'
import Response from '@/api/Response'

describe('actions.js', () => {
  const {
    fetchPacbioPlates,
    fetchPacbioTagSets,
    selectWellRequests,
    deselectPlateAndContents,
    createPool,
  } = actions

  it('fetchPacbioPlates', async () => {
    // mock commit
    const commit = jest.fn()
    // mock dependencies
    const get = jest.fn()
    const rootState = { api: { traction: { pacbio: { plates: { get } } } } }
    get.mockReturnValue(Data.PacbioPlatesRequest)
    // apply action
    await fetchPacbioPlates({ commit, rootState })
    // assert result (Might make sense to pull these into separate tests)
    expect(commit).toHaveBeenCalledWith('populatePlates', Data.PacbioPlatesRequest.data.data)
    expect(commit).toHaveBeenCalledWith(
      'populateWells',
      Data.PacbioPlatesRequest.data.included.slice(0, 4),
    )
    expect(commit).toHaveBeenCalledWith(
      'populateRequests',
      Data.PacbioPlatesRequest.data.included.slice(4, 8),
    )
  })

  it('fetchPacbioTagSets', async () => {
    // mock commit
    const commit = jest.fn()
    // mock dependencies
    const get = jest.fn()
    const rootState = { api: { traction: { pacbio: { tag_sets: { get } } } } }
    get.mockReturnValue(Data.PacbioTagSets)
    // apply action
    await fetchPacbioTagSets({ commit, rootState })
    // assert result
    expect(commit).toHaveBeenCalledWith('populateTagSets', Data.PacbioTagSets.data.data)
    expect(commit).toHaveBeenCalledWith('populateTags', Data.PacbioTagSets.data.included)
  })

  describe('selectWellRequests', () => {
    it('selects requests if unselected', async () => {
      // mock commit
      const commit = jest.fn()
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
      const commit = jest.fn()
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
      const commit = jest.fn()
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

  describe('createPool', async () => {
    const library1 = {
      pacbio_request_id: '1',
      tag_id: '1',
      template_prep_kit_box_barcode: 'ABC1',
      volume: 1,
      concentration: 1,
      fragment_size: 100,
    }

    const library2 = {
      pacbio_request_id: '2',
      tag_id: '2',
      template_prep_kit_box_barcode: 'ABC1',
      volume: 1,
      concentration: 1,
      fragment_size: 100,
    }

    // pool should be successfully created
    // for now: create a pool state with a simple success message
    it('when the pool is valid', async () => {
      const mockResponse = { status: '201', data: { data: { id: 1 } } }
      const commit = jest.fn()
      const create = jest.fn()
      const rootState = { api: { traction: { pacbio: { pools: { create } } } } }
      const libraries = { _1: library1, _2: library2 }
      create.mockReturnValue(mockResponse)
      const response = new Response(mockResponse)
      await createPool({ commit, rootState, state: { libraries } })
      expect(commit).toHaveBeenCalledWith('populateResult', response)
    })

    it.skip('when there is an error', () => {})

    // validate libraries fails
    // request is not sent
    // commit is not called
    it('when the pool is invalid', async () => {
      const commit = jest.fn()
      const create = jest.fn()
      const rootState = { api: { traction: { pacbio: { pools: { create } } } } }
      const libraries = { _1: library1, _2: { ...library2, tag_id: '' } }
      await createPool({ commit, rootState, state: { libraries } })
      expect(commit).not.toHaveBeenCalledWith('populateResult')
    })
  })
})
