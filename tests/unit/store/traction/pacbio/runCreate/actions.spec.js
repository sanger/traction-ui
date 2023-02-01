import { Data } from '@support/testHelper'
import actions from '@/store/traction/pacbio/runCreate/actions'
import { describe, it } from 'vitest'

describe('actions.js', () => {
  const { fetchSmrtLinkVersions } = actions

  describe('fetchSmrtLinkVersions', () => {
    it('handles success', async () => {
      const commit = vi.fn()
      const get = vi.fn()
      const rootState = { api: { traction: { pacbio: { smrt_link_versions: { get } } } } }
      get.mockResolvedValue(Data.TractionPacbioSmrtLinkVersions)
      const { success } = await fetchSmrtLinkVersions({ commit, rootState })
      expect(commit).toHaveBeenCalledWith(
        'populateSmrtLinkVersions',
        Data.TractionPacbioSmrtLinkVersions.data.data,
      )
      expect(success).toBeTruthy()
    })

    it('handles failure', async () => {
      const commit = vi.fn()
      const get = vi.fn()
      const rootState = { api: { traction: { pacbio: { smrt_link_versions: { get } } } } }
      get.mockRejectedValue({
        data: { data: [] },
        status: 500,
        statusText: 'Internal Server Error',
      })
      // apply action
      const { success } = await fetchSmrtLinkVersions({ commit, rootState })
      // assert result (Might make sense to pull these into separate tests)
      expect(commit).not.toHaveBeenCalled()
      expect(success).toBeFalsy()
    })
  })

  describe('findPools', () => {
    let commit, get, getters
    beforeEach(() => {
      // mock commit
      commit = vi.fn()
      // mock dependencies
      get = vi.fn()
      getters = { poolRequest: { get: get } }
    })

    it('returns the pool when given a valid tube barcode', async () => {
      const response = Data.TractionPacbioPools
      const { data: pools, included } = response.data
      get.mockResolvedValue(response)

      await actions.setPools({ commit, getters }, { barcode: 'TRAC-2-1' })

      // the information returned belongs to the pool with given tube barcode
      expect(commit).toHaveBeenCalledWith('setPools', pools.slice(0.1))
      expect(commit).toHaveBeenCalledWith('setTubes', included.slice(0, 1))
      expect(commit).toHaveBeenCalledWith('setLibraries', included.slice(2, 3))
      expect(commit).toHaveBeenCalledWith('setTags', included.slice(4, 5))
      expect(commit).toHaveBeenCalledWith('setRequests', included.slice(6, 7))
    })

    it('returns the pools when given multiple valid tube barcodes', async () => {})

    it('returns an error and an empty list when the barcode cannot be found', async () => {
      get.mockResolvedValue({ data: { data: [] } })
      const { success, errors } = await actions.setPools(
        { commit, getters },
        { barcode: 'fake-barcode' },
      )
      expect(errors).toEqual(['Unable to find pool with barcode: fake-barcode'])
      expect(success).toEqual(false)
    })

    it('returns an error and an empty list a barcode is not provided', async () => {
      const { success, errors } = await findPools({ commit, getters })
    })
  })
})
