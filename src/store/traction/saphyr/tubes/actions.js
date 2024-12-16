import handleResponse from '@/api/ResponseHelper.js'
import { dataToObjectById } from '@/api/JsonApi.js'

const getTractionTubesForBarcodes = async ({ commit, getters }, barcodes) => {
  const request = getters.tubeRequest
  const barcodeString = barcodes.join(',')
  const promise = request.get({ filter: { barcode: barcodeString }, include: 'materials' })
  const response = await handleResponse(promise)
  const {
    body: { data = {} },
    success,
  } = response
  if (success) {
    const tubes = dataToObjectById({ data, includeRelationships: true })
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
  const response = await handleResponse(promise)

  return response
}

const deleteLibraries = async ({ getters }, libraryIds) => {
  const request = getters.libraryRequest
  const promises = request.destroy(libraryIds)

  const responses = await Promise.all(promises.map((promise) => handleResponse(promise)))
  return responses
}

const setLibraries = async ({ commit, getters }) => {
  const request = getters.libraryRequest
  const promise = request.get()
  let libraries = null

  const response = await handleResponse(promise)
  const {
    body: { data = {} },
    success,
  } = response
  if (success) {
    libraries = dataToObjectById({ data, includeRelationships: true })
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
