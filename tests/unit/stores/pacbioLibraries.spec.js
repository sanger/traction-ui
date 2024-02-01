import Response from '@/api/Response'
import useRootStore from '@/stores'
import { Data, createPinia, setActivePinia } from '@support/testHelper.js'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import { newResponse } from '@/api/ResponseHelper.js'
import { beforeEach, describe } from 'vitest'
import { dataToObjectById } from '@/api/JsonApi.js'
describe('usePacbioLibrariesStore', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('state', () => {
    let libraries
    beforeEach(() => {
      libraries = new Response(Data.TractionPacbioLibrary).deserialize.libraries
    })

    it('"libraries" returns libraries from "state.libraries"', () => {
      const store = usePacbioLibrariesStore()
      store.$state = { libraries: libraries }
      expect(store.libraries).toEqual(libraries)
    })
  })
  describe('getters', () => {
    it('returns libraries array from "state.libraries"', async () => {
      const store = usePacbioLibrariesStore()

      const libraries = {
        1: {
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
        },
      }
      const tubes = {
        4: {
          id: '4',
          type: 'tubes',
          barcode: 'TRAC-2-721',
        },
      }
      const libraryTags = {
        3: {
          id: '3',
          type: 'tags',
          group_id: '1234',
        },
      }
      const requests = {
        1: {
          id: '1',
          type: 'requests',
          sample_name: '4616STDY7535900',
        },
      }

      store.$state = { libraries, libraryTags, requests, tubes }
      const libraryArray = [
        {
          id: '1',
          state: 'pending',
          volume: 1.0,
          concentration: 1,
          insert_size: 100,
          source_identifier: 'DN1:A1',
          template_prep_kit_box_barcode: 'LK12345',
          created_at: '09/23/2019 11:18',
          type: 'libraries',
          tag_group_id: '1234',
          sample_name: '4616STDY7535900',
          barcode: 'TRAC-2-721',
        },
      ]
      expect(store.librariesArray).toEqual(libraryArray)
    })
    it('returns tagSetChoicesArray and tagChoicesForId from state.tagSetChoices', async () => {
      const store = usePacbioLibrariesStore()
      const data = dataToObjectById({
        data: Data.TractionPacbioTagSets.data.data,
        includeRelationships: true,
      })
      store.$state = {
        tagSets: { ...data },
        tags: { ...dataToObjectById({ data: Data.TractionPacbioTagSets.data.included }) },
      }
      const expectedTagSetChoices = [
        {
          text: 'Sequel_16_barcodes_v3',
          value: '3',
        },
        {
          text: 'IsoSeq_v1',
          value: '4',
        },
      ]
      expect(store.tagSetChoices).toEqual(Object.values(expectedTagSetChoices))
      expect(store.tagChoicesForId('3')).toHaveLength(16)
      expect(
        store
          .tagChoicesForId('3')
          .some((tag) => tag.text === 'bc1001_BAK8A_OA' && tag.value === '113'),
      ).toBe(true)
    })
  })
  describe('actions', () => {
    let rootStore, store

    beforeEach(() => {
      rootStore = useRootStore()
      store = usePacbioLibrariesStore()
    })
    describe('#createLibraryInTraction', () => {
      let create, library, body

      beforeEach(() => {
        create = vi.fn()
        rootStore = useRootStore()
        store = usePacbioLibrariesStore()

        rootStore.api = {
          traction: {
            pacbio: {
              libraries: { create },
            },
            tractionTags: [{ id: 1, group_id: '123abc1' }],
          },
        }

        library = {
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          sample: { id: 1 },
          tag: { id: 1, group_id: '123abc1' },
        }
        body = {
          data: {
            type: 'libraries',
            attributes: {
              pacbio_request_id: library.sample.id,
              template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
              tag_id: 1,
              concentration: library.concentration,
              volume: library.volume,
              insert_size: library.insert_size,
              primary_aliquot_attributes: {
                template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
                volume: library.volume,
                concentration: library.concentration,
                insert_size: library.insert_size,
              },
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
        const { success, barcode } = await store.createLibraryInTraction(library, 1)
        expect(create).toBeCalledWith({
          data: body,
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
        const { success, errors } = await store.createLibraryInTraction(library)

        expect(success).toBeFalsy()
        expect(errors).toEqual(expectedResponse.errors)
      })
    })
    describe('#deleteLibraries', () => {
      let destroy, libraryIds

      beforeEach(() => {
        destroy = vi.fn()
        rootStore.api.traction.pacbio.libraries = { destroy: destroy }
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
        rootStore.api.traction.pacbio.libraries.get = get
        failedResponse = {
          data: { data: { errors: { error1: ['There was an error'] } } },
          status: 500,
          statusText: 'Internal Server Error',
        }
      })

      it('successfully', async () => {
        const libraries = Data.TractionPacbioLibrary
        get.mockResolvedValue(libraries)
        const { success, errors } = await store.fetchLibraries()
        // Because we do some data manipulation in the action the easiest way to build the expected data
        // is to do it manually
        const expectedLibrary = {
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

        expect(store.libraries[1]).toEqual(expectedLibrary)
        expect(store.tubes[4]).toEqual({
          id: '4',
          type: 'tubes',
          barcode: 'TRAC-2-721',
        })
        expect(store.libraryTags[3]).toEqual({
          id: '3',
          type: 'tags',
          group_id: '1234',
        })
        expect(store.requests[1]).toEqual({
          id: '1',
          type: 'requests',
          sample_name: '4616STDY7535900',
        })
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })

      it('when the library has no request, tube or tag', async () => {
        get.mockResolvedValue(Data.TractionPacbioLibrariesNoRelationships)

        const { success, errors } = await store.fetchLibraries()
        const expectedLibrary = {
          type: 'libraries',
          id: '7',
          state: 'pending',
          volume: 1,
          concentration: 1,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          created_at: '2019/10/16 13:52',
          deactivated_at: null,
          source_identifier: null,
          request: null,
          tag: null,
        }
        expect(store.libraries[7]).toEqual(expectedLibrary)
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

    describe('fetchPacbioTagSets', () => {
      it('handles success', async () => {
        // mock dependencies
        const get = vi.fn()
        rootStore.api.traction.pacbio.tag_sets = { get }
        get.mockResolvedValue(Data.TractionPacbioTagSets)
        // apply action
        const { success } = await store.fetchPacbioTagSets()
        // assert result
        const data = dataToObjectById({
          data: Data.TractionPacbioTagSets.data.data,
          includeRelationships: true,
        })
        expect(store.tagSets).toEqual(data)
        expect(success).toEqual(true)
      })

      it('handles failure', async () => {
        // mock dependencies
        const get = vi.fn()
        rootStore.api.traction.pacbio.tag_sets = { get }
        get.mockRejectedValue({
          data: { data: [] },
          status: 500,
          statusText: 'Internal Server Error',
        })
        // apply action
        const { success } = await store.fetchPacbioTagSets()
        expect(store.tagSets).toEqual({})
        expect(store.tags).toEqual({})
        expect(success).toEqual(false)
      })
    })
  })
})
