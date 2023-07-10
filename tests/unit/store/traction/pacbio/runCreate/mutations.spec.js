import mutations from '@/store/traction/pacbio/runCreate/mutations'
import defaultState from '@/store/traction/pacbio/runCreate/state'
import { Data } from '@support/testHelper'
import { dataToObjectById } from '@/api/JsonApi'
import {
  newRun,
  newPlate,
  createRunType,
  defaultWellAttributes,
} from '@/store/traction/pacbio/runCreate/run'
import storePools from '@tests/data/StorePools'
import { expect, it } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'

let state

const { data: pools, included } = Data.TractionPacbioPools.data
const tubes = included.slice(0, 2)
const libraries = included.slice(2, 4)
const tags = included.slice(4, 6)
const requests = included.slice(6, 8)
const PLATE_NUMBER = 1

describe('mutations.js', () => {
  const {
    populateSmrtLinkVersions,
    populateSmrtLinkVersion,
    populateRun,
    populatePools,
    populateRunType,
    clearRunData,
    setPools,
    setRequests,
    setTags,
    setLibraries,
    setTubes,
    removePool,
    populateDefaultWellAttributes,
    updateWell,
    deleteWell,
    populateInstrumentType,
  } = mutations

  describe('populateSmrtLinkVersions', () => {
    it('updates the state', () => {
      // mock state
      const smrtLinkVersions = Data.TractionPacbioSmrtLinkVersions.data.data
      const state = defaultState()
      // apply mutations
      populateSmrtLinkVersions(state, smrtLinkVersions)
      // assert result
      expect(state.resources.smrtLinkVersions).toEqual(dataToObjectById({ data: smrtLinkVersions }))
    })
  })

  describe('populateSmrtLinkVersion', () => {
    it('updates the state', () => {
      // mock state
      const state = defaultState()
      const smrtLinkVersion = {
        id: Data.TractionPacbioSmrtLinkVersions.data.data[0].id,
        ...Data.TractionPacbioSmrtLinkVersions.data.data[0].attributes,
      }
      // apply mutations
      populateSmrtLinkVersion(state, smrtLinkVersion)
      // assert result
      expect(state.smrtLinkVersion).toEqual(smrtLinkVersion)
    })
  })

  describe('populateRun', () => {
    it('updates the state', () => {
      // mock state
      const run = { id: 1, attributes: { ...newRun } }
      const state = defaultState()
      // apply mutation
      populateRun(state, run)
      // assert result
      expect(state.run).toEqual({ ...newRun, id: 1 })
    })
  })

  describe('populatePools', () => {
    it('updates the state', () => {
      // mock state
      const pools = Data.PacbioRun.data.included.slice(2, 3)
      const state = defaultState()
      // apply mutation
      populatePools(state, pools)
      // assert result
      expect(state.pools).toEqual(dataToObjectById({ data: pools, includeRelationships: true }))
    })
    it('"setPools" sets "state.pools" to the given pools', () => {
      state = {
        pools: {},
      }
      setPools(state, pools)
      expect(state.pools).toEqual(storePools.pools)
    })

    it('"setTubes" sets "state.tubes" to the given tubes', () => {
      state = {
        tubes: {},
      }
      setTubes(state, tubes)
      expect(state.tubes).toEqual(storePools.tubes)
    })

    it('"setLibraries" sets "state.libraries" to the given libraries', () => {
      state = {
        libraries: {},
      }
      setLibraries(state, libraries)
      expect(state.libraries).toEqual(storePools.libraries)
    })

    it('"setTags" sets "state.tags" to the given tags', () => {
      state = {
        tags: {},
      }
      setTags(state, tags)
      expect(state.tags).toEqual(storePools.tags)
    })

    it('"setRequests" sets "state.requests" to the given requests', () => {
      state = {
        requests: {},
      }
      setRequests(state, requests)
      expect(state.requests).toEqual(storePools.requests)
    })

    it('"removePool" removes the given pool id from state.pool', () => {
      state = {
        pools: {},
      }
      setPools(state, pools)
      removePool(state, 2)
      expect(state.pools).toEqual({ 1: storePools.pools[1] })
    })
  })

  describe('clearRunData', () => {
    it('clears existing pool data', () => {
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
      }
      // populates an existing pool into state
      clearRunData(state)
      expect(state).toEqual({
        resources: {
          smrtLinkVersions: {},
        },
        run: {},
        pools: {},
        tubes: {},
        libraries: {},
        requests: {},
        tags: {},
        smrtLinkVersion: {},
        runType: {},
        defaultWellAttributes: {},
        instrumentTypeList: PacbioInstrumentTypes,
        instrumentType: PacbioInstrumentTypes.SequelIIe,
      })
    })
  })

  describe('populateRunType', () => {
    it('populates run type', () => {
      const runType = createRunType({ id: 1 })
      const state = defaultState()
      // apply mutation
      populateRunType(state, runType)
      expect(state.runType).toEqual(runType)
    })
  })

  describe('populateDefaultWellAttributes', () => {
    it('populates default well attributes', () => {
      const state = defaultState()
      // apply mutation
      populateDefaultWellAttributes(state, { ...defaultWellAttributes() })
      expect(state.defaultWellAttributes).toEqual(defaultWellAttributes())
    })
  })

  describe('updateWell', () => {
    it('when it is a new well', () => {
      const state = defaultState()
      state.run = {
        plates: {
          1: newPlate(1),
          2: newPlate(2),
        },
      }

      const well = { position: 'A1', row: 'A', column: '1' }
      updateWell(state, { well: well, plateNumber: PLATE_NUMBER })
      expect(state.run.plates[PLATE_NUMBER].wells['A1']).toEqual(well)
    })

    it('when it is an existing well', () => {
      const state = defaultState()
      state.run = {
        plates: {
          1: newPlate(1),
        },
      }
      const well = { position: 'A1', row: 'A', column: '1' }
      updateWell(state, { well: well, plateNumber: PLATE_NUMBER })
      const updatedWell = { ...well, newAttribute: 'some nonsense' }
      updateWell(state, { well: updatedWell, plateNumber: PLATE_NUMBER })
      expect(state.run.plates[PLATE_NUMBER].wells['A1']).toEqual(updatedWell)
    })
  })

  describe('deleteWell', () => {
    it('should add _destroy to the well', () => {
      const state = defaultState()
      state.run = {
        plates: {
          1: newPlate(1),
        },
      }
      state.run.plates[PLATE_NUMBER].wells = {
        A1: { position: 'A1', id: 1 },
        A2: { position: 'A2', id: 2 },
        _destroy: [],
      }
      deleteWell(state, { position: 'A1', plateNumber: PLATE_NUMBER })
      expect(state.run.plates[PLATE_NUMBER].wells).toEqual({
        _destroy: [{ _destroy: true, id: 1 }],
        A2: { position: 'A2', id: 2 },
      })
    })
  })

  describe('populateInstrumentType', () => {
    it('updates the state', () => {
      // mock state
      const instrumentType = { name: 'Instrument Type 1' }
      const state = defaultState()
      // apply mutations
      populateInstrumentType(state, instrumentType)
      // assert result
      expect(state.instrumentType).toEqual(instrumentType)
    })
  })
})
