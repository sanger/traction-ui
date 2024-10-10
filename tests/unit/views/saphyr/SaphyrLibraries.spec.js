import Libraries from '@/views/saphyr/SaphyrLibraries'
import { mount, store, createTestingPinia } from '@support/testHelper'
import SaphyrLibrariesFactory from '@tests/factories/SaphyrLibrariesFactory.js'

function mountWithStore({ props } = {}) {
  const wrapperObj = mount(Libraries, {
    global: {
      plugins: [createTestingPinia({})],
      stubs: {
        PrinterModal: {
          template: '<div ref="printerModal"></div>',
        },
      },
    },
    store,
    props,
  })
  return { wrapperObj }
}
const saphyrLibrariesFactory = SaphyrLibrariesFactory()
describe('Libraries.vue', () => {
  let wrapper, libraries, mockLibraries

  beforeEach(() => {
    mockLibraries = Object.values(saphyrLibrariesFactory.storeData.dataArray)

    // We mock the request response, to allow the provider to trigger our
    // behaviour for us. We might be better of mocking the action itself, but
    // that gets surprisingly tricky as the store gets heavily modularised.
    // Before we used to inject the state directly, but that caused issues
    // when the component triggered the set requests action itself.
    vi.spyOn(store.getters['traction/saphyr/tubes/libraryRequest'], 'get').mockResolvedValue(
      saphyrLibrariesFactory.responses.fetch,
    )

    const { wrapperObj } = mountWithStore()

    wrapper = wrapperObj
    libraries = wrapper.vm
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of libraries.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(17)
    })
  })

  describe('#handleLibraryDelete', () => {
    beforeEach(() => {
      libraries.deleteLibraries = vi.fn()
      libraries.showAlert = vi.fn()
      wrapper.setData({ selected: mockLibraries })
    })

    it('calls the correct functions', async () => {
      libraries.deleteLibraries.mockReturnValue([{ success: true }])
      await libraries.handleLibraryDelete()

      const barcodes = mockLibraries.map((s) => s.barcode).join(', ')
      expect(libraries.deleteLibraries).toBeCalledWith(mockLibraries.map((s) => s.id))
      expect(libraries.showAlert).toBeCalledWith(
        `Libraries ${barcodes} successfully deleted`,
        'success',
      )
    })

    it('calls showAlert when there is an error', async () => {
      const failedResponse = {
        errors: [
          {
            title: 'Unprocessable Entity',
            status: '422',
          },
        ],
      }
      libraries.deleteLibraries.mockReturnValue([failedResponse])

      await libraries.handleLibraryDelete()

      expect(libraries.deleteLibraries).toBeCalled()

      expect(libraries.showAlert).toBeCalledWith('Failed to delete: ', 'danger')
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      libraries.showAlert('show this message', 'danger')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
    })
  })

  describe('Printing labels', () => {
    beforeEach(() => {
      libraries.selected = [
        { id: 1, barcode: 'TRAC-1' },
        { id: 2, barcode: 'TRAC-2' },
        { id: 3, barcode: 'TRAC-2' },
      ]
    })

    describe('#createLabels', () => {
      it('will have the correct number of labels', () => {
        expect(libraries.createLabels().length).toEqual(3)
      })

      it('will have the correct text for each label', () => {
        const label = libraries.createLabels()[0]
        expect(label.barcode).toEqual('TRAC-1')
        expect(label.first_line).toEqual('Saphyr - Library')
        expect(/\d{2}-\w{3}-\d{2}/g.test(label.second_line)).toBeTruthy()
        expect(label.third_line).toEqual('TRAC-1')
        expect(label.label_name).toEqual('main_label')
      })
    })

    describe('#printLabels', () => {
      beforeEach(() => {
        libraries.printingStore.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: true, message: 'success' }
        })

        const modal = wrapper.findComponent({ ref: 'printerModal' })
        modal.vm.$emit('selectPrinter', 'printer1')
      })

      it('should create a print job', () => {
        expect(libraries.printingStore.createPrintJob).toBeCalledWith({
          printerName: 'printer1',
          labels: libraries.createLabels(),
          copies: 1,
        })
      })
    })
  })
})
