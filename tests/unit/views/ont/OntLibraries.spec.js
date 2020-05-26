import OntLibraries from '@/views/ont/OntLibraries'
import { mount, localVue } from '../../testHelper'
import PrinterModal from '@/components/PrinterModal'

describe('OntLibraries.vue', () => {
  let wrapper, libraries, librariesData, mutate

  beforeEach(() => {
    mutate = jest.fn()

    librariesData = [
      { id: 1, tube_barcode: 'TRAC-2-1', plate_barcode: 'TRAC-1-1', poolSize: 1, wellRange: 'A1-H3', tag_set: 24 },
      { id: 2, tube_barcode: 'TRAC-2-2', plate_barcode: 'TRAC-1-1', poolSize: 2, wellRange: 'A4-H6', tag_set: 24 },
      { id: 3, tube_barcode: 'TRAC-2-3', plate_barcode: 'TRAC-1-1', poolSize: 3, wellRange: 'A7-H9', tag_set: 24 },
      { id: 4, tube_barcode: 'TRAC-2-4', plate_barcode: 'TRAC-1-1', poolSize: 4, wellRange: 'A10-H12', tag_set: 24 },
      { id: 5, tube_barcode: 'TRAC-2-5', plate_barcode: 'TRAC-1-2', poolSize: 1, wellRange: 'A1-H12', tag_set: 96 },
    ]

    wrapper = mount(OntLibraries, {
      localVue,
      stubs: {
        OntPlate: true,
        PrinterModal: true
      },
      data() {
        return {
          libraries: librariesData,
        }
      },
      mocks: {
        $apollo: {
          mutate: mutate
        }
      },
      methods: {
        refetchLibraries() { return }
      }
    })
    libraries = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntLibraries')
  })

  it('will have fields', () => {
    let expected = ["id", "name", "poolSize", "tubeBarcode", "plateBarcode", "pool", "createdAt"]
    expect(libraries.fields.map(i => i.key)).toEqual(expected)
  })

  it('will have a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('will have a table with libraries', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(librariesData.length)
  })

  describe('printerModal', () => {
    beforeEach(() => {
      libraries.handlePrintLabel = jest.fn()
    })

    it('passes selected printer to function on emit event', () => {
      libraries.selected = [{id: 1}]
      let modal = wrapper.find(PrinterModal)
      modal.vm.$emit('selectPrinter', 'printer1')

      expect(libraries.handlePrintLabel).toBeCalledWith('printer1')
    })
  })

  describe('Delete button', () => {
    let button
    const libraryName = 'aLibraryName'

    beforeEach(() => {
      button = wrapper.find('#deleteLibrary-btn')
      libraries.showAlert = jest.fn()
      libraries.selected = [{ name: libraryName }]
    })

    it('is shows button', () => {
      expect(button.text()).toEqual('Delete Library')
    })

    it('shows an alert on success', async () => {
      let mockResponse = { data: { deleteOntLibrary: { success: true, errors: [] } } }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      mutate.mockReturnValue(promise)

      await button.trigger('click')

      expect(mutate).toBeCalled()
      expect(libraries.showAlert).toBeCalledWith(`Library '${libraryName}' was successully deleted`, 'success')
    })

    it('shows an alert on failure', async () => {
      let mockResponse = { data: { deleteOntLibrary: { success: false, errors: ['this is an error'] } } }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      mutate.mockReturnValue(promise)

      await button.trigger('click')

      expect(mutate).toBeCalled()
      expect(libraries.showAlert).toBeCalledWith(`Failure deleting library '${libraryName}': this is an error`, 'danger')
    })
  })
})