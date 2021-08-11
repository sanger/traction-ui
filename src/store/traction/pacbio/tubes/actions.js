import handlePromise from '@/api/PromiseHelper'

const isLibraryBarcodeValid = async ({ dispatch }, barcode) => {
  if (!barcode) {
    return false
  }
  let libraryTube = await dispatch('getTubeForBarcode', barcode)
  return validateLibraryTube(libraryTube)
}

const getTubeForBarcode = async ({ rootGetters }, barcode) => {
  let request = rootGetters['traction/pacbio/tubes/tubeRequest']
  let promise = request.get({ filter: { barcode: barcode }, include: 'materials' })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    return response.deserialize.tubes[0]
  }
}

const validateLibraryTube = (tube) => {
  if (!tube) {
    return false
  }
  if (!tube.materials) {
    return false
  }
  if (!tube.materials.every((m) => m.material_type === 'library')) {
    return false
  }

  return true
}

const actions = {
  isLibraryBarcodeValid,
  isPoolBarcodeValid: isLibraryBarcodeValid,
  getTubeForBarcode,
}

export { isLibraryBarcodeValid, getTubeForBarcode, validateLibraryTube }

export default actions
