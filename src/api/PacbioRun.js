import handlePromise from './PromiseHelper'
const PRE_EXTENSION_TIME_DEFAULT = 2
const CCS_ANALYSIS_OUTPUT_DEFAULT = 'Yes'

// TODO: fix requests here for DPL-022

const buildWell = (
  row,
  column,
  generate_hifi = '',
  pre_extension_time = PRE_EXTENSION_TIME_DEFAULT,
  ccs_analysis_output = CCS_ANALYSIS_OUTPUT_DEFAULT,
) => ({
  row,
  column,
  position: `${row}${column}`,
  movie_time: '',
  insert_size: '',
  on_plate_loading_concentration: '',
  generate_hifi,
  ccs_analysis_output,
  libraries: [],
  pre_extension_time,
})

const build = (object) => {
  return (
    object || {
      id: 'new',
      binding_kit_box_barcode: '',
      sequencing_kit_box_barcode: '',
      dna_control_complex_box_barcode: '',
      comments: '',
      system_name: '',
      plate: {
        wells: [],
      },
    }
  )
}

const create = async (run, request) => {
  let runId
  let responses = []

  try {
    let runPayload = createRunPayload(run)
    let runResponse = await createResource(runPayload, request.runs)
    responses.push(runResponse)
    runId = runResponse.deserialize.runs[0].id

    let platePayload = createPlatePayload(runId)
    let plateResponse = await createResource(platePayload, request.runs.plates)
    responses.push(plateResponse)
    let plateId = plateResponse.deserialize.plates[0].id

    let wellsWithLibraries = run.plate.wells.filter((well) => well.libraries.length != 0)
    let wellsPayload = createWellsPayload(wellsWithLibraries, plateId)
    let wellResponse = await createResource(wellsPayload, request.runs.wells)
    responses.push(wellResponse)
  } catch (err) {
    destroy(runId, request.runs)
    return err.message
  }
  return []
}

const createResource = async (payload, request) => {
  let response = await handlePromise(request.create(payload))
  if (response.successful) {
    return response
  } else {
    throw response.errors
  }
}

const update = async (run, request) => {
  let responses = []

  try {
    let runPayload = updateRunPayload(run)
    let runResponse = await updateResource(runPayload, request.runs)
    responses.push(runResponse)
    let wellsWithLibraries = run.plate.wells.filter((well) => well.libraries.length != 0)
    for (const well of wellsWithLibraries) {
      if (well.id) {
        // Well exists - Update well
        let wellPayload = updateWellPayload(well)
        let wellResponse = await updateResource(wellPayload, request.runs.wells)
        responses.push(wellResponse)
      } else {
        // Well does not exist - Create well
        let wellPayload = createWellsPayload([well], run.plate.id)
        let wellResponse = await createResource(wellPayload, request.runs.wells)
        responses.push(wellResponse)
      }
    }
  } catch (err) {
    return [err.message]
  }
  return []
}

const updateResource = async (payload, request) => {
  const promise = await request.update(payload)
  const response = await handlePromise(promise)

  if (response.successful) {
    return response
  } else {
    throw response.errors
  }
}

const createRunPayload = (run) => {
  return {
    data: {
      type: 'runs',
      attributes: {
        binding_kit_box_barcode: run.binding_kit_box_barcode,
        sequencing_kit_box_barcode: run.sequencing_kit_box_barcode,
        dna_control_complex_box_barcode: run.dna_control_complex_box_barcode,
        system_name: run.system_name,
        comments: run.comments,
      },
    },
  }
}

const createPlatePayload = (runId) => {
  return {
    data: {
      type: 'plates',
      attributes: {
        pacbio_run_id: runId,
      },
    },
  }
}

const createWellsPayload = (wells, plateId) => {
  let wellsAttributes = wells.reduce((accumulator, well) => {
    let librariesAttributes = well.libraries.map((l) => {
      return { type: 'libraries', id: l.id }
    })

    accumulator.push({
      row: well.row,
      column: well.column,
      movie_time: well.movie_time,
      insert_size: well.insert_size,
      on_plate_loading_concentration: well.on_plate_loading_concentration,
      generate_hifi: well.generate_hifi,
      ccs_analysis_output: well.ccs_analysis_output,
      pre_extension_time: well.pre_extension_time,
      relationships: {
        plate: {
          data: {
            type: 'plates',
            id: plateId,
          },
        },
        libraries: {
          data: librariesAttributes,
        },
      },
    })
    return accumulator
  }, [])

  return {
    data: {
      type: 'wells',
      attributes: {
        wells: wellsAttributes,
      },
    },
  }
}

const updateRunPayload = (run) => {
  return {
    data: {
      id: run.id,
      type: 'runs',
      attributes: {
        binding_kit_box_barcode: run.binding_kit_box_barcode,
        sequencing_kit_box_barcode: run.sequencing_kit_box_barcode,
        dna_control_complex_box_barcode: run.dna_control_complex_box_barcode,
        system_name: run.system_name,
        comments: run.comments,
      },
    },
  }
}

const updateWellPayload = (well) => {
  let librariesAttributes = well.libraries.map((l) => {
    return { type: 'libraries', id: l.id }
  })

  return {
    data: {
      id: well.id,
      type: 'wells',
      attributes: {
        row: well.row,
        column: well.column,
        movie_time: well.movie_time,
        insert_size: well.insert_size,
        on_plate_loading_concentration: well.on_plate_loading_concentration,
        generate_hifi: well.generate_hifi,
        ccs_analysis_output: well.ccs_analysis_output,
        pre_extension_time: well.pre_extension_time,
      },
      relationships: {
        libraries: {
          data: librariesAttributes,
        },
      },
    },
  }
}

const destroy = async (id, request) => {
  let promise = request.destroy(id)
  return await handlePromise(promise)
}

export {
  build,
  buildWell,
  create,
  createResource,
  createRunPayload,
  createPlatePayload,
  createWellsPayload,
  update,
  updateResource,
  updateRunPayload,
  updateWellPayload,
  destroy,
}
