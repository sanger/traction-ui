import * as PacbioRun from '@/api/PacbioRun'

const mutate = key => (state, val) => {
    state[key] = val
}

const mutateRun = key => (state, val) => {
    state.currentRun[key] = val
}

const getCurrentWell = (state, position) => {
    return state.currentRun.plate.wells.filter(well => well.position === position)[0]
}

const mutations = {
    setRuns: mutate('runs'),
    setCurrentRun: mutate('currentRun'),
    setName: mutateRun('name'),
    setTemplatePrepKitBoxBarcode: mutateRun('template_prep_kit_box_barcode'),
    setBindingKitBoxBarcode: mutateRun('binding_kit_box_barcode'),
    setSequencingKitBoxBarcode: mutateRun('sequencing_kit_box_barcode'),
    setDNAControlComplexBoxBarcode: mutateRun('dna_control_complex_box_barcode'),
    setComments: mutateRun('comments'),
    setSystemName: mutateRun('system_name'),
    createWell(state, position) {
        // match() returns [original, row, column] e.g "A10 => ["A10", "A", "10"]
        let row = position.match(/(\S)(\d+)/)[1]
        let column = position.match(/(\S)(\d+)/)[2]

        let currentWell = PacbioRun.buildWell(row, column)
        state.currentRun.plate.wells.push(currentWell)
    },
    mutateWell(state, payload) {
        let currentWell = getCurrentWell(state, payload.position)
        currentWell[payload.property] = payload.with
    },
    addEmptyLibraryToWell(state, position) {
        let currentWell = getCurrentWell(state, position)
        currentWell.libraries.push({ id: '', barcode: '' })
    },
    removeLibraryFromWell(state, payload) {
        let currentWell = getCurrentWell(state, payload.position)
        currentWell.libraries.splice(payload.index, 1)
    },
    addLibraryToWell(state, payload) {
        let index = payload.index
        let currentWell = getCurrentWell(state, payload.position)
        currentWell.libraries[index] = payload.with
    }
}

export default mutations