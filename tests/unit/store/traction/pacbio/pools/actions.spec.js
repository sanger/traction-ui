import { Data } from '@support/testHelper'
import * as Actions from '@/store/traction/pacbio/pools/actions'
import { expect, it } from 'vitest'

describe('#setPools', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    // mock commit
    commit = vi.fn()
    // mock dependencies
    get = vi.fn()
    getters = { poolRequest: { get: get } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    const response = Data.TractionPacbioPools
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

  it('returns the pool that fits the valid tube barcode', async () => {
    const response = Data.TractionPacbioPools
    const { data: pools, included } = response.data
    get.mockResolvedValue(response)

    await Actions.setPools({ commit, getters }, { barcode: 'TRAC-2-1' })

    // the information returned belongs to the pool with given tube barcode
    expect(commit).toHaveBeenCalledWith('setPools', pools.slice(0.1))
    expect(commit).toHaveBeenCalledWith('setTubes', included.slice(0, 1))
    expect(commit).toHaveBeenCalledWith('setLibraries', included.slice(2, 3))
    expect(commit).toHaveBeenCalledWith('setTags', included.slice(4, 5))
    expect(commit).toHaveBeenCalledWith('setRequests', included.slice(6, 7))
  })

  it('returns an error when the barcode cannot be found', async () => {
    get.mockResolvedValue({ data: { data: [] } })
    const { success, errors } = await Actions.setPools(
      { commit, getters },
      { barcode: 'fake-barcode' },
    )

    expect(errors).toEqual(['Unable to find pool with barcode: fake-barcode'])
    expect(success).toEqual(false)
  })
})
