import SequencescapeTubesJson from '../../../../../data/sequencescapeTubesWithSample'
import TractionSaphyrTubesWithRequestJson from '../../../../../data/tractionSaphyrTubesWithRequest'
import TractionTubesWithLibrariesJson from '../../../../../data/tubeWithLibrary'
import RequestsJson from '../../../../../data/requests'

import Response from '@/api/Response'
import * as Actions from '@/store/traction/saphyr/tubes/actions'

describe('#getTractionTubesForBarcodes', () => {
  let commit, get, getters, barcodeString, failedResponse, emptyResponse

  beforeEach(() => {
    commit = jest.fn()
    get = jest.fn()
    getters = { 'tubeRequest': { 'get': get } }
    barcodeString = "TRAC-1"

    emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success'}
    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully for samples', async () => {
    get.mockReturnValue(TractionSaphyrTubesWithRequestJson)

    let expectedResponse = new Response(TractionSaphyrTubesWithRequestJson)
    let expectedTubes = expectedResponse.deserialize.tubes

    let response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeString)

    expect(commit).toHaveBeenCalledWith("setTubes", expectedTubes)
    expect(response).toEqual(expectedResponse)
  })

  it('successfully for libraries', async () => {
    get.mockReturnValue(TractionTubesWithLibrariesJson)

    let expectedResponse = new Response(TractionTubesWithLibrariesJson)
    let expectedTubes = expectedResponse.deserialize.tubes

    let response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeString)

    expect(commit).toHaveBeenCalledWith("setTubes", expectedTubes)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let expectedResponse = new Response(failedResponse)

    let response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeString)

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })

  it('when no tubes exist', async () => {
    get.mockReturnValue(emptyResponse)

    let expectedResponse = new Response(emptyResponse)

    let response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeString)

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})

describe('#exportSampleTubesIntoTraction', () => {
  let dispatch, create, getters, tubes

  beforeEach(() => {
    dispatch = jest.fn()
    create = jest.fn()
    getters = { 'requestsRequest': { 'create': create } }
    tubes = new Response(SequencescapeTubesJson).deserialize.tubes
  })

  it('successfully', async () => {
    let expectedResponse = new Response(TractionSaphyrTubesWithRequestJson)
    let expectedBarcodes = new Response(RequestsJson).deserialize.requests.map(s=> s.barcode).join('\n')

    create.mockReturnValue(RequestsJson)
    dispatch.mockReturnValue(expectedResponse)

    let response = await Actions.exportSampleTubesIntoTraction({ dispatch, getters }, tubes)

    expect(dispatch).toHaveBeenCalledWith("getTractionTubesForBarcodes", expectedBarcodes)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { name: ['error message'] }} }
    let expectedResponse = new Response(failedResponse)

    create.mockReturnValue(failedResponse)

    let response = await Actions.exportSampleTubesIntoTraction({ dispatch, getters }, tubes)

    expect(dispatch).not.toHaveBeenCalledWith("getTractionTubesForBarcodes")
    expect(response).toEqual(expectedResponse)
  })

})

describe('#sampleTubesJson', () => {

  it('will convert a deserialized response to the correct format', () => {
    let tubes = new Response(SequencescapeTubesJson).deserialize.tubes
    let json = Actions.sampleTubeJson(tubes)
    let tube = json[0]
    expect(tube.external_id).toBeDefined()
    expect(tube.external_id.includes('-')).toBeTruthy()
    expect(tube.external_study_id).toBeDefined()
    expect(tube.external_id.includes('-')).toBeTruthy()
    expect(tube.name).toBeDefined()
    expect(tube.species).toBeDefined()
  })
})
