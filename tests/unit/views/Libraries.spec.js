import Libraries from '@/views/Libraries'
import { mount, localVue, store } from '../testHelper'
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

    wrapper = mount(Libraries, { localVue,
      store,
      propsData: {
        items: mockLibraries
      }
    })
    libraries = wrapper.vm
  })

  describe('library request', () => {
    it('will get a list of libraries on success',  async () => {
      expect(libraries.items).toEqual(mockLibraries)
    })
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
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
      expect(libraries.showAlert).toBeCalled()
      expect(libraries.message).toEqual("Libraries 1,2 successfully deleted")
    })

    it('calls the correct functions when there is an error', async () => {
      let mockResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
      let expectedResponse = new Response(mockResponse)

      libraries.deleteLibraries.mockReturnValue([expectedResponse])

      await libraries.handleLibraryDelete()

      expect(libraries.deleteLibraries).toBeCalled()
      expect(libraries.showAlert).toBeCalled()
      expect(libraries.message).toEqual("Failed to delete: ")
    })
  })

  describe('#handlePrintLabel', () => {
    let request

    beforeEach(() => {
      libraries.selected = [{ id: 1, type: 'libraries', enzyme_name: 'enz1', barcode: 'TRAC-1' }]

      request = store.getters.api.printMyBarcode.print_jobs
      request.create = jest.fn()
    })

    it('passes selected printer to function on emit event', () => {
      let successfulResponse =  {
        data: {},
        status: 201,
        statusText: "OK"
      }

      let successfulPromise = new Promise((resolve) => {
        resolve(successfulResponse)
      })

      request.create.mockResolvedValue(successfulPromise)
      let modal = wrapper.find(PrinterModal)
      modal.vm.$emit('selectPrinter', 'printer1')

      expect(request.create).toBeCalled()
    })

    it('successfully prints label', async () => {
      let successfulResponse =  {
        data: {},
        status: 201,
        statusText: "OK"
      }

      let successfulPromise = new Promise((resolve) => {
        resolve(successfulResponse)
      })

      request.create.mockResolvedValue(successfulPromise)
      await libraries.handlePrintLabel('printer1')
      expect(libraries.message).toEqual('Printed successfully')
    })

    it('unsuccessfully', async () => {
      let failedResponse =  {
        data: {
          errors: {
            it: ['was a bust']
          }
        },
        status: 422
      }

      let failedPromise = new Promise((reject) => {
        reject(failedResponse)
      })

      request.create.mockReturnValue(failedPromise)
      await libraries.handlePrintLabel('printer1')
      expect(libraries.message).toEqual('it was a bust')
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

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      wrapper.setData({ message: 'show this message' })
      libraries.showAlert()
      expect(wrapper.find(Alert).html()).toMatch('show this message')
    })
  })
})
