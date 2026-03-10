import FlexiblePoolCreate from '@/views/FlexiblePoolCreate.vue'
import { mountWithStore, flushPromises, router, nextTick } from '@support/testHelper.js'
import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import useRootStore from '@/stores'
import MultiPoolFactory from '@tests/factories/MultiPoolFactory.js'
import FlipperFactory from '@tests/factories/FlipperFactory.js'
import { LabwareTypes } from '@/lib/LabwareTypes.js'

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
    await router.push({ name: 'FlexiblePool', params: { id: 'new' } })
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

    it('updates the store when pooling method is set to Tube Rack', async () => {
      const poolingMethodSelect = wrapper.find('[data-testid="pooling-layout-select"]')
      await poolingMethodSelect.setValue('TubeRack')
      expect(store.multiPoolCreateStore.multiPool.pool_method).toBe('TubeRack')
    })
  })

  describe('Actions section', () => {
    it('resets the form when reset button is clicked', async () => {
      const resetButton = wrapper.find('[data-testid="reset-btn"]')
      await resetButton.trigger('click')
      expect(store.multiPoolCreateStore.clearData).toHaveBeenCalled()
    })

    it('creates a multi pool when create button is clicked', async () => {
      store.multiPoolCreateStore.isValidMultiPool = vi.fn().mockReturnValue(true)
      store.multiPoolCreateStore.createMultiPool = vi.fn().mockResolvedValue({
        success: true,
        id: '1',
        errors: [],
      })
      // Next tick to ensure isValidMultiPool is run, enabling the create button
      await nextTick()

      const createButton = wrapper.find('[data-testid="create-btn"]')
      await createButton.trigger('click')

      expect(store.multiPoolCreateStore.createMultiPool).toHaveBeenCalled()
    })

    it('create is disabled when multi pool is invalid', async () => {
      store.multiPoolCreateStore.isValidMultiPool = vi.fn(() => false)
      const createButton = wrapper.find('[data-testid="create-btn"]')
      // Next tick to ensure isValidMultiPool is run
      await nextTick()

      expect(createButton.element.disabled).toBe(true)
    })

    it('create is enabled when multi pool is valid', async () => {
      store.multiPoolCreateStore.isValidMultiPool = vi.fn(() => true)
      const createButton = wrapper.find('[data-testid="create-btn"]')
      // Next tick to ensure isValidMultiPool is run
      await nextTick()

      expect(createButton.element.disabled).toBe(false)
    })
  })

  describe('#reset', () => {
    it('resets the store data when called', async () => {
      store.multiPoolCreateStore.clearData = vi.fn()
      await wrapper.vm.reset()
      expect(store.multiPoolCreateStore.clearData).toHaveBeenCalled()
    })
  })

  describe('#create', () => {
    it('shows the correct alert when creation is successful', async () => {
      store.multiPoolCreateStore.createMultiPool = vi.fn().mockResolvedValue({
        success: true,
        id: '1',
        errors: [],
      })
      await wrapper.vm.create()
      expect(store.multiPoolCreateStore.createMultiPool).toHaveBeenCalled()
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Flexible pool successfully created with id 1',
        'success',
      )
    })

    it('shows the correct alert when creation fails', async () => {
      store.multiPoolCreateStore.createMultiPool = vi.fn().mockResolvedValue({
        success: false,
        id: '',
        errors: ['Error creating pool'],
      })
      await wrapper.vm.create()
      expect(store.multiPoolCreateStore.createMultiPool).toHaveBeenCalled()
      expect(mockShowAlert).toHaveBeenCalledWith(['Error creating pool'], 'danger')
    })

    describe('id', () => {
      it('sets the id from the route params', async () => {
        expect(wrapper.vm.id).toBe('new')
        await router.push({ name: 'FlexiblePool', params: { id: 1 } })
        expect(wrapper.vm.id).toBe('1')
      })
    })

    describe('labwareType computed property', () => {
      it('returns MultiPool96 configuration when pool_method is Plate', () => {
        store.multiPoolCreateStore.multiPool.pool_method = 'Plate'
        expect(wrapper.vm.labwareType).toEqual(LabwareTypes.MultiPool96)
      })

      it('returns TubeRack24 configuration when pool_method is TubeRack', () => {
        store.multiPoolCreateStore.multiPool.pool_method = 'TubeRack'
        expect(wrapper.vm.labwareType).toEqual(LabwareTypes.TubeRack24)
      })
    })

    describe('isSetupDisabled computed property', () => {
      it('returns false when multiPoolPositions is empty', () => {
        store.multiPoolCreateStore.multiPool.multiPoolPositions = {}
        expect(wrapper.vm.isSetupDisabled).toBe(false)
      })

      it('returns true when multiPoolPositions has items', () => {
        store.multiPoolCreateStore.multiPool.multiPoolPositions = { 1: {} }
        expect(wrapper.vm.isSetupDisabled).toBe(true)
      })
    })

    describe('Setup section disabled state', () => {
      it('disables the setup section when multiPoolPositions has items', async () => {
        const pipelineSelect = wrapper.find('[data-testid="pipeline-select"]')
        const poolingMethodSelect = wrapper.find('[data-testid="pooling-layout-select"]')
        const csvFileInput = wrapper.find('[data-testid="csv-file-input"]')

        // Enable; there are no pool positions.
        store.multiPoolCreateStore.multiPool.multiPoolPositions = {}
        await wrapper.vm.$nextTick()
        expect(pipelineSelect.element.disabled).toBe(false)
        expect(poolingMethodSelect.element.disabled).toBe(false)
        expect(csvFileInput.element.disabled).toBe(false)

        // Disable; there is at least 1 pool position.
        store.multiPoolCreateStore.multiPool.multiPoolPositions = { 1: {} }
        await wrapper.vm.$nextTick()
        expect(pipelineSelect.element.disabled).toBe(true)
        expect(poolingMethodSelect.element.disabled).toBe(true)
        expect(csvFileInput.element.disabled).toBe(true)
      })

      it('enables the setup section when multiPoolPositions becomes empty', async () => {
        const pipelineSelect = wrapper.find('[data-testid="pipeline-select"]')
        const poolingMethodSelect = wrapper.find('[data-testid="pooling-layout-select"]')
        const csvFileInput = wrapper.find('[data-testid="csv-file-input"]')

        // Disable; there is at least 1 pool position.
        store.multiPoolCreateStore.multiPool.multiPoolPositions = { 1: {} }
        await wrapper.vm.$nextTick()
        expect(pipelineSelect.element.disabled).toBe(true)
        expect(poolingMethodSelect.element.disabled).toBe(true)
        expect(csvFileInput.element.disabled).toBe(true)

        // Enable; reset the store so that there are no pool positions.
        await wrapper.vm.reset() // store.multiPoolCreateStore.multiPool.multiPoolPositions = {}
        await wrapper.vm.$nextTick()
        expect(pipelineSelect.element.disabled).toBe(false)
        expect(poolingMethodSelect.element.disabled).toBe(false)
        expect(csvFileInput.element.disabled).toBe(false)
      })
    })

    describe('Pooling Layout rendering', () => {
      it('renders an 8x12 grid for Plate layout', async () => {
        store.multiPoolCreateStore.multiPool.pool_method = 'Plate'
        await wrapper.vm.$nextTick()
        const rows = wrapper.findAll('[data-attribute="labware-row"]')
        expect(rows.length).toBe(8) // 8 rows
        expect(rows[0].findAll('[data-attribute="labware-column"]').length).toBe(12) // 12 columns
      })

      it('renders a 4x6 grid for Tube Rack layout', async () => {
        store.multiPoolCreateStore.multiPool.pool_method = 'TubeRack'
        await wrapper.vm.$nextTick()
        const rows = wrapper.findAll('[data-attribute="labware-row"]')
        expect(rows.length).toBe(4) // 4 rows
        expect(rows[0].findAll('[data-attribute="labware-column"]').length).toBe(6) // 6 columns
      })

      it('numbers pools by rows for Tube Rack layout', async () => {
        store.multiPoolCreateStore.multiPool.pool_method = 'TubeRack'
        await wrapper.vm.$nextTick()
        const expectedNumbers = [
          ['1', '2', '3', '4', '5', '6'],
          ['7', '8', '9', '10', '11', '12'],
          ['13', '14', '15', '16', '17', '18'],
          ['19', '20', '21', '22', '23', '24'],
        ]
        const rows = wrapper.findAll('[data-attribute="labware-row"]')
        rows.forEach((row, rowIndex) => {
          const columns = row.findAll('[data-attribute="labware-column"]')
          columns.forEach((column, columnIndex) => {
            expect(column.find('[data-attribute="well-position"]').text()).toBe(
              expectedNumbers[rowIndex][columnIndex],
            )
          })
        })
      })
    })
  })
})
