import { extractLocationsForLabwares } from './helpers.js'
import { FetchWrapper } from '@/api/FetchWrapper.js'
import {
  fetchLibraries,
  exhaustLibrayVolume,
  formatAndTransformLibraries,
} from '@/stores/utilities/pacbioLibraries.js'

const labwhereFetch = FetchWrapper(import.meta.env['VITE_LABWHERE_BASE_URL'], 'LabWhere')
const destroyLocation = import.meta.env['VITE_DESTROYED_LOCATION_BARCODE']
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
 * @param {string} labwareBarcodes - The barcodes of the labware (library barcode or the plate / tube barcode for samples) to be stored, separated by newlines.
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

const exhaustSamplesIfDestroyed = async (locationBarcode, labwareBarcodes) => {
  if (locationBarcode !== destroyLocation) return { success: false }
  let librariesToDestroy = []

  const fetchAndMergeLibraries = async (barcodes, filterKey) => {
    const filterOptions = { filter: { [filterKey]: barcodes.join(',') } }
    const { success, libraries, tubes, tags, requests } = await fetchLibraries(filterOptions)
    if (success) {
      librariesToDestroy = [
        ...librariesToDestroy,
        ...formatAndTransformLibraries(libraries, tubes, tags, requests),
      ]
    }
  }
  await fetchAndMergeLibraries(labwareBarcodes, 'source_identifier')
  const barcodesNotFetchedAsSourceIdentifer = labwareBarcodes.filter(
    (barcode) => !librariesToDestroy.some((library) => library.source_identifier === barcode),
  )
  // If not all libraries are found by source_identifier, try fetching by barcode
  if (barcodesNotFetchedAsSourceIdentifer.length > 0) {
    //Fetch libraries which are not found by barcode
    await fetchAndMergeLibraries(barcodesNotFetchedAsSourceIdentifer, 'barcode')
  }
  if(!librariesToDestroy.length) return { success: false }
  const exhaustedLibraries = []
  await Promise.all(
    librariesToDestroy.map(async (library) => {
      const { success } = await exhaustLibrayVolume(library)
      if (success) {
        exhaustedLibraries.push(library)
      }
    }),
  )
  return { success: exhaustedLibraries.length>0, exhaustedLibraries }
}
export { getLabwhereLocations, scanBarcodesInLabwhereLocation, exhaustSamplesIfDestroyed }
