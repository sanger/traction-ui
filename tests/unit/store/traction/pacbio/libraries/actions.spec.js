import { Data } from '@support/testHelper'
import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/libraries/actions'
import { newResponse } from '@/api/ResponseHelper'

// TODO: we really need factories rather than building payloads manually
// This is quite complex and I don't quite understand what is going on. Needs simplification
describe('#createLibraryInTraction', () => {
  let create, library, body, rootGetters, rootState

  beforeEach(() => {
    create = vi.fn()
    rootGetters = {
      'traction/tractionTags': [
        { id: 1, group_id: '123abc1' },
        { id: 2, group_id: '123abc2' },
      ],
    }
    rootState = { api: { traction: { pacbio: { pools: { create } } } } }
    library = {
      tag: { group_id: '123abc1' },
      volume: 1.0,
      concentration: 1.0,
      template_prep_kit_box_barcode: 'LK12345',
      insert_size: 100,
      sample: { id: 1 },
    }

    body = {
      data: {
        type: 'pools',
        attributes: {
          library_attributes: [
            {
              pacbio_request_id: library.sample.id,
              template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
              tag_id: 1,
              volume: library.volume,
              concentration: library.concentration,
              insert_size: library.insert_size,
            },
          ],
          template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
          volume: library.volume,
          concentration: library.concentration,
          insert_size: library.insert_size,
        },
      },
    }
  })

  it('successfully', async () => {
    const mockResponse = {
      status: '201',
      data: { data: {}, included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1' } }] },
    }
    create.mockResolvedValue(mockResponse)

    const { success, barcode } = await Actions.createLibraryInTraction(
      { rootState, rootGetters },
      library,
    )

    expect(create).toBeCalledWith({
      data: body,
      include: 'tube',
    })
    expect(success).toBeTruthy()
    expect(barcode).toEqual('TRAC-1')
  })

  it('unsuccessfully', async () => {
    const mockResponse = {
      status: '422',
      data: { data: { errors: { error1: ['There was an error'] } } },
    }

    create.mockRejectedValue({ response: mockResponse })

    const expectedResponse = newResponse({ ...mockResponse, success: false })
    const { success, errors } = await Actions.createLibraryInTraction(
      { rootState, rootGetters },
      library,
    )

    expect(success).toBeFalsy()
    expect(errors).toEqual(expectedResponse.errors)
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
    commit = vi.fn()
    get = vi.fn()
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
  let commit, update, getters, failedResponse, library, successfulResponse, body

  beforeEach(() => {
    commit = vi.fn()
    update = vi.fn()
    getters = { libraryRequest: { update: update } }
    library = {
      id: 1,
      tag: { group_id: '123abc1' },
      volume: 1.0,
      concentration: 1.0,
      template_prep_kit_box_barcode: 'LK12345',
      insert_size: 100,
      sample: { id: 1 },
    }
    body = {
      id: library.id,
      type: 'libraries',
      attributes: {
        template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
        volume: library.volume,
        concentration: library.concentration,
        insert_size: library.insert_size,
      },
    }

    successfulResponse = { status: '200', data: Data.TractionPacbioLibrary.data }
    failedResponse = {
      status: '422',
      data: { data: { errors: { error1: ['There was an error'] } } },
    }
  })

  it('successfully', async () => {
    update.mockResolvedValue(successfulResponse)

    const { success, errors } = await Actions.updateLibrary({ commit, getters }, library)

    expect(update).toBeCalledWith({
      data: body,
      include: 'request,tag,tube,pool',
    })
    expect(success).toBeTruthy()
    expect(errors).toBeUndefined()
  })

  it('unsuccessfully', async () => {
    update.mockRejectedValue({ response: failedResponse })

    const expectedResponse = newResponse({ ...failedResponse, success: false })
    const { success, errors } = await Actions.updateLibrary({ commit, getters }, library)

    expect(commit).not.toHaveBeenCalled()
    expect(success).toBeFalsy()
    expect(errors).toEqual(expectedResponse.errors)
  })
})
