import { createUsedAliquot } from "./usedAliquot"

// Converts a pool and its used_aliquots to pacbio_pool_attributes
const buildPacbioPoolAttributes = ({ used_aliquots, pool }) => {
  const { template_prep_kit_box_barcode, volume, concentration, insert_size } = pool
  return {
    used_aliquots_attributes: Object.values(used_aliquots).map((ua) => createUsedAliquot(ua)).map((ua) => ua.payloadAttributes()),

    primary_aliquot_attributes: {
      template_prep_kit_box_barcode,
      volume,
      concentration,
      insert_size,
    },
    template_prep_kit_box_barcode,
    volume,
    concentration,
    insert_size,
  }
}

// Converts the multiPoolPositions object to the required array format
const multiPoolPositionsToAttributes = (multiPoolPositions) =>
  Object.entries(multiPoolPositions).map(([position, value]) => ({
    position,
    pacbio_pool_attributes: buildPacbioPoolAttributes({
      used_aliquots: value.used_aliquots,
      pool: value.pool,
    }),
  }))

/**
 * Produce a json api compliant payload
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

export { multiPoolPayload, createSubPools }
