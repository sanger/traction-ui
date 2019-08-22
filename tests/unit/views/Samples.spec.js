import Samples from '@/views/Samples'
import Modal from '@/components/Modal'
import PrinterModal from '@/components/PrinterModal'
import { mount, localVue, store } from '../testHelper'
import Libraries from '@/views/Libraries'
import TractionTubesWithLibrariesJson from '../../data/tubeWithLibrary'
import VueRouter from 'vue-router'
import Alert from '@/components/Alert'
import Response from '@/api/Response'

describe('Samples.vue', () => {

  let wrapper, samples, mockSamples

    beforeEach(() => {
      mockSamples = [
        { barcode: 'TRAC-1', material: {id: 1, type: 'samples', name: 'sample_d', external_id: 4, species: 'human', created_at: '02/27/2019 04:05' }},
        { barcode: 'TRAC-1', material: {id: 1, type: 'samples', name: 'sample_d', external_id: 4, species: 'human', created_at: '02/27/2019 04:05' }},
      ]

      const router = new VueRouter({ routes:
        [
          { path: '/libraries', name: 'Libraries', component: Libraries, props: true }
        ]
      })

      wrapper = mount(Samples, { localVue,
        store,
        router,
        propsData: {
          items: mockSamples
        },
        stubs: {
          Modal: true
        }
      })
      samples = wrapper.vm
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

    it('contains the correct data', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(mockSamples.length)
    })

    describe('selecting samples', () => {

      beforeEach(() => {
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
      samples.handleTractionTubes = jest.fn()
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
      expect(samples.createLibrariesInTraction).toBeCalledWith(payload)
      expect(samples.handleTubeRedirect).not.toBeCalled()
      expect(samples.message).toEqual('Raise this error')
      expect(samples.showAlert).toBeCalled()
    })
  })

  describe('modal', () => {
    beforeEach(() => {
      samples.handleLibraryCreate = jest.fn()
    })

    it('passes selected enzyme id to function on emit event', () => {
      samples.selected = [{id: 1}]
      let modal = wrapper.find(Modal)
      modal.vm.$emit('selectEnzyme', 2)

      expect(samples.handleLibraryCreate).toBeCalledWith(2)
    })
  })

  describe('#handlePrintLabel', () => {
    let printerName

    beforeEach(() => {
      printerName = "abc123"
      samples.selected = [{ id: 1, type: 'libraries', enzyme_name: 'enz1', barcode: 'TRAC-1' }]
      samples.printLabels = jest.fn()
    })

    it('passes selected printer to function on emit event', () => {
      let successfulResponse =  { data: {}, status: 201, statusText: "OK" }

      let expectedResponse = new Response(successfulResponse)
      samples.printLabels.mockReturnValue(expectedResponse)

      let modal = wrapper.find(PrinterModal)
      modal.vm.$emit('selectPrinter', printerName)

      expect(samples.printLabels).toBeCalledWith(printerName, samples.selected)
    })

    it('successfully prints label', async () => {
      let successfulResponse =  { data: {}, status: 201, statusText: "OK" }

      let expectedResponse = new Response(successfulResponse)

      samples.printLabels.mockReturnValue(expectedResponse)

      await samples.handlePrintLabel(printerName)

      expect(samples.printLabels).toBeCalledWith(printerName, samples.selected)
      expect(samples.message).toEqual('Printed successfully')
    })

    it('unsuccessfully', async () => {
      let failedResponse =  { data: { errors: { it: ['was a bust'] } }, status: 422 }

      let expectedResponse = new Response(failedResponse)

      samples.printLabels.mockReturnValue(expectedResponse)

      await samples.handlePrintLabel(printerName)

      expect(samples.printLabels).toBeCalledWith(printerName, samples.selected)
      expect(samples.message).toEqual('it was a bust')
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
      wrapper.setData({ message: 'show this message' })
      samples.showAlert()
      expect(wrapper.find(Alert).html()).toMatch('show this message')
    })
  })

})
