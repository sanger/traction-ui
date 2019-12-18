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
    mutateWell(state, payload) {
        let currentWell = getCurrentWell(state, payload.position)

        // If well does not exist - Build a new well
        if (!currentWell) {
            let position = payload.position
            // match() returns [original, row, column] e.g "A10 => ["A10", "A", "10"]
            let row = position.match(/(\S)(\d+)/)[1]
            let column = position.match(/(\S)(\d+)/)[2]

            currentWell = PacbioRun.buildWell(row, column)

            state.currentRun.plate.wells.push(currentWell)
        }

        currentWell[payload.property] = payload.with
    },
    addEmptyLibraryToWell(state, position) {
        let currentWell = getCurrentWell(state, position)
        if (!currentWell) {
            // If well does not exist - Build a new well
            let row = position.split("")[0] // e.g. A
            let column = position.split("")[1] // e.g. 1
            currentWell = PacbioRun.buildWell(row, column)
        }
        currentWell.libraries.push({ id: '', barcode: '' })
    },
    removeLibraryFromWell(state, payload) {
        let currentWell = getCurrentWell(state, payload.position)
        currentWell.libraries.splice(payload.index, 1)
    },
    addLibraryToWell(state, payload) {
        let index = payload.index
        let currentWell = state.currentRun.plate.wells.filter(well => well.position === payload.position)[0]
        if (index !== undefined) {
            currentWell.libraries[index] = payload.with
        } else {
            currentWell.libraries.push(payload.with)
        }
       
    }
}

export default mutations