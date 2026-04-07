import { dataToObjectById } from './../../api/JsonApi.js'
import { createUsedAliquot } from './usedAliquot.js'

/**
 * Validates a set of used_aliquots and the pool.
 * Checks if all required attributes are present in each used_aliquot and if there are no duplicate tags.
 * If a used_aliquot is missing a required attribute or there are duplicate tags, it adds an error message to the used_aliquot.
 * These error messages is accessed in components through the 'errors' property of each used_aliquot.
 * The function returns true if all used_aliquots are valid and there are no duplicate tags, false otherwise.
 *
 * @param {Object} used_aliquots - The used_aliquots to validate. Each key is a used_aliquot id and each value is a used_aliquot object.
 * @returns {boolean} Returns true if all used_aliquots are valid and there are no duplicate tags, false otherwise.
 *
 * @example
 * const used_aliquots = {
 *   '1': { tag_id: 'tag1', volume: 10, concentration: 5, insert_size: 1000,source_id:'1' },
 *   '2': { tag_id: 'tag2', volume: 10, concentration: 5, insert_size: 1000,source_id:'1'},
 * };
 * const isValid = validate(used_aliquots); // returns true
 */
const validate = ({ used_aliquots, pool }) => {
  const pooled = Object.keys(used_aliquots).length > 1
  const requiredPoolAttrs = [
    'template_prep_kit_box_barcode',
    'volume',
    'concentration',
    'insert_size',
  ]
  let isValid = true

  const aliquotEntries = Object.entries(used_aliquots)
  aliquotEntries.forEach(([key, used_aliquot]) => {
    const usedAliquotValid = createUsedAliquot(used_aliquot).validate(pooled)
    isValid = isValid && usedAliquotValid
    if (aliquotEntries.some(([k, obj]) => obj.tag_id === used_aliquot.tag_id && k !== key)) {
      used_aliquot.errors['tag_id'] = 'duplicated'
      isValid = false
    }
  })
  pool.errors = {}
  requiredPoolAttrs.forEach((field) => {
    // We check its not 0 to prevent false errors as 0 is valid but !0 returns true
    if (!pool[field] && pool[field] !== 0) {
      pool.errors[field] = 'must be present'
      isValid = false
    }
    // Check if the 'volume' field in the pool object is less than the 'used_volume'.
    // If so, add an error message to the pool.errors object and set isValid to false.

    if (
      field === 'volume' &&
      pool.used_volume != null &&
      parseFloat(pool[field]) < parseFloat(pool.used_volume)
    ) {
      pool.errors[field] = 'must be greater than used volume'
      isValid = false
    }
  })
  return isValid
}

/**
 * Produce a json api compliant payload
 *
 * @param {Object}
 *
 * @example
 * { data: { type: 'pools', attributes: { used_aliquot_attributes: [ used_aliquot1, used_aliquot2 ... ], template_prep_kit_box_barcode, volume, concentration, insert_size}}}
 */
const payload = ({ used_aliquots, pool }) => {
  const { template_prep_kit_box_barcode, volume, concentration, insert_size } = pool
  return {
    data: {
      type: 'pools',
      id: pool.id,
      attributes: {
        used_aliquots_attributes: Object.values(used_aliquots).map((used_aliquot) =>
          used_aliquot.payloadAttributes(),
        ),

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
      },
    },
  }
}

/**
 *
 * @param {Object} libraries - Object of libraries, key is id and value is library object
 * @param {Object} requests - Object of requests, key is id and value is request object
 * @param {Object} tubes - array of tubes
 * @returns {Object} - Object of tubes, key is id and value is tube object
 * Convert tubes to object with id as key
 * Assign library request to tube if the tube has a library
 */
const assignLibraryRequestsToTubes = ({ libraries, requests, tubes }) => {
  const storeTubes = dataToObjectById({ data: tubes, includeRelationships: true })
  Object.values(libraries).map((library) => {
    const request = requests[library.request]
    storeTubes[library.tube].requests = [request.id]
    storeTubes[library.tube].source_id = String(library.id)
  })
  return storeTubes
}

/**
 * @param {Object} libraries - Object of libraries, key is id and value is library object
 * @param {Object} aliquots - Array of aliquots
 * @returns {Object} - Object of used aliquots, key is source_id and value is used aliquot object
 * Create used aliquots object and map it to source_id. Also set the request and volume for each used aliquot
 */
const createUsedAliquotsAndMapToSourceId = ({ aliquots, libraries }) => {
  const usedAliquots = dataToObjectById({
    data: aliquots,
    includeRelationships: true,
  })

  return Object.values(usedAliquots).reduce((result, usedAliquot) => {
    // what does this do?
    usedAliquot.request = usedAliquot.id
    const usedAliquotObject = createUsedAliquot({
      ...usedAliquot,
      tag_id: usedAliquot.tag,
    })
    usedAliquotObject.setRequestAndVolume(libraries)
    return { ...result, [`_${usedAliquotObject.source_id}`]: usedAliquotObject }
  }, {})
}

/**
 *
 * @param {Object} libraries - Array of libraries
 * @param {Object} requests - Array of requests
 * @param {Object} tubes - Array of tubes
 * @returns {Object} - Object of tubes, key is id and value is tube object
 * Convert tubes to object with id as key
 * Assign request ids to tubes if the tubes have libraries
 * Assign source_id to tubes based on libraries
 * If libraries are empty, assign source_id to tubes based on tubes
 */
const assignRequestIdsToTubes = ({ libraries, requests, tubes }) => {
  const tubesById = dataToObjectById({ data: tubes, includeRelationships: true })
  Object.keys(tubesById).forEach((key) => {
    tubesById[key] = {
      ...tubesById[key],
      requests: libraries ? requests.map((request) => request.id) : tubesById[key].requests,
      source_id: String(libraries ? tubesById[key].libraries : tubesById[key].id),
    }
  })
  return tubesById
}

/**
 * This function takes an object with `pool` and `used_aliquots` properties and returns an array of run suitability errors.
 * It maps over the errors of `pool.run_suitability` and `used_aliquot.run_suitability` for each used_aliquot, formats the errors with the pool or used_aliquot details, and returns the formatted errors.
 *
 * @param {Object}  - An object with `pool` and `used_aliquots` properties.
 * @returns {string[]} The formatted run suitability errors.
 */
const buildRunSuitabilityErrors = ({ pool, used_aliquots }) => [
  ...pool.run_suitability.errors.map(({ detail }) => `Pool ${detail}`),
  ...used_aliquots.flatMap((used_aliquot) => {
    const used_aliquotName = `Used aliquot ${used_aliquot.id} (${used_aliquot.sample_name})`
    return used_aliquot.run_suitability.errors.map(({ detail }) => `${used_aliquotName} ${detail}`)
  }),
]

/**
 *
 * @param {Object} pool - pool object
 * @param {Object} state - state object
 * @returns {Object[]} - Array of used aliquots - id, type, source_id, source_type, tag, run suitability
 * Create used aliquots from state
 * For each aliquot in the pool, get the used aliquot from state and return the id, type, source_id, source_type, tag, and run suitability
 * Get the sample name based on the source_type
 * Get the group id based on the tag
 */
const createUsedAliquotsFromState = ({ pool, state }) => {
  return pool.used_aliquots.map((used_aliquotId) => {
    const { id, type, source_id, source_type, tag, run_suitability } =
      state.used_aliquots[used_aliquotId]
    // Get the sample name based on the source_type
    const { sample_name } =
      source_type === 'Pacbio::Request'
        ? state.requests[source_id]
        : state.requests[state.libraries[source_id]?.pacbio_request_id]
    const { group_id } = state.tags[tag] || {}
    return { id, type, sample_name, group_id, run_suitability }
  })
}

/**
 * @param {Object} state - The state object - pools, used_aliquots, requests, tags
 * @returns {Object[]} The array of pools with the retrieved data.
 * This function takes the state object as an argument and returns an array of pools with the retrieved data.
 * It maps over the values of the pools object, and for each pool, it creates an array of used aliquots using the `createUsedAliquotsFromState` function.
 * It returns the pools with the retrieved data, including the used aliquots, barcode, and run suitability
 */
const addUsedAliquotsBarcodeAndErrorsToPools = (state) => {
  return Object.values(state.pools).map((pool) => {
    const used_aliquots = createUsedAliquotsFromState({ pool, state })
    return {
      ...pool,
      used_aliquots,
      run_suitability: {
        ...pool.run_suitability,
        formattedErrors: buildRunSuitabilityErrors({ used_aliquots, pool }),
      },
    }
  })
}

/**
 *
 * @param {Object} Pool object containing pool attributes, used_aliquots object containing used aliquot objects
 * @returns {Boolean} Returns true if there are errors in the pool or any of the used aliquots, false otherwise
 */
const hasErrors = ({ pool, used_aliquots }) => {
  const poolErrors = pool?.errors ? Object.keys(pool.errors).length > 0 : false
  const usedAliquotsErrors = used_aliquots
    ? Object.values(used_aliquots).some(
        (used_aliquot) => used_aliquot.errors && Object.keys(used_aliquot.errors).length > 0,
      )
    : false
  return poolErrors || usedAliquotsErrors
}

/**
 * Sets the pool metadata (volume, insert_size, concentration) based on the used aliquots in the pool if sufficient
 * data is available.
 * @param {Object} pool - pool object
 * @param {Object} used_aliquots - used_aliquots object
 */
const calculatePoolMetadata = ({ pool, used_aliquots }) => {
  // Check if all used aliquots have volume, insert_size, and concentration before calculating pool metadata
  // Any missing value will result in the pool metadata being incomplete, so we only calculate if all values are present
  if (!canCalculatePoolMetadata(used_aliquots)) {
    return
  }

  const usedAliquotsArray = Object.values(used_aliquots)

  // Round to 1 decimal place for volume as pipettes can not be any more accurate
  pool.volume = usedAliquotsArray
    .reduce((totalVolume, used_aliquot) => {
      const volume = parseFloat(used_aliquot.volume)
      return totalVolume + volume
    }, 0)
    .toFixed(1)
  // Round to the nearest whole number as you can't have half a base pair
  pool.insert_size = (
    usedAliquotsArray.reduce((totalInsertSize, used_aliquot) => {
      const insertSize = parseFloat(used_aliquot.insert_size)
      return totalInsertSize + insertSize
    }, 0) / usedAliquotsArray.length
  ).toFixed()
  // Round to 2 decimal places for concentration as this is a common level of precision for concentration measurements and calculations
  pool.concentration = (
    usedAliquotsArray.reduce((totalMass, used_aliquot) => {
      const concentration = parseFloat(used_aliquot.concentration)
      const volume = parseFloat(used_aliquot.volume)
      // We calculate the total concentration by summing the concentration of each used aliquot multiplied by its volume, then dividing by the total volume of the pool
      const mass = concentration * volume

      return totalMass + mass
    }, 0) / pool.volume
  ).toFixed(2)

  // This is incalculable but it is a safe assumption to take the first used_aliquot value
  pool.template_prep_kit_box_barcode = usedAliquotsArray[0].template_prep_kit_box_barcode
}

/**
 * Checks if all used aliquots in the pool have float values greater than 0 for volume, insert_size, and concentration.
 * @param {Object} used_aliquots - used_aliquots object
 * @returns {Boolean} - Returns true if all used aliquots have volume, insert_size, and concentration, false otherwise
 */
const canCalculatePoolMetadata = (used_aliquots) => {
  if (!used_aliquots || Object.values(used_aliquots).length === 0) {
    return false
  }
  return Object.values(used_aliquots).every((used_aliquot) => {
    return ['volume', 'insert_size', 'concentration'].every((key) => {
      const value = parseFloat(used_aliquot[key])
      return !isNaN(value) && value > 0
    })
  })
}

export {
  validate,
  payload,
  assignLibraryRequestsToTubes,
  createUsedAliquotsAndMapToSourceId,
  assignRequestIdsToTubes,
  buildRunSuitabilityErrors,
  createUsedAliquotsFromState,
  addUsedAliquotsBarcodeAndErrorsToPools,
  hasErrors,
  calculatePoolMetadata,
  canCalculatePoolMetadata,
}
