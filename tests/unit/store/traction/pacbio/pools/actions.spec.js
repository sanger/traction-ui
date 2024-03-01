import { Data } from '@support/testHelper'
import * as Actions from '@/store/traction/pacbio/pools/actions'

describe('#setPools', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { poolRequest: { get: get } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    const response = Data.TractionPacbioPoolsV1
    const { data: pools, included } = response.data
    get.mockResolvedValue(response)

    await Actions.setPools({ commit, getters })
    expect(commit).toHaveBeenCalledWith('setPools', pools)
    expect(commit).toHaveBeenCalledWith('setTubes', included.slice(0, 2))
    expect(commit).toHaveBeenCalledWith('setLibraries', included.slice(2, 4))
    expect(commit).toHaveBeenCalledWith('setTags', included.slice(4, 6))
    expect(commit).toHaveBeenCalledWith('setRequests', included.slice(6, 8))
  })

  it('when the pool has no libraries', async () => {
    const response = Data.TractionPacbioPoolsNoRelationships
    const { data: pools } = response.data
    get.mockResolvedValue(response)

    await Actions.setPools({ commit, getters })

    expect(commit).toHaveBeenCalledWith('setPools', pools)
  })

  it('unsuccessfully', async () => {
    get.mockRejectedValue(failedResponse)

    await Actions.setPools({ commit, getters })

    expect(commit).not.toHaveBeenCalled()
  })
})
