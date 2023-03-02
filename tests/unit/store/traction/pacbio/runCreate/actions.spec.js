import { Data } from '@support/testHelper'
import actions from '@/store/traction/pacbio/runCreate/actions'
import { describe } from 'vitest'
import { newRun, newWell, payload } from '@/store/traction/pacbio/runCreate/run'

const failedResponse = {
  data: { data: [] },
  status: 500,
  statusText: 'Internal Server Error',
}

describe('actions.js', () => {
  const { fetchSmrtLinkVersions, fetchRun, saveRun } = actions

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

  describe.skip('saveRun', async () => {
    const wells = { 1: newWell(), 2: newWell() }

    describe('create', () => {
      const run = newRun()

      it('success', async () => {
        const mockResponse = {
          status: '201',
          data: { data: {} },
        }
        const create = vi.fn()
        const rootState = { api: { traction: { pacbio: { runs: { create } } } } }
        create.mockResolvedValue(mockResponse)
        const { success, data } = await saveRun({ rootState, state: { run, wells } })
        expect(create).toHaveBeenCalledWith({
          data: payload({ run, wells }),
          include: expect.anything(),
        })
        expect(success).toBeTruthy()
        expect(data).toEqual({ data: {} })
      })

      it('failure', () => {})
    })

    describe('update', () => {
      it('success', async () => {
        const mockResponse = {
          status: '201',
          data: { data: {} },
        }
        const create = vi.fn()
        const run = {}
        const wells = []
        const rootState = { api: { traction: { pacbio: { runs: { create } } } } }
        create.mockResolvedValue(mockResponse)
        const { success, data } = await saveRun({ rootState, state: { run, wells } })
        expect(create).toHaveBeenCalledWith({
          data: payload({ run, wells }),
          include: expect.anything(),
        })
        expect(success).toBeTruthy()
        expect(data).toEqual({ data: {} })
      })

      it('failure', () => {})
    })
  })
})
