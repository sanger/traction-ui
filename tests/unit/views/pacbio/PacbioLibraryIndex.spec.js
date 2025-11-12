import PacbioLibraryIndex from '@/views/pacbio/PacbioLibraryIndex.vue'
import { flushPromises, successfulResponse, mountWithStore } from '@support/testHelper.js'
import { beforeEach, expect, it, vi } from 'vitest'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import PacbioLibraryFactory from '@tests/factories/PacbioLibraryFactory.js'
import PrinterFactory from '@tests/factories/PrinterFactory.js'
import useRootStore from '@/stores'

const pacbioLibraryFactory = PacbioLibraryFactory()
const printerFactory = PrinterFactory()

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))
const mockFetchLocations = vi.fn().mockResolvedValue([])
vi.mock('@/composables/useLocationFetcher.js', () => ({
  default: () => ({
    fetchLocations: mockFetchLocations,
  }),
}))

const mockFetchLocations = vi.fn(() => [])
vi.mock('@/composables/useLocationFetcher.js', () => ({
  default: () => ({
    fetchLocations: mockFetchLocations,
  }),
}))

describe('Libraries.vue', () => {
  let wrapper, libraries, libraryStore
  beforeEach(async () => {
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.pacbio.libraries.get = vi
            .fn()
            .mockResolvedValue(pacbioLibraryFactory.responses.fetch)
          // a bit of a smell. Printing is hidden
          store.api.traction.printers.get = vi
            .fn()
            .mockResolvedValue(printerFactory.responses.fetch)
        }
      },
    ]
    ;({ wrapper, store: libraryStore } = mountWithStore(PacbioLibraryIndex, {
      plugins,
      createStore: () => usePacbioLibrariesStore(),
    }))
    await flushPromises()
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
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(5)
    })
  })
  describe('exhausted badge display', () => {
    it('displays the badge for exhausted if exhausted libraries exist', async () => {
      const pacbioLibraryFactoryWithExhausted = PacbioLibraryFactory({ exhausted: true })
      const plugins = [
        ({ store }) => {
          if (store.$id === 'root') {
            store.api.traction.pacbio.libraries.get = vi
              .fn()
              .mockResolvedValue(pacbioLibraryFactoryWithExhausted.responses.fetch)
            store.api.traction.printers.get = vi
              .fn()
              .mockResolvedValue(printerFactory.responses.fetch)
          }
        },
      ]
      ;({ wrapper } = mountWithStore(PacbioLibraryIndex, {
        plugins,
      }))
      await flushPromises()
      expect(wrapper.find('#exhausted-badge').exists()).toBe(true)
    })
    it('will not display exhausted badge', async () => {
      expect(wrapper.find('#exhausted-badge').exists()).toBeFalsy()
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
