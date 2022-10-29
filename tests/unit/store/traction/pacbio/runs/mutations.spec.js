import Mutations from '@/store/traction/pacbio/runs/mutations'
import Actions from '@/store/traction/pacbio/runs/actions'
import * as Run from '@/api/PacbioRun'
import { Data } from '@support/testHelper'
import storeRuns from '@tests/data/StoreRuns'

describe('mutate', () => {
  let state

  it('"setRuns" sets "state.runs" to the given runs', () => {
    const { data: runs } = Data.PacbioRuns.data
    state = {
      runs: {},
    }
    Mutations.setRuns(state, runs)
    expect(state.runs).toEqual(storeRuns)
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

  it('can set the default v11 smrt link options in the state', () => {
    const binding_kit_box_barcode = 'BKBC1'
    const loading_target_p1_plus_p2 = 0.4
    const movie_time = 10
    const on_plate_loading_concentration = 11
    const pre_extension_time = 2
    const ccs_analysis_output_include_kinetics_information = 'Yes'
    const ccs_analysis_output_include_low_quality_reads = 'No'
    const demultiplex_barcodes = 'In SMRT Link'
    const include_fivemc_calls_in_cpg_motifs = 'Yes'

    Mutations.setDefaultBindingKitBoxBarcode(state, binding_kit_box_barcode)
    Mutations.setDefaultLoadingTargetP1PlusP2(state, loading_target_p1_plus_p2)
    Mutations.setDefaultMovieTime(state, movie_time)
    Mutations.setDefaultOnPlateLoadingConcentration(state, on_plate_loading_concentration)
    Mutations.setDefaultPreExtensionTime(state, pre_extension_time)
    Mutations.setDefaultCcsAnalysisOutputIncludeKineticsInformation(
      state,
      ccs_analysis_output_include_kinetics_information,
    )
    Mutations.setDefaultCcsAnalysisOutputIncludeLowQualityReads(
      state,
      ccs_analysis_output_include_low_quality_reads,
    )
    Mutations.setDefaultDemultiplexBarcodes(state, demultiplex_barcodes)
    Mutations.setDefaultIncludeFivemcCallsInCpgMotifs(state, include_fivemc_calls_in_cpg_motifs)

    expect(state.currentRun.wellDefaults.binding_kit_box_barcode).toEqual(binding_kit_box_barcode)
    expect(state.currentRun.wellDefaults.loading_target_p1_plus_p2).toEqual(
      loading_target_p1_plus_p2,
    )
    expect(state.currentRun.wellDefaults.movie_time).toEqual(movie_time)
    expect(state.currentRun.wellDefaults.on_plate_loading_concentration).toEqual(
      on_plate_loading_concentration,
    )
    expect(state.currentRun.wellDefaults.pre_extension_time).toEqual(pre_extension_time)
    expect(state.currentRun.wellDefaults.ccs_analysis_output_include_kinetics_information).toEqual(
      ccs_analysis_output_include_kinetics_information,
    )
    expect(state.currentRun.wellDefaults.ccs_analysis_output_include_low_quality_reads).toEqual(
      ccs_analysis_output_include_low_quality_reads,
    )
    expect(state.currentRun.wellDefaults.demultiplex_barcodes).toEqual(demultiplex_barcodes)
    expect(state.currentRun.wellDefaults.include_fivemc_calls_in_cpg_motifs).toEqual(
      include_fivemc_calls_in_cpg_motifs,
    )
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
