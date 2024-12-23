import { getLabwhereLocations } from '@/services/labwhere/client.js'
import { formatLocations } from '@/services/labwhere/helpers.js'

/**
 * A composable function to fetch and format location data for given barcodes.
 *
 * @returns {Object} An object containing:
 *   @property {Function} fetchLocations - Fetches locations for specified barcodes.
 */
export default function useLocationFetcher() {
  let locationData = []

  /**
   * Fetches location data for an array of barcodes.
   *
   * @param {Array<string>} barcodes - List of barcodes to fetch locations for.
   * @returns {Promise<Array>} Promise resolving to an array of location objects,
   * each with `barcode` and either `name` and `coordinates` or default values.
   */
  const fetchLocations = async (barcodes) => {
    const defaultLocations = barcodes.map((barcode) => ({
      barcode,
      name: '-', // Default name for missing barcodes
    }))

    try {
      const trimmedBarcodes = barcodes.map((barcode) =>
        barcode.includes(':') ? barcode.split(':')[0] : barcode,
      )

      const extractedLocations = await getLabwhereLocations(trimmedBarcodes)
      locationData = formatLocations(extractedLocations)
    } catch (error) {
      console.error('Error fetching locations:', error)
      locationData = defaultLocations // Emit default locations on error
    }
    return locationData
  }

  return {
    fetchLocations,
  }
}
