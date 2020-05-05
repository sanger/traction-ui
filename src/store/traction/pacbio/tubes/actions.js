import handlePromise  from '@/api/PromiseHelper'

const isLibraryBarcodeValid = async ({ dispatch }, barcode) => {
  if (!barcode) { return false }
  let libraryTube = await dispatch('getTubeForBarcode', barcode)
  return validateLibraryTube(libraryTube)
}

// TODO: Use libraries resource instead 
const getTubeForBarcode = async ({ rootGetters }, barcode) => {
  let request = rootGetters["traction/pacbio/tubes/tubeRequest"]
  let promise = request.get({ filter: { barcode: barcode } })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    return response.deserialize.tubes[0]
  }
}

// If using library resouce, won't need to validate
// As we know it will be a library
const validateLibraryTube = (tube) => {
  if (!tube) { return false }
  if (!tube.materials) { return false }
  if (!tube.materials.every(m => m.material_type === 'library')) { return false }

  return true
}

const actions = {
  isLibraryBarcodeValid,
  getTubeForBarcode,
}

export {
  isLibraryBarcodeValid,
  getTubeForBarcode,
  validateLibraryTube,
}

export default actions
