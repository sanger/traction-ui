import FlexiblePoolWell from '@/components/labware/FlexiblePoolWell.vue'
import { mountWithStore } from '@support/testHelper.js'
import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import { beforeEach } from 'vitest'

const storePool = {
  pool: {
    id: 1,
  },
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

  describe('#status', () => {
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
})
