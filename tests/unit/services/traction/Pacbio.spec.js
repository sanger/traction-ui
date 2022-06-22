import { createLabware } from '@/services/traction/Pacbio'
import { Data } from '@support/testHelper'

const failedResponse = {
  status: 422,
  statusText: 'Record not found',
  data: {
    errors: [{ title: 'error1', detail: 'There was an error.' }],
  },
}

const createdPlateResponse = {
  status: 201,
  statusText: 'created',
  data: Data.TractionPlates,
}

const createdRequestResponse = {
  status: 201,
  statusText: 'created',
  data: {},
}

describe('Pacbio', () => {
  describe('#createLabware', () => {
    const fetchLabware = vi.fn()
    const createPlate = vi.fn()
    const createTube = vi.fn()

    afterEach(() => {
      fetchLabware.mockRestore()
      createPlate.mockRestore()
      createTube.mockRestore()
    })

    // would it be better to mock the Sequencescape function??
    const requests = {
      sequencescape: { get: fetchLabware },
      traction: {
        plates: { create: createPlate },
        requests: { create: createTube },
      },
    }

    it('successfully', async () => {
      fetchLabware.mockResolvedValue(Data.SequencescapeLabware)
      createPlate.mockResolvedValue(createdPlateResponse)
      createTube.mockResolvedValue(createdRequestResponse)

      const response = await createLabware({
        requests,
        barcodes: ['DN9000002A', 'NT1O'],
      })

      expect(response.status).toEqual('success')
      expect(response.message).toEqual('Labware created with barcodes DN9000002A,NT1O')
    })

    it('does not create plates if none are present', async () => {
      fetchLabware.mockResolvedValue(Data.SequencescapeLabwareTubeOnly)
      createTube.mockResolvedValue(createdRequestResponse)

      try {
        await createLabware({
          requests,
          barcodes: ['NT1O'],
          libraryType: 'Example',
        })
      } catch (error) {
        fail('createLabware threw an error')
      }

      expect(createPlate).not.toHaveBeenCalled()
    })

    it('does not create tubes if none are present', async () => {
      fetchLabware.mockResolvedValue(Data.SequencescapeLabwarePlateOnly)
      createPlate.mockResolvedValue(createdPlateResponse)

      try {
        await createLabware({
          requests,
          barcodes: ['DN9000002A'],
          libraryType: 'Example',
        })
      } catch (error) {
        fail('createLabware threw an error')
      }

      expect(createTube).not.toHaveBeenCalled()
    })

    it('generates a valid plate payload', async () => {
      fetchLabware.mockResolvedValue(Data.SequencescapeLabware)
      createPlate.mockResolvedValue(createdPlateResponse)
      createTube.mockResolvedValue(createdRequestResponse)

      await createLabware({
        requests,
        barcodes: ['DN9000002A', 'NT1O'],
        libraryType: 'Example',
        costCode: 'aCostCodeExample',
      })

      expect(createPlate).toHaveBeenCalledWith({
        data: {
          data: {
            attributes: {
              plates: [
                expect.objectContaining({
                  barcode: 'DN9000002A',
                  wells: expect.arrayContaining([
                    {
                      position: 'A1',
                      samples: [
                        {
                          external_id: 'd5008026-94c9-11ec-a9e3-acde48001122',
                          external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
                          name: '2STDY1',
                          species: 'Dragon',
                          library_type: 'Example',
                          cost_code: 'aCostCodeExample',
                        },
                      ],
                    },
                    {
                      position: 'B1',
                      samples: [
                        {
                          external_id: 'd50bad48-94c9-11ec-a9e3-acde48001122',
                          external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
                          name: '2STDY2',
                          species: 'Unicorn',
                          library_type: 'Example',
                          cost_code: 'aCostCodeExample',
                        },
                      ],
                    },
                  ]),
                }),
              ],
            },
          },
        },
      })
    })

    it('generates a valid tube payload', async () => {
      fetchLabware.mockResolvedValue(Data.SequencescapeLabware)
      createPlate.mockResolvedValue(createdPlateResponse)
      createTube.mockResolvedValue(createdRequestResponse)

      await createLabware({
        requests,
        barcodes: ['DN9000002A', 'NT1O'],
        libraryType: 'Example',
        costCode: 'aCostCodeExample',
      })

      expect(createTube).toHaveBeenCalledWith({
        data: {
          data: {
            type: 'requests',
            attributes: {
              requests: [
                {
                  sample: {
                    name: '2STDY97',
                    species: 'Gryphon',
                    external_id: '0db37dd8-94ca-11ec-a9e3-acde48001122',
                  },
                  request: {
                    external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
                    library_type: 'Example',
                    cost_code: 'aCostCodeExample',
                  },
                  tube: { barcode: '3980000001795' },
                },
              ],
            },
          },
        },
      })
    })

    it('generates a valid tube payload with a passed through library type', async () => {
      fetchLabware.mockResolvedValue(Data.SequencescapeLabware)
      createPlate.mockResolvedValue(createdPlateResponse)
      createTube.mockResolvedValue(createdRequestResponse)

      await createLabware({
        requests,
        barcodes: ['DN9000002A', 'NT1O'],
        libraryType: undefined,
      })

      expect(createTube).toHaveBeenCalledWith({
        data: {
          data: {
            type: 'requests',
            attributes: {
              requests: [
                {
                  sample: {
                    name: '2STDY97',
                    species: 'Gryphon',
                    external_id: '0db37dd8-94ca-11ec-a9e3-acde48001122',
                  },
                  request: {
                    external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
                    library_type: 'Pacbio_IsoSeq',
                  },
                  tube: { barcode: '3980000001795' },
                },
              ],
            },
          },
        },
      })
    })

    describe('unsuccessfully', () => {
      it('when the labware could not be retrievied', async () => {
        fetchLabware.mockRejectedValue({ response: failedResponse })

        const response = await createLabware({
          requests,
          barcodes: ['DN9000002A', 'NT1O'],
        })
        expect(response.status).toEqual('error')
        expect(response.message).toEqual(
          'Labware could not be retrieved from Sequencescape: DN9000002A,NT1O',
        )
      })

      it('when the plate could not be created', async () => {
        fetchLabware.mockResolvedValue(Data.SequencescapeLabware)
        createPlate.mockRejectedValue({ response: failedResponse })
        createTube.mockResolvedValue(createdRequestResponse)

        const response = await createLabware({
          requests,
          barcodes: ['DN9000002A', 'NT1O'],
        })
        expect(response.status).toEqual('error')
        expect(response.message).toEqual('error1 There was an error.')
      })

      it('when the tube could not be created', async () => {
        fetchLabware.mockResolvedValue(Data.SequencescapeLabware)
        createPlate.mockResolvedValue(createdPlateResponse)
        createTube.mockRejectedValue({ response: failedResponse })

        const response = await createLabware({
          requests,
          barcodes: ['DN9000002A', 'NT1O'],
        })
        expect(response.status).toEqual('error')
        expect(response.message).toEqual('error1 There was an error.')
      })
    })
  })
})
