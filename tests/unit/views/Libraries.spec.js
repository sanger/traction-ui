import Libraries from '@/views/Libraries'
import { mount, localVue, store } from '../testHelper'
import Alert from '@/components/Alert'
import PrinterModal from '@/components/PrinterModal'

describe('Libraries.vue', () => {

  let wrapper, libraries, mockLibraries

  describe('library request', () => {
    mockLibraries =  [
      { barcode: 'TRAC-8', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }},
      { barcode: 'TRAC-8', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }}
    ]

    beforeEach(() => {
      wrapper = mount(Libraries, { localVue,
        store,
        propsData: {
          items: mockLibraries
        }
      })
      libraries = wrapper.vm
    })

    it('will create a library request', () => {
      let request = libraries.libraryRequest
      expect(request.resource).toBeDefined()
    })

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
    })

    it('calls the correct functions', async () => {
      await libraries.handleLibraryDelete()
      expect(libraries.deleteLibraries).toBeCalled()
      expect(libraries.showAlert).not.toBeCalled()
    })

    it('calls showAlert when there is an error', async () => {
      libraries.deleteLibraries.mockImplementation(() => {
        throw 'Raise this error'
      })

      await libraries.handleLibraryDelete()
      expect(libraries.deleteLibraries).toBeCalled()
      expect(libraries.message).toEqual('Failed to delete: Raise this error')
      expect(libraries.showAlert).toBeCalled()
    })
  })

  describe('#deleteLibraries', () => {

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

      let checkboxes = wrapper.findAll(".selected")
      checkboxes.at(0).trigger('click')

      libraries.libraryRequest.execute = jest.fn()
    })

    it('will create a list of selected libraries', () => {
      expect(libraries.selected.length).toEqual(1)
    })

    it('successfully', async () => {
      let mockResponse =  {
        data: {},
        status: 204,
        statusText: "OK"
      }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      libraries.libraryRequest.execute.mockResolvedValue(promise)

      await libraries.deleteLibraries()

      let selectedIds = libraries.selected.map(s => s.id)
      expect(libraries.message).toEqual(`Libraries ${selectedIds.join(',')} successfully deleted`)
    })

    it('unsuccessfully', async () => {
      let mockResponse =  {  data: { errors: { it: ['was a bust'] } }, status: 422 }

      let promise = new Promise((reject) => {
        reject(mockResponse)
      })

      libraries.libraryRequest.execute.mockResolvedValue(promise)

      let message
      try {
        await await libraries.deleteLibraries()
      } catch (err) {
        message = err
      }
      expect(message).toEqual("it was a bust")
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

  describe('#libraryRequest', () => {
    it('will have a request', () => {
      expect(libraries.libraryRequest).toBeDefined()
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
