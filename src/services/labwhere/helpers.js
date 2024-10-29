// A series of data extraction helpers for interfacing with the data from the LabWhere API.

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

const locationBuilder = (items, locationsData) => {
  return items.map((item) => {
    const location = locationsData.find(
      (loc) => loc.barcode === item.barcode || loc.barcode === item.source_identifier,
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

const formatLocations = (locationData) => {
  const extractedLocations = Object.entries(locationData.data).map(([barcode, item]) => ({
    barcode,
    name: item.name || '-', // Default to '-' if no name
    coordinates: item.coordinates || null,
  }))

  const formattedLocations = Promise.all(
    extractedLocations.map(async (location) => {
      const coordinates = await getCoordinateForLabware(location, location.barcode)
      return {
        ...location,
        coordinates,
      }
    }),
  )

  return formattedLocations
}

export { extractLocationsForLabwares, getCoordinateForLabware, locationBuilder, formatLocations }
