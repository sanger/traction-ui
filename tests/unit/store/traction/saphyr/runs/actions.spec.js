import * as Actions from '@/store/traction/saphyr/runs/actions'
import * as Run from '@/api/v2/SaphyrRun.js'
import SaphyrRunFactory from '@tests/factories/SaphyrRunFactory.js'
import { handleResponse } from '@/api/v2/ResponseHelper.js'
import { dataToObjectById, extractAttributes } from '@/api/JsonApi.js'

const TractionTubesWithSample = {
  json: () =>
    Promise.resolve({
      data: {
        data: [
          {
            id: '11',
            type: 'tubes',
            attributes: { barcode: 'TRAC-2-11' },
            relationships: { materials: { data: [{ type: 'container_materials', id: '11' }] } },
          },
        ],
        included: [
          {
            id: '11',
            type: 'container_materials',
            attributes: {
              external_study_id: '1',
              sample_species: 'Species1',
              barcode: 'TRAC-2-11',
              created_at: '2020/05/04 12:45',
              sample_name: 'Sample1',
              material_type: 'request',
            },
          },
        ],
      },
    }),
  ok: true,
  status: '200',
  statusText: 'OK',
}

export const TubeWithLibrary = {
  json: () =>
    Promise.resolve({
      data: {
        data: [
          {
            id: '21',
            type: 'tubes',
            attributes: { barcode: 'TRAC-2-21' },
            relationships: { materials: { data: [{ type: 'container_materials', id: '21' }] } },
          },
        ],
        included: [
          {
            id: '21',
            type: 'container_materials',
            attributes: {
              state: 'pending',
              enzyme_name: 'Nb.BsrDI',
              deactivated_at: null,
              barcode: 'TRAC-2-21',
              created_at: '2020/05/04 13:26',
              sample_name: 'Sample1',
              material_type: 'library',
              material_id: '1',
            },
          },
        ],
      },
    }),
  ok: true,
  status: '200',
  statusText: 'OK',
}

const FindRunResponse = {
  status: '200',
  statusText: 'OK',
  json: () =>
    Promise.resolve({
      data: {
        id: '1',
        type: 'runs',
        state: 'pending',
        chip_barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX',
        created_at: '2024/10/01 11:03',
        name: 'Run 1',
      },
    }),
  ok: true,
}

const saphyrRunFactory = SaphyrRunFactory()

describe('#setRuns', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { runRequest: { get: get } }

    failedResponse = {
      status: 500,
      statusText: 'Internal Server Error',
      json: () =>
        Promise.resolve({
          data: { data: [] },
        }),
      ok: false,
    }
  })

  it('successfully', async () => {
    get.mockResolvedValue(saphyrRunFactory.responses.fetch)

    const expectedResponse = await handleResponse(saphyrRunFactory.responses.fetch)
    const expectedRuns = saphyrRunFactory.storeData

    const response = await Actions.setRuns({ commit, getters })

    expect(commit).toHaveBeenCalledWith('setRuns', expectedRuns)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockResolvedValue(failedResponse)

    const expectedResponse = await handleResponse(failedResponse)

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
    const response = await handleResponse(TractionTubesWithSample)
    const sampleTube = Object.values(dataToObjectById({ data: response.body.data.included }))[0]
    dispatch.mockReturnValue(sampleTube)
    const result = await Actions.isLibraryBarcodeValid({ dispatch }, 'TRAC-1')
    expect(result).toEqual(false)
  })

  it('will return true if the barcode belongs to a library 1å', async () => {
    const response = await handleResponse(TubeWithLibrary)
    const libraryTube = Object.values(dataToObjectById({ data: response.body.data.included }))[0]
    dispatch.mockReturnValue(libraryTube)
    const result = await Actions.isLibraryBarcodeValid({ dispatch }, 'TRAC-1')
    expect(result).toEqual(true)
  })

  it('will return true if the barcode belongs to a library', async () => {
    const response = await handleResponse(TubeWithLibrary)

    const libraryTube = Object.values(dataToObjectById({ data: response.body.data.included }))[0]

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

    failedResponse = {
      status: 500,
      statusText: 'Internal Server Error',
      json: () =>
        Promise.resolve({
          data: { data: [] },
        }),
      ok: false,
    }
  })

  it('successfully', async () => {
    get.mockResolvedValue(TubeWithLibrary)

    const expectedResponse = await handleResponse(TubeWithLibrary)
    const response = await Actions.getTubeForBarcode({ rootGetters }, barcode)
    const tubeWithLib = Object.values(
      dataToObjectById({ data: expectedResponse.body.data.included }),
    )[0]

    expect(response).toEqual(tubeWithLib)
  })

  it('unsuccessfully', async () => {
    get.mockResolvedValue(failedResponse)

    const response = await Actions.getTubeForBarcode({ rootGetters }, barcode)
    expect(response).toEqual(response)
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
    expect(Actions.validateLibraryTube({ notype: '' })).toBeFalsy()
  })

  it('returns true valid', () => {
    expect(Actions.validateLibraryTube({ material_type: 'library' })).toBeTruthy()
  })
})

describe('#editRun', () => {
  let getters, commit, mockRun, find

  beforeEach(async () => {
    mockRun = await handleResponse(FindRunResponse)
    find = vi.fn()
    getters = { runRequest: { find: find } }
    commit = vi.fn()
  })

  it('successfully', async () => {
    find.mockResolvedValue(FindRunResponse)
    await Actions.editRun({ getters, commit }, mockRun.id)
    expect(commit).toHaveBeenCalledWith('setCurrentRun', extractAttributes(mockRun.body.data))
  })
})

describe('#newRun', () => {
  let commit

  beforeEach(() => {
    commit = vi.fn()
  })

  it('successfully', () => {
    const newRun = Run.build()
    vi.spyOn(Run, 'build').mockImplementation(() => newRun)

    Actions.newRun({ commit })
    expect(commit).toHaveBeenCalledWith('setCurrentRun', newRun)
  })
})

describe('#createRun', () => {
  let getters, saphyrRequests
  const mockRun = {
    id: '101',
    name: 'Run X ',
    chip: {
      barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX',
      flowcells: [
        { position: 1, library: { barcode: 'TRAC-4-12' } },
        { position: 2, library: { barcode: 'TRAC-4-13' } },
      ],
    },
  }

  beforeEach(() => {
    saphyrRequests = vi.fn()
    getters = { currentRun: mockRun, saphyrRequests: saphyrRequests }
    vi.spyOn(Run, 'create').mockImplementation(() => {})
  })

  it('successfully', () => {
    Actions.createRun({ getters })
    expect(Run.create).toHaveBeenCalledWith(mockRun, saphyrRequests)
  })
})

describe('#updateRun', () => {
  let getters, saphyrRequests, mockRun, mockRunResponse

  beforeEach(async () => {
    mockRunResponse = await handleResponse(FindRunResponse)
    mockRun = mockRunResponse.body.data
    saphyrRequests = vi.fn()
    getters = { currentRun: mockRun, saphyrRequests: saphyrRequests }
    vi.spyOn(Run, 'update').mockImplementation(() => {})
  })

  it('successfully', () => {
    Actions.updateRun({ getters })
    expect(Run.update).toHaveBeenCalledWith(mockRun, saphyrRequests)
  })
})
