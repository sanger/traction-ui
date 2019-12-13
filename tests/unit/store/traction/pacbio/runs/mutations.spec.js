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

describe('addEmptyLibraryToWell', () => {
  let run, position, state

  beforeEach(() => {
    run = Run.build()
    state = { currentRun: run }
    position = "F1"
  })

  it('adds a library object to the given well', () => {
    Mutations.default.addEmptyLibraryToWell(state, position)
    let well = state.currentRun.plate.wells.filter(well => well.position === position)[0]
    expect(well.libraries.length).toEqual(1)
  })
})

describe('removeLibraryFromWell', () => {
  let run, payload, state, position

  beforeEach(() => {
    run = Run.build()
    state = { currentRun: run }
    position = 'A1'
    payload = { index: 0, position: position}
  })

  it('adds a library object to the given well', () => {
    Mutations.default.addEmptyLibraryToWell(state, position)
    Mutations.default.removeLibraryFromWell(state, payload)
    let well = state.currentRun.plate.wells.filter(well => well.position === position)[0]
    expect(well.libraries.length).toEqual(0)
  })
})

describe('addLibraryToWell', () => {
  let payload, state, position, library1

  beforeEach(() => {
    let run = Run.build()
    state = { currentRun: run }
    position = 'A1'
    library1 = { id: 1, barcode: 'TRAC-1'}
    payload = { position: position, index: 0, with: library1 }
  })

  it('adds a library object to the given well', () => {
    Mutations.default.addEmptyLibraryToWell(state, position)
    Mutations.default.addLibraryToWell(state, payload)
    let well = state.currentRun.plate.wells.filter(well => well.position === position)[0]
    expect(well.libraries[0]).toEqual(library1)
  })

  it('can add multiple library objects to the given well', () => {
    let library2 = { id: 2, barcode: 'TRAC-2' }
    let payload2 = { position: position, index: 1, with: library2 }

    Mutations.default.addEmptyLibraryToWell(state, position)
    Mutations.default.addLibraryToWell(state, payload)
    Mutations.default.addLibraryToWell(state, payload2)
    let well = state.currentRun.plate.wells.filter(well => well.position === position)[0]
    expect(well.libraries.length).toEqual(2)
    expect(well.libraries[0]).toEqual(library1)
    expect(well.libraries[1]).toEqual(library2)
  })
})