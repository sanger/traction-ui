import Samples from '@/views/Samples'
import EnzymeModal from '@/components/EnzymeModal'
import PrinterModal from '@/components/PrinterModal'
import { mount, localVue, Vuex } from '../testHelper'
import Libraries from '@/views/Libraries'
import TractionTubesWithLibrariesJson from '../../data/tubeWithLibrary'
import TractionSaphyrRequests from '../../data/tractionSaphyrRequests'

import VueRouter from 'vue-router'
import Alert from '@/components/Alert'
import * as consts from '@/consts/consts'

describe('Samples.vue', () => {

  let wrapper, samples

  beforeEach(() => {
    const router = new VueRouter({ routes:
      [
        { path: '/libraries', name: 'Libraries', component: Libraries, props: true }
      ]
    })

      const router = new VueRouter({
        routes: [{ path: '/libraries', name: 'Libraries', component: Libraries, props: true }]
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
                        tractionTubes: mockSamples
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

      wrapper = mount(Samples, { localVue,
        store,
        router,
        stubs: {
          Alert: Alert,
          PrinterModal: true,
          Modal: true,
          EnzymeModal: true
        }
      })
      samples = wrapper.vm
    })
    samples = wrapper.vm

    samples.tractionSaphyrRequestsRequest.get = jest.fn()
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of samples.fields) {
        expect(headers.filter(header => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      samples.tractionSaphyrRequestsRequest.get.mockResolvedValue(TractionSaphyrRequests)
      await samples.provider()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(5)
    })

    describe('selecting samples', () => {
      beforeEach(async () => {
        samples.tractionSaphyrRequestsRequest.get.mockResolvedValue(TractionSaphyrRequests)
        await samples.provider()
        let checkboxes = wrapper.findAll(".selected")
        checkboxes.at(0).trigger('click')
      })

      it('will create a list of selected requests', () => {
        expect(samples.selected.length).toEqual(1)
      })
    })
  })

  describe('#handleLibraryCreate', () => {
    let selectedEnzymeId, payload

    beforeEach(() => {
      selectedEnzymeId = 123
      samples.createLibrariesInTraction = jest.fn()
      samples.handleTubeRedirect = jest.fn()
      samples.showAlert = jest.fn()
      samples.selected = mockSamples
      payload = {'samples': mockSamples, 'enzymeID': selectedEnzymeId}
    })

    it('calls the correct functions', async () => {
      let expectedResponse = new Response(TractionTubesWithLibrariesJson)
      samples.createLibrariesInTraction.mockReturnValue(expectedResponse)

      await samples.handleLibraryCreate(selectedEnzymeId)

      expect(samples.createLibrariesInTraction).toBeCalledWith(payload)
      expect(samples.handleTubeRedirect).toBeCalled()
      expect(samples.showAlert).not.toBeCalled()
    })

    it('calls showAlert when there is an error', async () => {
      let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { errors: { Raise: ['this error'] }} }
      let expectedResponse = new Response(failedResponse)

      samples.createLibrariesInTraction.mockReturnValue(expectedResponse)

      await samples.handleLibraryCreate(selectedEnzymeId)
      expect(samples.createLibrariesInTraction).toBeCalledWith(selectedEnzymeId)
      expect(samples.handleTractionTubes).toBeCalled()
      expect(samples.showAlert).toBeCalled()
    })
  })

  describe('#handlePrintLabel', () => {
    let printerName

    beforeEach(() => {
      printerName = "abc123"
      samples.selected = [{ id: 1, type: 'libraries', enzyme_name: 'enz1', barcode: 'TRAC-1' }]
      samples.printLabels = jest.fn()
      samples.showAlert = jest.fn()
    })

    it('passes selected printer to function on emit event', () => {
      samples.handlePrintLabel = jest.fn()

      let successfulResponse =  { data: {}, status: 201, statusText: "OK" }

      let expectedResponse = new Response(successfulResponse)
      samples.printLabels.mockReturnValue(expectedResponse)

      let modal = wrapper.find(PrinterModal)
      modal.vm.$emit('selectPrinter', printerName)
      expect(modal.emitted().selectPrinter[0]).toEqual([printerName])
    })

    it('does not store any library barcodes', async () => {
      let mockResponse = { data: { errors: { name: ['name error message 1']}},
        status: 422,
        statusText: "Unprocessible entity"
      }

      samples.tractionSaphyrLibraryRequest.create.mockResolvedValue(mockResponse)

      let selectedEnzymeId = 1
      samples.selected = [{id: 1}]

      await expect(samples.createLibrariesInTraction(selectedEnzymeId)).rejects.toThrow(
        consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + "name name error message 1"
      )
      expect(samples.barcodes).toEqual([])
    })
  })

      let expectedResponse = new Response(successfulResponse)

      samples.printLabels.mockReturnValue(expectedResponse)

      await samples.handlePrintLabel(printerName)

      expect(samples.printLabels).toBeCalledWith(printerName, samples.selected)
      expect(samples.message).toEqual('Printed successfully')
      expect(samples.showAlert).toBeCalled()
    })

    it('unsuccessfully', async () => {
      samples.tractionSaphyrTubeRequest.get.mockResolvedValue(failedResponse)
      await expect(samples.handleTractionTubes()).rejects.toThrow(
        consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
    })

    it('when no tubes exist', async () => {
      samples.tractionSaphyrTubeRequest.get.mockResolvedValue(emptyResponse)
      await expect(samples.handleTractionTubes()).rejects.toThrow(
        consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
    })

    it('when there are no barcodes', async () => {
      wrapper.setData({ barcodes: '' })
      await expect(samples.handleTractionTubes()).rejects.toThrow(
        consts.MESSAGE_WARNING_NO_BARCODES)
    })
  })

  describe('modal', () => {
    beforeEach(() => {
      samples.handleLibraryCreate = jest.fn()
    })

    it('passes selected enzyme id to function on emit event', () => {
      samples.selected = [{id: 1}]
      let modal = wrapper.find(EnzymeModal)
      modal.vm.$emit('selectEnzyme', 2)

      expect(samples.handleLibraryCreate).toBeCalledWith(2)
    })
  })

  describe('#handlePrintLabel', () => {
    let request

    beforeEach(() => {
      samples.selected = [{ id: 1, type: 'samples', name: 'enz1', barcode: 'TRAC-1' }]

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
      await samples.handlePrintLabel('printer1')
      expect(wrapper.find(Alert).vm.message).toEqual(consts.MESSAGE_SUCCESS_PRINTER)
    })
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
      await samples.handlePrintLabel('printer1')
      expect(wrapper.find(Alert).vm.message).toEqual('it was a bust')
    })
  })

  describe('printerModal', () => {
    beforeEach(() => {
      samples.handlePrintLabel = jest.fn()
    })

    it('passes selected printer to function on emit event', () => {
      samples.selected = [{id: 1}]
      let modal = wrapper.find(PrinterModal)
      modal.vm.$emit('selectPrinter', 'printer1')

      expect(samples.handlePrintLabel).toBeCalledWith('printer1')
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      samples.showAlert('show this message')
      expect(wrapper.find(Alert).html()).toMatch('show this message')
    })

    it('passes selected enzyme id to function on emit event', () => {
      samples.selected = [{id: 1}]
      let modal = wrapper.find(Modal)
      modal.vm.$emit('selectEnzyme', 2)

      expect(samples.handleLibraryCreate).toBeCalledWith(2)
    })
  })

})
