import mutations from '@/store/traction/pacbio/runCreate/mutations'
import defaultState from '@/store/traction/pacbio/runCreate/state'
import { Data } from '@support/testHelper'
import { dataToObjectById } from '@/api/JsonApi'
import { newRun, createRunType } from '@/store/traction/pacbio/runCreate/run'
import storePools from '@tests/data/StorePools'
import { expect, it } from 'vitest'

let state

const { data: pools, included } = Data.TractionPacbioPools.data
const tubes = included.slice(0, 2)
const libraries = included.slice(2, 4)
const tags = included.slice(4, 6)
const requests = included.slice(6, 8)

describe('mutations.js', () => {
  const { populateSmrtLinkVersions, populateRun, populateWells, populatePools, populateRunType } =
    mutations

  describe('populateSmrtLinkVersions', () => {
    it('updates the state', () => {
      // mock state
      const smrtLinkVersions = Data.TractionPacbioSmrtLinkVersions.data.data
      const state = defaultState()
      // apply mutation
      populateSmrtLinkVersions(state, smrtLinkVersions)
      // assert result
      expect(state.resources.smrtLinkVersions).toEqual(dataToObjectById({ data: smrtLinkVersions }))
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
      expect(state.wells).toEqual(dataToObjectById({ data: wells, includeRelationships: true }))
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
      mutations.setPools(state, pools)
      expect(state.pools).toEqual(storePools.pools)
    })

    it('"setTubes" sets "state.tubes" to the given tubes', () => {
      state = {
        tubes: {},
      }
      mutations.setTubes(state, tubes)
      expect(state.tubes).toEqual(storePools.tubes)
    })

    it('"setLibraries" sets "state.libraries" to the given libraries', () => {
      state = {
        libraries: {},
      }
      mutations.setLibraries(state, libraries)
      expect(state.libraries).toEqual(storePools.libraries)
    })

    it('"setTags" sets "state.tags" to the given tags', () => {
      state = {
        tags: {},
      }
      mutations.setTags(state, tags)
      expect(state.tags).toEqual(storePools.tags)
    })

    it('"setRequests" sets "state.requests" to the given requests', () => {
      state = {
        requests: {},
      }
      mutations.setRequests(state, requests)
      expect(state.requests).toEqual(storePools.requests)
    })

    it('"removePool" removes the given pool id from state.pool', () => {
      state = {
        pools: {},
      }
      mutations.setPools(state, pools)
      mutations.removePool(state, 2)
      expect(state.pools).toEqual({ 1: storePools.pools[1] })
    })
  })

  describe('clearPoolData', () => {
    it('clears existing pool data', () => {
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
      }
      // populates an existing pool into state
      mutations.clearPoolData(state)
      expect(state).toEqual({
        resources: {
          smrtLinkVersions: {},
        },
        run: {},
        wells: {},
        pools: {},
        tubes: {},
        libraries: {},
        requests: {},
        tags: {},
        runType: {},
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
})
