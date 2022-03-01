import { handleResponse } from '@/api/ResponseHelper'

import {
  getLabware,
  transformPlates,
  PacbioSample,
  extractBarcodes,
  transformTubes,
} from '@/services/Sequencescape'

const checkBarcodes = (barcodes, foundBarcodes) =>
  barcodes.filter((barcode) => !foundBarcodes.includes(barcode))

/*
  retrieve the plates from Sequencescape.
  if that is successful transform the plates into the correct format.
  then create the plates in traction
  @param requests: {sequencescape: Request, traction: Request} the request that will be called
  @param barcodes: {string} list of barcodes e.g DN1,DN2,DN3
*/
const createLabware = async ({ requests, barcodes, libraryType }) => {
  const { plates, tubes } = await getLabware(requests.sequencescape, barcodes.join(','))
  const platesPayload = transformPlates({ plates, sampleType: PacbioSample, libraryType })
  const tubesPayload = transformTubes({ tubes, sampleType: PacbioSample, libraryType })

  const foundBarcodes = extractBarcodes({ plates, tubes })

  const missingBarcodes = checkBarcodes(barcodes, foundBarcodes)
  if (missingBarcodes.length > 0) {
    return {
      status: 'error',
      message: `Labware could not be retrieved from Sequencescape: ${missingBarcodes}`,
    }
  }

  const plateResponse = await handleResponse(
    requests.traction.plates.create({
      data: {
        data: {
          attributes: {
            plates: platesPayload,
          },
        },
      },
    }),
  )

  const tubeResponse = await handleResponse(
    requests.traction.requests.create({
      data: {
        data: {
          attributes: {
            requests: tubesPayload,
          },
          type: 'requests',
        },
      },
    }),
  )

  if (plateResponse.success && tubeResponse.success) {
    return { status: 'success', message: `Labware created with barcodes ${barcodes}` }
  } else {
    return {
      status: 'error',
      message: [plateResponse.errors, tubeResponse.errors].filter((a) => a).join(', '),
    }
  }
}

export { createLabware }
