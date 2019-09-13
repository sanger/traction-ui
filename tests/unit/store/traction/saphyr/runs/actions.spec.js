// import TractionTubesWithLibrariesJson from '../../../../data/tubeWithLibrary'
import RunsJson from '../../../../../data/runs'
// import RunJson from '../../../../data/runWithLibrary'
import Response from '@/api/Response'
import * as Actions from '@/store/traction/saphyr/runs/actions'

describe('#setRuns', () => {
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

    let response = await Actions.setRuns({ commit, getters })

    expect(commit).toHaveBeenCalledWith("setRuns", expectedRuns)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let expectedResponse = new Response(failedResponse)

    let response = await Actions.setRuns({ commit, getters })

    expect(commit).not.toHaveBeenCalled()
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