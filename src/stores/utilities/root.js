/**
 * Groups data by a specified key after applying an optional transformation function.
 *
 * @param {Object} params - The parameters object.
 * @param {Array} params.data - The array of data items to group.
 * @param {string} params.key - The key to group by.
 * @param {Function} params.fn - A function to transform the data array before grouping.
 * @returns {Object} An object where keys are unique values of the specified key and values are arrays of grouped items.
 *
 * @example
 * const data = [{ type: 'A', value: 1 }, { type: 'B', value: 2 }, { type: 'A', value: 3 }]
 * const result = groupByAttribute({ data, key: 'type', fn: (arr) => arr })
 * // result = { A: [{ type: 'A', value: 1 }, { type: 'A', value: 3 }], B: [{ type: 'B', value: 2 }] }
 */
const groupByAttribute = ({ data, key, fn }) => {
  return Object.groupBy(
    data.map((item) => fn(item)),
    (item) => item[key],
  )
}

export { groupByAttribute }
