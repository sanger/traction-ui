import Response from '@/api/v1/Response'
import * as Actions from '@/store/traction/saphyr/runs/actions'
import { Data } from '@support/testHelper'
import * as Run from '@/api/v1/SaphyrRun.js'
import SaphyrRunFactory from '@tests/factories/SaphyrRunFactory'

const saphyrRunFactory = SaphyrRunFactory()

describe('#setRuns', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { runRequest: { get: get } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockResolvedValue(saphyrRunFactory.responses.fetch)

    const expectedResponse = new Response(saphyrRunFactory)
    const expectedRuns = saphyrRunFactory.content.data

    const response = await Actions.setRuns({ commit, getters })

    expect(commit).toHaveBeenCalledWith('setRuns', expectedRuns)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    const expectedResponse = new Response(failedResponse)

    const response = await Actions.setRuns({ commit, getters })

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})

describe('#isLibraryBarcodeValid', () => {
  let dispatch

  beforeEach(() => {
    dispatch = vi.fn()
  })

  it('will return false when barcode is null', async () => {
    const result = await Actions.isLibraryBarcodeValid({ dispatch }, '')
    expect(result).toEqual(false)
  })

  it('will return false if the barcode belongs to a sample', async () => {
    const sampleTube = new Response(Data.TractionTubesWithSample).deserialize.tubes[0]
    dispatch.mockReturnValue(sampleTube)
    const result = await Actions.isLibraryBarcodeValid({ dispatch }, 'TRAC-1')
    expect(result).toEqual(false)
  })

  it('will return true if the barcode belongs to a library', async () => {
    const libraryTube = new Response(Data.TubeWithLibrary).deserialize.tubes[0]
    dispatch.mockReturnValue(libraryTube)
    const result = await Actions.isLibraryBarcodeValid({ dispatch }, 'TRAC-1')
    expect(result).toEqual(true)
  })
})

describe('#getTubeForBarcode', () => {
  let get, rootGetters, barcode, failedResponse

  beforeEach(() => {
    get = vi.fn()
    rootGetters = { 'traction/saphyr/tubes/tubeRequest': { get: get } }
    barcode = 'TRAC-1'

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.TubeWithLibrary)

    const expectedResponse = new Response(Data.TubeWithLibrary)
    const response = await Actions.getTubeForBarcode({ rootGetters }, barcode)

    expect(response).toEqual(expectedResponse.deserialize.tubes[0])
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    const response = await Actions.getTubeForBarcode({ rootGetters }, barcode)
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
    expect(Actions.validateLibraryTube({ materials: [{ notype: '' }] })).toBeFalsy()
  })

  it('returns true valid', () => {
    expect(Actions.validateLibraryTube({ materials: [{ material_type: 'library' }] })).toBeTruthy()
  })
})

describe('#editRun', () => {
  let getters, commit, mockRun, find

  beforeEach(() => {
    mockRun = new Response(Data.Runs).deserialize.runs[0]

    find = vi.fn()
    getters = { runRequest: { find: find } }
    commit = vi.fn()
  })

  it('successfully', async () => {
    find.mockReturnValue(Data.Runs)
    await Actions.editRun({ getters, commit }, mockRun.id)
    expect(commit).toHaveBeenCalledWith('setCurrentRun', mockRun)
  })
})

describe('#newRun', () => {
  let commit

  beforeEach(() => {
    commit = vi.fn()
  })

  it('successfully', async () => {
    const newRun = Run.build()
    vi.spyOn(Run, 'build').mockImplementation(() => newRun)

    Actions.newRun({ commit })
    expect(commit).toHaveBeenCalledWith('setCurrentRun', newRun)
  })
})

describe('#createRun', () => {
  let getters, saphyrRequests, mockRun

  beforeEach(() => {
    mockRun = new Response(Data.Runs).deserialize.runs[0]
    saphyrRequests = vi.fn()
    getters = { currentRun: mockRun, saphyrRequests: saphyrRequests }
    vi.spyOn(Run, 'create').mockImplementation(() => {})
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
    saphyrRequests = vi.fn()
    getters = { currentRun: mockRun, saphyrRequests: saphyrRequests }
    vi.spyOn(Run, 'update').mockImplementation(() => {})
  })

  it('successfully', async () => {
    Actions.updateRun({ getters })
    expect(Run.update).toHaveBeenCalledWith(mockRun, saphyrRequests)
  })
})
