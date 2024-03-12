import PacbioLibraryIndex from '@/views/pacbio/PacbioLibraryIndex.vue'
import { mount, Data, store, flushPromises, createTestingPinia } from '@support/testHelper.js'
import { expect, vi } from 'vitest'
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
 * state - initial state of the store.
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 */
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
            .mockResolvedValue(Data.TractionPacbioLibraries)
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
    beforeEach(() => {
      libraries.state.selected = [
        { id: 1, barcode: 'TRAC-1', source_identifier: 'SQSC-1' },
        { id: 2, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
        { id: 3, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
      ]
    })

    describe('#createLabels', () => {
      it('will have the correct number of labels', () => {
        expect(libraries.createLabels().length).toEqual(3)
      })

      it('will have the correct text for each label', () => {
        const label = libraries.createLabels()[0]
        expect(label.barcode).toEqual('TRAC-1')
        expect(label.first_line).toEqual('Pacbio - Library')
        expect(/\d{2}-\w{3}-\d{2}/g.test(label.second_line)).toBeTruthy()
        expect(label.third_line).toEqual('TRAC-1')
        expect(label.fourth_line).toEqual('SQSC-1')
        expect(label.label_name).toEqual('main_label')
      })
    })

    describe('#printLabels', () => {
      beforeEach(() => {
        const mockPrintJob = vi.fn().mockResolvedValue({ success: true, message: 'success' })
        store.dispatch = mockPrintJob
        const modal = wrapper.findComponent({ ref: 'printerModal' })
        modal.vm.$emit('selectPrinter', 'printer1')
      })

      it('should create a print job', () => {
        expect(store.dispatch).toBeCalledWith('printMyBarcode/createPrintJob', {
          printerName: 'printer1',
          labels: libraries.createLabels(),
          copies: 1,
        })
        expect(mockShowAlert).toBeCalledWith('success', 'success')
      })
    })
  })
})
