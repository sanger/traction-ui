import Libraries from '@/views/Libraries'
import { mount, localVue, Vuex } from '../testHelper'
import Alert from '@/components/Alert'
import PrinterModal from '@/components/PrinterModal'
import Response from '@/api/Response'
import * as consts from '@/consts/consts'
import TractionSaphyrLibraries from '../../data/tractionSaphyrLibraries'
import VueRouter from 'vue-router'

describe('Libraries.vue', () => {
  let wrapper, libraries, mockLibraries

  beforeEach(() => {
    mockLibraries =  [
      { barcode: 'TRAC-8', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }},
      { barcode: 'TRAC-8', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }}
    ]

    const router = new VueRouter({
      routes: [{
        path: '/libraries',
        name: 'Libraries',
        component: Libraries,
        props: true
      }]
    })

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
      router,
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

    it('calls the correct functions when successful', async () => {
      let mockResponse =  { data: {}, status: 204, statusText: "OK" }
      let expectedResponse = new Response(mockResponse)

      libraries.deleteLibraries.mockReturnValue([expectedResponse])

      await libraries.handleLibraryDelete()

      let selectedIds = libraries.selected.map(s => s.id)
      expect(wrapper.find(Alert).vm.message).toEqual(`Library ${selectedIds.join(',')} successfully deleted`)
    })

    it('unsuccessfully', async () => {
      let mockResponse =  { data: { errors: { it: ['was a bust'] } }, status: 422 }

      libraries.deleteLibraries.mockReturnValue([expectedResponse])

      await libraries.handleLibraryDelete()

      await expect(libraries.deleteLibraries()).rejects.toThrow("it was a bust")
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

      request.create.mockResolvedValue(successfulPromise)
      await libraries.handlePrintLabel('printer1')
      expect(wrapper.find(Alert).vm.message).toEqual('Printed successfully')
    })

    it('unsuccessfully', async () => {
      let failedResponse =  { data: { errors: { it: ['was a bust'] } }, status: 422 }

      let expectedResponse = new Response(failedResponse)

      libraries.printLabels.mockReturnValue(expectedResponse)

      await libraries.handlePrintLabel(printerName)

      request.create.mockReturnValue(failedPromise)
      await libraries.handlePrintLabel('printer1')
      expect(wrapper.find(Alert).vm.message).toEqual('it was a bust')
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

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      libraries.showAlert('show this message')
      expect(wrapper.find(Alert).vm.message).toMatch('show this message')
    })
  })
})
