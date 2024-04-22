import { mount, nextTick, createTestingPinia, flushPromises, Data } from '@support/testHelper.js'
import PacbioLibraryEdit from '@/components/pacbio/PacbioLibraryEdit.vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
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
  const wrapperObj = mount(PacbioLibraryEdit, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioLibraries: { ...state },
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
  })
  const storeObj = usePacbioLibrariesStore()
  return { wrapperObj, storeObj }
}

describe('PacbioLibraryEdit.vue', () => {
  let wrapper, modal, props, store

  beforeEach(async () => {
    props = {
      disabled: true,
      isStatic: true,
      library: { id: 1, barcode: 'TRAC-1' },
    }
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.pacbio.tag_sets.get = vi.fn(() => Data.TractionPacbioTagSets)
        }
      },
    ]
    const { wrapperObj, storeObj } = mountWithStore({
      props,
      plugins,
    })
    await flushPromises()
    wrapper = wrapperObj
    store = storeObj
    modal = wrapperObj.vm
  })

  it('will have an form component', async () => {
    wrapper.vm.showModal = true
    await nextTick()
    expect(wrapper.find('#libraryForm').element).toBeTruthy()
  })

  it('must have a library prop', () => {
    expect(modal.library).toEqual(props.library)
  })

  it('disables te update button if there are errors in formLibrary', async () => {
    wrapper.vm.showModal = true
    await nextTick()
    expect(wrapper.find('#update-btn').element.disabled).toBe(false)
    expect(wrapper.vm.formRef).toBeDefined()
    wrapper.vm.formRef.formLibrary.error = 'error'
    await nextTick()
    expect(wrapper.find('#update-btn').element.disabled).toBe(true)
  })

  describe('#updateLibrary', () => {
    let payload

    beforeEach(() => {
      store.updateLibrary = vi.fn()
    })

    it('is successful', async () => {
      const expectedResponse = { success: true, errors: [] }
      store.updateLibrary.mockReturnValue(expectedResponse)
      await modal.updateLibrary()
      expect(mockShowAlert).toBeCalledWith('Updated library with barcode TRAC-1', 'success')
    })

    it('does not error when there is no tag', async () => {
      modal.library.value = { tag_id: null }
      const expectedResponse = { success: true, barcode: 'TRAC-1', errors: [] }
      store.updateLibrary.mockReturnValue(expectedResponse)
      await modal.updateLibrary()
      expect(wrapper.emitted().editCompleted).toBeTruthy()
      expect(mockShowAlert).toBeCalledWith('Updated library with barcode TRAC-1', 'success')
    })

    it('shows a error message on failure', async () => {
      modal.library.value = payload
      const expectedResponse = { success: false, barcode: '', errors: ['it did not work'] }
      store.updateLibrary.mockReturnValue(expectedResponse)

      await modal.updateLibrary()
      expect(mockShowAlert).toBeCalledWith(
        'Failed to update library in Traction: it did not work',
        'danger',
      )
    })
  })
})
