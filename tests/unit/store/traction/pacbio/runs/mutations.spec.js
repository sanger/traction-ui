import Mutations from '@/store/traction/pacbio/runs/mutations'
import Actions from '@/store/traction/pacbio/runs/actions'
import * as Run from '@/api/PacbioRun'
import { Data } from '@support/testHelper'
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
    run.system_name = 'Sequel IIe'
    state = { currentRun: run }
  })

  it('creates the well', async () => {
    position = 'A10'
    let wellObject = await Actions.buildWell({ state }, position)

    Mutations.createWell(state, wellObject)

    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(well).toBeDefined()
    expect(well.position).toEqual(position)
    expect(well.generate_hifi).toEqual('On Instrument')
  })
})

describe('updateWell', () => {
  let run, position, state

  beforeEach(() => {
    run = Run.build()
    run.plate.wells = []
    run.system_name = 'Sequel I'
    state = { currentRun: run }
  })

  it('updates the correct well from currentRun state', async () => {
    position = 'A10'
    let wellObject = await Actions.buildWell({ state }, position)
    Mutations.createWell(state, wellObject)
    let well = { ...wellObject, binding_kit_box_barcode: 'test_bkbb' }

    Mutations.updateWell(state, well)

    let updatedWell = state.currentRun.plate.wells.find((well) => well.position === position)
    expect(updatedWell.binding_kit_box_barcode).toBe('test_bkbb')
  })
})

describe('deleteWell', () => {
  let run, state

  beforeEach(() => {
    run = Run.build()
    run.plate.wells = []
    run.system_name = 'Sequel I'
    state = { currentRun: run }
  })

  it('removes well from currentRun state', async () => {
    let position = 'A10'
    let wellObject = await Actions.buildWell({ state }, position)
    Mutations.createWell(state, wellObject)
    let well = state.currentRun.plate.wells.find((well) => well.position === position)

    Mutations.deleteWell(state, well)

    expect(state.currentRun.plate.wells.indexOf(well)).toBe(-1)
    expect(state.currentRun.plate.wellsToDelete).toEqual([])
  })

  it('removes well from currentRun state and adds to wellsToDelete state if well has an ID', async () => {
    let position = 'A10'
    let wellObject = await Actions.buildWell({ state }, position)
    wellObject.id = '1' // Has an ID to show it exists in DB
    Mutations.createWell(state, wellObject)
    let well = state.currentRun.plate.wells.find((well) => well.position === position)

    Mutations.deleteWell(state, well)

    expect(state.currentRun.plate.wells.indexOf(well)).toBe(-1)
    expect(state.currentRun.plate.wellsToDelete).toEqual([wellObject.id])
  })
})
