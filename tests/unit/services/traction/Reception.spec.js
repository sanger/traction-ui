import { createReceptionResource } from '@/services/traction/Reception'
// import { Data } from '@support/testHelper'

// Setup some of the parameters we'll be testing with
const source = 'traction-ui.sequencescape'
const requestAttributes = [
  {
    request: {
      external_study_id: '8b151474-7046-4aee-8706-482f65cead7f',
      cost_code: 'S0001',
      library_type: 'Library type',
      data_type: 'Data type',
    },
    sample: {
      name: 'My sample',
      external_id: '2063dbbb-f0e4-42af-a667-de8064690381',
      species: 'Human',
    },
    container: { type: 'tubes', barcode: 'NT1' },
  },
]

const failedResponse = {
  status: 422,
  statusText: 'Record not found',
  data: {
    errors: [{ title: 'error1', detail: 'There was an error.' }],
  },
}

const createdReceptionResponse = {
  status: 201,
  statusText: 'created',
  data: {},
}

describe('Traction', () => {
  describe('#createReceptionResource', () => {
    const createReceptionRequest = vi.fn()

    it('successfully', async () => {
      createReceptionRequest.mockResolvedValue(createdReceptionResponse)

      const response = await createReceptionResource(createReceptionRequest, {
        source,
        requestAttributes,
      })

      expect(response).toEqual(createdReceptionResponse.data)
    })

    it('does not import labware if none are present', async () => {
      expect(
        createReceptionResource(createReceptionRequest, {
          source,
          requestAttributes: [],
        }),
      ).rejects.toThrow('No labware to import')

      expect(createReceptionRequest).not.toHaveBeenCalled()
    })

    it('generates a valid reception payload', async () => {
      createReceptionRequest.mockResolvedValue(createdReceptionResponse)

      await createReceptionResource(createReceptionRequest, { source, requestAttributes })

      expect(createReceptionRequest).toHaveBeenCalledWith({
        data: {
          data: {
            type: 'receptions',
            attributes: {
              source,
              request_attributes: requestAttributes,
            },
          },
        },
      })
    })

    it('when the reception could not be created', async () => {
      createReceptionRequest.mockRejectedValue({ response: failedResponse })

      expect(
        createReceptionResource(createReceptionRequest, { source, requestAttributes }),
      ).rejects.toThrow('error1 There was an error.')
    })
  })
})
