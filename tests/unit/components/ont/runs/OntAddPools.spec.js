import ONTAddPools from '@/components/ont/runs/ONTAddPools'
import { localVue, mount, store } from '@support/testHelper'
import { describe } from 'vitest'

describe('ONTAddPools', () => {
  let wrapper, cmp

  beforeEach(() => {
    wrapper = mount(ONTAddPools, { localVue, store })
    cmp = wrapper.vm
  })

  describe('#data', () => {
    it('must have pool_barcode data', () => {
      expect(cmp.pool_barcode).toEqual(null)
    })
    it('must have fields data', () => {
      expect(cmp.fields).toEqual([
        { key: 'id', label: 'Pool ID', sortable: true, tdClass: 'pool-id' },
        { key: 'barcode', label: 'Barcode', sortable: true, tdClass: 'barcode' },
      ])
    })
  })
  describe('#computed', () => {
    it('#mapGetters', () => {
      expect(cmp.pools).toBeDefined()
      expect(cmp.pools).toEqual([])
    })
    it('#mapState', () => {
      expect(cmp.pools).toBeDefined()
      expect(cmp.pools).toEqual([])
    })
  })

  describe('#methods', () => {
    describe('#mapActions', () => {
      it('#populateOntPools', () => {
        const {
          state: {
            api: {
              traction: {
                ont: { pools: poolsRequest },
              },
            },
          },
        } = store

        poolsRequest.get = vi.fn()

        mount(ONTAddPools, {
          localVue,
          store,
        })

        cmp.populateOntPools('aBarcode')
        expect(poolsRequest.get).toBeCalled()
      })
    })
  })
})
