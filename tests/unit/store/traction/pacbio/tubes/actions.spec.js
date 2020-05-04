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

describe('#isLibraryBarcodeValid', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('will return false when barcode is null', async () => {
    let result = await Actions.isLibraryBarcodeValid({ dispatch }, '')
    expect(result).toEqual(false)
  })

  it('will return false if the barcode belongs to a sample', async () => {
    let sampleTube = new Response(Data.TractionTubesWithSample).deserialize.tubes[0]
    dispatch.mockReturnValue(sampleTube)
    let result = await Actions.isLibraryBarcodeValid({ dispatch }, 'TRAC-1')
    expect(result).toEqual(false)
  })

  it('will return true if the barcode belongs to a library', async () => {
    let libraryTube = new Response(Data.TractionTubeWithContainerMaterials).deserialize.tubes[0]
    dispatch.mockReturnValue(libraryTube)
    let result = await Actions.isLibraryBarcodeValid({ dispatch }, 'TRAC-1')
    expect(result).toEqual(true)
  })
})

describe('#getTubeForBarcode', () => {
  let get, rootGetters, barcode, failedResponse

  beforeEach(() => {
    get = jest.fn()
    rootGetters = { 'traction/pacbio/tubes/tubeRequest': { 'get': get } }
    barcode = 'TRAC-1'

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.TractionTubeWithContainerMaterials)

    let expectedResponse = new Response(Data.TractionTubeWithContainerMaterials)
    let response = await Actions.getTubeForBarcode({ rootGetters }, barcode)

    expect(response).toEqual(expectedResponse.deserialize.tubes[0])
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let response = await Actions.getTubeForBarcode({ rootGetters }, barcode)
    expect(response).toEqual()
  })
})

describe('#validateLibraryTube', () => {
  it('returns false if tube doesnt exist', () => {
    expect(Actions.validateLibraryTube()).toBeFalsy()
  })

  it('returns false if tube doesnt have material', () => {
    expect(Actions.validateLibraryTube({ 'no material': '' })).toBeFalsy()
  })

  it('returns false if tube doesnt have material with libraries', () => {
    expect(Actions.validateLibraryTube({ 'materials': [{ 'notype': '' }] })).toBeFalsy()
  })

  it('returns true valid', () => {
    // check the validation of a library
    expect(Actions.validateLibraryTube({ 'materials': [{ 'library_kit_barcode': 'present' }] })).toBeTruthy()
  })
})

