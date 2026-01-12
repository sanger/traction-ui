import FlexiblePoolingIndex from '@/views/FlexiblePoolingIndex.vue'
import { mountWithStore, flushPromises } from '@support/testHelper.js'
import { beforeEach, describe, expect, it } from 'vitest'
import MultiPoolFactory from '@tests/factories/MultiPoolFactory.js'
import { useMultiPoolStore } from '@/stores/multiPools.js'
import useRootStore from '@/stores'

const multiPoolFactory = MultiPoolFactory()

describe('FlexiblePoolingIndex', () => {
  let wrapper

  beforeEach(async () => {
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.multi_pools.requests.get = vi
            .fn()
            .mockResolvedValue(multiPoolFactory.responses.fetch)
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

  describe.skip('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of wrapper.vm.state.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(
        multiPoolFactory.storeData.resources.multiPools.length,
      )
    })
  })
})
