import FlexiblePoolWell from '@/components/labware/FlexiblePoolWell.vue'
import { mountWithStore, nextTick } from '@support/testHelper.js'
import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import { beforeEach } from 'vitest'

const storePool = {
  id: '1',
  position: '1',
  type: 'MultiPoolPosition',
  pool_barcode: 'TRAC-2-1213',
  pool_id: '1',
}
const props = {
  position: '1',
  id: 'new',
}

describe('FlexiblePoolWell.vue', () => {
  let well, wrapper, store

  beforeEach(() => {
    ;({ wrapper, store } = mountWithStore(FlexiblePoolWell, {
      props,
      initialState: {
        multiPoolCreate: {
          multiPoolPositions: {
            1: storePool,
          },
        },
      },
      createStore: () => useMultiPoolCreateStore(),
    }))

    well = wrapper.vm
  })

  it('must have a position', () => {
    expect(well.position).toEqual(props.position)
  })

  it('must have an id', () => {
    expect(well.id).toEqual(props.id)
  })

  describe('#poolStatus', () => {
    it('returns bg-white text-black when there is no pool assigned to the position', () => {
      store.getPool = vi.fn(() => null)
      expect(well.poolStatus).toEqual('bg-white text-black')
    })

    it('returns bg-success text-white when the pool is valid', async () => {
      store.isValidPool = vi.fn(() => true)
      expect(well.poolStatus).toEqual('bg-success text-white')
    })

    it('returns bg-failure text-white when the pool is invalid', () => {
      store.isValidPool = vi.fn(() => false)
      expect(well.poolStatus).toEqual('bg-failure text-white')
    })
  })

  describe('pool barcode', () => {
    it('shows the pool barcode if it exists', () => {
      expect(wrapper.find('[data-attribute="flexible-pool-well"]').text()).toContain(
        storePool.pool_barcode,
      )
    })

    it('shows nothing if there is no pool barcode', async () => {
      wrapper.setProps({ position: '2' })
      await nextTick()
      expect(wrapper.find('[data-attribute="flexible-pool-well"]').text()).toBe('')
    })
  })

  describe('icons', () => {
    it('shows a tick icon when the pool is valid', async () => {
      store.isValidPool = vi.fn(() => true)
      await nextTick()
      expect(wrapper.find('[data-attribute="tick-icon"]').exists()).toBe(true)
      expect(wrapper.find('[data-attribute="cross-icon"]').exists()).toBe(false)
    })

    it('shows a cross icon when the pool is invalid', async () => {
      store.isValidPool = vi.fn(() => false)
      await nextTick()
      expect(wrapper.find('[data-attribute="cross-icon"]').exists()).toBe(true)
      expect(wrapper.find('[data-attribute="tick-icon"]').exists()).toBe(false)
    })

    it('shows no icon when the pool is empty', async () => {
      store.getPool = vi.fn(() => null)
      await nextTick()
      expect(wrapper.find('[data-attribute="cross-icon"]').exists()).toBe(false)
      expect(wrapper.find('[data-attribute="tick-icon"]').exists()).toBe(false)
    })
  })

  describe('#poolLink', () => {
    it('returns individual pool create when it is a new pool in a new multi pool', () => {
      store.getPool = vi.fn().mockReturnValue(null)
      const expectedLink = {
        name: 'FlexibleIndividualPoolCreate',
        params: { id: props.id, position: props.position },
      }
      expect(well.poolLink).toEqual(expectedLink)
    })

    it('returns PacbioPoolCreate when it is an existing pool in an existing multi pool', async () => {
      wrapper.setProps({ id: '2' })
      await nextTick()

      store.getPool = vi.fn().mockReturnValue(storePool)
      const expectedLink = {
        name: 'PacbioPoolCreate',
        params: { id: storePool.pool_id },
      }
      expect(well.poolLink).toEqual(expectedLink)
    })

    it('returns nothing when there is no pool and it is an existing multi pool', async () => {
      wrapper.setProps({ id: '2' })
      await nextTick()

      store.getPool = vi.fn().mockReturnValue(null)
      expect(well.poolLink).toEqual('')
    })
  })
})
