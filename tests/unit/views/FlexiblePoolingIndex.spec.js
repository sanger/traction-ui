import FlexiblePoolingIndex from '@/views/FlexiblePoolingIndex.vue'
import { mountWithStore, flushPromises } from '@support/testHelper.js'
import { beforeEach, describe, expect, it } from 'vitest'
import MultiPoolFactory from '@tests/factories/MultiPoolFactory.js'
import { useMultiPoolStore } from '@/stores/multiPools.js'
import useRootStore from '@/stores'
import FlipperFactory from '@tests/factories/FlipperFactory.js'

const multiPoolFactory = MultiPoolFactory()
const flipperFactory = FlipperFactory()

describe('FlexiblePoolingIndex', () => {
  let wrapper

  beforeEach(async () => {
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.multi_pools.get = vi
            .fn()
            .mockResolvedValue(multiPoolFactory.responses.fetch)
          // Mock feature_flags endpoint to enable flexible_pooling
          store.api.traction.feature_flags.get = vi.fn(() => flipperFactory.responses.fetch)
        }
      },
    ]
    ;({ wrapper } = mountWithStore(FlexiblePoolingIndex, {
      plugins,
      createStore: () => {
        useMultiPoolStore()
        useRootStore()
      },
    }))
    await flushPromises()
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of wrapper.vm.state.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(
        Object.values(multiPoolFactory.storeData.resources.multiPools).length,
      )
    })
  })
})
