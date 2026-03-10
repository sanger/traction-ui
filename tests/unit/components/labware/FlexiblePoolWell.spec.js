import FlexiblePoolWell from '@/components/labware/FlexiblePoolWell.vue'
import { mountWithStore, nextTick } from '@support/testHelper.js'
import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import { beforeEach } from 'vitest'

const storePool = {
  position: '1',
  type: 'MultiPoolPosition',
  pool_barcode: 'TRAC-2-1213',
}
const props = {
  position: '1',
}

describe('FlexiblePoolWell.vue', () => {
  let well, wrapper

  beforeEach(() => {
    ;({ wrapper } = mountWithStore(FlexiblePoolWell, {
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
})
