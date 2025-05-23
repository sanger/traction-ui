import PacbioPoolCreate from '@/views/pacbio/PacbioPoolCreate.vue'
import { mountWithStore, router, flushPromises } from '@support/testHelper.js'
import { expect } from 'vitest'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import PacbioPlateFactory from '@tests/factories/PacbioPlateFactory.js'
import PacbioTubeFactory from '@tests/factories/PacbioTubeFactory.js'

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

const triggerInputEnter = async (wrapper, value) => {
  const input = wrapper.find('#labware-finder-input')
  // Set the value of the input element
  input.element.value = value
  // Create a mock event with event.key set to 'Enter'
  const mockEvent = { key: 'Enter' }
  await input.wrapperElement.dispatchEvent(new KeyboardEvent('keyup', mockEvent))
}

const mountPacbioPoolCreate = (params) =>
  mountWithStore(PacbioPoolCreate, {
    ...params,
    stubs: {
      PacbioTagSetList: true,
      PacbioTagSetItem: true,
      PacbioLabwareSelectedList: true,
      PacbioPoolEdit: true,
    },
    createStore: () => usePacbioPoolCreateStore(),
  })

const pacbioPlateFactory = PacbioPlateFactory()
const pacbioTubeFactory = PacbioTubeFactory()

describe('PacbioPoolCreate', () => {
  const mockFetchPacbioTagSets = vi.fn()
  const mockPopulateUsedAliquotsFromPool = vi.fn()
  const plugins = [
    ({ store }) => {
      if (store.$id === 'pacbioRoot') {
        store.fetchPacbioTagSets = mockFetchPacbioTagSets
      }
      if (store.$id === 'pacbioPoolCreate') {
        store.populateUsedAliquotsFromPool = mockPopulateUsedAliquotsFromPool
      }
    },
  ]
  const { plates, wells } = pacbioPlateFactory.storeData.resources
  const tubes = pacbioTubeFactory.storeData.tubes

  describe('On Pool/New', () => {
    afterEach(async () => {
      // Clear the router so it doesn't affect other tests as router is shared between tests
      await router.push('/')
    })
    it('will only call mockFetchPacbioTagSets', async () => {
      mockFetchPacbioTagSets.mockReturnValue({ success: true, errors: [] })
      mockPopulateUsedAliquotsFromPool.mockReturnValue({ success: true, errors: [] })
      await router.push('/pacbio/pool/new')
      mountPacbioPoolCreate({ plugins })
      await flushPromises()
      expect(mockFetchPacbioTagSets).toBeCalled()
      expect(mockPopulateUsedAliquotsFromPool).not.toBeCalled()
    })
    it('will showAlert if mockFetchPacbioTagsets returns error', async () => {
      const errors = ['Invalid data']
      mockFetchPacbioTagSets.mockReturnValue({ success: false, errors })
      mockPopulateUsedAliquotsFromPool.mockReturnValue({ success: true, errors: [] })
      await router.push('/pacbio/pool/new')
      mountPacbioPoolCreate({ plugins })
      await flushPromises()
      expect(mockShowAlert).toBeCalledWith(errors, 'danger')
    })
  })

  describe('On Pool/Edit', () => {
    let wrapper, store
    beforeEach(async () => {
      const state = {
        resources: {
          plates,
          tubes,
          wells,
        },
      }
      mockFetchPacbioTagSets.mockReturnValue({ success: true, errors: [] })
      mockPopulateUsedAliquotsFromPool.mockReturnValue({ success: true, errors: [] })
      ;({ wrapper, store } = mountPacbioPoolCreate({
        plugins,
        initialState: { pacbioPoolCreate: state },
      }))
      store.selected.plates = {
        61: { id: '61' },
      }
      store.selected.tubes = {
        1: { id: '20' },
      }
      await flushPromises()
    })

    describe('when a plate or tube is selected', () => {
      it('calls both mockFetchPacbioTagSets and mockPopulateUsedAliquotsFromPool', async () => {
        expect(mockFetchPacbioTagSets).toBeCalled()
        expect(mockPopulateUsedAliquotsFromPool).toBeCalled()
      })
      it('sets scanned labware with selected plates and tubes', async () => {
        mockFetchPacbioTagSets.mockReturnValue({ success: true, errors: [] })
        mockPopulateUsedAliquotsFromPool.mockReturnValue({ success: true, errors: [] })
        expect(wrapper.vm.scannedLabware).toEqual([
          { barcode: 'DN814327C', type: 'plates' },
          { barcode: 'TRAC-2-20', type: 'tubes' },
        ])
      })
    })
  })

  describe('On Scan', () => {
    let wrapper, store
    const mockFindPacbioPlateFn = vi.fn()
    const mockFindPacbioTubeFn = vi.fn()
    beforeEach(async () => {
      const state = {
        resources: {
          plates,
          tubes,
          wells,
        },
      }
      mockFetchPacbioTagSets.mockReturnValue({ success: true, errors: [] })
      mockPopulateUsedAliquotsFromPool.mockReturnValue({ success: true, errors: [] })
      ;({ wrapper, store } = mountPacbioPoolCreate({ plugins, state }))
      store.findPacbioPlate = mockFindPacbioPlateFn
      store.findPacbioTube = mockFindPacbioTubeFn
      await flushPromises()
    })
    describe('when a plate barcode is scanned', () => {
      const barcode = 'DN814327C'
      it('calls findPacbioPlate on enter key press', async () => {
        mockFindPacbioPlateFn.mockReturnValue({
          success: true,
          errors: [],
        })
        mockFindPacbioTubeFn.mockReturnValue({ success: true, errors: [] })
        await triggerInputEnter(wrapper, barcode)

        expect(mockFindPacbioPlateFn).toBeCalled()
        expect(mockFindPacbioTubeFn).not.toBeCalled()
      })
      it('enables search button on input', async () => {
        expect(wrapper.find('#labware-finder-button').element.disabled).toBe(true)
        mockFindPacbioPlateFn.mockReturnValue({
          success: true,
          errors: [],
        })
        mockFindPacbioTubeFn.mockReturnValue({ success: true, errors: [] })
        const input = wrapper.find('#labware-finder-input')
        // Set the value of the input element
        await input.setValue(barcode)
        expect(wrapper.find('#labware-finder-button').element.disabled).toBe(false)
      })
      it('calls findPacbioPlate on search button press', async () => {
        mockFindPacbioPlateFn.mockReturnValue({
          success: true,
          errors: [],
        })
        mockFindPacbioTubeFn.mockReturnValue({ success: true, errors: [] })
        const input = wrapper.find('#labware-finder-input')
        // Set the value of the input element
        await input.setValue(barcode)
        expect(wrapper.find('#labware-finder-button').element.disabled).toBe(false)
        await wrapper.find('#labware-finder-button').trigger('click')
        expect(mockFindPacbioPlateFn).toBeCalled()
        expect(mockFindPacbioTubeFn).not.toBeCalled()
      })

      it('sets scannedLabware', async () => {
        mockFindPacbioPlateFn.mockReturnValue({
          success: true,
          errors: [],
        })
        mockFindPacbioTubeFn.mockReturnValue({ success: true, errors: [] })
        await triggerInputEnter(wrapper, barcode)

        expect(wrapper.vm.scannedLabware).toEqual([{ barcode, type: 'plates' }])
      })
      it('show alert on error', async () => {
        mockFindPacbioPlateFn.mockReturnValue({
          success: false,
          errors: ['Error finding plate'],
        })
        mockFindPacbioTubeFn.mockReturnValue({ success: false, errors: ['Error finding tube'] })
        await triggerInputEnter(wrapper, barcode)

        expect(mockFindPacbioPlateFn).toBeCalled()
        expect(mockFindPacbioTubeFn).toBeCalled()
        expect(mockShowAlert).toBeCalledWith('No labware found', 'danger')
      })
    })

    describe('when a tube barcode is scanned', () => {
      const barcode = 'GEN-1680611780-6'
      it('calls findPacbioPlate', async () => {
        mockFindPacbioPlateFn.mockReturnValue({
          success: false,
          errors: ['Error finding plate'],
        })
        mockFindPacbioTubeFn.mockReturnValue({ success: true, errors: [] })
        await triggerInputEnter(wrapper, barcode)

        expect(mockFindPacbioPlateFn).toBeCalled()
        expect(mockFindPacbioTubeFn).toBeCalled()
      })
      it('sets scannedLabware', async () => {
        mockFindPacbioPlateFn.mockReturnValue({
          success: false,
          errors: ['Error finding plate'],
        })
        mockFindPacbioTubeFn.mockReturnValue({ success: true, errors: [] })
        await triggerInputEnter(wrapper, barcode)

        expect(wrapper.vm.scannedLabware).toEqual([{ barcode, type: 'tubes' }])
      })
      it('show alert on error', async () => {
        mockFindPacbioPlateFn.mockReturnValue({
          success: false,
          errors: ['Error finding plate'],
        })
        mockFindPacbioTubeFn.mockReturnValue({ success: false, errors: ['Error finding tube'] })
        await triggerInputEnter(wrapper, barcode)

        expect(mockFindPacbioPlateFn).toBeCalled()
        expect(mockFindPacbioTubeFn).toBeCalled()
        expect(mockShowAlert).toBeCalledWith('No labware found', 'danger')
      })
    })
    describe('On scanning a plate or tube that is already selected', () => {
      it('will show alert', async () => {
        wrapper.vm.scannedLabware = [{ barcode: 'DN814327C', type: 'plates' }]
        await triggerInputEnter(wrapper, 'DN814327C')
        expect(mockShowAlert).toBeCalledWith('Labware already scanned', 'danger')
      })
    })
  })

  describe('resetData', () => {
    it('resets the data when called', async () => {
      let { wrapper, store } = mountPacbioPoolCreate()
      wrapper.vm.scannedLabware = [
        { barcode: 'DN814327C', type: 'plates' },
        { barcode: 'TRAC-2-20', type: 'tubes' },
      ]
      wrapper.vm.searchText = 'DN814327C'
      wrapper.vm.searchRef = 'plates'
      wrapper.vm.aliquotSelectionHighlightLabware = { labware: 'DN814327C', aliquot: { id: 1 } }

      wrapper.vm.resetData()

      expect(wrapper.vm.scannedLabware).toEqual([])
      expect(wrapper.vm.searchRef).toEqual(null)
      expect(wrapper.vm.searchText).toEqual('')
      expect(wrapper.vm.aliquotSelectionHighlightLabware).toEqual(null)
      expect(store.clearPoolData).toBeCalled()
    })
  })
})
