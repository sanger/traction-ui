// A series of data extraction helpers for interfacing with the data from the LabWhere API.

import { scanBarcodesInLabwhereLocation } from '@/services/labwhere/client.js'

/**
 * Extracts the locations for a given set of labwares based on their barcodes.
 *
 * @param {Array} labwares - An array of labware objects, each containing a `barcode` and `location` property.
 * @param {Array} labwhereBarcodes - An array of barcodes to find locations for.
 * @returns {Object} A mapping of barcodes to their corresponding locations. If a barcode is not found, an empty object is returned for that barcode.
 */

const extractLocationsForLabwares = (labwares, labwhereBarcodes) =>
  labwhereBarcodes.reduce((locationMap, barcode) => {
    locationMap[barcode] = labwares.find((labware) => labware.barcode === barcode)?.location || {}
    return locationMap
  }, {})

/**
 * Retrieves the coordinate for a specific labware within a given location.
 *
 * @param {Object} location - The location object containing coordinates.
 * @param {string} labwareBarcode - The barcode of the labware to find.
 * @returns {Object} The coordinate object for the specified labware, or an empty object if not found.
 */
const getCoordinateForLabware = (location, labwareBarcode) => {
  return location?.coordinates?.find((coordinate) => coordinate.labware === labwareBarcode) || {}
}

/**
 * Builds location information for each item based on available location data.
 *
 * @param {Array} items - List of items to find locations for.
 * @param {Array} locationsData - Array of location data containing coordinates and names.
 * @returns {Array} Updated items with location information.
 */
const locationBuilder = (items, locationsData = []) => {
  return items.map((item) => {
    const location = locationsData.find(
      (loc) =>
        loc.barcode === item.barcode || loc.barcode === item.source_identifier?.split(':')[0],
    )
    return {
      ...item,
      location: location
        ? location.coordinates && Object.keys(location.coordinates).length
          ? `${location.name} - ${location.coordinates.row}, ${location.coordinates.column}`
          : location.name
        : '-',
    }
  })
}

/**
 * Formats location data by extracting barcodes, names, and coordinates.
 *
 * @param {Object} locationData - Object containing location details with data property.
 * @returns {Promise<Array>} Promise resolving to an array of formatted location objects.
 */
const formatLocations = (locationData) => {
  const extractedLocations = Object.entries(locationData.data).map(([barcode, item]) => ({
    barcode,
    name: item.name || '-', // Default to '-' if no name
    coordinates: item.coordinates || null,
  }))

  const formattedLocations = extractedLocations.map((location) => {
    const coordinates = getCoordinateForLabware(location, location.barcode)
    return {
      ...location,
      coordinates,
    }
  })

  return formattedLocations
}

/**
 * Scans barcodes into a specified location in LabWhere.
 *
 * @param {string} userCode - The user code performing the scan.
 * @param {string} location - The location where the barcodes will be scanned.
 * @param {string} barcodes - barcode list.
 * @returns {Object} An object indicating the result of the scan.
 *                   The object contains a `type` property ('success' or 'danger') and a `text` property with the message.
 *                   Used to display a success or error alert.
 */
const scanInBarcodesToLocation = async (userCode, location, barcodes) => {
  const labwhereResponse = await scanBarcodesInLabwhereLocation(userCode, location, barcodes)
  return labwhereResponse.success
    ? { type: 'success', text: labwhereResponse.message }
    : { type: 'danger', text: labwhereResponse.errors.join('\n') }
}

export {
  extractLocationsForLabwares,
  getCoordinateForLabware,
  locationBuilder,
  formatLocations,
  scanInBarcodesToLocation,
}
