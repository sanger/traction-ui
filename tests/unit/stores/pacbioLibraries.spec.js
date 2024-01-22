import Response from '@/api/Response'
import useRootStore from '@/stores'
import { Data, createPinia, setActivePinia } from '@support/testHelper.js'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import { newResponse } from '@/api/ResponseHelper.js'
import { beforeEach, describe } from 'vitest'

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
      libraries = new Response(Data.TractionPacbioLibraries).deserialize.libraries
    })

    it('"libraries" returns libraries from "state.libraries"', () => {
      const store = usePacbioLibrariesStore()
      store.$state = { libraries: libraries }
      expect(store.libraries).toEqual(libraries)
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
              pools: { create },
            },
          },
        }

        library = {
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          sample: { id: 1 },
        }
        body = {
          data: {
            type: 'library',
            attributes: {
              pacbio_request_id: library.sample.id,
              template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
              tag_id: 1,
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
        const { success, barcode } = await store.createLibraryInTraction(library, 1)
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
    describe('#setLibraries', () => {
      let get, failedResponse

      beforeEach(() => {
        get = vi.fn()
        store.libraryRequest.get = get
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
        const { success, errors } = await store.setLibraries()

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
              relationships: {
                tube: {
                  data: {
                    id: '721',
                    type: 'tubes',
                  },
                },
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
              relationships: {
                tube: {
                  data: {
                    id: '722',
                    type: 'tubes',
                  },
                },
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
        expect(store.libraries).toEqual(expectedLibraries)
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })

      it('when the library has no request, tube or tag', async () => {
        get.mockResolvedValue(Data.TractionPacbioLibrariesNoRelationships)

        const { success, errors } = await store.setLibraries()

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
        expect(store.libraries).toEqual(expectedLibrary)
        expect(success).toEqual(true)
        expect(errors).toEqual([])
      })

      it('unsuccessfully', async () => {
        get.mockRejectedValue({ response: failedResponse })
        const expectedResponse = newResponse({ ...failedResponse, success: false })
        const { success, errors } = await store.setLibraries()
        expect(success).toEqual(false)
        expect(errors).toEqual(expectedResponse.errors)
      })
    })
    describe('updateLibrary', () => {
      it('"updateLibrary" updates "state.libraries" with the given library change', () => {
        const library = new Response(Data.TractionPacbioLibrary).deserialize.libraries[0]
        const libraries = new Response(Data.TractionPacbioLibraries).deserialize.libraries
        library.volume = 7
        store.libraries = [...libraries]
        store.updateLibrary(library)
        expect(store.libraries).not.toEqual(libraries)
      })
    })
    describe('fetchPacbioTagSets', () => {
      it('handles success', async () => {
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

        // mock dependencies
        const get = vi.fn()
        rootStore.api.traction.pacbio.tag_sets = { get }
        get.mockResolvedValue(Data.TractionPacbioTagSets)
        // apply action
        const { success } = await store.fetchPacbioTagSets()
        // assert result
        expect(store.tagSetChoices).toEqual(expectedTagSetChoices)
        expect(Object.keys(store.tagChoices)).toEqual(['3', '4'])
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
        expect(store.tagSetChoices).toEqual([])
        expect(store.tagChoices).toEqual({})
        expect(success).toEqual(false)
      })
    })
  })
})
