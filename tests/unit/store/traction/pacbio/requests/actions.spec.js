import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/requests/actions'
import { Data } from '../../../../testHelper'

let requests, failedResponse

describe('actions', () => {
  beforeEach(() => {
    requests = new Response(Data.TractionPacbioSamples).deserialize.requests
    failedResponse = { status: 404, statusText: 'Record not found', data: { errors: { title: ['The record could not be found.'] } } }
  })

  describe("setRequests", () => {
    it("fetches the requets from the service, and commits them", async () => {
      const commit = jest.fn()
      const get = jest.fn()
      const getters = { 'requestsRequest': { 'get': get } }

      get.mockReturnValue(Data.TractionPacbioSamples)

      await Actions.setRequests({ commit, getters })

      expect(commit).toHaveBeenCalledWith("setRequests", requests)
    })
  })

  describe("updateRequest", () => {
    it("successful", async () => {
      let sample = requests[0]
      const update = jest.fn()
      const getters = { 'requestsRequest': { 'update': update }, 'requests': requests }

      update.mockReturnValue([Data.TractionPacbioSamples])

      let resp = await Actions.updateRequest({ getters }, sample)

      let expectedPayload = Actions.createRequestPayload(sample)
      expect(getters.requestsRequest.update).toHaveBeenCalledWith(expectedPayload)

      let expectedResp = new Response(Data.TractionPacbioSamples)
      expect(resp).toEqual(expectedResp)
    })

    it("unsuccessful", async () => {
      let sample = requests[0]
      const update = jest.fn()
      const getters = { 'requestsRequest': { 'update': update }, 'requests': requests }

      update.mockReturnValue([failedResponse])

      let expectedResponse = new Response(failedResponse)
      await expect(Actions.updateRequest({ getters }, sample)).rejects.toEqual(expectedResponse.errors)

    })
  })

  describe("createRequestPayload", () => {
    it("creates the payload for the sample", async () => {
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
      create = jest.fn()
      getters = { 'requestsRequest': { 'create': create } }
      tubes = new Response(Data.SampleExtractionTubesWithSample).deserialize.assets
    })

    it('successfully', async () => {
      let expectedResponse = new Response(Data.CreatePacbioRequest)
      create.mockReturnValue(Data.CreatePacbioRequest)

      let response = await Actions.exportSampleExtractionTubesIntoTraction({ getters }, tubes)
      expect(response).toEqual(expectedResponse)
    })

    it('unsuccessfully', async () => {
      let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { name: ['error message'] } } }
      let expectedResponse = new Response(failedResponse)

      create.mockReturnValue(failedResponse)

      let response = await Actions.exportSampleExtractionTubesIntoTraction({ dispatch, getters }, tubes)
      expect(response).toEqual(expectedResponse)
    })
  })

  describe('#sampleExtractionTubeJson', () => {

    it('will convert a deserialized response to the correct format for a pacbio request', () => {
      let tubes = new Response(Data.SampleExtractionTubesWithSample).deserialize.assets
      let json = Actions.sampleExtractionTubeJson(tubes)
      let tube = json[0]
      expect(tube.external_id).toBeDefined()
      expect(tube.external_id.includes('-')).toBeTruthy()
      expect(tube.external_study_id).toBeDefined()
      expect(tube.external_study_id.includes('-')).toBeTruthy()
      expect(tube.name).toBeDefined()
      expect(tube.species).toBeDefined()
      expect(tube.library_type).toBeDefined()
      expect(tube.estimate_of_gb_required).toBeDefined()
      expect(tube.number_of_smrt_cells).toBeDefined()
      expect(tube.cost_code).toBeDefined()
      expect(tube.source_barcode).toBeDefined()
    })
  })

  describe("processCostCode", () => {
    let tube

    beforeEach(() => {
      tube = {
        fields: {
          sanger_sample_id: 'Sample1',
          species: 'human',
        },
        sample_uuid: 'abc1234',
        study_uuid: 'abc2345',
        library_type: 'library_type_1',
        estimate_of_gb_required: '10',
        number_of_smrt_cells: '3',
        cost_code: 'CC12345'
      }
    })

    it("if completed use existing cost code", () => {
      expect(Actions.processCostCode(tube)).toEqual(tube.cost_code)
    })

    it("if not completed and DTOL sample use TOL cost code", () => {
      tube.fields.sanger_sample_id = 'DTOL12345'
      tube.cost_code = null
      expect(Actions.processCostCode(tube)).toEqual('S4773')
    })

    it("if not completed and no DTOL sample leave blank", () => {
      tube.cost_code = null
      expect(Actions.processCostCode(tube)).toBeNull()
    })
  })

})
