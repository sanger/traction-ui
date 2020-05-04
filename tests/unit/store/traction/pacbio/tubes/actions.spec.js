import { Data } from '../../../../testHelper'
import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/tubes/actions'

describe('#exportSampleExtractionTubesIntoTraction', () => {
  let dispatch, create, getters, tubes

  beforeEach(() => {
    create = jest.fn()
    getters = { 'requestsRequest': { 'create': create } }
    tubes = new Response(Data.SampleExtractionTubesWithSample).deserialize.assets
  })

  it('successfully', async () => {
    let expectedResponse = new Response(Data.TractionPacbioTubesWithRequest)
    create.mockReturnValue(Data.TractionPacbioTubesWithRequest)

    let response = await Actions.exportSampleExtractionTubesIntoTraction({ getters }, tubes)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { name: ['error message'] }} }
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
