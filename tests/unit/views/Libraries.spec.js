import Libraries from '@/views/Libraries'
import { mount, localVue, store } from '../testHelper'
import Alert from '@/components/Alert'
import PrinterModal from '@/components/PrinterModal'
import * as consts from '@/consts/consts'
import TractionSaphyrLibraries from '../../data/tractionSaphyrLibraries'
import VueRouter from 'vue-router'

describe('Libraries.vue', () => {

  let wrapper, libraries
  beforeEach(() => {
    const router = new VueRouter({
      routes: [{
        path: '/libraries',
        name: 'Libraries',
        component: Libraries,
        props: true
      }]
    })

    wrapper = mount(Libraries, {
      localVue,
      store,
      router,
    })
    libraries = wrapper.vm

    libraries.tractionSaphyrLibraryRequest.get = jest.fn()
  })

  describe('library request', () => {
    it('will create a library request', () => {
      let request = libraries.tractionSaphyrLibraryRequest
      expect(request.resource).toBeDefined()
    })

    it('will get a list of libraries on success',  async () => {
      libraries.tractionSaphyrLibraryRequest.get.mockResolvedValue(TractionSaphyrLibraries)
      await libraries.provider()
      expect(libraries.items.length).toEqual(17)
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

    it('contains the correct data', async () => {
      libraries.tractionSaphyrLibraryRequest.get.mockResolvedValue(TractionSaphyrLibraries)
      await libraries.provider()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(libraries.perPage)
    })
  })

  describe('#handleLibraryDelete', () => {
    beforeEach(() => {
      libraries.deleteLibraries = jest.fn()
    })

    it('calls the correct functions', async () => {
      libraries.showAlert = jest.fn()
      await libraries.handleLibraryDelete()
      expect(libraries.deleteLibraries).toBeCalled()
      expect(libraries.showAlert).not.toBeCalled()
    })

    it('calls showAlert when there is an error', async () => {
      libraries.deleteLibraries.mockImplementation(() => {
        throw Error('Raise this error')
      })

      await libraries.handleLibraryDelete()
      expect(libraries.deleteLibraries).toBeCalled()
      expect(wrapper.find(Alert).vm.message).toEqual(
        consts.MESSAGE_ERROR_DELETION_FAILED + 'Raise this error')
    })
  })

  describe('#deleteLibraries', () => {
    beforeEach(async () => {
      const router = new VueRouter({
        routes: [{
          path: '/libraries',
          name: 'Libraries',
          component: Libraries,
          props: true
        }]
      })

      wrapper = mount(Libraries, {
        localVue,
        store,
        router,
      })
      libraries = wrapper.vm

      libraries.tractionSaphyrLibraryRequest.execute = jest.fn()
      libraries.tractionSaphyrLibraryRequest.get.mockResolvedValue(TractionSaphyrLibraries)
      await libraries.provider()

      let checkboxes = wrapper.findAll(".selected")
      checkboxes.at(0).trigger('click')
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

      libraries.tractionSaphyrLibraryRequest.execute.mockResolvedValue(promise)

      await libraries.deleteLibraries()

      let selectedIds = libraries.selected.map(s => s.id)
      expect(wrapper.find(Alert).vm.message).toEqual(`Library ${selectedIds.join(',')} successfully deleted`)
    })

    it('unsuccessfully', async () => {
      let mockResponse =  { data: { errors: { it: ['was a bust'] } }, status: 422 }

      let promise = new Promise((reject) => {
        reject(mockResponse)
      })

      libraries.tractionSaphyrLibraryRequest.execute.mockResolvedValue(promise)

      await expect(libraries.deleteLibraries()).rejects.toThrow("it was a bust")
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
      expect(wrapper.find(Alert).vm.message).toEqual('Printed successfully')
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
      expect(wrapper.find(Alert).vm.message).toEqual('it was a bust')
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

  describe('#tractionSaphyrLibraryRequest', () => {
    it('will have a request', () => {
      expect(libraries.tractionSaphyrLibraryRequest).toBeDefined()
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      libraries.showAlert('show this message')
      expect(wrapper.find(Alert).vm.message).toMatch('show this message')
    })
  })
})
