import { Data } from 'testHelper'
import Response from '@/api/Response'
import * as Actions from '@/store/traction/saphyr/tubes/actions'

describe('#getTractionTubesForBarcodes', () => {
  let commit, get, getters, barcodeList, failedResponse, emptyResponse

  beforeEach(() => {
    commit = jest.fn()
    get = jest.fn()
    getters = { tubeRequest: { get: get } }
    barcodeList = ['TRAC-1']

    emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success' }
    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully for samples', async () => {
    get.mockReturnValue(Data.TractionSaphyrTubesWithRequest)

    let expectedResponse = new Response(Data.TractionSaphyrTubesWithRequest)
    let expectedTubes = expectedResponse.deserialize.tubes

    let response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeList)

    expect(commit).toHaveBeenCalledWith('setTubes', expectedTubes)
    expect(response).toEqual(expectedResponse)
  })

  it('successfully for libraries', async () => {
    get.mockReturnValue(Data.TubeWithLibrary)

    let expectedResponse = new Response(Data.TubeWithLibrary)
    let expectedTubes = expectedResponse.deserialize.tubes

    let response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeList)

    expect(commit).toHaveBeenCalledWith('setTubes', expectedTubes)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let expectedResponse = new Response(failedResponse)

    let response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeList)

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })

  it('when no tubes exist', async () => {
    get.mockReturnValue(emptyResponse)

    let expectedResponse = new Response(emptyResponse)

    let response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeList)

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})

describe('#createLibrariesInTraction', () => {
  let create, getters, payload

  beforeEach(() => {
    create = jest.fn()
    getters = { libraryRequest: { create: create } }
    let samples = [
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
    let enzymeID = 1
    payload = { samples: samples, enzymeID: enzymeID }
  })

  it('successfully', async () => {
    let expectedResponse = new Response(Data.TubeWithLibrary)
    create.mockReturnValue(Data.TubeWithLibrary)

    let response = await Actions.createLibrariesInTraction({ getters }, payload)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    let failedResponse = {
      status: 422,
      statusText: 'Unprocessable Entity',
      data: { errors: { name: ['error message'] } },
    }
    let expectedResponse = new Response(failedResponse)

    create.mockReturnValue(failedResponse)

    let response = await Actions.createLibrariesInTraction({ getters }, payload)
    expect(response).toEqual(expectedResponse)
  })
})

describe('#deleteLibraries', () => {
  let destroy, getters, libraryIds, failedResponse

  beforeEach(() => {
    destroy = jest.fn()
    getters = { libraryRequest: { destroy: destroy } }
    libraryIds = [1, 2]

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    let mockResponse = { data: {}, status: 204, statusText: 'OK' }

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

describe('#setLibraries', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = jest.fn()
    get = jest.fn()
    getters = { libraryRequest: { get: get } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.TractionSaphyrLibraries)

    let libraries = await Actions.setLibraries({ commit, getters })

    expect(commit).toHaveBeenCalledWith('setLibraries', libraries)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let response = await Actions.setLibraries({ commit, getters })

    expect(commit).not.toHaveBeenCalled()
    expect(response).toBeNull()
  })
})
