import mutations from '@/store/traction/pacbio/runCreate/mutations'
import defaultState from '@/store/traction/pacbio/runCreate/state'
import { Data } from '@support/testHelper'
import { dataToObjectById, dataToObjectByPosition } from '@/api/JsonApi'
import { newRun, createRunType, defaultWellAttributes } from '@/store/traction/pacbio/runCreate/run'
import storePools from '@tests/data/StorePools'
import { expect, it } from 'vitest'

let state

const { data: pools, included } = Data.TractionPacbioPools.data
const tubes = included.slice(0, 2)
const libraries = included.slice(2, 4)
const tags = included.slice(4, 6)
const requests = included.slice(6, 8)
const PLATE_INDEX = 0

describe('mutations.js', () => {
  const {
    populateSmrtLinkVersions,
    populateSmrtLinkVersion,
    populateRun,
    populateWells,
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

  describe('populateWells', () => {
    it('updates the state', () => {
      // mock state
      const wells = Data.PacbioRun.data.included.slice(1, 2)
      const state = defaultState()
      // apply mutation
      populateWells(state, wells)
      // assert result
      expect(state.wells).toEqual(
        dataToObjectByPosition({ data: wells, includeRelationships: true }),
      )
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
      // TODO maybe update defaultState to include plates: [] ...
      const state = defaultState()
      state.run = { plates: [{ wells: {} }] }
      const well = { position: 'A1', row: 'A', column: '1' }
      updateWell(state, { well: well, plateIndex: PLATE_INDEX })
      expect(state.run.plates[PLATE_INDEX].wells['A1']).toEqual(well)
    })

    it('when it is an existing well', () => {
      const state = defaultState()
      state.run = { plates: [{ wells: {} }] }
      const well = { position: 'A1', row: 'A', column: '1' }
      updateWell(state, { well: well, plateIndex: PLATE_INDEX })
      const updatedWell = { ...well, newAttribute: 'some nonsense' }
      updateWell(state, { well: updatedWell, plateIndex: PLATE_INDEX })
      expect(state.run.plates[PLATE_INDEX].wells['A1']).toEqual(updatedWell)
    })
  })

  describe('deleteWell', () => {
    it('should delete the well', () => {
      const state = defaultState()
      state.run = { plates: [{ wells: {} }] }
      state.run.plates[PLATE_INDEX].wells = { A1: { position: 'A1' }, A2: { position: 'A2' } }
      deleteWell(state, { position: 'A1', plateIndex: PLATE_INDEX })
      expect(state.run.plates[PLATE_INDEX].wells).toEqual({ A2: { position: 'A2' } })
    })
  })
})
