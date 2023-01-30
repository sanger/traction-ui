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

    failedResponse = {
      data: { data: { errors: { error1: ['There was an error'] } } },
      status: 500,
      statusText: 'Internal Server Error',
    }
  })

  it('successfully', async () => {
    const libraries = Data.TractionPacbioLibraries
    libraries.data.data.splice(2, 4)
    get.mockResolvedValue(libraries)

    const { success, errors } = await Actions.setLibraries({ commit, getters })

    // Because we do some data manipulation in the action the easiest way to build the expected data
    // is to do it manually
    const expectedLibraries = [
      {
        id: '721',
        state: 'pending',
        volume: 1,
        concentration: 1,
        template_prep_kit_box_barcode: 'LK12345',
        insert_size: 100,
        created_at: '2021/06/15 10:25',
        deactivated_at: null,
        source_identifier: 'DN1:A1',
        run_suitability: { ready_for_run: true, errors: [] },
        pool: {
          id: '1',
          type: 'pools',
          attributes: {
            concentration: 1,
            created_at: '2021-07-23T10:15:37.000Z',
            insert_size: 1,
            run_suitability: {
              errors: [],
              ready_for_run: true,
            },
            source_identifier: 'DN1:A4',
            template_prep_kit_box_barcode: '2424',
            updated_at: '2021-07-23T10:15:37.000Z',
            volume: 1,
          },
          links: {
            self: 'http://localhost:3100/v1/pacbio/pools/1',
          },
        },
        tag_group_id: 'bc1009_BAK8A_OA',
        sample_name: 'Sample48',
        barcode: 'TRAC-2-721',
      },
      {
        id: '722',
        state: 'pending',
        volume: 1,
        concentration: 1,
        template_prep_kit_box_barcode: 'LK12345',
        insert_size: 100,
        created_at: '2021/06/15 10:25',
        deactivated_at: null,
        source_identifier: 'DN1:A2',
        run_suitability: { ready_for_run: true, errors: [] },
        pool: {
          id: '2',
          type: 'pools',
          attributes: {
            concentration: 1,
            created_at: '2021-07-23T10:15:37.000Z',
            insert_size: 1,
            volume: 1,
            run_suitability: {
              errors: [],
              ready_for_run: true,
            },
            source_identifier: 'DN1:A5',
            template_prep_kit_box_barcode: '2424',
            updated_at: '2021-07-23T10:15:37.000Z',
          },
          links: {
            self: 'http://localhost:3100/v1/pacbio/pools/2',
          },
        },
        tag_group_id: 'bc1008_BAK8A_OA',
        sample_name: 'Sample47',
        barcode: 'TRAC-2-722',
      },
    ]
    expect(commit).toHaveBeenCalledWith('setLibraries', expectedLibraries)
    expect(success).toEqual(true)
    expect(errors).toEqual([])
  })

  it('when the library has no request, tube or tag', async () => {
    get.mockResolvedValue(Data.TractionPacbioLibrariesNoRelationships)

    const { success, errors } = await Actions.setLibraries({ commit, getters })

    const expectedLibrary = [
      {
        id: '7',
        state: 'pending',
        volume: 1,
        concentration: 1,
        template_prep_kit_box_barcode: 'LK12345',
        insert_size: 100,
        created_at: '2019/10/16 13:52',
        deactivated_at: null,
        source_identifier: null,
        pool: undefined,
        tag_group_id: undefined,
        sample_name: undefined,
        barcode: undefined,
      },
    ]
    expect(commit).toHaveBeenCalledWith('setLibraries', expectedLibrary)
    expect(success).toEqual(true)
    expect(errors).toEqual([])
  })

  it('unsuccessfully', async () => {
    get.mockRejectedValue({ response: failedResponse })

    const expectedResponse = newResponse({ ...failedResponse, success: false })
    const { success, errors } = await Actions.setLibraries({ commit, getters })

    expect(success).toEqual(false)
    expect(errors).toEqual(expectedResponse.errors)
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
