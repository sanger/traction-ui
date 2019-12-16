import * as PacbioRun from '@/api/PacbioRun'

const mutate = key => (state, val) => {
    state[key] = val
}

const mutateRun = key => (state, val) => {
    state.currentRun[key] = val
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
        let currentWell = state.currentRun.plate.wells.filter(well => well.position === payload.position)[0]

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
    }
}

export default mutations