import { Data } from '@support/testHelper'
import Response from '@/api/v1/Response'
import * as Actions from '@/store/traction/saphyr/tubes/actions'

describe('#getTractionTubesForBarcodes', () => {
  let commit, get, getters, barcodeList, failedResponse, emptyResponse

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { tubeRequest: { get: get } }
    barcodeList = ['TRAC-1']

    emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success' }
    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully for samples', async () => {
    get.mockReturnValue(Data.TractionSaphyrTubesWithRequest)

    const expectedResponse = new Response(Data.TractionSaphyrTubesWithRequest)
    const expectedTubes = expectedResponse.deserialize.tubes

    const response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeList)

    expect(commit).toHaveBeenCalledWith('setTubes', expectedTubes)
    expect(response).toEqual(expectedResponse)
  })

  it('successfully for libraries', async () => {
    get.mockReturnValue(Data.TubeWithLibrary)

    const expectedResponse = new Response(Data.TubeWithLibrary)
    const expectedTubes = expectedResponse.deserialize.tubes

    const response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeList)

    expect(commit).toHaveBeenCalledWith('setTubes', expectedTubes)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    const expectedResponse = new Response(failedResponse)

    const response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeList)

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })

  it('when no tubes exist', async () => {
    get.mockReturnValue(emptyResponse)

    const expectedResponse = new Response(emptyResponse)

    const response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeList)

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})

describe('#createLibrariesInTraction', () => {
  let create, getters, payload

  beforeEach(() => {
    create = vi.fn()
    getters = { libraryRequest: { create: create } }
    const samples = [
      {
        barcode: 'TRAC-1',
        material: {
          id: 1,
          type: 'samples',
          name: 'sample_d',
          external_id: 4,
          species: 'human',
          created_at: '02/27/2019 04:05',
        },
      },
      {
        barcode: 'TRAC-1',
        material: {
          id: 1,
          type: 'samples',
          name: 'sample_d',
          external_id: 4,
          species: 'human',
          created_at: '02/27/2019 04:05',
        },
      },
    ]
    const enzymeID = 1
    payload = { samples: samples, enzymeID: enzymeID }
  })

  it('successfully', async () => {
    const expectedResponse = new Response(Data.TubeWithLibrary)
    create.mockReturnValue(Data.TubeWithLibrary)

    const response = await Actions.createLibrariesInTraction({ getters }, payload)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    const failedResponse = {
      status: 422,
      statusText: 'Unprocessable Entity',
      data: { errors: { name: ['error message'] } },
    }
    const expectedResponse = new Response(failedResponse)

    create.mockReturnValue(failedResponse)

    const response = await Actions.createLibrariesInTraction({ getters }, payload)
    expect(response).toEqual(expectedResponse)
  })
})

describe('#deleteLibraries', () => {
  let destroy, getters, libraryIds, failedResponse

  beforeEach(() => {
    destroy = vi.fn()
    getters = { libraryRequest: { destroy: destroy } }
    libraryIds = [1, 2]

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    const mockResponse = { data: {}, status: 204, statusText: 'OK' }

    const promise = new Promise((resolve) => {
      resolve(mockResponse)
    })

    destroy.mockReturnValue([promise])

    const expectedResponse = new Response(mockResponse)
    const response = await Actions.deleteLibraries({ getters }, libraryIds)

    expect(response).toEqual([expectedResponse])
  })

  it('unsuccessfully', async () => {
    const promise = new Promise((reject) => {
      reject(failedResponse)
    })

    destroy.mockReturnValue([promise])

    const expectedResponse = new Response(failedResponse)
    const response = await Actions.deleteLibraries({ getters }, libraryIds)

    expect(response).toEqual([expectedResponse])
  })
})

describe('#setLibraries', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { libraryRequest: { get: get } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.TractionSaphyrLibraries)

    const libraries = await Actions.setLibraries({ commit, getters })

    expect(commit).toHaveBeenCalledWith('setLibraries', libraries)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    const response = await Actions.setLibraries({ commit, getters })

    expect(commit).not.toHaveBeenCalled()
    expect(response).toBeNull()
  })
})
