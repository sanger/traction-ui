import Response from '@/api/Response'
import * as Actions from '@/store/traction/actions'

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
  let update, getters, rootGetters, payload, failedResponse

  beforeEach(() => {
    update = jest.fn()
    rootGetters = { 'pipeline': 'pacbio' }
    getters = { 'pacbio/runs/runRequest': { 'update': update } }
    payload = { id: 1, attributes: { state: 'a state' } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    let mockResponse = { data: {}, status: 204, statusText: "OK" }

    let promise = new Promise((resolve) => {
      resolve(mockResponse)
    })

    update.mockReturnValue([promise])

    let expectedResponse = new Response(mockResponse)
    let response = await Actions.handleRunUpdate({ rootGetters, getters }, payload)

    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    let promise = new Promise((reject) => {
      reject(failedResponse)
    })

    update.mockReturnValue([promise])

    let expectedResponse = new Response(failedResponse)
    let response = await Actions.handleRunUpdate({ rootGetters, getters }, payload)

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
