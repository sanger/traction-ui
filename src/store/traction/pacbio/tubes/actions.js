import handlePromise from '@/api/PromiseHelper'

const isLibraryBarcodeValid = async ({ dispatch }, barcode) => {
  if (!barcode) {
    return false
  }
  let libraryTube = await dispatch('getTubeForBarcode', barcode)
  return validateLibraryTube(libraryTube)
}

const getTubeForBarcode = async ({ getters }, barcode) => {
  let request = getters.tubeRequest
  let promise = request.get({ filter: { barcode: barcode }, include: 'pools' })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    return response.deserialize.tubes[0]
  }
}

const validForRunCreation = (pool) => {
  return (
    pool.volume &&
    pool.concentration &&
    pool.template_prep_kit_box_barcode &&
    pool.fragment_size &&
    true
  )
}

const validateLibraryTube = ({ pools = [] } = {}) => {
  if (pools.length < 1) {
    return false
  }

  return pools.every(validForRunCreation)
}

const actions = {
  isLibraryBarcodeValid,
  isPoolBarcodeValid: isLibraryBarcodeValid,
  getTubeForBarcode,
}

export { isLibraryBarcodeValid, getTubeForBarcode, validateLibraryTube }

export default actions
