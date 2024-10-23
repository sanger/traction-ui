import useRootStore from '@/stores'
import { Data, createPinia, setActivePinia } from '@support/testHelper.js'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import { newResponse } from '@/api/v1/ResponseHelper.js'
import { beforeEach, describe, expect } from 'vitest'
import PacbioLibraryFactory from '@tests/factories/PacbioLibraryFactory.js'
import { libraryPayload } from '@/stores/utilities/pacbioLibraries.js'

const pacbioLibraryFactory = PacbioLibraryFactory()
const pacbioLibraryWithoutRelationships = PacbioLibraryFactory(false)

const requiredAttributes = {
  volume: 1.0,
  concentration: 1.0,
  template_prep_kit_box_barcode: 'LK12345',
  insert_size: 100,
  tag_id: 1,
}

const formLibrary = {
  ...requiredAttributes,
  sample: { id: 1 },
}

describe('usePacbioLibrariesStore', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('#libraryPayload', () => {
    it('for a create action', () => {
      expect(libraryPayload({ ...requiredAttributes, pacbio_request_id: 1 })).toEqual({
        data: {
          type: 'libraries',
          attributes: {
            ...requiredAttributes,
            pacbio_request_id: 1,
            primary_aliquot_attributes: {
              ...requiredAttributes,
            },
          },
        },
      })
    })

    it('for an update action', () => {
      expect(libraryPayload({ ...requiredAttributes, id: 1 })).toEqual({
        data: {
          id: 1,
          type: 'libraries',
          attributes: {
            ...requiredAttributes,
            primary_aliquot_attributes: {
              ...requiredAttributes,
            },
          },
        },
      })
    })
  })

  describe('getters', () => {
    it('returns libraries array from "state.libraries"', async () => {
      const store = usePacbioLibrariesStore()

      store.$state = { ...pacbioLibraryFactory.storeData }

      expect(store.librariesArray).toEqual(pacbioLibraryFactory.librariesArray)
    })
  })
  describe('actions', () => {
    let rootStore, store

    beforeEach(() => {
      rootStore = useRootStore()
      store = usePacbioLibrariesStore()
    })
    describe('#createLibraryInTraction', () => {
      let create

      beforeEach(() => {
        create = vi.fn()
        rootStore = useRootStore()
        store = usePacbioLibrariesStore()

        rootStore.api.v1 = {
          traction: {
            pacbio: {
              libraries: { create },
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
        const { success, barcode } = await store.createLibraryInTraction(formLibrary)
        expect(create).toBeCalledWith({
          data: libraryPayload({ ...requiredAttributes, pacbio_request_id: 1 }),
          include: 'tube,primary_aliquot',
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
        const { success, errors } = await store.createLibraryInTraction(formLibrary)

        expect(success).toBeFalsy()
        expect(errors).toEqual(expectedResponse.errors)
      })
    })
    describe('#deleteLibraries', () => {
      let destroy, libraryIds

      beforeEach(() => {
        destroy = vi.fn()
        rootStore.api.v1.traction.pacbio.libraries = { destroy }
        libraryIds = [1, 2]
      })

      it('successfully', async () => {
        const mockResponse = {
          status: '201',
          data: { data: {} },
        }
        destroy.mockReturnValue([Promise.resolve(mockResponse)])
        const expectedResponse = newResponse({ ...mockResponse, success: true })
        const response = await store.deleteLibraries(libraryIds)
        expect(response).toEqual([expectedResponse])
      })

      it('unsuccessfully', async () => {
        const failedResponse = {
          status: '422',
          data: { data: { errors: { error1: ['There was an error'] } } },
        }
        destroy.mockReturnValue([Promise.reject({ response: failedResponse })])

        const expectedResponse = newResponse({ ...failedResponse, success: false })
        const response = await store.deleteLibraries(libraryIds)

        expect(response[0].errors).toEqual(expectedResponse.errors)
        expect(response[0].success).toBeFalsy()
      })
    })
    describe('#fetchLibraries', () => {
      let get, failedResponse

      beforeEach(() => {
        get = vi.fn()
        rootStore.api.v1.traction.pacbio.libraries.get = get
        failedResponse = {
          data: { data: { errors: { error1: ['There was an error'] } } },
          status: 500,
          statusText: 'Internal Server Error',
        }
      })

      it('successfully', async () => {
        get.mockResolvedValue(pacbioLibraryFactory.responses.axios)
        const { success, errors } = await store.fetchLibraries()

        const expectedLibrary = Object.values(pacbioLibraryFactory.storeData.libraries)[0]

        expect(store.libraries[expectedLibrary.id]).toEqual(expectedLibrary)
        expect(store.tubes[expectedLibrary.tube]).toEqual(
          pacbioLibraryFactory.storeData.tubes[expectedLibrary.tube],
        )
        expect(store.tags[expectedLibrary.tag]).toEqual(
          pacbioLibraryFactory.storeData.tags[expectedLibrary.tag],
        )
        expect(store.requests[expectedLibrary.request]).toEqual(
          pacbioLibraryFactory.storeData.requests[expectedLibrary.request],
        )
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })

      it.only('when the library has no request, tube or tag', async () => {
        get.mockResolvedValue(pacbioLibraryWithoutRelationships.responses.axios)

        const { success, errors } = await store.fetchLibraries()
        const expectedLibrary = Object.values(
          pacbioLibraryWithoutRelationships.storeData.libraries,
        )[0]
        expect(store.libraries[expectedLibrary.id]).toEqual(expectedLibrary)
        expect(store.tubes).toEqual({})
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })

      it('unsuccessfully', async () => {
        get.mockRejectedValue({ response: failedResponse })
        const expectedResponse = newResponse({ ...failedResponse, success: false })
        const { success, errors } = await store.fetchLibraries()
        expect(success).toEqual(false)
        expect(errors).toEqual(expectedResponse.errors)
      })
    })

    describe('#updateLibrary', () => {
      let update, get, libraryBeforeUpdate, mockSuccessResponse, library

      beforeEach(async () => {
        update = vi.fn()
        const libraries = Data.TractionPacbioLibrary
        get = vi.fn().mockResolvedValue(libraries)
        rootStore = useRootStore()
        store = usePacbioLibrariesStore()

        rootStore.api.v1.traction.pacbio.libraries.get = get
        rootStore.api.v1.traction.pacbio.libraries.update = update
        await store.fetchLibraries()
        libraryBeforeUpdate = {
          id: '1',
          request: '1',
          tag: '3',
          tube: '4',
          state: 'pending',
          volume: 1.0,
          concentration: 1,
          insert_size: 100,
          source_identifier: 'DN1:A1',
          template_prep_kit_box_barcode: 'LK12345',
          created_at: '09/23/2019 11:18',
          type: 'libraries',
        }
        mockSuccessResponse = {
          status: '201',
        }
        library = {
          ...libraryBeforeUpdate,
          concentration: 2.0,
          template_prep_kit_box_barcode: 'LK12348',
          volume: 4.0,
          tag_id: '3',
        }
      })
      it('successfully', async () => {
        update.mockResolvedValue(mockSuccessResponse)
        const library = { ...libraryBeforeUpdate }
        library.concentration = 2.0
        library.template_prep_kit_box_barcode = 'LK12347'
        library.tag_id = '3'
        const { success } = await store.updateLibrary(library)
        expect(update).toBeCalledWith({
          data: {
            id: '1',
            type: 'libraries',
            attributes: {
              concentration: 2.0,
              template_prep_kit_box_barcode: 'LK12347',
              volume: 1.0,
              insert_size: 100,
              tag_id: '3',
              primary_aliquot_attributes: {
                concentration: 2.0,
                template_prep_kit_box_barcode: 'LK12347',
                volume: 1.0,
                insert_size: 100,
                tag_id: '3',
              },
            },
          },
        })
        expect(success).toBeTruthy()
      })

      it('should update the values in the store', async () => {
        update.mockResolvedValue(mockSuccessResponse)
        await store.fetchLibraries()
        expect(store.libraries[1]).toEqual(libraryBeforeUpdate)
        await store.updateLibrary(library)
        expect(store.libraries[1].concentration).toEqual(2.0)
        expect(store.libraries[1].template_prep_kit_box_barcode).toEqual('LK12348')
        expect(store.libraries[1].volume).toEqual(4.0)
      })

      it('should return error if required attributes are empty', async () => {
        await store.fetchLibraries()
        expect(store.libraries[1]).toEqual(libraryBeforeUpdate)
        library.volume = ''
        const { success, errors } = await store.updateLibrary(library)
        expect(success).toBeFalsy()
        expect(errors).toEqual('Missing required field(s)')
      })

      it('should not return error if optional attributes are empty', async () => {
        await store.fetchLibraries()
        const newLibrary = { ...library, tag_id: null }
        const { success, errors } = await store.updateLibrary(newLibrary)
        expect(success).toBeTruthy()
        expect(errors).toEqual(undefined)
      })

      it('unsuccessfully', async () => {
        const mockResponse = {
          status: '422',
          data: { data: { errors: { error1: ['There was an error'] } } },
        }
        update.mockRejectedValue({ response: mockResponse })
        const expectedResponse = newResponse({ ...mockResponse, success: false })
        const { success, errors } = await store.updateLibrary(library)
        expect(success).toBeFalsy()
        expect(errors).toEqual(expectedResponse.errors)
      })
    })
  })
})
