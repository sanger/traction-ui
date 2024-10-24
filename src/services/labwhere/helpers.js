// A series of data extraction helpers for interfacing with the data from the LabWhere API.

/**
 * Extracts the locations for a given set of labwares based on their barcodes.
 *
 * @param {Array} labwares - An array of labware objects, each containing a `barcode` and `location` property.
 * @param {Array} labwhereBarcodes - An array of barcodes to find locations for.
 * @returns {Object} A mapping of barcodes to their corresponding locations. If a barcode is not found, an empty object is returned for that barcode.
 */
const extractLocationsForLabwares = (labwares, labwhereBarcodes) => {
  const locationMap = {}
  labwhereBarcodes.forEach((barcode) => {
    const labware = labwares.find((labware) => labware.barcode === barcode)
    locationMap[barcode] = labware ? labware.location : {}
  })
  return locationMap
}

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

export { extractLocationsForLabwares, getCoordinateForLabware }
