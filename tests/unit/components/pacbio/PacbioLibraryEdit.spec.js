import { mountWithStore, flushPromises, nextTick } from '@support/testHelper.js'
import PacbioLibraryEdit from '@/components/pacbio/PacbioLibraryEdit.vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import PacbioTagSetFactory from '@tests/factories/PacbioTagSetFactory.js'

const pacbioTagSetFactory = PacbioTagSetFactory()

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

describe('PacbioLibraryEdit.vue', () => {
  let wrapper, modal, props, store

  beforeEach(async () => {
    props = {
      disabled: true,
      isStatic: true,
      library: {
        id: 1,
        barcode: 'TRAC-1',
        volume: 1,
        concentration: 1,
        template_prep_kit_box_barcode: 1,
      },
    }
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          // this was api. but didn't fail so is it needed?
          store.api.traction.pacbio.tag_sets.get = vi.fn(() => pacbioTagSetFactory.responses.fetch)
        }
      },
    ]
    ;({ wrapper, store } = mountWithStore(PacbioLibraryEdit, {
      props,
      plugins,
      createStore: () => usePacbioLibrariesStore(),
    }))
    await flushPromises()
    modal = wrapper.vm
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
      const expectedResponse = {
        success: false,
        barcode: '',
        template_prep_kit_box_barcode: '',
        errors: ['it did not work'],
      }
      store.updateLibrary.mockReturnValue(expectedResponse)

      await modal.updateLibrary()
      expect(mockShowAlert).toBeCalledWith(
        'Failed to update library in Traction: it did not work',
        'danger',
      )
    })
  })
})
