import Vue from 'vue'
import { dataToObjectById } from '@/api/JsonApi'

const mutate = (key) => (state, val) => {
  state[key] = val
}

const mutateRun = (key) => (state, val) => {
  state.currentRun[key] = val
}

const mutateWellDefaults = (key) => (state, val) => {
  Vue.set(state.currentRun.wellDefaults, key, val)
}

const mutations = {
  setRuns(state, runs) {
    state.runs = dataToObjectById({ data: runs, includeRelationships: false })
  },

  // setRuns: mutate('runs'),
  setCurrentRun: mutate('currentRun'),
  setSequencingKitBoxBarcode: mutateRun('sequencing_kit_box_barcode'),
  setDNAControlComplexBoxBarcode: mutateRun('dna_control_complex_box_barcode'),
  setComments: mutateRun('comments'),
  setSystemName: mutateRun('system_name'),
  setSmrtLinkVersionId: mutateRun('smrt_link_version_id'),
  setDefaultBindingKitBoxBarcode: mutateWellDefaults('binding_kit_box_barcode'),
  setDefaultMovieTime: mutateWellDefaults('movie_time'),
  setDefaultGenerateHifi: mutateWellDefaults('generate_hifi'),
  setDefaultCcsAnalysisOutput: mutateWellDefaults('ccs_analysis_output'),
  setDefaultPreExtensionTime: mutateWellDefaults('pre_extension_time'),
  setDefaultLoadingTargetP1PlusP2: mutateWellDefaults('loading_target_p1_plus_p2'),
  setDefaultOnPlateLoadingConcentration: mutateWellDefaults('on_plate_loading_concentration'),
  setDefaultCcsAnalysisOutputIncludeKineticsInformation: mutateWellDefaults(
    'ccs_analysis_output_include_kinetics_information',
  ),
  setDefaultCcsAnalysisOutputIncludeLowQualityReads: mutateWellDefaults(
    'ccs_analysis_output_include_low_quality_reads',
  ),
  setDefaultDemultiplexBarcodes: mutateWellDefaults('demultiplex_barcodes'),
  setDefaultIncludeFivemcCallsInCpgMotifs: mutateWellDefaults('include_fivemc_calls_in_cpg_motifs'),

  createWell(state, well) {
    state.currentRun.plate.wells.push(well)
  },
  updateWell(state, well) {
    const wellIndex = state.currentRun.plate.wells.findIndex((w) => w.position === well.position)
    state.currentRun.plate.wells.splice(wellIndex, 1, well)
  },
  deleteWell(state, well) {
    const wellIndex = state.currentRun.plate.wells.findIndex((w) => w.position === well.position)

    // If well exists in DB we want to delete it from db when run is updated
    well.id ? state.currentRun.plate.wellsToDelete.push(well.id) : ''
    state.currentRun.plate.wells.splice(wellIndex, 1)
  },
}

export default mutations
