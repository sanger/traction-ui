import useRootStore from '@/stores'
import {
  createPinia,
  setActivePinia,
  successfulResponse,
  failedResponse,
} from '@support/testHelper.js'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import { beforeEach, describe, expect } from 'vitest'
import PacbioLibraryFactory from '@tests/factories/PacbioLibraryFactory.js'
import { formatAndTransformLibraries } from '@/stores/utilities/pacbioLibraries.js'
import { buildLibraryResourcePayload } from '@/services/traction/PacbioLibrary.js'

const pacbioLibraryFactory = PacbioLibraryFactory()
const pacbioLibraryWithoutRelationships = PacbioLibraryFactory({ relationships: false })

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
      const payload = buildLibraryResourcePayload({ ...requiredAttributes, pacbio_request_id: 1 })
      expect(Object.keys(payload.data).includes('id')).toBeFalsy()
      expect(payload).toEqual({
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
      const payload = buildLibraryResourcePayload({ ...requiredAttributes, id: 1 })
      expect(Object.keys(payload.data.attributes).includes('pacbio_request_id')).toBeFalsy()
      expect(payload).toEqual({
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
      const { libraries, tubes, tags, requests } = pacbioLibraryFactory.storeData

      expect(store.librariesArray).toEqual(
        formatAndTransformLibraries(libraries, tubes, tags, requests),
      )
    })
  })
  describe('actions', () => {
    let rootStore, store

    beforeEach(() => {
      rootStore = useRootStore()
      store = usePacbioLibrariesStore()
    })
    describe('#createLibrary', () => {
      let create

      beforeEach(() => {
        create = vi.fn()
        rootStore = useRootStore()
        store = usePacbioLibrariesStore()

        rootStore.api = {
          traction: {
            pacbio: {
              libraries: { create },
            },
          },
        }
      })
      it('successfully', async () => {
        const mockResponse = successfulResponse({
          data: {},
          included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1' } }],
        })
        create.mockResolvedValue(mockResponse)
        const { success, barcode } = await store.createLibrary(formLibrary)
        expect(create).toBeCalledWith({
          data: buildLibraryResourcePayload({ ...requiredAttributes, pacbio_request_id: 1 }),
          include: 'tube,primary_aliquot',
        })
        expect(success).toBeTruthy()
        expect(barcode).toEqual('TRAC-1')
      })
      it('unsuccessfully', async () => {
        const failureResponse = failedResponse()
        create.mockResolvedValue(failureResponse)

        const { success, errors } = await store.createLibrary(formLibrary)

        expect(success).toBeFalsy()
        expect(errors).toEqual(failureResponse.errorSummary)
      })
    })
    describe('#deleteLibraries', () => {
      let destroy, libraryIds

      beforeEach(() => {
        destroy = vi.fn()
        rootStore.api.traction.pacbio.libraries = { destroy }
        libraryIds = [1, 2]
      })

      it('successfully', async () => {
        const mockResponse = successfulResponse()
        destroy.mockReturnValue([Promise.resolve(mockResponse)])
        const response = await store.deleteLibraries(libraryIds)
        expect(response[0].success).toBeTruthy()
      })

      it('unsuccessfully', async () => {
        const mockResponse = failedResponse()
        destroy.mockReturnValue([Promise.resolve(mockResponse)])

        const response = await store.deleteLibraries(libraryIds)

        expect(response[0].errors).toEqual(mockResponse.errorSummary)
        expect(response[0].success).toBeFalsy()
      })
    })
    describe('#fetchLibraries', () => {
      let get

      beforeEach(() => {
        get = vi.fn()
        rootStore.api.traction.pacbio.libraries.get = get
      })

      it('successfully', async () => {
        get.mockResolvedValue(pacbioLibraryFactory.responses.fetch)
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

      it('when the library has no request, tube or tag', async () => {
        get.mockResolvedValue(pacbioLibraryWithoutRelationships.responses.fetch)

        const { success, errors } = await store.fetchLibraries()
        const expectedLibrary = Object.values(
          pacbioLibraryWithoutRelationships.storeData.libraries,
        )[0]
        expect(store.libraries[expectedLibrary.id]).toEqual(expectedLibrary)
        expect(store.tubes).toEqual({})
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })
    })

    describe('#updateLibrary', () => {
      let update, get, libraryBeforeUpdate, library

      beforeEach(async () => {
        update = vi.fn()
        get = vi.fn().mockResolvedValue(pacbioLibraryFactory.responses.fetch)
        rootStore = useRootStore()
        store = usePacbioLibrariesStore()

        rootStore.api.traction.pacbio.libraries.get = get
        rootStore.api.traction.pacbio.libraries.update = update
        await store.fetchLibraries()
        libraryBeforeUpdate = Object.values(pacbioLibraryFactory.storeData.libraries)[0]

        library = {
          ...libraryBeforeUpdate,
          concentration: 2.0,
          template_prep_kit_box_barcode: 'LK12348',
          volume: 4.0,
          tag_id: '3',
        }
      })

      it('successfully', async () => {
        const mockResponse = successfulResponse()
        update.mockResolvedValue(mockResponse)
        const { success } = await store.updateLibrary(library)
        expect(success).toBeTruthy()
      })

      it('should update the values in the store', async () => {
        const mockResponse = {
          status: 201,
          json: async () => ({
            data: {
              id: library.id,
              attributes: {
                concentration: 2.0,
                template_prep_kit_box_barcode: 'LK12348',
                volume: 4.0,
                tag_id: '3',
              },
            },
          }),
          ok: true,
        }
        update.mockResolvedValue(mockResponse) // Mock API response

        await store.fetchLibraries()

        expect(store.libraries[libraryBeforeUpdate.id]).toEqual(libraryBeforeUpdate)
        await store.updateLibrary(library)
        const storeLibrary = store.libraries[libraryBeforeUpdate.id]
        expect(storeLibrary.concentration).toEqual(2.0)
        expect(storeLibrary.template_prep_kit_box_barcode).toEqual('LK12348')
        expect(storeLibrary.volume).toEqual(4.0)
      })
    })
  })
})
