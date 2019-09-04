import Libraries from '@/views/Libraries'
import { mount, localVue, Vuex } from '../testHelper'
import Alert from '@/components/Alert'
import PrinterModal from '@/components/PrinterModal'
import Response from '@/api/Response'

describe('Libraries.vue', () => {
  let wrapper, libraries, mockLibraries

  beforeEach(() => {
    mockLibraries =  [
      { barcode: 'TRAC-8', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }},
      { barcode: 'TRAC-8', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }}
    ]

    let store = new Vuex.Store({
      modules: {
        traction: {
          namespaced: true,
          modules: {
            saphyr: {
              namespaced: true,
                modules: {
                  tubes: {
                    namespaced: true,
                    state: {
                      tractionTubes: mockLibraries
                    },
                    getters: {
                      tractionTubesWithInfo: state => state.tractionTubes.map(i => Object.assign(i.material, {barcode: i.barcode}))
                    }
                  }
                }
            }
          }
        }
      }
    })

    wrapper = mount(Libraries, {
      store,
      localVue,
      stubs: {
        Alert: Alert,
        PrinterModal: true
      }
    })
    libraries = wrapper.vm
  })

  describe('building the table', () => {

    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of libraries.fields) {
        expect(headers.filter(header => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(mockLibraries.length)
    })

    describe('selecting libraries', () => {

      beforeEach(() => {
        let checkboxes = wrapper.findAll(".selected")
        checkboxes.at(0).trigger('click')
      })

      it('will create a list of selected requests', () => {
        expect(libraries.selected.length).toEqual(1)
      })

    })

  })

  describe('#handleLibraryDelete', () => {

    beforeEach(() => {
      libraries.deleteLibraries = jest.fn()
      libraries.showAlert = jest.fn()

      libraries.selected = [{ id: 1, type: 'libraries', enzyme_name: 'enz1', barcode: 'TRAC-1' },
                            { id:2, type: 'libraries', enzyme_name: 'enz2', barcode: 'TRAC-2' }]
    })

    it('calls the correct functions when successful', async () => {
      let mockResponse =  { data: {}, status: 204, statusText: "OK" }
      let expectedResponse = new Response(mockResponse)

      libraries.deleteLibraries.mockReturnValue([expectedResponse])

      await libraries.handleLibraryDelete()

      expect(libraries.deleteLibraries).toBeCalled()
      expect(libraries.message).toEqual("Libraries 1,2 successfully deleted")
      expect(libraries.showAlert).toBeCalled()
    })

    it('calls the correct functions when there is an error', async () => {
      let failedResponse =  { data: { errors: { it: ['was a bust'] } }, status: 422, statusText: 'Internal Server Error' }
      let expectedResponse = new Response(failedResponse)

      libraries.deleteLibraries.mockReturnValue([expectedResponse])

      await libraries.handleLibraryDelete()

      expect(libraries.deleteLibraries).toBeCalled()
      expect(libraries.message).toEqual("Failed to delete: it was a bust")
      expect(libraries.showAlert).toBeCalled()
    })
  })

  describe('#handlePrintLabel', () => {
    let printerName

    beforeEach(() => {
      printerName = "abc123"
      libraries.selected = [{ id: 1, type: 'libraries', enzyme_name: 'enz1', barcode: 'TRAC-1' }]
      libraries.printLabels = jest.fn()
      libraries.showAlert = jest.fn()
    })

    it('passes selected printer to function on emit event', () => {
      libraries.handlePrintLabel = jest.fn()

      let successfulResponse =  { data: {}, status: 201, statusText: "OK" }

      let expectedResponse = new Response(successfulResponse)
      libraries.printLabels.mockReturnValue(expectedResponse)

      let modal = wrapper.find(PrinterModal)
      modal.vm.$emit('selectPrinter', printerName)
      expect(modal.emitted().selectPrinter[0]).toEqual([printerName])
    })

    it('successfully prints label', async () => {
      let successfulResponse =  { data: {}, status: 201, statusText: "OK" }

      let expectedResponse = new Response(successfulResponse)

      libraries.printLabels.mockReturnValue(expectedResponse)

      await libraries.handlePrintLabel(printerName)

      expect(libraries.printLabels).toBeCalledWith(printerName, libraries.selected)
      expect(libraries.message).toEqual('Printed successfully')
      expect(libraries.showAlert).toBeCalled()
    })

    it('unsuccessfully', async () => {
      let failedResponse =  { data: { errors: { it: ['was a bust'] } }, status: 422 }

      let expectedResponse = new Response(failedResponse)

      libraries.printLabels.mockReturnValue(expectedResponse)

      await libraries.handlePrintLabel(printerName)

      expect(libraries.printLabels).toBeCalledWith(printerName, libraries.selected)
      expect(libraries.message).toEqual('it was a bust')
      expect(libraries.showAlert).toBeCalled()
    })

  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      wrapper.setData({ message: 'show this message' })
      libraries.showAlert()
      expect(wrapper.find(Alert).html()).toMatch('show this message')
    })
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

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
  })

})
