import { createPinia, setActivePinia } from 'pinia'
import { usePacbioPoolsStore } from '@/stores/pacbioPools.js'
import { Data } from '@support/testHelper.js'
import useRootStore from '@/stores'
import { expect } from 'vitest'
import * as jsonapi from '@/api/JsonApi'

const pools = [
  {
    id: '1',
    type: 'pools',
    barcode: 'TRAC-2-1',
    used_aliquots: [
      {
        id: '1',
        sample_name: 'Sample48',
        group_id: 'bc1019',
        type: 'used_aliquots',
        run_suitability: {
          ready_for_run: true,
          errors: [],
        },
      },
    ],
    tube: '1',
    volume: 1.0,
    concentration: 1.0,
    template_prep_kit_box_barcode: 'LK12345',
    insert_size: 100,
    source_identifier: 'DN1:A1',
    created_at: '2021-07-15T15:26:29.000Z',
    updated_at: '2021-07-15T15:26:29.000Z',
    run_suitability: {
      ready_for_run: true,
      errors: [],
      formattedErrors: [],
    },
  },
  {
    id: '2',
    type: 'pools',
    barcode: 'TRAC-2-2',
    used_aliquots: [
      {
        id: '2',
        sample_name: 'Sample47',
        group_id: 'bc1011_BAK8A_OA',
        type: 'used_aliquots',
        run_suitability: {
          ready_for_run: false,
          errors: [
            {
              title: "can't be blank",
              detail: "insert_size - can't be blank",
              code: '100',
              source: {
                pointer: '/data/attributes/insert_size',
              },
            },
          ],
        },
      },
    ],
    tube: '2',
    volume: 1.0,
    concentration: 1.0,
    template_prep_kit_box_barcode: 'LK12345',
    insert_size: null,
    source_identifier: 'DN1:B1',
    created_at: '2021-07-15T15:26:29.000Z',
    updated_at: '2021-07-15T15:26:29.000Z',
    run_suitability: {
      ready_for_run: false,
      formattedErrors: [
        "Pool insert_size - can't be blank",
        'Pool used_aliquots - is invalid',
        "Used aliquot 2 (Sample47) insert_size - can't be blank",
      ],
      errors: [
        {
          title: "can't be blank",
          detail: "insert_size - can't be blank",
          code: '100',
          source: {
            pointer: '/data/attributes/insert_size',
          },
        },
        {
          title: 'is invalid',
          detail: 'used_aliquots - is invalid',
          code: '100',
          source: {
            pointer: '/data/relationships/used_aliquots',
          },
        },
      ],
    },
  },
]

describe('usePacbioPools', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('getters', () => {
    let store
    beforeEach(() => {
      store = usePacbioPoolsStore()
      store.$state = Data.StorePools
    })
    it('"pools" returns denormalized pools from "state.pools"', () => {
      expect(store.poolsArray).toEqual(pools)
    })

    it('"pools" returns pools successfully and with an empty library group_id if that library has no tag', () => {
      store.used_aliquots[1] = {
        id: '1',
        request: '1',
        tag: '',
        type: 'used_aliquots',
        run_suitability: { ready_for_run: true, errors: [] },
      }
      expect(store.poolsArray[0].used_aliquots[0].group_id).toEqual(undefined)
    })
  })
  describe('actions', () => {
    describe('#fetchPools', () => {
      let get, failedResponse, rootStore, store

      beforeEach(() => {
        get = vi.fn()
        store = usePacbioPoolsStore()
        rootStore = useRootStore()
        rootStore.api.traction.pacbio.pools.get = get
        failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
      })

      it('successfully', async () => {
        const response = Data.TractionPacbioPoolsWithAliquots
        const { data: pools, included } = response.data
        get.mockResolvedValue(response)

        await store.fetchPools()
        expect(store.pools).toEqual(
          jsonapi.dataToObjectById({ data: pools, includeRelationships: true }),
        )
        expect(store.tubes).toEqual(jsonapi.dataToObjectById({ data: included.slice(0, 2) }))
        // expect(store.used_aliquots).toEqual(
        //   jsonapi.dataToObjectById({ data: included.slice(2, 4), includeRelationships: true }),
        // )
        expect(store.tags).toEqual(jsonapi.dataToObjectById({ data: included.slice(4, 6) }))
        expect(store.requests).toEqual(jsonapi.dataToObjectById({ data: included.slice(6, 8) }))
      })

      it('when the pool has no used_aliquots', async () => {
        const response = Data.TractionPacbioPoolsNoRelationships
        const { data: pools } = response.data
        get.mockResolvedValue(response)
        await store.fetchPools()
        expect(store.pools).toEqual(
          jsonapi.dataToObjectById({ data: pools, includeRelationships: true }),
        )
      })

      it('unsuccessfully', async () => {
        get.mockRejectedValue(failedResponse)
        const { success, errors } = await store.fetchPools()
        expect(success).toEqual(false)
        expect(errors).toEqual(failedResponse)
      })
    })
  })
})
