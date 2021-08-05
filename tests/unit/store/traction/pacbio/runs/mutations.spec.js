import Mutations from '@/store/traction/pacbio/runs/mutations'
import * as Run from '@/api/PacbioRun'
import { Data } from 'testHelper'
import Response from '@/api/Response'

describe('mutate', () => {
  let runs, state

  beforeEach(() => {
    runs = new Response(Data.PacbioRuns).deserialize.runs
    state = { runs: [] }
  })

  it('can update the mutate the state, e.g setRuns', () => {
    Mutations.setRuns(state, runs)
    expect(state.runs.length).toEqual(runs.length)
  })
})

describe('mutateRun', () => {
  let run, state

  beforeEach(() => {
    run = Run.build()
    state = { currentRun: run }
  })

  it('can update the mutate the state, e.g setSystemName', () => {
    let systemName = 'System 1'
    Mutations.setSystemName(state, systemName)
    expect(state.currentRun.system_name).toEqual(systemName)
  })
})

describe('createWell', () => {
  let run, position, state

  beforeEach(() => {
    run = Run.build()
    run.plate.wells = []
    run.system_name = 'Sequel I'
    run.default_binding_kit_box_barcode = 'default'
    state = { currentRun: run }
  })

  describe('when well does not exist', () => {
    it('creates the well', () => {
      position = 'A10'
      Mutations.createWell(state, position)

      let well = state.currentRun.plate.wells.find((well) => well.position === position)
      expect(well).toBeDefined()
      expect(well.position).toEqual(position)
      expect(well.generate_hifi).toEqual('In SMRT Link')
      expect(well.binding_kit_box_barcode).toEqual('default')
    })
  })

  describe('well binding kit box barcode is defaulted as "" when no value is passed', () => {
    it('creates the well', () => {
      position = 'A10'
      delete state.currentRun.default_binding_kit_box_barcode
      Mutations.createWell(state, position)

      let well = state.currentRun.plate.wells.find((well) => well.position === position)
      expect(well).toBeDefined()
      expect(well.binding_kit_box_barcode).toEqual('')
    })
  })
})

describe('mutateWell', () => {
  let run, position, state

  beforeEach(() => {
    run = Run.build()
    state = { currentRun: run }
  })

  it('mutates the well, e.g. generate_hifi', () => {
    position = 'A10'
    let payload = { position: position, property: 'generate_hifi', with: 'generateHiFi' }
    Mutations.mutateWell(state, payload)

    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(well.generate_hifi).toEqual('generateHiFi')
  })
})

describe('addEmptyLibraryToWell', () => {
  let run, position, state

  beforeEach(() => {
    run = Run.build()
    state = { currentRun: run }
    position = 'F1'
  })

  it('adds a library object to the given well', () => {
    Mutations.addEmptyLibraryToWell(state, position)
    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(well.libraries.length).toEqual(1)
  })
})

describe('removeLibraryFromWell', () => {
  let run, payload, state, position

  beforeEach(() => {
    run = Run.build()
    state = { currentRun: run }
    position = 'A1'
    payload = { index: 0, position: position }
  })

  it('adds a library object to the given well', () => {
    Mutations.addEmptyLibraryToWell(state, position)
    Mutations.removeLibraryFromWell(state, payload)
    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(well.libraries.length).toEqual(0)
  })
})

describe('addLibraryToWell', () => {
  let payload, state, position, library1

  beforeEach(() => {
    let run = Run.build()
    state = { currentRun: run }
    position = 'A1'
    library1 = { id: 1, barcode: 'TRAC-1' }
    payload = { position: position, index: 0, with: library1 }
  })

  it('adds a library object to the given well', () => {
    Mutations.addEmptyLibraryToWell(state, position)
    Mutations.addLibraryToWell(state, payload)
    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(well.libraries[0]).toEqual(library1)
  })

  it('can add multiple library objects to the given well', () => {
    let library2 = { id: 2, barcode: 'TRAC-2' }
    let payload2 = { position: position, index: 1, with: library2 }

    Mutations.addEmptyLibraryToWell(state, position)
    Mutations.addLibraryToWell(state, payload)
    Mutations.addLibraryToWell(state, payload2)
    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(well.libraries.length).toEqual(2)
    expect(well.libraries[0]).toEqual(library1)
    expect(well.libraries[1]).toEqual(library2)
  })

  it('can add a library to the given well without an index', () => {
    payload = { position: position, with: library1 }
    Mutations.addLibraryToWell(state, payload)
    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(well.libraries[0]).toEqual(library1)
  })
})

describe('addEmptyPoolToWell', () => {
  let run, position, state

  beforeEach(() => {
    run = Run.build()
    state = { currentRun: run }
    position = 'F1'
  })

  it('adds a pool object to the given well', () => {
    Mutations.addEmptyPoolToWell(state, position)
    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(well.pools.length).toEqual(1)
  })
})

describe('removePoolFromWell', () => {
  let run, payload, state, position

  beforeEach(() => {
    run = Run.build()
    state = { currentRun: run }
    position = 'A1'
    payload = { index: 0, position: position }
  })

  it('removes a pool object to the given well', () => {
    Mutations.addEmptyPoolToWell(state, position)
    Mutations.removePoolFromWell(state, payload)
    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(well.pools.length).toEqual(0)
  })
})

describe('addPoolToWell', () => {
  let payload, state, position, pool1

  beforeEach(() => {
    let run = Run.build()
    state = { currentRun: run }
    position = 'A1'
    pool1 = { id: 1, barcode: 'TRAC-1', type: 'pools', libraries: [] }
    payload = { position: position, index: 0, with: pool1 }
  })

  it('adds a pool object to the given well', () => {
    Mutations.addEmptyPoolToWell(state, position)
    Mutations.addPoolToWell(state, payload)
    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(well.pools[0]).toEqual(pool1)
  })

  it('can add multiple pool objects to the given well', () => {
    let pool2 = { id: 2, barcode: 'TRAC-2', type: 'pools', libraries: [] }
    let payload2 = { position: position, index: 1, with: pool2 }

    Mutations.addEmptyPoolToWell(state, position)
    Mutations.addPoolToWell(state, payload)
    Mutations.addPoolToWell(state, payload2)
    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(well.pools.length).toEqual(2)
    expect(well.pools[0]).toEqual(pool1)
    expect(well.pools[1]).toEqual(pool2)
  })

  it('can add a pool to the given well without an index', () => {
    payload = { position: position, with: pool1 }
    Mutations.addPoolToWell(state, payload)
    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(well.pools[0]).toEqual(pool1)
  })
})
