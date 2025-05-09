// A mock reception class for testing purposes
// This class is used to simulate the behavior of a real reception class
// It produces randomized data for testing purposes without relying on external APIs
// It is not intended for production use

/**
 * Generates a reception object containing mocked plate attributes based on the provided barcodes.
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
      wells_attributes.push({
        type: 'wells',
        position,
        sample: {
          name: `${barcode}-${i}`,
          species: 'Human',
          retention_instruction: 'long_term_storage',
          external_id: crypto.randomUUID(),
        },
        request: {
          ...requestOptions,
          external_study_id: crypto.randomUUID(),
        },
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

const fetchTubesFunction = async ({ requestOptions, barcodes }) => {
  const tubes_attributes = barcodes.map((barcode, index) => {
    return {
      type: 'tubes',
      barcode,
      sample: {
        name: `${barcode} ${index}`,
        species: 'Human',
        retention_instruction: 'long_term_storage',
        external_id: crypto.randomUUID(),
      },
      request: {
        ...requestOptions,
        external_study_id: crypto.randomUUID(),
      },
    }
  })

  return {
    attributes: { source: 'traction-ui.mock-reception', tubes_attributes },
    foundBarcodes: new Set(barcodes),
  }
}

const MockReception = {
  fetchPlatesFunction,
  fetchTubesFunction,
}

export { fetchPlatesFunction, fetchTubesFunction }

export default MockReception
