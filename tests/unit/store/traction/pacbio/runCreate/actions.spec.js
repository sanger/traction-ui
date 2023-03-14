import { Data } from '@support/testHelper'
import actions from '@/store/traction/pacbio/runCreate/actions'
import { describe, expect, it } from 'vitest'
import {
  newRun,
  newWell,
  createRunType,
  newRunType,
  existingRunType,
} from '@/store/traction/pacbio/runCreate/run'

const failedResponse = {
  data: { data: [] },
  status: 500,
  statusText: 'Internal Server Error',
}

const wells = {
  1: { ...newWell() },
  2: { ...newWell(), pools: [1, 2] },
}

const defaultSmrtLinkVersion = {
  id: '1',
  version: 'v1',
  default: true,
}

describe('actions.js', () => {
  const { fetchSmrtLinkVersions, findPools, fetchRun, saveRun, setRun } = actions

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
      const { success } = await fetchRun({ commit, rootState }, { id: 1 })
      expect(commit).toHaveBeenCalledWith('populateRun', Data.PacbioRun.data.data)
      expect(commit).toHaveBeenCalledWith('populateWells', Data.PacbioRun.data.included.slice(1, 2))
      expect(commit).toHaveBeenCalledWith('populatePools', Data.PacbioRun.data.included.slice(2, 3))
      expect(commit).toHaveBeenCalledWith('setTubes', Data.PacbioRun.data.included.slice(3, 4))
      expect(success).toBeTruthy()
    })

    it('handles failure', async () => {
      const commit = vi.fn()
      const find = vi.fn()
      const rootState = { api: { traction: { pacbio: { runs: { find } } } } }
      find.mockRejectedValue(failedResponse)
      const { success } = await fetchRun({ commit, rootState }, { id: 1 })
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
      getters = { poolRequest: { get } }
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
      const runType = createRunType({ id: run.id })

      it('success', async () => {
        const mockResponse = {
          status: '201',
          data: { data: {} },
        }
        const create = vi.fn()
        const rootState = { api: { traction: { pacbio: { runs: { create } } } } }
        create.mockResolvedValue(mockResponse)
        const { success } = await saveRun({ rootState, state: { runType, run, wells } })
        expect(create).toHaveBeenCalled()
        expect(success).toBeTruthy()
      })

      it('failure', async () => {
        const create = vi.fn()
        const rootState = { api: { traction: { pacbio: { runs: { create } } } } }
        create.mockRejectedValue(failedResponse)
        const { success } = await saveRun({ rootState, state: { runType, run, wells } })
        expect(success).toBeFalsy()
      })
    })

    describe('update', () => {
      const run = { ...newRun(), id: 1 }
      const runType = createRunType({ id: run.id })

      it('success', async () => {
        const mockResponse = {
          status: '201',
          data: { data: {} },
        }
        const update = vi.fn()
        const rootState = { api: { traction: { pacbio: { runs: { update } } } } }
        update.mockResolvedValue(mockResponse)
        const { success } = await saveRun({ rootState, state: { runType, run, wells } })
        expect(update).toHaveBeenCalled()
        expect(success).toBeTruthy()
      })

      it('failure', async () => {
        const update = vi.fn()
        const rootState = { api: { traction: { pacbio: { runs: { update } } } } }
        update.mockRejectedValue(failedResponse)
        const { success } = await saveRun({ rootState, state: { runType, run, wells } })
        expect(success).toBeFalsy()
      })
    })
  })

  describe('setRun', () => {
    // this works but we are getting into implementation so probably needs a method
    // to construct a new run with smrt link version
    it('for a new run', async () => {
      const getters = { defaultSmrtLinkVersion }
      const run = newRun()
      const { id, ...attributes } = run
      const commit = vi.fn()
      const { success } = await setRun({ commit, getters }, { id })
      expect(success).toBeTruthy()
      expect(commit).toHaveBeenCalledWith('populateRun', {
        id,
        attributes: { ...attributes, smrt_link_version_id: defaultSmrtLinkVersion.id },
      })
      expect(commit).toHaveBeenCalledWith('populateRunType', newRunType)
    })

    // TODO: This is clearly complex and needs to be simplified.
    it('for an existing run', async () => {
      const state = {
        tubes: {
          1: { barcode: 'TRAC-2-1', id: '1', type: 'tubes' },
          2: { barcode: 'TRAC-2-2', id: '2', type: 'tubes' },
        },
      }
      const id = 1
      const commit = vi.fn()
      const getters = {}
      const dispatch = vi.fn()
      dispatch.mockResolvedValue({ success: true })

      const { success } = await setRun({ commit, dispatch, state, getters }, { id })
      expect(dispatch).toHaveBeenCalledWith('fetchRun', { id })
      expect(dispatch).toHaveBeenCalledWith('findPools', { barcode: 'TRAC-2-1,TRAC-2-2' })
      expect(commit).toHaveBeenCalledWith('populateRunType', existingRunType)
      expect(success).toBeTruthy()
    })
  })
})
