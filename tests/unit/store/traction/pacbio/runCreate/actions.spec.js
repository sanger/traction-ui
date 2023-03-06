import { Data } from '@support/testHelper'
import actions from '@/store/traction/pacbio/runCreate/actions'
import { describe, expect, it } from 'vitest'
import { newRun, newWell, createPayload } from '@/store/traction/pacbio/runCreate/run'

const failedResponse = {
  data: { data: [] },
  status: 500,
  statusText: 'Internal Server Error',
}

const wells = {
  1: { ...newWell() },
  2: { ...newWell(), pools: [1, 2] },
}

describe('actions.js', () => {
  const { fetchSmrtLinkVersions, findPools, fetchRun, saveRun } = actions

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
      get.mockRejectedValue(failedResponse)
      // apply action
      const { success } = await fetchSmrtLinkVersions({ commit, rootState })
      // assert result (Might make sense to pull these into separate tests)
      expect(commit).not.toHaveBeenCalled()
      expect(success).toBeFalsy()
    })
  })

  describe('fetchRun', () => {
    it('handles success', async () => {
      const commit = vi.fn()
      const find = vi.fn()
      const rootState = { api: { traction: { pacbio: { runs: { find } } } } }
      find.mockResolvedValue(Data.PacbioRun)
      const { success } = await fetchRun({ commit, rootState })
      expect(commit).toHaveBeenCalledWith('populateRun', Data.PacbioRun.data.data)
      expect(commit).toHaveBeenCalledWith('populateWells', Data.PacbioRun.data.included.slice(1, 2))
      expect(commit).toHaveBeenCalledWith('populatePools', Data.PacbioRun.data.included.slice(2, 3))
      expect(commit).toHaveBeenCalledWith('populateTubes', Data.PacbioRun.data.included.slice(3, 4))
      expect(success).toBeTruthy()
    })

    it('handles failure', async () => {
      const commit = vi.fn()
      const find = vi.fn()
      const rootState = { api: { traction: { pacbio: { runs: { find } } } } }
      find.mockRejectedValue(failedResponse)
      const { success } = await fetchRun({ commit, rootState })
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
      const response = Data.PacbioPool
      const { data: pools, included } = response.data
      get.mockResolvedValue(response)

      // apply action
      const { success } = await findPools({ commit, getters }, { barcode: 'TRAC-2-1' })

      // assert result
      expect(commit).toHaveBeenCalledWith('setPools', pools.slice(0, 1))
      expect(commit).toHaveBeenCalledWith('setTubes', included.slice(0, 1))
      expect(commit).toHaveBeenCalledWith('setLibraries', included.slice(1, 2))
      expect(commit).toHaveBeenCalledWith('setRequests', included.slice(2, 3))
      expect(success).toEqual(true)
    })
  })

  describe('saveRun', async () => {
    describe('create', () => {
      const run = newRun()

      it('success', async () => {
        const mockResponse = {
          status: '201',
          data: { data: {} },
        }
        const create = vi.fn()
        // eslint-disable-next-line no-unused-vars
        const { id, ...attributes } = run
        const rootState = { api: { traction: { pacbio: { runs: { create } } } } }
        create.mockResolvedValue(mockResponse)
        const { success } = await saveRun({ rootState, state: { run, wells } })
        expect(create).toHaveBeenCalledWith({
          data: createPayload({ run: attributes, wells: Object.values(wells) }),
        })
        expect(success).toBeTruthy()
      })

      it('failure', async () => {
        const create = vi.fn()
        const rootState = { api: { traction: { pacbio: { runs: { create } } } } }
        create.mockRejectedValue(failedResponse)
        const { success } = await saveRun({ rootState, state: { run, wells } })
        expect(success).toBeFalsy()
      })
    })

    describe('update', () => {
      const run = { ...newRun(), id: 1 }
      const { id, ...attributes } = run

      it('success', async () => {
        const mockResponse = {
          status: '201',
          data: { data: {} },
        }
        const update = vi.fn()
        const rootState = { api: { traction: { pacbio: { runs: { update } } } } }
        update.mockResolvedValue(mockResponse)
        const { success } = await saveRun({ rootState, state: { run, wells } })
        expect(update).toHaveBeenCalledWith(
          createPayload({ id, run: attributes, wells: Object.values(wells) }),
        )
        expect(success).toBeTruthy()
      })

      it('failure', async () => {
        const update = vi.fn()
        const rootState = { api: { traction: { pacbio: { runs: { update } } } } }
        update.mockRejectedValue(failedResponse)
        const { success } = await saveRun({ rootState, state: { id, run, wells } })
        expect(success).toBeFalsy()
      })
    })
  })
})
