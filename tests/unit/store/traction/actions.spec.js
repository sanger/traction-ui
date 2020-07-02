import Response from '@/api/Response'
import * as Actions from '@/store/traction/actions'
import { Data } from '../../testHelper'

describe('#startRun', () => {
  let dispatch, id, payload

  beforeEach(() => {
    dispatch = jest.fn()
    id = 123
    payload = { id: id, attributes: { state: 'started' } }
  })

  it('successfully', async () => {
    await Actions.startRun({ dispatch }, id)
    expect(dispatch).toHaveBeenCalledWith("handleRunUpdate", payload)
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
    expect(dispatch).toHaveBeenCalledWith("handleRunUpdate", payload)
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
    expect(dispatch).toHaveBeenCalledWith("handleRunUpdate", payload)
  })

})

describe('#handleRunUpdate', () => {
  let update, getters, rootGetters, payload, failedResponse, commit

  beforeEach(() => {
    update = jest.fn()
    commit = jest.fn()
    localStorage.setItem('pipeline', 'pacbio')
    getters = { 'pacbio/runs/runRequest': { 'update': update } }
    payload = { id: 1, attributes: { state: 'a state' } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    update.mockReturnValue([Data.UpdateRun])

    let expectedResponse = new Response(Data.UpdateRun)
    let expectedRun = expectedResponse.deserialize.runs[0]

    let response = await Actions.handleRunUpdate({ rootGetters, getters, commit }, payload)

    expect(commit).toHaveBeenCalledWith("updateRun", expectedRun)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    update.mockReturnValue([failedResponse])

    let expectedResponse = new Response(failedResponse)
    let response = await Actions.handleRunUpdate({ rootGetters, getters, commit }, payload)

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

describe('#setTags', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = jest.fn()
    get = jest.fn()
    getters = { 'tagsRequest': { 'get': get } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.TractionTags)

    let expectedResponse = new Response(Data.TractionTags)
    let expectedTags = expectedResponse.deserialize.tags

    let response = await Actions.setTags({ getters, commit })

    expect(commit).toHaveBeenCalledWith("setTags", expectedTags)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let expectedResponse = new Response(failedResponse)

    let response = await Actions.setTags({ getters, commit })

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})
