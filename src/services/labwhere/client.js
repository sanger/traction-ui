import { extractLocationsForLabwares } from './helpers.js'
import { FetchWrapper } from '@/api/FetchWrapper.js'

const labwhereFetch = FetchWrapper(import.meta.env['VITE_LABWHERE_BASE_URL'], 'LabWhere')
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
  const params = new URLSearchParams()
  labwhereBarcodes.forEach((barcode) => {
    params.append('barcodes[]', barcode)
  })

  const response = await labwhereFetch.post('/api/labwares/searches', params, 'multipart/form-data')

  if (response.success) {
    response.data = extractLocationsForLabwares(response.data, labwhereBarcodes)
  }
  return response
}

/**
 * Scan labware barcodes into a specified location in LabWhere.
 * 
 * The content type is set to 'application/x-www-form-urlencoded' to use 'safe' headers for the cross-origin request instead of 'application/json'.
 * This is necessary for the POST request to be successful; otherwise, it will be blocked by CORS policy due to the pre-flight request check performed on non-safe content types.
 * Refer to https://javascript.info/fetch-crossorigin for more information.

 *
 * @param {string} userCode - The user code or swipecard.
 * @param {string} locationBarcode - The barcode of the location where labware will be stored.
 * @param {string} labwareBarcodes - The barcodes of the labware to be stored, separated by newlines.
 * @param {number|null} [startPosition=null] - The starting position for storing the labware (optional).
 * @returns {Promise<{success: boolean, errors: string[]}>} - A promise that resolves to an object containing the success status, any errors, and the data.
 *
 * @example
 * const userCode = 'user123';
 * const locationBarcode = 'location123';
 * const labwareBarcodes = 'barcode1\nbarcode2';
 * const startPosition = 1;
 * scanBarcodesInLabwhereLocation(userCode, locationBarcode, labwareBarcodes, startPosition).then(response => {
 *   if (response.success) {
 *     console.log('Barcodes stored successfully');
 *   } else {
 *     console.error('Errors:', response.errors);
 *   }
 * });
 */
const scanBarcodesInLabwhereLocation = async (
  userCode,
  locationBarcode,
  labwareBarcodes,
  startPosition,
) => {
  if (!userCode || !labwareBarcodes) {
    return { success: false, errors: ['Required parameters are missing for the Scan In operation'] }
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
    'application/x-www-form-urlencoded',
  )
  return { success: response.success, errors: response.errors, message: response.data.message }
}

export { getLabwhereLocations, scanBarcodesInLabwhereLocation }
