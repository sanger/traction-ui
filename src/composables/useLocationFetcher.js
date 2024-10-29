import { getLabwhereLocations } from '@/services/labwhere/client.js'
import { formatLocations } from '@/services/labwhere/helpers.js'

export function useLocationFetcher() {
  let locationData = []

  const fetchLocations = async (barcodes) => {
    const defaultLocations = barcodes.map((barcode) => ({
      barcode,
      name: '-', // Default name for missing barcodes
    }))

    if (barcodes.length === 0) {
      return defaultLocations
    }

    try {
      const extractedLocations = await getLabwhereLocations(barcodes)
      locationData = await formatLocations(extractedLocations)
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
