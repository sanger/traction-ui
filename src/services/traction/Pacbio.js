import handlePromise from '@/api/PromiseHelper'
import { getPlates, transformPlates, PacbioSample } from '@/services/Sequencescape'

/*  
  retrieve the plates from Sequencescape.
  if that is successful transform the plates into the correct format.
  then create the plates in traction
  @param requests: {sequencescape: Request, traction: Request} the request that will be called
  @param barcodes: {string} list of barcodes e.g DN1,DN2,DN3
*/
const createPlates = async ({ requests, barcodes }) => {
  const plates = await getPlates(requests.sequencescape, barcodes)

  if (plates.length === 0) {
    return { status: 'error', message: 'Plates could not be retrieved from Sequencescape' }
  }

  const response = await handlePromise(
    requests.traction.create({
      data: {
        attributes: {
          plates: transformPlates({
            plates,
            sampleType: PacbioSample,
          }),
        },
      },
    }),
  )

  if (response.successful) {
    return { status: 'success', message: `Plates created with barcodes ${barcodes}` }
  } else {
    return { status: 'error', ...response.errors }
  }
}

export { createPlates }
