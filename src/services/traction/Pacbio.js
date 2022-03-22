import { handleResponse } from '@/api/ResponseHelper'
import { PacbioSample, labwareForImport } from '@/services/Sequencescape'

const checkBarcodes = (barcodes, foundBarcodes) =>
  barcodes.filter((barcode) => !foundBarcodes.includes(barcode))

const makePlateRequest = (request, plates) =>
  plates.length > 0
    ? request.create({ data: { data: { attributes: { plates } } } })
    : { success: true, data: [] }

const makeTubeRequest = (request, tubes) =>
  tubes.length > 0
    ? request.create({ data: { data: { attributes: { requests: tubes }, type: 'requests' } } })
    : { success: true, data: [] }

/*
  retrieve the plates from Sequencescape.
  if that is successful transform the plates into the correct format.
  then create the plates in traction
  @param requests: {sequencescape: Request, traction: Request} the request that will be called
  @param barcodes: {string} list of barcodes e.g DN1,DN2,DN3
*/
const createLabware = async ({ requests, barcodes, libraryType }) => {
  const { plates, tubes, foundBarcodes } = await labwareForImport({
    request: requests.sequencescape,
    barcodes,
    sampleType: PacbioSample,
    libraryType,
  })

  const missingBarcodes = checkBarcodes(barcodes, foundBarcodes)
  if (missingBarcodes.length > 0) {
    return {
      status: 'error',
      message: `Labware could not be retrieved from Sequencescape: ${missingBarcodes}`,
    }
  }

  const plateRequest = makePlateRequest(requests.traction.plates, plates)
  const tubeRequest = makeTubeRequest(requests.traction.requests, tubes)

  const plateResponse = await handleResponse(plateRequest)
  const tubeResponse = await handleResponse(tubeRequest)

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
