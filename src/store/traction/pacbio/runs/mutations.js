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

        if (!currentWell) {
            // If well does not exist - Build a new well
            let row = payload.position.split("")[0] // e.g. A
            let column = payload.position.split("")[1] // e.g. 1
            currentWell = PacbioRun.buildWell(row, column)

            state.currentRun.plate.wells.push(currentWell)
        }
        debugger
        currentWell[payload.property] << payload.with
    },
}

export default mutations