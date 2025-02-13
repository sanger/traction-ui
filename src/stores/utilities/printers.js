/**
 * Filters the list of printers to return only those that match the specified labware type.
 *
 * @param {Array} printers - The array of printer objects.
 * @param {string} labwareType - The labware type to filter the printers by.
 * @returns {Array} - An array of printers that match the specified labware type.
 */
const getPrintersOfType = (printers, labwareType) =>
  printers.filter((printer) => printer.labware_type === labwareType)

export { getPrintersOfType }
