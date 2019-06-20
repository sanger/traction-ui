import handlePromise from '@/api/PromiseHelper'

// request - a Api.Request object
// return - a Api.Response object
const getTubesForBarcodes = async (barcodes, request) => {
  let barcodeString = queryString(barcodes)
  if(!barcodeString) return
  let promise = request.get({filter: { barcode: barcodeString} })
  return await handlePromise(promise)
}

// barcodes - a list of barcodes
const queryString = (barcodes) => {
  if (barcodes === undefined || !barcodes.length) return ''
  return barcodes.split('\n').filter(Boolean).join(',')
}

export {
  getTubesForBarcodes,
  queryString
}

export default getTubesForBarcodes
