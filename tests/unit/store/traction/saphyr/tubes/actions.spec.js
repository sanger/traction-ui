import * as Actions from '@/store/traction/saphyr/tubes/actions'
import SaphyrTubesFactory from '@tests/factories/SaphyrTubesFactory.js'
import BaseFactory from '../../../../../factories/BaseFactory'

const saphyrTubesRequestFactory = SaphyrTubesFactory('request')
const saphyrTubesLibraryFactory = SaphyrTubesFactory('library')
const failedResponse = {
  errors: [
    {
      title: 'Internal Server Error',
      status: '500',
    },
  ],
}

describe('#getTractionTubesForBarcodes', () => {
  let commit, get, getters, barcodeList

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { tubeRequest: { get: get } }
    barcodeList = ['TRAC-1']
  })

  it('successfully for samples', async () => {
    get.mockReturnValue(saphyrTubesRequestFactory.responses.fetch)
    const expectedTubes = saphyrTubesRequestFactory.storeData.data

    await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeList)

    expect(commit).toHaveBeenCalledWith('setTubes', expectedTubes)
  })

  it('successfully for libraries', async () => {
    get.mockReturnValue(saphyrTubesLibraryFactory.responses.fetch)
    const expectedTubes = saphyrTubesLibraryFactory.storeData.data

    const response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeList)

    expect(commit).toHaveBeenCalledWith('setTubes', expectedTubes)
    expect(response.body.data).toEqual(saphyrTubesLibraryFactory.content.data)
  })

  it('unsuccessfully', async () => {
    const promise = Promise.reject(failedResponse)
    get.mockReturnValue(promise)
    const response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeList)

    expect(commit).not.toHaveBeenCalled()
    expect(response.success).toBeFalsy()
    expect(response.errors).toEqual(failedResponse)
  })

  it('when no tubes exist', async () => {
    const factory = SaphyrTubesFactory()
    get.mockReturnValue(factory.responses.fetch)

    const response = await Actions.getTractionTubesForBarcodes({ commit, getters }, barcodeList)

    expect(commit).toHaveBeenCalledWith('setTubes', factory.storeData.data)
    expect(response.body.data).toEqual(factory.content.data)
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
    create.mockReturnValue(saphyrTubesLibraryFactory.responses.fetch)

    const response = await Actions.createLibrariesInTraction({ getters }, payload)
    expect(response.success).toBe(true)
    expect(response.body.data).toEqual(saphyrTubesLibraryFactory.content.data)
  })

  it('unsuccessfully', async () => {
    const failedResponse = {
      errors: [
        {
          title: 'Unprocessable Entity',
          status: '422',
        },
      ],
    }
    const promise = Promise.reject(failedResponse)
    create.mockReturnValue(promise)

    const response = await Actions.createLibrariesInTraction({ getters }, payload)
    expect(response.success).toBeFalsy()
    expect(response.errors).toEqual(failedResponse)
  })
})

describe('#deleteLibraries', () => {
  let destroy, getters, libraryIds

  beforeEach(() => {
    destroy = vi.fn()
    getters = { libraryRequest: { destroy: destroy } }
    libraryIds = [1, 2]
  })

  it('successfully', async () => {
    const factory = BaseFactory({})
    destroy.mockReturnValue([Promise.resolve(factory.responses.fetch)])
    const response = await Actions.deleteLibraries({ getters }, libraryIds)
    expect(response[0].success).toBe(true)
    expect(response[0].body).toEqual(factory.content)
  })

  it('unsuccessfully', async () => {
    const failedResponse = {
      errors: [
        {
          title: 'Unprocessable Entity',
          status: '422',
        },
      ],
    }
    destroy.mockReturnValue([Promise.reject(failedResponse)])
    const response = await Actions.deleteLibraries({ getters }, libraryIds)

    expect(response[0].errors).toEqual(failedResponse)
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
    get.mockReturnValue(saphyrTubesLibraryFactory.responses.fetch)

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
