import Response from '@/api/Response'
import * as Actions from '@/store/traction/saphyr/runs/actions'
import { Data } from '../../../../testHelper'
import * as Run from '@/api/Run'

describe('#setRuns', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = jest.fn()
    get = jest.fn()
    getters = { 'runRequest': { 'get': get } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.Runs)

    let expectedResponse = new Response(Data.Runs)
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
    let libraryTube = new Response(Data.TubeWithLibrary).deserialize.tubes[0]
    dispatch.mockReturnValue(libraryTube)
    let result = await Actions.isLibraryBarcodeValid({ dispatch }, 'TRAC-1')
    expect(result).toEqual(true)
  })
})

describe('#getTubeForBarcode', () => {
  let get, rootGetters, barcode, failedResponse

  beforeEach(() => {
    get = jest.fn()
    rootGetters = { 'traction/saphyr/tubes/tubeRequest': { 'get': get } }
    barcode = 'TRAC-1'

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.TubeWithLibrary)

    let expectedResponse = new Response(Data.TubeWithLibrary)
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
  it ('returns false if tube doesnt exist', () => {
    expect(Actions.validateLibraryTube()).toBeFalsy()
  })

  it('returns false if tube doesnt have material', () => {
    expect(Actions.validateLibraryTube( { 'no material': '' } )).toBeFalsy()
  })

  it('returns false if tube doesnt have material with libraries', () => {
    expect(Actions.validateLibraryTube( { 'material': { 'notype': '' } } )).toBeFalsy()
  })

  it('returns true valid', () => {
    expect(Actions.validateLibraryTube({ 'material': { 'type': 'libraries'} })).toBeTruthy()
  })
})

describe('#editRun', () => {
  let getters, commit, mockRun, run

  beforeEach(() => {
    mockRun = new Response(Data.Runs).deserialize.runs[0]

    run = jest.fn()
    getters = { 'run': run }
    commit = jest.fn()
  })

  it('successfully', async () => {
    run.mockReturnValue(mockRun)

    Actions.editRun({ getters, commit }, mockRun.id)
    expect(commit).toHaveBeenCalledWith("setCurrentRun", mockRun)
  })
})

describe('#newRun', () => {
  let commit

  beforeEach(() => {
    commit = jest.fn()
  })

  it('successfully', async () => {
    let newRun = Run.build()
    Run.build = jest.fn()
    Run.build.mockReturnValue(newRun)

    Actions.newRun({ commit })
    expect(commit).toHaveBeenCalledWith("setCurrentRun", newRun)
  })
})

describe('#createRun', () => {
  let getters, saphyrRequests, mockRun

  beforeEach(() => {
    mockRun = new Response(Data.Runs).deserialize.runs[0]
    saphyrRequests = jest.fn()
    getters = { 'currentRun': mockRun, 'saphyrRequests': saphyrRequests }

    Run.create = jest.fn()
  })

  it('successfully', async () => {
    Actions.createRun({ getters })
    expect(Run.create).toHaveBeenCalledWith(mockRun, saphyrRequests)
  })
})

describe('#updateRun', () => {
  let getters, saphyrRequests, mockRun

  beforeEach(() => {
    mockRun = new Response(Data.Runs).deserialize.runs[0]
    saphyrRequests = jest.fn()
    getters = { 'currentRun': mockRun, 'saphyrRequests': saphyrRequests }

    Run.update = jest.fn()
  })

  it('successfully', async () => {
    Actions.updateRun({ getters })
    expect(Run.update).toHaveBeenCalledWith(mockRun, saphyrRequests)
  })
})