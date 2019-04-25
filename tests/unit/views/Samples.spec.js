import Samples from '@/views/Samples'
import Modal from '@/components/Modal'
import { mount, localVue, store } from '../testHelper'
import Libraries from '@/views/Libraries'
import TractionTubesWithLibrariesJson from '../../data/tubeWithLibrary'
import Vue from 'vue'
import Request from '@/api/Request'
import Response from '@/api/Response'
import VueRouter from 'vue-router'

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
    })

    it('successfully', async () => {
      await samples.handleLibraryCreate(selectedEnzymeId)
      expect(samples.createLibrariesInTraction).toBeCalledWith(selectedEnzymeId)
      expect(samples.handleTractionTubes).toBeCalled()
    })
  })

  describe('#createLibrariesInTraction', () => {

    beforeEach(() => {
      samples.libraryRequest.create = jest.fn()
    })

    it('success', async () => {
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

      expect(samples.message).toEqual("Libraries 1,2 created in Traction")
      expect(samples.barcodes).toEqual('TRAC-1\nTRAC-2')
    })

    it('failure', async () => {

      let mockResponse = {
        data: {
          errors: {
            name: ['name error message 1']
          }
        },
        status: 422,
        statusText: "Unprocessible entity"
      }

      samples.libraryRequest.create.mockReturnValue(mockResponse)

      let selectedEnzymeId = 1
      samples.selected = [{id: 1}]

      await samples.createLibrariesInTraction(selectedEnzymeId)
      expect(samples.message).toEqual("name name error message 1")
      expect(samples.barcodes).toEqual("")
    })
  })

  describe('#handleTractionTubes', () => {

    beforeEach(() => {
      samples.findTubes = jest.fn()
    })

    it('successfully for libraries', async () => {
      let tubes = new Response(TractionTubesWithLibrariesJson).deserialize.tubes
      samples.findTubes.mockResolvedValue(tubes)
      await samples.handleTractionTubes()
      expect(samples.$route.path).toEqual('/libraries')
    })

  })

  describe('#findTubes', () => {

    let emptyResponse, failedResponse, request, cmp, response, barcodes

    beforeEach(() => {
      emptyResponse = { data: { data: []}, status: 200, statusText: 'Success'}
      failedResponse = { data: { }, status: 500, statusText: 'Internal Server Error' }
      cmp = Vue.extend(Request)
      request = new cmp({propsData: { baseURL: 'http://sequencescape.com', apiNamespace: 'api/v2', resource: 'requests'}})
      request.get = jest.fn()
      barcodes = 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5'
      samples.barcodes = barcodes
    })

    it('successfully', async () => {
      request.get.mockResolvedValue(TractionTubesWithLibrariesJson)
      response = await samples.findTubes(request)
      expect(request.get).toBeCalledWith({ filter: { barcode: samples.queryString } })
      expect(response).toEqual(new Response(TractionTubesWithLibrariesJson).deserialize.tubes)
      expect(samples.message).toEqual('Tubes successfully found')
    })

    it('unsuccessfully', async () => {
      request.get.mockReturnValue(failedResponse)
      response = await samples.findTubes(request)
      expect(request.get).toBeCalledWith({ filter: { barcode: samples.queryString } })
      expect(response).toEqual(new Response(failedResponse))
      expect(samples.message).toEqual('There was an error')
    })

    it('when no tubes exist', async () => {
      request.get.mockReturnValue(emptyResponse)
      response = await samples.findTubes(request)
      expect(request.get).toBeCalledWith({ filter: { barcode: samples.queryString } })
      expect(response).toEqual(new Response(emptyResponse))
      expect(samples.message).toEqual('No tubes found')
    })

    it('when there is no query string', async () => {
      samples.barcodes = ''
      response = await samples.findTubes(request)
      expect(request.get).not.toBeCalled()
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

  describe('emitAlert', () => {
    it('emits an event with the message', () => {
      wrapper.setData({ message: 'show this message' })
      samples.emitAlert
      expect(wrapper.emitted().alert).toBeTruthy()
    })
  })

  describe('#libraryRequest', () => {
    it('will have a request', () => {
      expect(samples.libraryRequest).toBeDefined()
    })
  })

  describe('#queryString', () => {
    it('will allow the user to scan in a barcopde', () => {
      wrapper.setData({ barcodes: 'TRAC-2' })
      expect(samples.queryString).toEqual('TRAC-2')
    })

    it('will allow the user to scan in multiple barcodes', () => {
      let barcodes = 'TRAC-1\nTRAC-2\nTRAC-3\nTRAC-4\nTRAC-5'
      wrapper.setData({ barcodes: barcodes })
      expect(samples.queryString).toEqual('TRAC-1,TRAC-2,TRAC-3,TRAC-4,TRAC-5')
    })
  })

})
