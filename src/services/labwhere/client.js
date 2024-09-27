import { extractLocationsForLabwares } from './helpers.js'

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
  try {
    const rawResponse = await fetch(
      `${import.meta.env['VITE_LABWHERE_BASE_URL']}/api/labwares/searches`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barcodes: [...labwhereBarcodes],
        }),
      },
    )
    const response = await rawResponse.json()

    if (!rawResponse.ok) {
      return { success: false, errors: response.errors, data: {} }
    }

    const locations = extractLocationsForLabwares(response, labwhereBarcodes)
    return { success: true, errors: [], data: locations }
  } catch (error) {
    // If there is a failure when accessing LabWhere, return a failed response.
    return { success: false, errors: [`Failed to access LabWhere: ${error.message}`], data: {} }
  }
}

export { getLabwhereLocations }
