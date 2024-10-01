import { extractLocationsForLabwares } from './helpers.js'
import { FetchWrapper } from '@/api/FetchWrapper.js'

const labwhereFetch = new FetchWrapper(import.meta.env['VITE_LABWHERE_BASE_URL'], 'LabWhere')
/**
 * Fetches the locations of labwares from LabWhere based on provided barcodes.
 *
 * @param {string[]} labwhereBarcodes - An array of labware barcodes to search for.
 * @returns {Promise<{success: boolean, errors: string[], data: Object}>} - A promise that resolves to an object containing the success status, any errors, and the data (locations).
 *
 * @example
 * const barcodes = ['barcode1', 'barcode2'];
 * getLabwhereLocations(barcodes).then(response => {
 *   if (response.success) {
 *     console.log('Locations:', response.data);
 *   } else {
 *     console.error('Errors:', response.errors);
 *   }
 * });
 */
const getLabwhereLocations = async (labwhereBarcodes) => {
  // If no barcodes are provided, return a failed response.
  if (!labwhereBarcodes || labwhereBarcodes.length === 0) {
    return { success: false, errors: ['No barcodes provided'], data: {} }
  }
  const response = await labwhereFetch.post(
    '/api/labwares/searches',
    JSON.stringify({ barcodes: [...labwhereBarcodes] }),
  )
  if (response.success) {
    response.data = extractLocationsForLabwares(response.data, labwhereBarcodes)
  }
  return response
}

const storeBarcodesIntoLabwhereLocation = async (userCode,locationBarcode,labwareBarcodes, startPosition) => {

  if(!userCode || !labwareBarcodes || !locationBarcode) {
    return { success: false, errors: ['Missing required parameters'] }
  }

  const params = {
    'scan[user_code]': userCode,
    'scan[labware_barcodes]': labwareBarcodes,
    'scan[location_barcode]': locationBarcode,
  }

  if (startPosition) {
    params['scan[start_position]'] = startPosition
  }
  const response = await labwhereFetch.post(
    '/api/scans',
    new URLSearchParams(params).toString(),
    'application/x-www-form-urlencoded'
  )
  return {success: response.success, errors: response.errors};
}


export { getLabwhereLocations,storeBarcodesIntoLabwhereLocation }
