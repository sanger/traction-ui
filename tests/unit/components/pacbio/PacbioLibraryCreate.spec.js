import { mountWithStore, flushPromises, nextTick } from '@support/testHelper.js'
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

const mountPacbioLibraryCreate = ({ props } = {}) =>
  mountWithStore(PacbioLibraryCreate, {
    plugins: [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.pacbio.tag_sets.get = vi.fn(() => pacbioTagSetFactory.responses.fetch)
        }
      },
    ],
    props,
    createStore: () => usePacbioLibrariesStore(),
  })

describe('PacbioLibraryCreate.vue', () => {
  it('disables create library button when sample is empty', async () => {
    const { wrapper } = mountPacbioLibraryCreate({
      props: { selectedSample: {} },
    })
    const button = wrapper.findComponent('#pacbioLibraryCreate')
    await nextTick()
    expect(button.element.disabled).toBe(true)
  })

  describe('when a valid sample is given as a prop', () => {
    let wrapper, cmp, props, store
    beforeEach(async () => {
      props = {
        selectedSample: { id: 1, sample_name: 'sample1' },
      }
      ;({ wrapper, store } = mountPacbioLibraryCreate({
        props,
      }))
      await flushPromises()
      cmp = wrapper.vm
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
