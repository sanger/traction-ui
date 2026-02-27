import FlexiblePoolCreate from '@/views/FlexiblePoolCreate.vue'
import { mountWithStore, flushPromises, nextTick } from '@support/testHelper.js'
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

  describe('tooltip and download link', () => {
    it('displays tooltip text when hovered over', async () => {
      const tooltip = wrapper.find('#csv-tooltip')
      await tooltip.trigger('mouseover')
      expect(tooltip.find('#tooltip').isVisible()).toBe(true)
      expect(tooltip.find('#tooltip').text()).toContain('All columns must contain values:')
    })

    it('has a working download link', () => {
      const downloadLink = wrapper.find('a[href="/flexible-pooling-template.csv"]')
      expect(downloadLink.exists()).toBe(true)
      expect(downloadLink.attributes('download')).toBe('FlexiblePoolingTemplate.csv')
    })
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

  describe('loading modal', () => {
    it('shows the modal when showLoadingModal is called', async () => {
      const message = 'show modal message'
      wrapper.vm.showLoadingModal(message)
      await nextTick()
      expect(wrapper.find('[data-type=loading-full-screen-modal]').exists()).toBe(true)
      expect(wrapper.find('[data-type=loading-full-screen-modal]').text()).toBe(message)
    })

    it('hides the modal when clearLoadingModal is called', async () => {
      wrapper.vm.showLoadingModal('show modal message')
      await nextTick()
      expect(wrapper.find('[data-type=loading-full-screen-modal]').exists()).toBe(true)
      wrapper.vm.clearLoadingModal()
      await nextTick()
      expect(wrapper.find('[data-type=loading-full-screen-modal]').exists()).toBe(false)
    })
  })

  describe('uploadFile', () => {
    it('calls the correct store method when a file is uploaded', async () => {
      const file = new File(['file contents'], 'test.csv', { type: 'text/csv' })
      const event = { target: { files: [file] } }
      store.multiPoolCreateStore.parsePoolingCsvFile = vi.fn().mockResolvedValue({
        success: true,
        errors: [],
      })
      await wrapper.vm.uploadFile(event)
      expect(store.multiPoolCreateStore.parsePoolingCsvFile).toHaveBeenCalledWith(file)
      expect(mockShowAlert).toHaveBeenCalledWith('CSV file successfully processed', 'success')
    })

    it('shows an alert if there is an error parsing the file', async () => {
      const file = new File(['file contents'], 'test.csv', { type: 'text/csv' })
      const event = { target: { files: [file] } }
      store.multiPoolCreateStore.parsePoolingCsvFile = vi.fn().mockResolvedValue({
        success: false,
        errors: ['Error parsing file'],
      })
      await wrapper.vm.uploadFile(event)
      expect(store.multiPoolCreateStore.parsePoolingCsvFile).toHaveBeenCalledWith(file)
      expect(mockShowAlert).toHaveBeenCalledWith('Error parsing file', 'danger')
    })

    it('shows an alert if there is no file', async () => {
      const event = { target: { files: [] } }
      await wrapper.vm.uploadFile(event)
      expect(mockShowAlert).toHaveBeenCalledWith(
        'No file selected. Please select a CSV file to upload.',
        'warning',
      )
    })
  })
})
