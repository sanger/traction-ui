import { Data } from '../../../../testHelper'
import actions from '@/store/traction/pacbio/poolCreate/actions'

describe('actions.js', () => {
  const {
    fetchPacbioPlates,
    fetchPacbioTagSets
  } = actions

  it('fetchPacbioPlates', async () => {
    // mock commit
    const commit = jest.fn()
    // mock dependencies
    const get = jest.fn()
    const rootState = { api: { traction: { pacbio: { plates: { get } } } } }
    get.mockReturnValue(Data.PacbioPlatesRequest)
    // apply action
    await fetchPacbioPlates({commit, rootState})
    // assert result (Might make sense to pull these into separate tests)
    expect(commit).toHaveBeenCalledWith('populatePlates', Data.PacbioPlatesRequest.data.data)
    expect(commit).toHaveBeenCalledWith('populateWells', Data.PacbioPlatesRequest.data.included.slice(0,4))
    expect(commit).toHaveBeenCalledWith('populateRequests', Data.PacbioPlatesRequest.data.included.slice(4,8))
  })

  it('fetchPacbioTagSets', async () => {
    // mock commit
    const commit = jest.fn()
    // mock dependencies
    const get = jest.fn()
    const rootState = { api: { traction: { pacbio: { tag_sets: { get } } } } }
    get.mockReturnValue(Data.PacbioTagSets)
    // apply action
    await fetchPacbioTagSets({commit, rootState})
    // assert result
    expect(commit).toHaveBeenCalledWith('populateTagSets', Data.PacbioTagSets.data.data)
    expect(commit).toHaveBeenCalledWith('populateTags', Data.PacbioTagSets.data.included)
  })
})
