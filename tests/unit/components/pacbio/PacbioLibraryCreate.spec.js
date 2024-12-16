import { mount, nextTick, createTestingPinia, flushPromises } from '@support/testHelper.js'
import PacbioLibraryCreate from '@/components/pacbio/PacbioLibraryCreate.vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import { expect } from 'vitest'
import PacbioTagSetFactory from '@tests/factories/PacbioTagSetFactory.js'

const pacbioTagSetFactory = PacbioTagSetFactory()

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
  const plugins = [
    ({ store }) => {
      if (store.$id === 'root') {
        store.api.traction.pacbio.tag_sets.get = vi.fn(() => pacbioTagSetFactory.responses.fetch)
      }
    },
  ]
  it('disables create library button when sample is empty', async () => {
    const { wrapperObj } = mountWithStore({
      props: { selectedSample: {} },
      plugins,
    })
    const button = wrapperObj.findComponent('#pacbioLibraryCreate')
    await nextTick()
    expect(button.element.disabled).toBe(true)
  })

  describe('when a valid sample is given as a prop', () => {
    let wrapper, cmp, props, store
    beforeEach(async () => {
      props = {
        selectedSample: { id: 1, sample_name: 'sample1' },
      }

      const { wrapperObj, storeObj } = mountWithStore({
        props,
        plugins,
      })
      await flushPromises()
      wrapper = wrapperObj
      store = storeObj
      cmp = wrapperObj.vm
    })

    it('will have a Create Library button component', () => {
      const button = wrapper.findComponent('#pacbioLibraryCreate')
      expect(button.element.disabled).toBe(false)
    })

    it('must have a selectedSample prop', () => {
      expect(cmp.selectedSample).toEqual(props.selectedSample)
    })

    describe('#createLibrary', () => {
      let payload

      beforeEach(() => {
        store.createLibrary = vi.fn()
      })

      it('is successful', async () => {
        const expectedResponse = { success: true, barcode: 'TRAC-1', errors: [] }
        store.createLibrary.mockReturnValue(expectedResponse)
        await cmp.createLibrary()
        expect(mockShowAlert).toBeCalledWith('Created library with barcode TRAC-1', 'success')
      })

      it('does not error when there is no tag', async () => {
        cmp.library.value = { tag: { id: '' }, sample: { id: 1 } }
        const expectedResponse = { success: true, barcode: 'TRAC-1', errors: [] }
        store.createLibrary.mockReturnValue(expectedResponse)
        await cmp.createLibrary()
        expect(mockShowAlert).toBeCalledWith('Created library with barcode TRAC-1', 'success')
      })

      it('shows a error message on failure', async () => {
        cmp.library.value = payload
        const expectedResponse = { success: false, barcode: '', errors: ['it did not work'] }
        store.createLibrary.mockReturnValue(expectedResponse)

        await cmp.createLibrary()
        expect(mockShowAlert).toBeCalledWith(
          'Failed to create library in Traction: it did not work',
          'danger',
        )
      })
    })
  })
})
