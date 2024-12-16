import PacbioLibraryIndex from '@/views/pacbio/PacbioLibraryIndex.vue'
import {
  mount,
  flushPromises,
  createTestingPinia,
  successfulResponse,
} from '@support/testHelper.js'
import { expect, vi } from 'vitest'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import PacbioLibraryFactory from '@tests/factories/PacbioLibraryFactory.js'
import useRootStore from '@/stores'

const pacbioLibraryFactory = PacbioLibraryFactory()

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(PacbioLibraryIndex, {
    global: {
      plugins: [
        createTestingPinia({
          state,
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

describe('Libraries.vue', () => {
  let wrapper, libraries, libraryStore
  beforeEach(async () => {
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.pacbio.libraries.get = vi
            .fn()
            .mockResolvedValue(pacbioLibraryFactory.responses.fetch)
        }
      },
    ]
    const { wrapperObj, storeObj } = mountWithStore({
      plugins,
    })
    await flushPromises()
    wrapper = wrapperObj
    libraryStore = storeObj
    libraries = wrapper.vm
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of libraries.state.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })
  })

  describe('#handleLibraryDelete', () => {
    let mockLibraries
    beforeEach(() => {
      mockLibraries = [
        {
          id: '721',
          barcode: 'TRAC-2-721',
        },
        {
          id: '722',
          barcode: 'TRAC-2-722',
        },
      ]
      libraries.deleteLibraries = vi.fn()
      libraries.showAlert = vi.fn()
      libraries.state.selected = mockLibraries
    })

    it('calls the correct functions', async () => {
      const expectedResponse = [{ success: true, barcode: 'TRAC-1', errors: [] }]
      libraryStore.deleteLibraries.mockReturnValue(expectedResponse)
      await libraries.handleLibraryDelete()

      expect(libraryStore.deleteLibraries).toBeCalledWith(mockLibraries.map((s) => s.id))
      expect(mockShowAlert).toBeCalledWith('Libraries 721, 722 successfully deleted', 'success')
    })

    it('calls showAlert when there is an error', async () => {
      const failedResponse = { success: false, barcode: '', errors: ['it did not work'] }
      libraryStore.deleteLibraries.mockReturnValue([failedResponse])
      await libraries.handleLibraryDelete()
      expect(libraryStore.deleteLibraries).toBeCalled()
      expect(mockShowAlert).toBeCalledWith('Failed to delete: Error: it did not work', 'danger')
    })
  })

  describe('Edit button', () => {
    let button
    it('is present for each library', async () => {
      button = wrapper.find('#edit-btn-721')
      expect(button.text()).toEqual('Edit')
      await button.trigger('click')
      expect(wrapper.find('#libraryForm').element).toBeTruthy()
    })
  })

  describe('Printing labels', () => {
    let create
    beforeEach(() => {
      const rootStore = useRootStore()
      create = vi.fn()
      rootStore.api = { printMyBarcode: { print_jobs: { create } } }

      libraries.state.selected = [
        { id: 1, barcode: 'TRAC-1', source_identifier: 'SQSC-1' },
        { id: 2, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
        { id: 3, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
      ]
    })

    describe('#printLabels', () => {
      beforeEach(() => {
        const modal = wrapper.findComponent({ ref: 'printerModal' })
        modal.vm.$emit('selectPrinter', 'printer1')
      })

      it('creates a print job and shows a success alert', async () => {
        create.mockResolvedValue(successfulResponse())
        wrapper.vm.onPrintAction()
        await flushPromises()

        expect(mockShowAlert).toBeCalledWith('Barcode(s) successfully printed', 'success')
      })
    })
  })
})
