import { createReceptionResource, createMessages } from '@/services/traction/Reception'
import { expect } from 'vitest'

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

const reception = {
  name: 'sequencescape',
  text: 'Sequencescape',
  value: 'Sequencescape',
}

describe('Traction', () => {
  describe('#createReceptionResource', () => {
    const createReceptionRequest = vi.fn()

    it('successfully', async () => {
      createReceptionRequest.mockResolvedValue(createdReceptionResponse)

      const attributes = { source, request_attributes: requestAttributes }

      const response = await createReceptionResource(createReceptionRequest, attributes)

      expect(response).toEqual(createdReceptionResponse.data)
    })

    it('does not import labware if none are present', async () => {
      const attributes = { source, request_attributes: [] }
      const labwareCount = 0
      expect(
        createReceptionResource(createReceptionRequest, labwareCount, attributes),
      ).rejects.toThrow('No labware to import')

      expect(createReceptionRequest).not.toHaveBeenCalled()
    })

    it('generates a valid reception payload', async () => {
      createReceptionRequest.mockResolvedValue(createdReceptionResponse)

      const attributes = { source, request_attributes: requestAttributes }
      const labwareCount = 1

      await createReceptionResource(createReceptionRequest, labwareCount, attributes)

      expect(createReceptionRequest).toHaveBeenCalledWith({
        data: {
          data: {
            type: 'receptions',
            attributes,
          },
        },
      })
    })

    it('when the reception could not be created', async () => {
      createReceptionRequest.mockRejectedValue({ response: failedResponse })

      const attributes = { source, request_attributes: requestAttributes }
      const labwareCount = 1

      expect(
        createReceptionResource(createReceptionRequest, labwareCount, attributes),
      ).rejects.toThrow('error1 There was an error.')
    })
  })

  describe('#createMessage', () => {
    it('when everything is created successfully', () => {
      const barcodes = ['NT1', 'NT2']
      const response = { labwares: { NT1: { imported: 'success' }, NT2: { imported: 'success' } } }
      const messages = createMessages({ barcodes, response, reception })
      expect(messages).toEqual([
        {
          type: 'success',
          message: 'NT1 imported from Sequencescape.',
        },
        {
          type: 'success',
          message: 'NT2 imported from Sequencescape.',
        },
      ])
    })

    it('when some of the barcodes could not be found', () => {
      const barcodes = ['NT1', 'NT2', 'NT3', 'NT4']
      const response = { labwares: { NT1: { imported: 'success' }, NT2: { imported: 'success' } } }
      const messages = createMessages({ barcodes, response, reception })

      expect(messages).toEqual(
        expect.arrayContaining([
          {
            type: 'success',
            message: 'NT1 imported from Sequencescape.',
          },
          {
            type: 'success',
            message: 'NT2 imported from Sequencescape.',
          },
          {
            type: 'danger',
            message: 'NT3, NT4 could not be found in Sequencescape.',
          },
        ]),
      )
    })

    it('when some of the labware includes could not be imported', () => {
      const barcodes = ['NT1', 'NT2']
      const response = {
        labwares: {
          NT1: { imported: 'success' },
          NT2: { imported: 'failure', errors: ['error1', 'error2'] },
        },
      }
      const messages = createMessages({ barcodes, response, reception })
      expect(messages).toEqual([
        {
          type: 'success',
          message: 'NT1 imported from Sequencescape.',
        },
        {
          type: 'danger',
          message: 'NT2 could not be imported from Sequencescape because: error1, error2.',
        },
      ])
    })

    it('when some of the labware is partially imported', () => {
      const barcodes = ['NT1', 'NT2']
      const response = {
        labwares: {
          NT1: { imported: 'success' },
          NT2: { imported: 'partial', errors: ['error1', 'error2'] },
        },
      }
      const messages = createMessages({ barcodes, response, reception })
      expect(messages).toEqual([
        {
          type: 'success',
          message: 'NT1 imported from Sequencescape.',
        },
        {
          type: 'danger',
          message: 'NT2 imported from Sequencescape with errors: error1, error2.',
        },
      ])
    })
  })
})
