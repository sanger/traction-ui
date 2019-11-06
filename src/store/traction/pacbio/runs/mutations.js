const mutations = {
    setRuns(state, runs) {
        state.runs = runs
    },
    setCurrentRun(state, run) {
        state.currentRun = run
    },
    setName(state, name) {
        state.currentRun.name = name
    },
    setTemplatePrepKitBoxBarcode(state, barcode) {
        state.currentRun.template_prep_kit_box_barcode = barcode
    },
    setBindingKitBoxBarcode(state, barcode) {
        state.currentRun.binding_kit_box_barcode = barcode
    },
    setSequencingKitBoxBarcode(state, barcode) {
        state.currentRun.sequencing_kit_box_barcode = barcode
    },
    setDNAControlComplexBoxBarcode(state, barcode) {
        state.currentRun.dna_control_complex_box_barcode = barcode
    },
    setComments(state, comments) {
        state.currentRun.comments = comments
    },
    setSystemName(state, systemName) {
        state.currentRun.system_name = systemName
    },
    setLibraryBarcode(state, payload) {
        state.currentRun.plate.wells.filter(well => well.position === payload.position)[0].library = payload.library
    },
    setInsertSize(state, payload) {
        state.currentRun.plate.wells.filter(well => well.position === payload.position)[0].insert_size = payload.insertSize
    },
    setOnPlateLoadingConc(state, payload) {
        state.currentRun.plate.wells.filter(well => well.position === payload.position)[0].on_plate_loading_concentration = payload.onPlateLoadingConc
    },
    setMovieTime(state, payload) {
        state.currentRun.plate.wells.filter(well => well.position === payload.position)[0].movie_time = payload.movieTime
    },
    setSequencingMode(state, payload) {
        state.currentRun.plate.wells.filter(well => well.position === payload.position)[0].sequencing_mode = payload.sequencingMode
    }
}

export default mutations