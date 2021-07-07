import { Data } from 'testHelper'
import actions from '@/store/traction/pacbio/poolCreate/actions'
import defaultState from '@/store/traction/pacbio/poolCreate/state'

describe('actions.js', () => {
  const { fetchPacbioPlates, fetchPacbioTagSets, selectWellRequests } = actions

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
        selected: {
          ...defaultStateObject.selected,
          requests: {
            2: { id: '2', selected: true },
          },
        },
      }
      // apply action
      await selectWellRequests({ commit, state }, '1')
      // assert result
      expect(commit).toHaveBeenCalledWith('selectRequest', { id: '2', selected: false })
    })
  })
})
