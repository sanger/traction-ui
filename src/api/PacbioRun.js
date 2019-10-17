import handlePromise from './PromiseHelper'

const build = (object) => {
    let run = object || {
        id: 'new',
        name: '',
        template_prep_kit_box_barcode: '',
        binding_kit_box_barcode: '',
        sequencing_kit_box_barcode: '',
        dna_control_complex_box_barcode: '',
        comments: '',
        uuid: '',
        system_name: '',
        plate: {
            barcode: '',
            // create wells in seperate function
            wells: [
                { row: 'A', column: '1', movie_time: '', insert_size: '', on_plate_loading_concentration: '', sequencing_mode: '', library: { id: '' } },
                { row: 'A', column: '2', movie_time: '', insert_size: '', on_plate_loading_concentration: '', sequencing_mode: '', library: { id: '' } },
                { row: 'B', column: '1', movie_time: '', insert_size: '', on_plate_loading_concentration: '', sequencing_mode: '', library: { id: '' } },
                { row: 'B', column: '2', movie_time: '', insert_size: '', on_plate_loading_concentration: '', sequencing_mode: '', library: { id: '' } },
            ]
        }
    }
    // run.assign = (object) => { assign(this, object) }
    return run
}

const create = async (run, request) => {
    let id
    let responses = []

    try {
        let runPayload = {
            data: {
                type: "runs",
                attributes: {
                    name: run.name,
                    template_prep_kit_box_barcode: run.template_prep_kit_box_barcode,
                    binding_kit_box_barcode: run.binding_kit_box_barcode,
                    sequencing_kit_box_barcode: run.sequencing_kit_box_barcode,
                    dna_control_complex_box_barcode: run.dna_control_complex_box_barcode,
                    system_name: run.system_name,
                }
            }
        }

        let runResponse = await createResource(runPayload, request.runs)
        id = runResponse.deserialize.runs[0].id
        responses.push(runResponse)

        let platePayload = {
            data: {
                type: "plates",
                attributes: {
                    pacbio_run_id: id,
                    barcode: run.plate.barcode
                }
            }
        }

        let plateResponse = await createResource(platePayload, request.plates)
        id = plateResponse.deserialize.plates[0].id
        responses.push(plateResponse)

        for (const well of run.plate.wells) {
            let wellPayload = {
                data: {
                    type: "wells",
                    attributes: {
                        row: well.row,
                        column: well.column,
                        pacbio_plate_id: id,
                        movie_time: well.movie_time,
                        insert_size: well.insert_size,
                        on_plate_loading_concentration: well.on_plate_loading_concentration,
                        sequencing_mode: well.sequencing_mode,
                    }
                }
            }

            let wellResponse = await createResource(wellPayload, request.wells)
            responses.push(wellResponse)

            // create well library
        }

    } catch (err) {
        rollback(responses, request)
        return false
    }
    return true
}

const createResource = async (payload, request) => {
    let response = await handlePromise(request.create(payload))

    if (response.successful) {
        return response
    } else {
        throw response.errors
    }
}

const rollback = (responses, request) => {
    for (const response of responses) {
        let deserializedResponse = response.deserialize
        let type = Object.keys(deserializedResponse)[0]
        let id = deserializedResponse[type][0].id
        destroy(id, request[type])
    }

    return true
}

const destroy = async (id, request) => {
    let promise = request.destroy(id)

    return await handlePromise(promise)
}


export {
    build,
    create,
    createResource,
    rollback,
    destroy
}
