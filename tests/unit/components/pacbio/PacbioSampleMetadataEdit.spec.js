import { mount, createTestingPinia, flushPromises } from '@support/testHelper.js'
import PacbioSampleMetadataEdit from '@/components/pacbio/PacbioSampleMetadataEdit.vue'
import PacbioSampleFactory from '@tests/factories/PacbioSampleFactory.js'
import { usePacbioRequestsStore } from '@/stores/pacbioRequests.js'

const pacbioSampleFactory = PacbioSampleFactory()

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

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
  const wrapperObj = mount(PacbioSampleMetadataEdit, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioRequests: { ...state },
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
  })
  const storeObj = usePacbioRequestsStore()
  return { wrapperObj, storeObj }
}

describe('PacbioSampleMetadataEdit.vue', () => {
  let wrapper, props, mockSamples, store

  beforeEach(async () => {
    mockSamples = pacbioSampleFactory.content.data.data
    props = { req: mockSamples[0] }

    // store.commit('traction/pacbio/requests/setRequests', mockSamples)

    const { wrapperObj, storeObj } = mountWithStore({
      props,
    })
    await flushPromises()
    wrapper = wrapperObj
    store = storeObj
  })

  describe('update', () => {
    beforeEach(() => {
      store.updateRequest = vi.fn()
    })

    it('successful ', async () => {
      store.updateRequest.mockResolvedValue({ success: true, errors: [] })
      await wrapper.vm.update()
      expect(mockShowAlert).toBeCalledWith('Sample updated', 'success')
    })

    it('unsuccessful ', async () => {
      store.updateRequest.mockReturnValue({ success: false, errors: ['Error: Raise this error'] })
      await wrapper.vm.update()
      expect(mockShowAlert).toBeCalledWith(
        'Failed to update sample. Error: Raise this error',
        'danger',
      )
    })
  })

  it('#generateId', () => {
    expect(wrapper.vm.generateId('edit', 1)).toEqual('edit-1')
  })
})
