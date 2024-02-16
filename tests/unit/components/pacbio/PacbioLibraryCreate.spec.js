import { mount, nextTick, createTestingPinia } from '@support/testHelper.js'
import PacbioLibraryCreate from '@/components/pacbio/PacbioLibraryCreate.vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import PacbioLibraryForm from '@/components/pacbio/PacbioLibraryForm.vue'
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
 * state - initial state of the store.
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 */
function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(PacbioLibraryCreate, {
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

describe('PacbioLibraryCreate.vue', () => {
  let wrapper, modal, props, store

  beforeEach(() => {
    props = {
      disabled: true,
      isStatic: true,
      selectedSample: { id: 1 },
    }
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.pacbio.tag_sets.get = vi.fn().mockReturnValue([])
        }
      },
    ]
    const { wrapperObj, storeObj } = mountWithStore({
      props,
      plugins,
    })
    wrapper = wrapperObj
    store = storeObj
    modal = wrapperObj.vm
  })

  it('will have an button component', () => {
    expect(wrapper.find('#pacbioLibraryCreate').element).toBeTruthy()
  })

  it('will have an modal component', () => {
    expect(wrapper.find('.modal')).toBeTruthy()
  })

  it('will have an form component', async () => {
    wrapper.vm.showModal = true
    await nextTick()
    expect(wrapper.find('#librarForm').element).toBeTruthy()
  })

  it('must have a disabled prop', () => {
    expect(modal.disabled).toEqual(props.disabled)
  })

  it('must have a isStatic prop', () => {
    expect(modal.isStatic).toEqual(props.isStatic)
  })

  it('must have a selectedSample prop', () => {
    expect(modal.selectedSample).toEqual(props.selectedSample)
  })

  describe('#createLibrary', () => {
    let payload

    beforeEach(() => {
      modal.createLibraryInTraction = vi.fn()
      payload = { tag: { id: 1 }, sample: { id: 1 } }
    })

    it.only('is successful', async () => {
      const expectedResponse = { success: true, barcode: 'TRAC-1', errors: [] }
      store.createLibraryInTraction.mockReturnValue(expectedResponse)
      modal.formRef.library.value = payload
      await modal.createLibrary()
      expect(wrapper.emitted().alert).toBeTruthy()
    })

    it('does not error when there is no tag', async () => {
      modal.library.value = { tag: { id: '' }, sample: { id: 1 } }
      const expectedResponse = { success: true, barcode: 'TRAC-1', errors: [] }
      store.createLibraryInTraction.mockReturnValue(expectedResponse)

      await modal.createLibrary()

      expect(wrapper.emitted().alert).toBeTruthy()
    })

    it('shows a error message on failure', async () => {
      modal.library.value = payload
      const expectedResponse = { success: false, barcode: '', errors: ['it did not work'] }
      store.createLibraryInTraction.mockReturnValue(expectedResponse)

      await modal.createLibrary()
      expect(mockShowAlert).toBeCalledWith(
        'Failed to create library in Traction: it did not work',
        'danger',
      )
    })
  })
})
