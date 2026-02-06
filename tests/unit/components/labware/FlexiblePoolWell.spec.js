import FlexiblePoolWell from '@/components/labware/FlexiblePoolWell.vue'
import { mountWithStore } from '@support/testHelper.js'
import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import { beforeEach } from 'vitest'

const storePool = {
  position: 'A1',
  type: 'MultiPoolPosition',
}
const props = {
  position: 'A1',
  id: 'new',
}

describe('FlexiblePoolWell.vue', () => {
  let well, wrapper

  beforeEach(() => {
    ;({ wrapper } = mountWithStore(FlexiblePoolWell, {
      props,
      initialState: {
        multiPoolCreate: {
          multiPoolPositions: {
            A1: storePool,
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
})
