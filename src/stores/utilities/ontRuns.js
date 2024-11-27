/**
 * Builds a formatted ONT run object.
 *
 * @param {Array<Object>} instruments - The list of instruments.
 * @param {Array<Object>} pools - The list of pools.
 * @param {Object} data - The data object containing run attributes.
 * @param {Array<Object>} included - The included array containing related resources.
 * @returns {Object} The formatted ONT run object.
 *
 * @example
 * const instruments = [
 *   { id: '1', name: 'Instrument 1' },
 *   { id: '2', name: 'Instrument 2' },
 * ]
 * const pools = [
 *   { id: '1', tube_barcode: 'Tube 1' },
 *   { id: '2', tube_barcode: 'Tube 2' },
 * ]
 * const data = {
 *   id: '1',
 *   attributes: {
 *     ont_instrument_id: '1',
 *     state: 'active',
 *   },
 * }
 * const included = [
 *   {
 *     type: 'flowcells',
 *     attributes: {
 *       flowcell_id: 'fc1',
 *       ont_pool_id: '1',
 *       position: 'A1',
 *     },
 *   },
 *   {
 *     type: 'flowcells',
 *     attributes: {
 *       flowcell_id: 'fc2',
 *       ont_pool_id: '2',
 *       position: 'B1',
 *     },
 *   },
 * ]
 * const result = buildFormattedOntRun(instruments, pools, data, included)
 * console.log(result)
 * // Output:
 * // {
 * //   id: '1',
 * //   instrument_name: 'Instrument 1',
 * //   state: 'active',
 * //   flowcell_attributes: [
 * //     {
 * //       flowcell_id: 'fc1',
 * //       ont_pool_id: '1',
 * //       position: 'A1',
 * //       tube_barcode: 'Tube 1',
 * //     },
 * //     {
 * //       flowcell_id: 'fc2',
 * //       ont_pool_id: '2',
 * //       position: 'B1',
 * //       tube_barcode: 'Tube 2',
 * //     },
 * //   ],
 * // }
 */
const buildFormattedOntRun = (instruments, pools, data, included) => {
  const instrument_name = instruments.find((i) => i.id == data.attributes.ont_instrument_id)?.name

  return {
    id: data.id,
    instrument_name: instrument_name,
    state: data.attributes.state,
    flowcell_attributes: included
      .filter((item) => item.type === 'flowcells')
      .map((fc) => {
        const tube_barcode = pools.find((p) => p.id == fc.attributes.ont_pool_id)?.tube_barcode

        return {
          flowcell_id: fc.attributes.flowcell_id,
          ont_pool_id: fc.attributes.ont_pool_id,
          position: fc.attributes.position,
          tube_barcode: tube_barcode,
        }
      }),
  }
}

export { buildFormattedOntRun }
