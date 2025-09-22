import PacbioPoolCreate from '@/views/pacbio/PacbioPoolCreate.vue'
import { mountWithStore, flushPromises } from '@support/testHelper.js'
import { expect } from 'vitest'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import PacbioPlateFactory from '@tests/factories/PacbioPlateFactory.js'
import PacbioTubeFactory from '@tests/factories/PacbioTubeFactory.js'
import PacbioTagSetFactory from '@tests/factories/PacbioTagSetFactory.js'

// there is a lot of mocking going on here.
// I suspect most of this should be in e2e tests
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
const pacbioTagSetFactory = PacbioTagSetFactory()

describe('PacbioPoolCreate', () => {
  const mockPopulateUsedAliquotsFromPool = vi.fn()
  const plugins = [
    ({ store }) => {
      if (store.$id === 'pacbioPoolCreate') {
        store.populateUsedAliquotsFromPool = mockPopulateUsedAliquotsFromPool
      }
      if (store.$id === 'root') {
        store.api.traction.pacbio.tag_sets.get = vi
          .fn()
          .mockResolvedValue(pacbioTagSetFactory.responses.fetch)
      }
    },
  ]
  const { plates, wells } = pacbioPlateFactory.storeData.resources
  const tubes = pacbioTubeFactory.storeData.tubes

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
      it('calls mockPopulateUsedAliquotsFromPool', async () => {
        expect(mockPopulateUsedAliquotsFromPool).toBeCalled()
      })
      it('sets scanned labware with selected plates and tubes', async () => {
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
      mockPopulateUsedAliquotsFromPool.mockReturnValue({ success: true, errors: [] })
      let { wrapper, store } = mountPacbioPoolCreate({ plugins })
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
