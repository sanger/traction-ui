import Response from '@/api/Response'
import useRootStore from '@/stores'
import { Data, createPinia, setActivePinia } from '@support/testHelper.js'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import { newResponse } from '@/api/ResponseHelper.js'
import { beforeEach, describe } from 'vitest'

const expectedTagChoices = {
  3: [
    {
      text: 'bc1001_BAK8A_OA',
      value: '113',
    },
    {
      text: 'bc1002_BAK8A_OA',
      value: '114',
    },
    {
      text: 'bc1003_BAK8A_OA',
      value: '115',
    },
    {
      text: 'bc1008_BAK8A_OA',
      value: '116',
    },
    {
      text: 'bc1009_BAK8A_OA',
      value: '117',
    },
    {
      text: 'bc1010_BAK8A_OA',
      value: '118',
    },
    {
      text: 'bc1011_BAK8A_OA',
      value: '119',
    },
    {
      text: 'bc1012_BAK8A_OA',
      value: '120',
    },
    {
      text: 'bc1015_BAK8B_OA',
      value: '121',
    },
    {
      text: 'bc1016_BAK8B_OA',
      value: '122',
    },
    {
      text: 'bc1017_BAK8B_OA',
      value: '123',
    },
    {
      text: 'bc1018_BAK8B_OA',
      value: '124',
    },
    {
      text: 'bc1019_BAK8B_OA',
      value: '125',
    },
    {
      text: 'bc1020_BAK8B_OA',
      value: '126',
    },
    {
      text: 'bc1021_BAK8B_OA',
      value: '127',
    },
    {
      text: 'bc1022_BAK8B_OA',
      value: '128',
    },
  ],
  4: [
    {
      text: 'bc1001-F',
      value: '129',
    },
    {
      text: 'bc1001-R',
      value: '130',
    },
    {
      text: 'bc1002-F',
      value: '131',
    },
    {
      text: 'bc1002-R',
      value: '132',
    },
    {
      text: 'bc1003-F',
      value: '133',
    },
    {
      text: 'bc1003-R',
      value: '134',
    },
    {
      text: 'bc1004-F',
      value: '135',
    },
    {
      text: 'bc1004-R',
      value: '136',
    },
    {
      text: 'bc1005-F',
      value: '137',
    },
    {
      text: 'bc1005-R',
      value: '138',
    },
    {
      text: 'bc1006-F',
      value: '139',
    },
    {
      text: 'bc1006-R',
      value: '140',
    },
    {
      text: 'bc1008-F',
      value: '141',
    },
    {
      text: 'bc1008-R ',
      value: '142',
    },
    {
      text: 'bc1012-F',
      value: '143',
    },
    {
      text: 'bc1012-R',
      value: '144',
    },
    {
      text: 'bc1018-F',
      value: '145',
    },
    {
      text: 'bc1018-R',
      value: '146',
    },
    {
      text: 'bc1019-F',
      value: '147',
    },
    {
      text: 'bc1019-R',
      value: '148',
    },
    {
      text: 'bc1020-F',
      value: '149',
    },
    {
      text: 'bc1020-R',
      value: '150',
    },
    {
      text: 'bc1023-F',
      value: '151',
    },
    {
      text: 'bc1023-R',
      value: '152',
    },
  ],
}
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
          tag: { id: 1, group_id: '123abc1' },
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
        const { success, barcode } = await store.createLibraryInTraction(library)
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
      let destroy, libraryIds, failedResponse

      beforeEach(() => {
        destroy = vi.fn()
        rootStore.api.traction.pacbio.libraries = { destroy: destroy }
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
        const response = await store.deleteLibraries(libraryIds)

        expect(response).toEqual([expectedResponse])
      })

      it('unsuccessfully', async () => {
        const promise = new Promise((reject) => {
          reject(failedResponse)
        })

        destroy.mockReturnValue([promise])

        const expectedResponse = new Response(failedResponse)
        const response = await store.deleteLibraries(libraryIds)

        expect(response).toEqual([expectedResponse])
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
        expect(store.tagChoices).toEqual(expectedTagChoices)
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
