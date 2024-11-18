import PacbioPoolCreate from '@/views/pacbio/PacbioPoolCreate.vue'
import { mount, createTestingPinia, router, flushPromises } from '@support/testHelper.js'
import { expect } from 'vitest'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import PacbioPlatesRequestFactory from '@tests/factories/PacbioPlatesRequestFactory'
import PacbioTubeFactory from '@tests/factories/PacbioTubeFactory'

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
/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * state - initial state of the store
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 */
function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(PacbioPoolCreate, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioPoolCreate: state,
          },
          stubActions,
          plugins,
        }),
      ],
      stubs: {
        PacbioTagSetList: true,
        PacbioTagSetItem: true,
        PacbioLabwareSelectedList: true,
        PacbioPoolEdit: true,
      },
    },
    props,
  })
  const storeObj = usePacbioPoolCreateStore()
  return { wrapperObj, storeObj }
}
const pacbioPlatesRequestFactory = PacbioPlatesRequestFactory()
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
  const plates = pacbioPlatesRequestFactory.storeData.plates
  const wells = pacbioPlatesRequestFactory.storeData.wells
  const tubes = pacbioTubeFactory.storeData.tubes

  // const tubes = dataToObjectById({
  //   data: Data.PacbioTubesRequest.data.data,
  //   includeRelationships: true,
  // })

  describe('On Pool/New', () => {
    afterEach(async () => {
      // Clear the router so it doesn't affect other tests as router is shared between tests
      await router.push('/')
    })
    it('will only call mockFetchPacbioTagSets', async () => {
      mockFetchPacbioTagSets.mockReturnValue({ success: true, errors: [] })
      mockPopulateUsedAliquotsFromPool.mockReturnValue({ success: true, errors: [] })
      await router.push('/pacbio/pool/new')
      mountWithStore({ plugins })
      await flushPromises()
      expect(mockFetchPacbioTagSets).toBeCalled()
      expect(mockPopulateUsedAliquotsFromPool).not.toBeCalled()
    })
    it('will showAlert if mockFetchPacbioTagsets returns error', async () => {
      const errors = ['Invalid data']
      mockFetchPacbioTagSets.mockReturnValue({ success: false, errors })
      mockPopulateUsedAliquotsFromPool.mockReturnValue({ success: true, errors: [] })
      await router.push('/pacbio/pool/new')
      mountWithStore({ plugins })
      await flushPromises()
      expect(mockShowAlert).toBeCalledWith(errors, 'danger')
    })
  })

  describe('On Pool/Edit', () => {
    let wrapper, store
    beforeEach(() => {
      const state = {
        resources: {
          plates,
          tubes,
          wells,
        },
      }
      mockFetchPacbioTagSets.mockReturnValue({ success: true, errors: [] })
      mockPopulateUsedAliquotsFromPool.mockReturnValue({ success: true, errors: [] })
      const { wrapperObj, storeObj } = mountWithStore({ plugins, state })
      wrapper = wrapperObj
      store = storeObj
      store.selected.plates = {
        61: { id: '61' },
      }
      store.selected.tubes = {
        1: { id: '20' },
      }
    })

    describe('when a plate or tube is selected', () => {
      it('calls both mockFetchPacbioTagSets and mockPopulateUsedAliquotsFromPool', async () => {
        await flushPromises()
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
    beforeEach(() => {
      const state = {
        resources: {
          plates,
          tubes,
          wells,
        },
      }
      mockFetchPacbioTagSets.mockReturnValue({ success: true, errors: [] })
      mockPopulateUsedAliquotsFromPool.mockReturnValue({ success: true, errors: [] })
      const { wrapperObj, storeObj } = mountWithStore({ plugins, state })
      wrapper = wrapperObj
      store = storeObj
      store.findPacbioPlate = mockFindPacbioPlateFn
      store.findPacbioTube = mockFindPacbioTubeFn
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
})
