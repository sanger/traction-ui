import mutations from '@/store/traction/pacbio/runCreate/mutations'
import defaultState from '@/store/traction/pacbio/runCreate/state'
import { Data } from '@support/testHelper'
import { dataToObjectById } from '@/api/JsonApi'
import { newRun } from '@/store/traction/pacbio/runCreate/run'

describe('mutations.js', () => {
  const { populateSmrtLinkVersions, populateRun, populateWells, populatePools } = mutations

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
  })
})
