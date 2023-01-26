import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/requests/actions'
import { Data } from '@support/testHelper'
import { newResponse } from '@/api/ResponseHelper'
import deserialize from '@/api/JsonApi'

let requests, failedResponse

describe('actions', () => {
  beforeEach(() => {
    requests = new Response(Data.TractionPacbioSamples).deserialize.requests
    failedResponse = {
      status: 404,
      statusText: 'Record not found',
      data: { errors: { title: ['The record could not be found.'] } },
    }
  })

  describe('setRequests', () => {
    it('fetches the requets from the service, and commits them', async () => {
      const commit = vi.fn()
      const get = vi.fn()
      const getters = { requestsRequest: { get: get } }
      let requests = Data.TractionPacbioSamples
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
      let sample = requests[0]
      const update = vi.fn()
      const getters = { requestsRequest: { update: update }, requests: requests }

      update.mockReturnValue(Data.TractionPacbioSamples)

      let resp = await Actions.updateRequest({ getters }, sample)

      let expectedPayload = Actions.createRequestPayload(sample)
      expect(getters.requestsRequest.update).toHaveBeenCalledWith(expectedPayload)

      let expectedResp = new Response(Data.TractionPacbioSamples)
      expect(resp).toEqual(expectedResp)
    })

    it('unsuccessful', async () => {
      let sample = requests[0]
      const update = vi.fn()
      const getters = { requestsRequest: { update: update }, requests: requests }

      update.mockReturnValue(failedResponse)

      let expectedResponse = new Response(failedResponse)
      await expect(Actions.updateRequest({ getters }, sample)).rejects.toEqual(
        expectedResponse.errors,
      )
    })
  })

  describe('createRequestPayload', () => {
    it('creates the payload for the sample', async () => {
      let sample = new Response(Data.TractionPacbioSamples).deserialize.requests[0]
      let result = Actions.createRequestPayload(sample)

      expect(result.data.id).toEqual(sample.id)
      expect(result.data.type).toEqual('requests')
      expect(result.data.attributes.library_type).toEqual(sample.library_type)
      expect(result.data.attributes.estimate_of_gb_required).toEqual(sample.estimate_of_gb_required)
      expect(result.data.attributes.number_of_smrt_cells).toEqual(sample.number_of_smrt_cells)
      expect(result.data.attributes.cost_code).toEqual(sample.cost_code)
    })
  })

  describe('#exportSampleExtractionTubesIntoTraction', () => {
    let dispatch, create, getters, tubes

    beforeEach(() => {
      create = vi.fn()
      getters = { requestsRequest: { create: create } }

      const expectedResponse = newResponse({
        ...Data.SampleExtractionTubesWithSample,
        success: true,
      })

      tubes = deserialize(expectedResponse.data).assets
    })

    it('successfully', async () => {
      const expectedResponse = newResponse({
        success: true,
        ...Data.CreatePacbioRequest,
      })
      create.mockReturnValue(Data.CreatePacbioRequest)

      let response = await Actions.exportSampleExtractionTubesIntoTraction({ getters }, { tubes })

      let expectedPayload = {
        data: {
          data: {
            type: 'requests',
            attributes: {
              requests: Actions.sampleExtractionTubeJson(tubes),
            },
          },
        },
      }
      expect(create).toBeCalledWith(expectedPayload)

      expect(response).toEqual(expectedResponse)
    })

    it('unsuccessfully', async () => {
      let failedResponse = {
        success: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        data: { errors: { name: ['error message'] } },
      }

      const expectedResponse = newResponse({
        success: false,
        ...failedResponse,
      })

      create.mockReturnValue(failedResponse)

      let response = await Actions.exportSampleExtractionTubesIntoTraction(
        { dispatch, getters },
        { tubes },
      )
      expect(response).toEqual(expectedResponse)
    })
  })

  describe('#sampleExtractionTubeJson', () => {
    it('will convert a deserialized response to the correct format for a pacbio request', () => {
      const tubes = new Response(Data.SampleExtractionTubesWithSample).deserialize.assets
      const [{ tube, sample, request }] = Actions.sampleExtractionTubeJson(tubes, undefined)
      // sample
      expect(sample.name).toBeDefined()
      expect(sample.species).toBeDefined()
      expect(sample.external_id).toBeDefined()
      expect(sample.external_id.includes('-')).toBeTruthy()
      // request
      expect(request.external_study_id).toBeDefined()
      expect(request.external_study_id.includes('-')).toBeTruthy()
      expect(request.library_type).toBeDefined()
      expect(request.estimate_of_gb_required).toBeDefined()
      expect(request.number_of_smrt_cells).toBeDefined()
      expect(request.cost_code).toBeDefined()
      // tube
      expect(tube.barcode).toBeDefined()
    })

    it('will import library_type when undefined', () => {
      const tubes = new Response(Data.SampleExtractionTubesWithSample).deserialize.assets
      const [{ request }] = Actions.sampleExtractionTubeJson(tubes, undefined)
      expect(request.library_type).toEqual('type')
    })

    it('will remove library_type when null', () => {
      const tubes = new Response(Data.SampleExtractionTubesWithSample).deserialize.assets
      const [{ request }] = Actions.sampleExtractionTubeJson(tubes, null)
      expect(request.library_type).toEqual(null)
    })

    it('will set library_type when specified', () => {
      const tubes = new Response(Data.SampleExtractionTubesWithSample).deserialize.assets
      const [{ request }] = Actions.sampleExtractionTubeJson(tubes, 'custom')
      expect(request.library_type).toEqual('custom')
    })

    it('if cost code is null do not include cost code in request', () => {
      let tubes = new Response(Data.SampleExtractionTubesWithSample).deserialize.assets
      tubes[0].cost_code = null
      let [{ request }] = Actions.sampleExtractionTubeJson(tubes)
      expect(request.cost_code).not.toBeDefined()
    })
  })
})
