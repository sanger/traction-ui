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
  let wrapper, modal, props, mockSamples, store

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
    modal = wrapperObj.vm
  })

  it('will have a modal', () => {
    expect(wrapper.find('#editSampleModal')).toBeDefined()
  })

  it('will have a form', () => {
    expect(wrapper.find('#sampleMetaDataForm')).toBeDefined()
  })

  it('store', () => {
    expect(store).toBeDefined()
  })

  describe.skip('update', () => {
    beforeEach(() => {
      modal.alert = vi.fn()
      modal.hide = vi.fn()
      modal.updateRequest = vi.fn()
    })

    it('successful ', async () => {
      modal.updateRequest.mockResolvedValue({ success: true, errors: [] })
      await modal.update()
      expect(modal.alert).toBeCalledWith('Sample updated', 'success')
      expect(modal.hide).toBeCalled()
    })

    it('unsuccessful ', async () => {
      modal.updateRequest.mockResolvedValue({ success: false, errors: ['Error: Raise this error'] })
      await modal.update()
      expect(modal.alert).toBeCalledWith(
        'Failed to update sample. Error: Raise this error',
        'danger',
      )
      expect(modal.hide).toBeCalled()
    })
  })

  describe.skip('alert', () => {
    it('emits an event with the message', () => {
      modal.alert('emit this message', 'success')
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0][0]).toEqual('emit this message')
      expect(wrapper.emitted().alert[0][1]).toEqual('success')
    })
  })

  describe.skip('Edit button', () => {
    let button

    it('is present for each sample', () => {
      button = wrapper.find('#editSample-1')
      expect(button.text()).toEqual('Edit')
    })
  })

  it.skip('#generateId', () => {
    expect(modal.generateId('edit', 1)).toEqual('edit-1')
  })
})
