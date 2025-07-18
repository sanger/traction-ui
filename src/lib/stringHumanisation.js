/**
 * https://stackoverflow.com/a/1026087
 * @param {*} string the string to capitalize
 */
const capitalizeFirstLetter = (string = '') => string.charAt(0).toUpperCase() + string.slice(1)

// capitalise first letter and remove dashes (can add more when need be)
const humanise = (string) => capitalizeFirstLetter(string).replace(/[-_]/g, ' ')

// singularise a string by removing the trailing 's'
// this is a very simple implementation and may not work for all cases
const singularise = (string = '') => string.replace(/s$/, '')

export { capitalizeFirstLetter, humanise, singularise }
