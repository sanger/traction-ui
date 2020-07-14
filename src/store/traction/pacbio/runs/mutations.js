import * as PacbioRun from '@/api/PacbioRun'

const splitPosition = (position) => {
    // match() returns [original, row, column] e.g "A10 => ["A10", "A", "10"]
    return position.match(/(\S)(\d+)/).slice(1)
}

const mutate = key => (state, val) => {
    state[key] = val
}

const mutateRun = key => (state, val) => {
    state.currentRun[key] = val
}

const getCurrentWell = (state, position) => {
    let currentWell = state.currentRun.plate.wells.filter(well => well.position === position)[0]

    // If well does not exist - Build a new well
    if (!currentWell) {

        currentWell = PacbioRun.buildWell(...splitPosition(position))
        state.currentRun.plate.wells.push(currentWell)
    }

    return currentWell
}

const mutations = {
    setRuns: mutate('runs'),
    setCurrentRun: mutate('currentRun'),
    setBindingKitBoxBarcode: mutateRun('binding_kit_box_barcode'),
    setSequencingKitBoxBarcode: mutateRun('sequencing_kit_box_barcode'),
    setDNAControlComplexBoxBarcode: mutateRun('dna_control_complex_box_barcode'),
    setComments: mutateRun('comments'),
    setSystemName: mutateRun('system_name'),
    createWell(state, position) {

        let currentWell = PacbioRun.buildWell(...splitPosition(position))
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
        if (index !== undefined) {
            currentWell.libraries.splice(index, 1, payload.with)
            currentWell.libraries = [...currentWell.libraries]
        } else {
            currentWell.libraries.push(payload.with)
        }
    }
}

export default mutations