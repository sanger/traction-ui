import FlexiblePoolCreate from '@/views/FlexiblePoolCreate.vue'
import { mountWithStore, flushPromises } from '@support/testHelper.js'
import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import useRootStore from '@/stores'
import MultiPoolFactory from '@tests/factories/MultiPoolFactory.js'
import FlipperFactory from '@tests/factories/FlipperFactory.js'

const singleMultiPoolFactory = MultiPoolFactory.single()
const flipperFactory = FlipperFactory({ flexible_pooling: { enabled: true } })

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

describe('FlexiblePoolCreate', () => {
  let wrapper, store

  beforeEach(async () => {
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.multi_pools.find = vi
            .fn()
            .mockResolvedValue(singleMultiPoolFactory.responses.fetch)
          // Mock feature_flags endpoint to enable flexible_pooling
          store.api.traction.feature_flags.get = vi.fn(() => flipperFactory.responses.fetch)
        }
      },
    ]
    ;({ wrapper, store } = mountWithStore(FlexiblePoolCreate, {
      plugins,
      createStore: () => {
        return {
          multiPoolCreateStore: useMultiPoolCreateStore(),
          rootStore: useRootStore(),
        }
      },
    }))
    await flushPromises()
  })

  describe('Setup section', () => {
    it('updates the store when pipeline is selected', async () => {
      const pipelineSelect = wrapper.find('[data-testid="pipeline-select"]')
      await pipelineSelect.setValue('pacbio')
      expect(store.multiPoolCreateStore.multiPool.pipeline).toBe('pacbio')
    })

    it('updates the store when pooling method is selected', async () => {
      const poolingMethodSelect = wrapper.find('[data-testid="pooling-layout-select"]')
      await poolingMethodSelect.setValue('Plate')
      expect(store.multiPoolCreateStore.multiPool.pool_method).toBe('Plate')
    })
  })

  describe('reset', () => {
    it('resets the store data when called', async () => {
      store.multiPoolCreateStore.clearData = vi.fn()
      await wrapper.vm.reset()
      expect(store.multiPoolCreateStore.clearData).toHaveBeenCalled()
    })
  })

  describe('create', () => {
    it('shows the correct alert when creation is successful', async () => {
      store.multiPoolCreateStore.createMultiPool = vi.fn().mockResolvedValue({
        success: true,
        barcode: 'TRAC-2-123',
        errors: [],
      })
      await wrapper.vm.create()
      expect(store.multiPoolCreateStore.createMultiPool).toHaveBeenCalled()
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Flexible pool successfully created with barcode TRAC-2-123',
        'success',
      )
    })

    it('shows the correct alert when creation fails', async () => {
      store.multiPoolCreateStore.createMultiPool = vi.fn().mockResolvedValue({
        success: false,
        barcode: '',
        errors: ['Error creating pool'],
      })
      await wrapper.vm.create()
      expect(store.multiPoolCreateStore.createMultiPool).toHaveBeenCalled()
      expect(mockShowAlert).toHaveBeenCalledWith(['Error creating pool'], 'danger')
    })
  })
})
