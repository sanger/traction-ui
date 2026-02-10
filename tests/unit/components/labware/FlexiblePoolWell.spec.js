import FlexiblePoolWell from '@/components/labware/FlexiblePoolWell.vue'
import { mountWithStore } from '@support/testHelper.js'
import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import { beforeEach } from 'vitest'

const storePool = {
  position: '1',
  type: 'MultiPoolPosition',
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
})
