import { extractLocationsForLabwares } from './helpers.js'
import { FetchWrapper } from '@/api/FetchWrapper.js'

const labwhereFetch = FetchWrapper(import.meta.env['VITE_LABWHERE_BASE_URL'], 'LabWhere', 'multipart/form-data')
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
  const params = new URLSearchParams();
  labwhereBarcodes.forEach(barcode => {
    params.append('barcodes[]', barcode);
  });

  const response = await labwhereFetch.post(
    '/api/labwares/searches',
    params
  );

  if (response.success) {
    response.data = extractLocationsForLabwares(response.data, labwhereBarcodes)
  }
  return response
}

export { getLabwhereLocations }
