import { createPlates } from '@/services/traction/Pacbio'
import { Data } from 'testHelper'

const failedResponse = {
  status: 422,
  statusText: 'Record not found',
  data: { errors: { error1: ['There was an error.'] } },
}

const createdResponse = {
  status: 201,
  statusText: 'created',
  data: Data.TractionPlates,
}

describe('Pacbio', () => {
  describe('#createPlates', () => {
    afterEach(() => {
      requests.sequencescape.get.mockRestore()
      requests.traction.create.mockRestore()
    })

    // would it be better to mock the Sequencescape function??
    const requests = { sequencescape: { get: jest.fn() }, traction: { create: jest.fn() } }

    it('successfully', async () => {
      requests.sequencescape.get.mockReturnValue(Data.SequencescapePlates)
      requests.traction.create.mockReturnValue(createdResponse)

      const response = await createPlates({ requests, barcodes: ['DN1', 'DN2'] })
      expect(response.status).toEqual('success')
      expect(response.message).toEqual('Plates created with barcodes DN1,DN2')
    })

    it('generates a valid payload', async () => {
      requests.sequencescape.get.mockReturnValue(Data.SequencescapePlates)
      requests.traction.create.mockReturnValue(createdResponse)
      await createPlates({ requests, barcodes: ['DN1', 'DN2'], libraryType: 'Example' })

      expect(requests.traction.create).toHaveBeenCalledWith({
        data: {
          data: {
            attributes: {
              plates: [
                expect.objectContaining({
                  barcode: 'DN803958S',
                  wells: expect.arrayContaining([
                    {
                      position: 'A1',
                      samples: [
                        {
                          external_id: '64e065a4-a9b0-11eb-991b-fa163eac3af7',
                          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
                          name: 'DTOL10233354',
                          species: 'Orgyia antiqua',
                          library_type: 'Example',
                        },
                      ],
                    },
                    {
                      position: 'B1',
                      samples: [
                        {
                          external_id: '64e8f43a-a9b0-11eb-991b-fa163eac3af7',
                          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
                          name: 'DTOL10233355',
                          species: 'Chelidonium majus',
                          library_type: 'Example',
                        },
                      ],
                    },
                  ]),
                }),
                expect.objectContaining({ barcode: 'DN804974W' }),
              ],
            },
          },
        },
      })
    })

    describe('unsuccessfully', () => {
      it('when the plates could not be retrievied', async () => {
        requests.sequencescape.get.mockReturnValue(failedResponse)
        const response = await createPlates({ requests, barcodes: ['DN1', 'DN2'] })
        expect(response.status).toEqual('error')
        expect(response.message).toEqual('Plates could not be retrieved from Sequencescape')
      })

      it('when the plates could not be created', async () => {
        requests.sequencescape.get.mockReturnValue(Data.SequencescapePlates)
        requests.traction.create.mockReturnValue(failedResponse)

        const response = await createPlates({ requests, barcodes: ['DN1', 'DN2'] })
        expect(response.status).toEqual('error')
        expect(response.message).toEqual('error1 There was an error.')
      })
    })
  })
})
