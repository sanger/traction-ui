import Samples from '@/views/Samples'
import Modal from '@/components/Modal'
import PrinterModal from '@/components/PrinterModal'
import { mount, localVue, store } from '../testHelper'
import Libraries from '@/views/Libraries'
import TractionTubesWithLibrariesJson from '../../data/tubeWithLibrary'
import VueRouter from 'vue-router'
import Alert from '@/components/Alert'

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
        methods: { provider() { return } }
      })
      samples = wrapper.vm
    })

    it('has a create libraries with enzyme button', () => {
      expect(wrapper.contains('#createLibrariesWithEnzymeButton')).toBe(true)
      let button = wrapper.find('#createLibrariesWithEnzymeButton').text()
      expect(button).toEqual("Create Libraries with Enzyme")
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
    let selectedEnzymeId

    beforeEach(() => {
      selectedEnzymeId = 123
      samples.createLibrariesInTraction = jest.fn()
      samples.handleTractionTubes = jest.fn()
      samples.showAlert = jest.fn()
    })

    it('calls the correct functions', async () => {
      await samples.handleLibraryCreate(selectedEnzymeId)
      expect(samples.createLibrariesInTraction).toBeCalledWith(selectedEnzymeId)
      expect(samples.handleTractionTubes).toBeCalled()
      expect(samples.showAlert).not.toBeCalled()
    })

    it('calls showAlert when there is an error', async () => {
      samples.handleTractionTubes.mockImplementation(() => {
        throw 'Raise this error'
      })

      await samples.handleLibraryCreate(selectedEnzymeId)
      expect(samples.createLibrariesInTraction).toBeCalledWith(selectedEnzymeId)
      expect(samples.handleTractionTubes).toBeCalled()
      expect(samples.message).toEqual('Raise this error')
      expect(samples.showAlert).toBeCalled()
    })
  })

  describe('#createLibrariesInTraction', () => {

    beforeEach(() => {
      samples.libraryRequest.create = jest.fn()
    })

    it('stores the create library barcodes', async () => {
      let mockResponse =  {
        data: {
          data: [
             { id: 1, type: "libraries", attributes: { name: "testname1", barcode: 'TRAC-1' }},
             { id: 2, type: "libraries", attributes: { name: "testname2", barcode: 'TRAC-2' }}
          ]
        },
        status: 200,
        statusText: "OK"
      }

      samples.libraryRequest.create.mockResolvedValue(mockResponse)

      let selectedEnzymeId = 1
      samples.selected = [{id: 1}]

      await samples.createLibrariesInTraction(selectedEnzymeId)

      let expectedBody = {data: {attributes: {libraries: [{enzyme_id: 1, sample_id: 1}]}, type: "libraries"}}
      expect(samples.libraryRequest.create).toBeCalledWith(expectedBody)
      expect(samples.barcodes).toEqual('TRAC-1\nTRAC-2')
    })

    it('doesnt store any library barcodes', async () => {

      let mockResponse = { data: { errors: { name: ['name error message 1']}},
        status: 422,
        statusText: "Unprocessible entity"
      }

      samples.libraryRequest.create.mockReturnValue(mockResponse)

      let selectedEnzymeId = 1
      samples.selected = [{id: 1}]

      let message
      try {
        await samples.createLibrariesInTraction(selectedEnzymeId)
      } catch (err) {
        message = err
      }

      expect(message).toEqual("Failed to create library in Traction: name name error message 1")
      expect(samples.barcodes).toEqual("")
    })
  })

  describe('#handleTractionTubes', () => {
    let successfulResponse, emptyResponse, failedResponse

    beforeEach(() => {
      wrapper.setData({ barcodes: 'TRAC-1\nTRAC-2' })
      samples.tractionTubeRequest.get = jest.fn()

      successfulResponse = TractionTubesWithLibrariesJson
      emptyResponse = { data: { data: [] }, status: 200, statusText: 'Success'}
      failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
    })

    it('successfully', async () => {
      samples.tractionTubeRequest.get.mockResolvedValue(successfulResponse)
      await samples.handleTractionTubes()
      expect(samples.$route.path).toEqual('/libraries')
    })

    it('unsuccessfully', async () => {
      samples.tractionTubeRequest.get.mockResolvedValue(failedResponse)

      let message
      try {
        await await samples.handleTractionTubes()
      } catch (err) {
        message = err
      }
      expect(message).toEqual('Failed to get Traction tubes')
    })

    it('when no tubes exist', async () => {
      samples.tractionTubeRequest.get.mockResolvedValue(emptyResponse)

      let message
      try {
        await await samples.handleTractionTubes()
      } catch (err) {
        message = err
      }
      expect(message).toEqual('Failed to get Traction tubes')
    })

    it('when there is no barcodes', async () => {
      wrapper.setData({ barcodes: '' })

      let message
      try {
        await samples.handleTractionTubes()
      } catch (err) {
        message = err
      }

      expect(message).toEqual("There are no barcodes")
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

  describe('#libraryRequest', () => {
    it('will have a request', () => {
      expect(samples.libraryRequest).toBeDefined()
    })
  })

  describe('#tractionTubeRequest', () => {
    it('will have a request', () => {
      expect(samples.tractionTubeRequest).toBeDefined()
    })
  })

})
