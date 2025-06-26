// A mock reception class for testing purposes
// This class is used to simulate the behavior of a real reception class
// It produces randomized data for testing purposes without relying on external APIs
// It is not intended for production use

/**
 * A function to help encapsulate the logic of building a mock sample and request object.
 *
 * @param {string} sample_name - The name of the sample to be included in the mock data.
 * @param {Object} requestOptions - An object containing request options to be included in each well's request.
 * @returns {Object} A mock sample and request object.
 */
const buildMockSampleAndRequest = (sample_name, requestOptions) => {
  return {
    sample: {
      name: sample_name,
      species: 'Human',
      retention_instruction: 'long_term_storage',
      external_id: crypto.randomUUID(),
    },
    request: {
      ...requestOptions,
      external_study_id: crypto.randomUUID(),
    },
  }
}

/**
 * A function to help encapsulate the logic of building a mock compound sample and request object.
 * Uses buildMockSampleAndRequest for each sample name.
 *
 * @param {string[]} sample_names - The names of the samples to be included in the mock data.
 * @param {Object} requestOptions - An object containing request options to be included in each sample's request.
 * @returns {Object} A mock compound sample and request object.
 */
const buildMockCompoundSampleAndRequest = (sample_names, requestOptions) => {
  return {
    samples: sample_names.map((name) => buildMockSampleAndRequest(name, requestOptions)),
  }
}

/**
 * Generates a reception object containing mocked plates_attributes based on the provided barcodes.
 * Each plate contains a barcode and an array of well attributes. Each well
 * attribute includes a position, sample details, and request details.
 *
 * @param {string[]} barcodes - An array of barcodes to use for the plates.
 * @param {Object} requestOptions - An object containing request options to be included in each well's request.
 * @returns {Object} A formatted reception object containing the following structure:
 *   - `attributes` {Object}: The attributes of the reception, including:
 *      - `source` {string}: The source of the reception, always "traction-ui.mock-reception".
 *      - `plates_attributes` {Object[]}: An array of plate attributes.
 *   - `foundBarcodes` {Set}: A set of found barcodes.
 */
const fetchPlatesFunction = async ({ requestOptions, barcodes }) => {
  const plates_attributes = barcodes.map((barcode) => {
    const wells_attributes = []

    for (let i = 0; i < 48; i++) {
      const position = String.fromCharCode(65 + Math.floor(i / 12)) + ((i % 12) + 1)
      const sample_name = `${barcode}-sample-${i}`
      wells_attributes.push({
        type: 'wells',
        position,
        ...buildMockSampleAndRequest(sample_name, requestOptions),
      })
    }

    return {
      type: 'plates',
      barcode,
      wells_attributes,
    }
  })

  return {
    attributes: { source: 'traction-ui.mock-reception', plates_attributes },
    foundBarcodes: new Set(barcodes),
  }
}

/**
 * Generates a reception object containing mocked tubes_attributes based on the provided barcodes.
 * Each tube contains a barcode, sample details and request details.
 *
 * @param {string[]} barcodes - An array of barcodes to use for the tubes.
 * @param {Object} requestOptions - An object containing request options to be included in each well's request.
 * @returns {Object} A formatted reception object containing the following structure:
 *   - `attributes` {Object}: The attributes of the reception, including:
 *      - `source` {string}: The source of the reception, always "traction-ui.mock-reception".
 *      - `tubes_attributes` {Object[]}: An array of tube attributes.
 *   - `foundBarcodes` {Set}: A set of found barcodes.
 */
const fetchTubesFunction = async ({ requestOptions, barcodes }) => {
  const tubes_attributes = barcodes.map((barcode, index) => {
    const sample_name = `${barcode}-sample-${index}`
    return {
      type: 'tubes',
      barcode,
      ...buildMockSampleAndRequest(sample_name, requestOptions),
    }
  })

  return {
    attributes: { source: 'traction-ui.mock-reception', tubes_attributes },
    foundBarcodes: new Set(barcodes),
  }
}

/**
 * Generates a reception object containing mocked tubes_attributes for compound sample tubes based on the provided barcodes.
 * Each tube contains a barcode and an array of samples, each with its own sample details and request details.
 * The number of samples per tube is currently set to 3, and each sample name is generated using the barcode and index.
 *
 * @param {string[]} barcodes - An array of barcodes to use for the tubes.
 * @param {Object} requestOptions - An object containing request options to be included in each sample's request.
 * @returns {Object} A formatted reception object containing the following structure:
 *   - `attributes` {Object}: The attributes of the reception, including:
 *      - `source` {string}: The source of the reception, always "traction-ui.mock-reception".
 *      - `tubes_attributes` {Object[]}: An array of tube attributes, each with a barcode and an array of samples.
 *   - `foundBarcodes` {Set}: A set of found barcodes.
 */
const fetchCompoundSampleTubesFunction = async ({ requestOptions, barcodes }) => {
  const compound_sample_tubes_attributes = barcodes.map((barcode, index) => {
    const sample_names = Array.from({ length: 3 }, (_, i) => `${barcode}-sample-${i + 1}-${index}`)
    return {
      type: 'tubes',
      barcode,
      ...buildMockCompoundSampleAndRequest(sample_names, requestOptions),
    }
  })

  return {
    attributes: { source: 'traction-ui.mock-reception', compound_sample_tubes_attributes },
    foundBarcodes: new Set(barcodes),
  }
}

const MockReception = {
  fetchPlatesFunction,
  fetchTubesFunction,
  fetchCompoundSampleTubesFunction,
}

export { fetchPlatesFunction, fetchTubesFunction, fetchCompoundSampleTubesFunction }

export default MockReception
