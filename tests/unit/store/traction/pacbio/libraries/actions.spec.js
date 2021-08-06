import { Data } from 'testHelper'
import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/libraries/actions'

// TODO: we really need factories rather than building payloads manually
// This is quite complex and I don't quite understand what is going on. Needs simplification
describe('#createLibraryInTraction', () => {
  let create, getters, library, body, rootGetters

  beforeEach(() => {
    create = jest.fn()
    rootGetters = {
      'traction/tractionTags': [
        { id: 1, group_id: '123abc1' },
        { id: 2, group_id: '123abc2' },
      ],
    }
    getters = { libraryRequest: { create: create } }
    library = {
      tag: { group_id: '123abc1' },
      volume: 1.0,
      concentration: 1.0,
      templatePrepKitBoxBarcode: 'LK12345',
      fragmentSize: 100,
      sample: { id: 1 },
    }

    body = {
      data: {
        type: 'library',
        attributes: {
          volume: 1,
          concentration: 1,
          template_prep_kit_box_barcode: 'LK12345',
          fragment_size: 100,
        },
        relationships: {
          request: { data: { type: 'requests', id: 1 } },
          tag: { data: { type: 'tags', id: 1 } },
        },
      },
    }
  })

  it('successfully', async () => {
    let expectedResponse = new Response(Data.TractionTubeWithContainerMaterials)
    create.mockReturnValue(Data.TractionTubeWithContainerMaterials)

    let response = await Actions.createLibraryInTraction({ getters, rootGetters }, library)
    expect(response).toEqual(expectedResponse)
    expect(create).toBeCalledWith(body)
  })

  it('unsuccessfully', async () => {
    let failedResponse = {
      status: 422,
      statusText: 'Unprocessable Entity',
      data: { errors: { name: ['error message'] } },
    }
    let expectedResponse = new Response(failedResponse)

    create.mockReturnValue(failedResponse)

    let response = await Actions.createLibraryInTraction({ getters, rootGetters }, library)
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
    get.mockReturnValue(Data.TractionPacbioLibraries)

    let libraries = await Actions.setLibraries({ commit, getters })

    expect(commit).toHaveBeenCalledWith('setLibraries', libraries)
    let library = libraries[0]
    expect(library.request).toBeDefined()
    expect(library.tag_group_id).toBeDefined()
  })

  it('when the library has no request, tube or tag', async () => {
    get.mockReturnValue(Data.TractionPacbioLibrariesNoRelationships)

    let libraries = await Actions.setLibraries({ commit, getters })

    expect(commit).toHaveBeenCalledWith('setLibraries', libraries)
    let library = libraries[0]
    expect(library.request).not.toBeDefined()
    expect(library.tag_group_id).toBeNull()
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let response = await Actions.setLibraries({ commit, getters })

    expect(commit).not.toHaveBeenCalled()
    expect(response).toBeNull()
  })
})

describe('#updateLibrary', () => {
  let commit, update, getters, failedResponse, library, expectedResponse

  beforeEach(() => {
    commit = jest.fn()
    update = jest.fn()
    getters = { libraryRequest: { update: update } }
    expectedResponse = new Response(Data.TractionPacbioLibrary)
    library = expectedResponse.deserialize.libraries[0]

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    update.mockReturnValue(Data.TractionPacbioLibrary)
    library.volume = '5'
    let response = await Actions.updateLibrary({ commit, getters }, library)
    expect(expectedResponse).toEqual(response)
  })

  it('unsuccessfully', async () => {
    update.mockReturnValue(failedResponse)
    expectedResponse = new Response(failedResponse)
    let response = await Actions.updateLibrary({ commit, getters }, library)
    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})
