import { Data } from '@support/testHelper'
import actions from '@/store/traction/pacbio/runCreate/actions'
import { describe, expect, it } from 'vitest'
import {
  newRun,
  newPlate,
  newWell,
  createRunType,
  newRunType,
  existingRunType,
  defaultWellAttributes,
} from '@/store/traction/pacbio/runCreate/run'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'

const failedResponse = {
  data: { data: [] },
  status: 500,
  statusText: 'Internal Server Error',
}

const plateNumber = 1

const plates = {
  1: { ...newPlate(plateNumber) },
}

const wells = {
  1: {
    A1: { ...newWell({ position: 'A1' }) },
    A2: { ...newWell({ position: 'A2' }), pools: [1, 2] },
    _destroy: [],
  },
}

const defaultSmrtLinkVersion = {
  id: '1',
  version: 'v1',
  default: true,
}

const instrumentType = PacbioInstrumentTypes.SequelIIe

describe('actions.js', () => {
  const {
    fetchSmrtLinkVersions,
    findPools,
    fetchRun,
    saveRun,
    setRun,
    getOrCreateWell,
    updateWell,
    getPool,
    setInstrumentType,
  } = actions

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

      const smrtLinkVersion = {
        id: Data.PacbioRun.data.included.slice(10)[0].id,
        type: Data.PacbioRun.data.included.slice(10)[0].type,
        ...Data.PacbioRun.data.included.slice(10)[0].attributes,
      }

      expect(commit).toHaveBeenCalledWith('populateRun', Data.PacbioRun.data.data)
      expect(commit).toHaveBeenCalledWith(
        'populatePlates',
        Data.PacbioRun.data.included.slice(0, 2),
      )
      expect(commit).toHaveBeenCalledWith('populateWells', {
        plates: Data.PacbioRun.data.included.slice(0, 2),
        wells: Data.PacbioRun.data.included.slice(2, 5),
      })
      expect(commit).toHaveBeenCalledWith('populatePools', Data.PacbioRun.data.included.slice(5, 6))
      expect(commit).toHaveBeenCalledWith('setTubes', Data.PacbioRun.data.included.slice(6, 7))
      expect(commit).toHaveBeenCalledWith('setLibraries', Data.PacbioRun.data.included.slice(7, 8))
      expect(commit).toHaveBeenCalledWith('setTags', Data.PacbioRun.data.included.slice(8, 9))
      expect(commit).toHaveBeenCalledWith('setRequests', Data.PacbioRun.data.included.slice(9, 10))
      expect(commit).toHaveBeenCalledWith('populateSmrtLinkVersion', smrtLinkVersion)
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
        const { success } = await saveRun({
          rootState,
          state: { runType, run, plates, wells, smrtLinkVersion: defaultSmrtLinkVersion },
        })
        expect(create).toHaveBeenCalled()
        expect(success).toBeTruthy()
      })

      it('failure', async () => {
        const create = vi.fn()
        const rootState = { api: { traction: { pacbio: { runs: { create } } } } }
        create.mockRejectedValue(failedResponse)
        const { success } = await saveRun({
          rootState,
          state: { runType, run, plates, wells, smrtLinkVersion: defaultSmrtLinkVersion },
        })
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
        const { success } = await saveRun({
          rootState,
          state: { runType, run, plates, wells, smrtLinkVersion: defaultSmrtLinkVersion },
        })
        expect(update).toHaveBeenCalled()
        expect(success).toBeTruthy()
      })

      it('failure', async () => {
        const update = vi.fn()
        const rootState = { api: { traction: { pacbio: { runs: { update } } } } }
        update.mockRejectedValue(failedResponse)
        const { success } = await saveRun({
          rootState,
          state: { runType, run, plates, wells, smrtLinkVersion: defaultSmrtLinkVersion },
        })
        expect(success).toBeFalsy()
      })
    })
  })

  describe('setRun', () => {
    // this works but we are getting into implementation so probably needs a method
    // to construct a new run with smrt link version
    it('for a new run', async () => {
      const getters = { defaultSmrtLinkVersion, instrumentType }
      const run = newRun()
      const { id, ...attributes } = run
      const commit = vi.fn()
      const { success } = await setRun({ commit, getters, state: { instrumentType } }, { id })
      expect(success).toBeTruthy()
      expect(commit).toHaveBeenCalledWith('populateRun', {
        id,
        attributes,
      })
      expect(commit).toHaveBeenCalledWith('populateSmrtLinkVersion', getters.defaultSmrtLinkVersion)
      expect(commit).toHaveBeenCalledWith('populateRunType', newRunType)
      expect(commit).toHaveBeenCalledWith('createPlates', instrumentType.plateCount)
    })

    it('for an existing run', async () => {
      const state = {
        tubes: {
          1: { barcode: 'TRAC-2-1', id: '1', type: 'tubes' },
          2: { barcode: 'TRAC-2-2', id: '2', type: 'tubes' },
        },
        run: {
          system_name: 'Revio',
        },
        instrumentTypeList: PacbioInstrumentTypes,
      }
      const id = 1
      const commit = vi.fn()
      const getters = {}
      const dispatch = vi.fn()
      dispatch.mockResolvedValue({ success: true })

      const { success } = await setRun({ commit, dispatch, state, getters }, { id })
      expect(dispatch).toHaveBeenCalledWith('fetchRun', { id })
      expect(commit).toHaveBeenCalledWith('populateRunType', existingRunType)
      expect(commit).toHaveBeenCalledWith('populateInstrumentType', PacbioInstrumentTypes.Revio)
      expect(success).toBeTruthy()
    })
  })

  describe('getOrCreateWell', () => {
    it('if it is a new well', () => {
      const state = {
        wells: {
          [plateNumber]: {},
        },
        defaultWellAttributes: { ...defaultWellAttributes() },
      }

      const position = 'A1'

      const well = getOrCreateWell({ state }, { position, plateNumber })
      expect(well).toEqual(newWell({ position, ...state.defaultWellAttributes }))
    })

    it('if it is an existing well', () => {
      const position = 'A1'
      const well = newWell({ position })

      const state = {
        wells: { 1: { [position]: well } },
        defaultWellAttributes: { ...defaultWellAttributes() },
      }

      const gottenWell = getOrCreateWell({ state }, { position: position, plateNumber })
      expect(gottenWell).toEqual(well)
    })
  })

  describe('updateWell', () => {
    it('updates the well', () => {
      const well = { position: 'A1', row: 'A', column: '1' }
      const commit = vi.fn()
      updateWell({ commit }, { well: well, plateNumber })
      expect(commit).toHaveBeenCalledWith('updateWell', { well: well, plateNumber })
    })
  })

  describe('getPool', () => {
    it('when finding the pool is successful', async () => {
      const barcode = 'TRAC-2-1'
      const dispatch = vi.fn()
      const getters = { poolByBarcode: () => ({ id: '1', barcode }) }
      dispatch.mockResolvedValue({ success: true })
      const { success, pool } = await getPool({ dispatch, getters }, { barcode })
      expect(success).toBeTruthy()
      expect(pool).toEqual({ id: '1', barcode })
    })

    it('when finding the pool fails', async () => {
      const barcode = 'TRAC-2-1'
      const dispatch = vi.fn()
      const getters = {}
      dispatch.mockResolvedValue({ success: false, errors: ['it didnt work'] })
      const { success, errors } = await getPool({ dispatch, getters }, { barcode })
      expect(success).toBeFalsy()
      expect(errors).toEqual(['it didnt work'])
    })
  })

  describe('setInstrumentType', () => {
    it('sets the instrument type', () => {
      const commit = vi.fn()
      const instrumentName = 'Sequel IIe'
      const state = {
        instrumentTypeList: PacbioInstrumentTypes,
      }
      setInstrumentType({ commit, state }, instrumentName)
      expect(commit).toHaveBeenCalledWith('populateInstrumentType', PacbioInstrumentTypes.SequelIIe)
      expect(commit).toHaveBeenCalledWith(
        'createPlates',
        PacbioInstrumentTypes.SequelIIe.plateCount,
      )
    })
  })
})
