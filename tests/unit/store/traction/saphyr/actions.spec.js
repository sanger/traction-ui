import SequencescapeTubesJson from '../../../../data/sequencescapeTubesWithSample'
import TractionSaphyrTubesWithRequestJson from '../../../../data/tractionSaphyrTubesWithRequest'
import TractionTubesWithLibrariesJson from '../../../../data/tubeWithLibrary'
import RequestsJson from '../../../../data/requests'
import RunsJson from '../../../../data/runs'
import RunJson from '../../../../data/runWithLibrary'

import Response from '@/api/Response'
import * as Actions from '@/store/traction/saphyr/actions'

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

describe('#deleteLibraries', () => {
  let destroy, getters, libraryIds, failedResponse

  beforeEach(() => {
    destroy = jest.fn()
    getters = { 'libraryRequest': { 'destroy': destroy } }
    libraryIds = [1,2]

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    let mockResponse =  { data: {}, status: 204, statusText: "OK" }

    let promise = new Promise((resolve) => {
      resolve(mockResponse)
    })

    destroy.mockReturnValue([promise])

    let expectedResponse = new Response(mockResponse)
    let response = await Actions.deleteLibraries({ getters }, libraryIds)

    expect(response).toEqual([expectedResponse])
  })

  it('unsuccessfully', async () => {
    let promise = new Promise((reject) => {
      reject(failedResponse)
    })

    destroy.mockReturnValue([promise])

    let expectedResponse = new Response(failedResponse)
    let response = await Actions.deleteLibraries({ getters }, libraryIds)

    expect(response).toEqual([expectedResponse])
  })

})

describe('#createLibrariesInTraction', () => {
  let dispatch, create, getters, payload

  beforeEach(() => {
    dispatch = jest.fn()
    create = jest.fn()
    getters = { 'libraryRequest': { 'create': create } }
    let samples = [
      { barcode: 'TRAC-1', material: {id: 1, type: 'samples', name: 'sample_d', external_id: 4, species: 'human', created_at: '02/27/2019 04:05' }},
      { barcode: 'TRAC-1', material: {id: 1, type: 'samples', name: 'sample_d', external_id: 4, species: 'human', created_at: '02/27/2019 04:05' }},
    ]
    let enzymeID = 1
    payload = {'samples': samples, 'enzymeID': enzymeID}
  })

  it('successfully', async () => {

    let mockResponse =  {
      data: {
        data: [
           { id: 1, type: "libraries", attributes: { name: "testname1", barcode: 'TRAC-1' }},
           { id: 2, type: "libraries", attributes: { name: "testname2", barcode: 'TRAC-2' }}
        ]
      },
      status: 200,
      statusText: "OK"
    }

    let expectedResponse = new Response(TractionTubesWithLibrariesJson)
    let expectedBarcodes = new Response(mockResponse).deserialize.libraries.map(s=> s.barcode).join('\n')

    create.mockReturnValue(mockResponse)
    dispatch.mockReturnValue(expectedResponse)

    let response = await Actions.createLibrariesInTraction({ dispatch, getters }, payload)

    expect(dispatch).toHaveBeenCalledWith('getTractionTubesForBarcodes', expectedBarcodes)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { name: ['error message'] }} }
    let expectedResponse = new Response(failedResponse)

    create.mockReturnValue(failedResponse)

    let response = await Actions.createLibrariesInTraction({ dispatch, getters }, payload)

    expect(dispatch).not.toHaveBeenCalledWith('getTractionTubesForBarcodes')
    expect(response).toEqual(expectedResponse)
  })

})

describe('#getRuns', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = jest.fn()
    get = jest.fn()
    getters = { 'runRequest': { 'get': get } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(RunsJson)

    let expectedResponse = new Response(RunsJson)
    let expectedRuns = expectedResponse.deserialize.runs

    let response = await Actions.getRuns({ commit, getters })

    expect(commit).toHaveBeenCalledWith("setRuns", expectedRuns)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let expectedResponse = new Response(failedResponse)

    let response = await Actions.getRuns({ commit, getters })

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })

})

describe('#runPayloadJson', () => {

  it('will convert a payload to the correct format', () => {
    let payload = { id: 1, attributes: { state: 'a state' } }
    let json = Actions.runPayloadJson(payload)
    expect(json.data).toBeDefined()
    expect(json.data.id).toEqual(1)
    expect(json.data.attributes).toBeDefined()
    expect(json.data.attributes.state).toEqual('a state')
  })
})

describe('#handleUpdate', () => {
  let update, getters, payload, failedResponse

  beforeEach(() => {
    update = jest.fn()
    getters = { 'runRequest': { 'update': update } }
    payload = { id: 1, attributes: { state: 'a state' } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    let mockResponse =  { data: {}, status: 204, statusText: "OK" }

    let promise = new Promise((resolve) => {
      resolve(mockResponse)
    })

    update.mockReturnValue([promise])

    let expectedResponse = new Response(mockResponse)
    let response = await Actions.handleUpdate({ getters }, payload)

    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    let promise = new Promise((reject) => {
      reject(failedResponse)
    })

    update.mockReturnValue([promise])

    let expectedResponse = new Response(failedResponse)
    let response = await Actions.handleUpdate({ getters }, payload)

    expect(response).toEqual(expectedResponse)
  })

})

describe('#startRun', () => {
  let dispatch, id, payload

  beforeEach(() => {
    dispatch = jest.fn()
    id = 123
    payload = { id: id, attributes: { state: 'started' } }
  })

  it('successfully', async () => {
    await Actions.startRun({ dispatch }, id)
    expect(dispatch).toHaveBeenCalledWith("handleUpdate", payload)
  })

})

describe('#completeRun', () => {
  let dispatch, id, payload

  beforeEach(() => {
    dispatch = jest.fn()
    id = 123
    payload = { id: id, attributes: { state: 'completed' } }
  })

  it('successfully', async () => {
    await Actions.completeRun({ dispatch }, id)
    expect(dispatch).toHaveBeenCalledWith("handleUpdate", payload)
  })

})

describe('#cancelRun', () => {
  let dispatch, id, payload

  beforeEach(() => {
    dispatch = jest.fn()
    id = 123
    payload = { id: id, attributes: { state: 'cancelled' } }
  })

  it('successfully', async () => {
    await Actions.cancelRun({ dispatch }, id)
    expect(dispatch).toHaveBeenCalledWith("handleUpdate", payload)
  })

})
