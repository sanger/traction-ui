import * as Actions from '@/store/traction/pacbio/requests/actions'
import { expect } from 'vitest'
import { newResponse } from '@/api/v1/ResponseHelper'
import TractionPacbioSamplesFactory from '@tests/factories/TractionPacbioSamplesFactory.js'

let requests

const tractionPacbioSamplesFactory = TractionPacbioSamplesFactory()

describe('actions', () => {
  beforeEach(() => {
    requests = tractionPacbioSamplesFactory.content.data.data
  })

  describe('setRequests', () => {
    it('fetches the requets from the service, and commits them', async () => {
      const commit = vi.fn()
      const get = vi.fn()
      const getters = { requestsRequest: { get: get } }
      const requests = tractionPacbioSamplesFactory.content
      requests.data.data.splice(2, 11)
      get.mockReturnValue(requests)

      const expectedRequests = [
        {
          id: '1',
          type: 'requests',
          attributes: {
            library_type: 'library_type_1',
            estimate_of_gb_required: 100,
            number_of_smrt_cells: 3,
            cost_code: 'PSD1234',
            external_study_id: 'mockStudy-ID',
            sample_name: 'mockName3',
            barcode: 'TRAC-82',
            sample_species: 'mockSpecies',
            source_identifier: 'NT127Q',
            created_at: '10/14/2019 10:56',
          },
        },
        {
          id: '2',
          type: 'requests',
          attributes: {
            library_type: 'library_type_1',
            estimate_of_gb_required: 100,
            number_of_smrt_cells: 3,
            cost_code: 'PSD1234',
            external_study_id: 'mockStudy-ID',
            sample_name: 'mockName3',
            barcode: 'TRAC-83',
            sample_species: 'mockSpecies',
            source_identifier: 'NT127Q',
            created_at: '10/14/2019 10:56',
          },
        },
      ]

      await Actions.setRequests({ commit, getters })

      expect(commit).toHaveBeenCalledWith('setRequests', expectedRequests)
    })
  })

  describe('updateRequest', () => {
    it('successful', async () => {
      const sample = requests[0]
      const update = vi.fn()
      const commit = vi.fn()
      const getters = { requestsRequest: { update: update } }

      update.mockReturnValue(tractionPacbioSamplesFactory.content)

      const { success, errors } = await Actions.updateRequest({ commit, getters }, sample)
      const expectedPayload = Actions.createRequestPayload(sample)

      expect(getters.requestsRequest.update).toHaveBeenCalledWith(expectedPayload)
      expect(commit).toHaveBeenCalledWith('updateRequest', tractionPacbioSamplesFactory.content.data.data)
      expect(success).toEqual(true)
      expect(errors).toEqual([])
    })

    it('unsuccessful', async () => {
      const sample = requests[0]
      const update = vi.fn()
      const commit = vi.fn()
      const getters = { requestsRequest: { update: update } }
      const mockResponse = {
        status: '422',
        data: { data: { errors: { error1: ['There was an error'] } } },
      }

      update.mockRejectedValue({ response: mockResponse })
      const expectedResponse = newResponse({ ...mockResponse, success: false })

      const { success, errors } = await Actions.updateRequest({ commit, getters }, sample)

      expect(success).toEqual(false)
      expect(errors).toEqual(expectedResponse.errors)
    })
  })

  describe('createRequestPayload', () => {
    it('creates the payload for the sample', async () => {
      const sample = tractionPacbioSamplesFactory.content.data.data[0]
      const result = Actions.createRequestPayload(sample)

      expect(result.data.id).toEqual(sample.id)
      expect(result.data.type).toEqual('requests')
      expect(result.data.attributes.library_type).toEqual(sample.library_type)
      expect(result.data.attributes.estimate_of_gb_required).toEqual(sample.estimate_of_gb_required)
      expect(result.data.attributes.number_of_smrt_cells).toEqual(sample.number_of_smrt_cells)
      expect(result.data.attributes.cost_code).toEqual(sample.cost_code)
    })
  })
})
