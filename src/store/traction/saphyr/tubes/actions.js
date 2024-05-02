import handlePromise from '@/api/v1/PromiseHelper'

const getTractionTubesForBarcodes = async ({ commit, getters }, barcodes) => {
  const request = getters.tubeRequest
  const barcodeString = barcodes.join(',')
  const promise = request.get({ filter: { barcode: barcodeString }, include: 'materials' })
  const response = await handlePromise(promise)
  if (response.successful && !response.empty) {
    const tubes = response.deserialize.tubes
    commit('setTubes', tubes)
  }
  return response
}

const createLibrariesInTraction = async ({ getters }, payload) => {
  const libraries = payload.samples.map((item) => {
    return {
      state: 'pending',
      saphyr_request_id: item.id,
      saphyr_enzyme_id: payload.enzymeID,
    }
  })

  const body = {
    data: {
      type: 'libraries',
      attributes: {
        libraries: libraries,
      },
    },
  }

  const request = getters.libraryRequest
  const promise = request.create({ data: body })
  const response = await handlePromise(promise)

  return response
}

const deleteLibraries = async ({ getters }, libraryIds) => {
  const request = getters.libraryRequest
  const promises = request.destroy(libraryIds)

  const responses = await Promise.all(promises.map((promise) => handlePromise(promise)))
  return responses
}

const setLibraries = async ({ commit, getters }) => {
  const request = getters.libraryRequest
  const promise = request.get()
  const response = await handlePromise(promise)
  let libraries = null

  if (response.successful && !response.empty) {
    libraries = response.deserialize.libraries

    commit('setLibraries', libraries)
  }

  return libraries
}

const actions = {
  getTractionTubesForBarcodes,
  createLibrariesInTraction,
  deleteLibraries,
  setLibraries,
}

export { getTractionTubesForBarcodes, createLibrariesInTraction, deleteLibraries, setLibraries }

export default actions
