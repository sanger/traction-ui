import * as Mutations from '@/store/traction/pacbio/runs/mutations'
import * as Run from '@/api/PacbioRun'
import { Data } from '../../../../testHelper'
import Response from '@/api/Response'

describe('mutate', () => {
  let runs, state

  beforeEach(() => {
    runs = new Response(Data.PacbioRuns).deserialize.runs
    state = { runs: [] }
  })

  it('can update the mutate the state, e.g setRuns', () => {
    Mutations.default.setRuns(state, runs)
    expect(state.runs.length).toEqual(runs.length)
  })
})

describe('mutateRun', () => {
  let run, state

  beforeEach(() => {
    run = Run.build()
    state = { currentRun: run }
  })

  it('can update the mutate the state, e.g setName', () => {
    let newName = 'a new name'
    Mutations.default.setName(state, newName)
    expect(state.currentRun.name).toEqual(newName)
  })
})

describe('mutateWell', () => {
  let run, position, state

  beforeEach(() => {
    run = Run.build()
    state = { currentRun: run }
  })

  describe('when well exists', () => {
    it('mutates the well, e.g. sequencing_mode', () => {
      position = 'A1'
      let payload = { position: position, property: 'sequencing_mode', with: 'seqMode' }
      Mutations.default.mutateWell(state, payload)

      let well = state.currentRun.plate.wells.filter(well => well.position === position)[0]
      expect(well.sequencing_mode).toEqual('seqMode')
    })

    // TODO possibly refactor
    xit('mutates the well, e.g. libraries', () => {
      position = 'A1'
      let payload = { position: position, property: 'libraries', with: [{ id: 123, barcode: 'TRAC-1' }] }
      Mutations.default.mutateWell(state, payload)

      let well = state.currentRun.plate.wells.filter(well => well.position === position)[0]
      expect(well.libraries.length).toEqual(payload.with.length)
      expect(well.libraries[0].id).toEqual(123)
      expect(well.libraries[0].barcode).toEqual('TRAC-1')
    })
  })

  describe('when well does not exist', () => {
    it('creates the well, then mutates the given property of the well, with the give prop', () => {
      position = 'X1'
      let payload = { position: position, property: 'sequencing_mode', with: 'seqMode' }
      Mutations.default.mutateWell(state, payload)

      let well = state.currentRun.plate.wells.filter(well => well.position === position)[0]
      expect(well.sequencing_mode).toEqual('seqMode')
    })
  })

})