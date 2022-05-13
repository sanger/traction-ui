import handlePromise from './PromiseHelper'

// TODO: fix requests here for DPL-022

const DefaultSystemName = 'Sequel IIe'

const build = (object) => {
  return (
    object || {
      id: 'new',
      sequencing_kit_box_barcode: '',
      dna_control_complex_box_barcode: '',
      comments: '',
      system_name: DefaultSystemName,
      plate: {
        wells: [],
        wellsToDelete: [], // Needed so we know the ID of wells that should be deleted
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

    let wellsWithPools = run.plate.wells.filter((well) => well.pools.length != 0)
    let wellsPayload = createWellsPayload(wellsWithPools, plateId)
    let wellResponse = await createResource(wellsPayload, request.runs.wells)
    responses.push(wellResponse)
  } catch (err) {
    destroy(runId, request.runs)
    return err.message
  }
  return []
}

const createResource = async (payload, request) => {
  let response = await handlePromise(request.create({ data: payload }))
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
    let wellsWithPools = run.plate.wells.filter((well) => well.pools.length != 0)
    for (const well of wellsWithPools) {
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
    run.plate.wellsToDelete.forEach(async (wellId) => {
      try {
        const wellResponse = await destroy(wellId, request.runs.wells)
        responses.push(wellResponse)
      } catch (e) {
        console.error(e)
      }
    })
  } catch (err) {
    return [err.message]
  }
  return []
}

const updateResource = async (payload, request) => {
  const response = await handlePromise(request.update({ data: payload }))

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
  let wellsAttributes = wells.map((well) => {
    let poolsAttributes = well.pools.map(({ id }) => ({ type: 'pools', id }))

    return {
      row: well.row,
      column: well.column,
      movie_time: well.movie_time,
      on_plate_loading_concentration: well.on_plate_loading_concentration,
      generate_hifi: well.generate_hifi,
      ccs_analysis_output: well.ccs_analysis_output,
      pre_extension_time: well.pre_extension_time,
      binding_kit_box_barcode: well.binding_kit_box_barcode,
      loading_target_p1_plus_p2: well.loading_target_p1_plus_p2,
      relationships: {
        plate: {
          data: {
            type: 'plates',
            id: plateId,
          },
        },
        pools: {
          data: poolsAttributes,
        },
      },
    }
  })

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
        sequencing_kit_box_barcode: run.sequencing_kit_box_barcode,
        dna_control_complex_box_barcode: run.dna_control_complex_box_barcode,
        system_name: run.system_name,
        comments: run.comments,
      },
    },
  }
}

const updateWellPayload = (well) => {
  const poolsAttributes = well.pools.map((l) => {
    return { type: 'pools', id: l.id }
  })

  return {
    data: {
      id: well.id,
      type: 'wells',
      attributes: {
        ...well,
      },
      relationships: {
        pools: {
          data: poolsAttributes,
        },
      },
    },
  }
}

const destroy = async (id, request) => {
  let promise = request.destroy(id)
  // needs to be promise[0] as destroy return an array
  return await handlePromise(promise[0])
}

export {
  build,
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
