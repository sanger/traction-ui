import { extractLocationsForLabwares } from './helpers.js'
import { FetchWrapper } from '@/api/FetchWrapper.js'
import {
  exhaustLibrayVolume,
  formatAndTransformLibraries,
} from '@/stores/utilities/pacbioLibraries.js'
import { getPacbioLibraryResources } from '@/services/traction/PacbioLibrary.js'

const labwhereFetch = FetchWrapper(import.meta.env['VITE_LABWHERE_BASE_URL'], 'LabWhere')
const labwhereFetchV2 = FetchWrapper(import.meta.env['VITE_LABWHERE_V2_BASE_URL'], 'LabWhere')
const destroyLocation = import.meta.env['VITE_DESTROYED_LOCATION_BARCODE']
/**
 * Fetches the locations of labwares from LabWhere based on provided barcodes.
 *
 * @param {string[]} labwhereBarcodes - An array of labware barcodes to search for.
 * @param {Object} [fetchWrapper=labwhereFetch] - The fetch wrapper to use for the request (optional).
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
const getLabwhereLocations = async (labwhereBarcodes, fetchWrapper = labwhereFetch) => {
  // If no barcodes are provided, return a failed response.
  if (!labwhereBarcodes || labwhereBarcodes.length === 0) {
    return { success: false, errors: ['No barcodes provided'], data: {} }
  }
  const params = new URLSearchParams()
  labwhereBarcodes.forEach((barcode) => {
    params.append('barcodes[]', barcode)
  })

  const response = await fetchWrapper.post('/api/labwares/searches', params, 'multipart/form-data')

  return response.success
    ? { ...response, data: extractLocationsForLabwares(response.data, labwhereBarcodes) }
    : response
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
 * @param {string} labwareBarcodes - The barcodes of the labware (library barcode or the plate / tube barcode for samples) to be stored, separated by newlines.
 * @param {number|null} [startPosition=null] - The starting position for storing the labware (optional).
 * @param {Object} [fetchWrapper=labwhereFetch] - The fetch wrapper to use for the request (optional).
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
  fetchWrapper = labwhereFetch,
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
  const response = await fetchWrapper.post(
    '/api/scans',
    new URLSearchParams(params).toString(),
    'application/x-www-form-urlencoded',
  )
  return { success: response.success, errors: response.errors, message: response.data.message }
}
/**
 * Exhausts the volume of libraries if the location barcode matches the destroy location.
 *
 * @param {string} locationBarcode - The barcode of the location.
 * @param {Array<string>} labwareBarcodes - The barcodes of the labware.
 * @returns {Promise<Object>} - An object containing the success status and the exhausted libraries.
 */
const exhaustLibraryVolumeIfDestroyed = async (locationBarcode, labwareBarcodes) => {
  if (locationBarcode !== destroyLocation) return { success: false }
  let librariesToDestroy = []

  //Fetch libraries by filter key
  const fetchAndMergeLibraries = async (barcodes, filterKey) => {
    const filterOptions = { filter: { [filterKey]: barcodes.join(',') } }

    const { success, libraries, tags, requests } = await getPacbioLibraryResources(filterOptions)
    if (success) {
      librariesToDestroy = [
        ...librariesToDestroy,
        ...formatAndTransformLibraries(libraries, tags, requests),
      ]
    }
  }

  //Fetch libraries by source_identifier
  await fetchAndMergeLibraries(labwareBarcodes, 'source_identifier')
  const barcodesNotFetchedAsSourceIdentifer = labwareBarcodes.filter(
    (barcode) => !librariesToDestroy.some((library) => library.source_identifier === barcode),
  )
  // If not all libraries are found by source_identifier, try fetching by barcode
  if (barcodesNotFetchedAsSourceIdentifer.length > 0) {
    //Fetch libraries which are not found by barcode
    await fetchAndMergeLibraries(barcodesNotFetchedAsSourceIdentifer, 'barcode')
  }
  // If no libraries are found, return a failed response
  if (!librariesToDestroy.length) return { success: false }
  const exhaustedLibraries = []

  // Exhaust the volume of libraries
  await Promise.all(
    librariesToDestroy.map(async (library) => {
      const { success } = await exhaustLibrayVolume(library)
      if (success) {
        exhaustedLibraries.push(library)
      }
    }),
  )
  return { success: exhaustedLibraries.length > 0, exhaustedLibraries }
}

/**
 * Scans labware barcodes into a specified location in LabWhere (V2 API with Rust).
 *
 * @param {string} locationBarcode - The barcode of the location where labware will be stored.
 * @param {string} labwareBarcodes - The barcodes of the labware to be stored, separated by newlines.
 * @param {Object} [fetchWrapper=labwhereFetchV2] - The fetch wrapper to use for the request (optional).
 * @returns {Promise<{success: boolean, errors: string[], message: string}>} - A promise that resolves to an object containing:
 * - `success` (boolean): Whether the operation was successful.
 * - `errors` (string[]): An array of error messages, if any.
 * - `message` (string): A message describing the result of the operation.
 *
 * @example
 * const locationBarcode = 'location123';
 * const labwareBarcodes = 'barcode1\nbarcode2';
 * scanBarcodesInLabwhereLocationV2(locationBarcode, labwareBarcodes).then(response => {
 *   if (response.success) {
 *     console.log('Barcodes scanned successfully:', response.message);
 *   } else {
 *     console.error('Errors:', response.errors);
 *   }
 * });
 */
const scanBarcodesInLabwhereLocationV2 = async (
  userCode,
  locationBarcode,
  labwareBarcodes,
  startPosition,
  fetchWrapper = labwhereFetchV2,
) => {
  if (!labwareBarcodes) {
    return { success: false, errors: ['Required parameters are missing for the Scan In operation'] }
  }
  const response = await fetchWrapper.post('/scan', {
    labware_barcodes: labwareBarcodes,
    location_barcode: locationBarcode,
  })

  return { success: response.success, errors: response.errors, message: response.data.message }
}

/**
 * Fetches labware locations from Labwhere using the provided barcodes.
 *
 * @async
 * @function getLabwhereLocationsV2
 * @param {string[]} labwhereBarcodes - An array of labware barcodes to search for.
 * @param {Object} [fetchWrapper=labwhereFetchv2] - An optional fetch wrapper for making HTTP requests.
 * @param {Function} fetchWrapper.post - A function to perform POST requests.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *   - `success` {boolean}: Indicates whether the request was successful.
 *   - `errors` {string[]}: An array of error messages, if any.
 *   - `data` {Object}: The response data, including extracted locations for the provided barcodes.
 *
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * const barcodes = ['ABC123', 'DEF456'];
 * const result = await getLabwhereLocationsV2(barcodes);
 * if (result.success) {
 *   console.log('Locations:', result.data);
 * } else {
 *   console.error('Errors:', result.errors);
 * }
 */
const getLabwhereLocationsV2 = async (labwhereBarcodes, fetchWrapper = labwhereFetchV2) => {
  // If no barcodes are provided, return a failed response.
  if (!labwhereBarcodes || labwhereBarcodes.length === 0) {
    return { success: false, errors: ['No barcodes provided'], data: {} }
  }

  console.log('Labwhere barcodes:', labwhereBarcodes)

  const response = await fetchWrapper.post(
    '/searches',
    {
      labware_barcodes: labwhereBarcodes.join('\n'),
    },
    'application/json',
  )

  console.log(response)

  if (response.success) {
    response.data = extractLocationsForLabwares(response.data, labwhereBarcodes)
  }
  return response
}

export {
  getLabwhereLocations,
  getLabwhereLocationsV2,
  scanBarcodesInLabwhereLocation,
  exhaustLibraryVolumeIfDestroyed,
  scanBarcodesInLabwhereLocationV2,
}
