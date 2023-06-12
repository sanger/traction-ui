/**
 * https://stackoverflow.com/a/1026087
 * @param {*} string the string to capitalize
 */
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)
// capitalise first letter and remove dashes (can add more when need be)
const humanise = (string) => capitalizeFirstLetter(string).replace(/-/g, ' ')

/**
 * Render strings in their appropiate pluralised form
 * Inspired by:
 * https://kazupon.github.io/vue-i18n/guide/pluralization.html#pluralization
 * Usage:
 *    pluralise(appleCount,'no apples','1 apple','{ appleCount } apples')
 * Returns:
 *
 */
const pluralise = (count, zero, singular, plural) =>
  count === 0 ? zero : count === 1 ? singular : plural

export { capitalizeFirstLetter, humanise, pluralise }
