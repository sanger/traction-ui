import { createUsedAliquot } from './usedAliquot.js'
import { payload as PacbioPoolPayload } from './pacbioPool.js'

/**
 * Converts multi pool positions from the store into the attributes format required for the multi pool payload.
 * @param {*} multiPoolPositions - Object containing store entries for multi pool positions
 * @returns {Array} - Array of multi pool position attributes formatted for the multi pool payload
 */
const multiPoolPositionsToAttributes = (multiPoolPositions) =>
  Object.entries(multiPoolPositions).map(([position, value]) => {
    // Convert used_aliquots to the required usedAliquot instance for PacbioPoolPayload function
    const used_aliquots = Object.fromEntries(
      Object.entries(value.used_aliquots).map(([key, ua]) => [key, createUsedAliquot(ua)]),
    )
    return {
      position,
      // Get the data attributes from the PacbioPoolPayload function
      pacbio_pool_attributes: PacbioPoolPayload({
        used_aliquots: used_aliquots,
        pool: value.pool,
      }).data.attributes,
    }
  })

/**
 * Produce a json api compliant payload for creating/updating a multi pool
 *
 * @param {Object}
 */
const multiPoolPayload = ({ multiPool, multiPoolPositions }) => {
  const { pipeline, pool_method } = multiPool
  return {
    data: {
      type: 'multi_pools',
      id: multiPool.id,
      attributes: {
        pipeline,
        pool_method,
        multi_pool_positions_attributes: multiPoolPositionsToAttributes(multiPoolPositions),
      },
    },
  }
}

/**
 * Creates an array of sub-pool objects from a multi-pool structure.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.multiPool - The multi-pool object containing multi_pool_positions (array of position IDs).
 * @param {Object} params.multiPoolPositions - Map of position IDs to position objects (each with pool_id and position).
 * @param {Object} params.pools - Map of pool IDs to pool objects (each with id and barcode).
 * @returns {Array<Object>} Array of sub-pool objects with id, barcode, and position.
 */
const createSubPools = ({ multiPool, multiPoolPositions, pools }) => {
  if (!multiPool || !multiPool.multi_pool_positions) {
    return []
  }
  return multiPool.multi_pool_positions.map((positionId) => {
    const position = multiPoolPositions[positionId]
    const pool = pools[position.pool_id]
    return {
      id: pool.id,
      barcode: pool.barcode,
      position: position.position,
    }
  })
}

export { multiPoolPayload, multiPoolPositionsToAttributes, createSubPools }
