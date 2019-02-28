import Samples from '@/views/Samples'
import SamplesJson from '../../data/samples'
import Modal from '@/components/Modal'
import { mount, localVue } from '../testHelper'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'

describe('Samples.vue', () => {

  let wrapper, samples

    beforeEach(() => {
      wrapper = mount(Samples, { localVue, methods: { provider() { return } } })
      samples = wrapper.vm
    })

    it('has a create libraries with enzyme button', () => {
      expect(wrapper.contains('#createLibrariesWithEnzymeButton')).toBe(true)
      let button = wrapper.find('#createLibrariesWithEnzymeButton').text()
      expect(button).toEqual("Create Libraries with Enzyme")
    })

  describe('sample request', () => {
    it('will create a sample request', () => {
      let request = samples.sampleRequest
      expect(request.resource).toBeDefined()
    })

    it('will get a list of samples',  async () => {
      samples.sampleRequest.execute = jest.fn()
      samples.sampleRequest.execute.mockResolvedValue(SamplesJson)

      await samples.getSamples()
      let expected = new Response(SamplesJson)
      expect(samples.items).toEqual(expected.deserialize.samples)
    })
  })

  describe('building the table', () => {

    let mockSamples

    beforeEach(() => {
      mockSamples = new Response(SamplesJson).deserialize.samples

      wrapper = mount(Samples, { localVue,
        methods: {
          provider() {
            return
          }
        },
        data() {
          return {
            items: mockSamples
          }
        }
      })
      samples = wrapper.vm
    })

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
        checkboxes.at(1).trigger('click')
        checkboxes.at(2).trigger('click')
      })

      it('will create a list of selected requests', () => {
        expect(samples.selected.length).toEqual(3)
      })

    })

  })

  describe('#createLibrariesInTraction', () => {

    beforeEach(() => {
      samples.libraryRequest.execute = jest.fn()
    })

    it('success', async () => {
      let mockResponse =  {
        data: {
          data: [
             { id: 1, type: "libraries", attributes: { name: "testname1" }},
             { id: 2, type: "libraries", attributes: { name: "testname2" }}
          ]
        },
        status: 200,
        statusText: "OK"
      }

      samples.libraryRequest.execute.mockResolvedValue(mockResponse)

      let selectedEnzymeId = 1
      samples.selected = [{id: 1}]

      await samples.createLibrariesInTraction(selectedEnzymeId)
      expect(samples.message).toEqual("Libraries created in Traction")
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

      samples.libraryRequest.execute.mockReturnValue(mockResponse)

      let selectedEnzymeId = 1
      samples.selected = [{id: 1}]

      await samples.createLibrariesInTraction(selectedEnzymeId)
      await flushPromises()
      expect(samples.message).toEqual("name name error message 1")
    })
  })

  describe('modal', () => {
    it('passes selected enzyme id to function on emit event', () => {

      samples.selected = [{id: 1}]

      let modal = wrapper.find(Modal)
      samples.libraryRequest.create = jest.fn()
      samples.libraryRequest.create.mockResolvedValue({status: 201, data: {}})

      modal.vm.$emit('selectEnzyme', 2)
      let expectedBody = {data: {attributes: {libraries: [{enzyme_id: 2, sample_id: 1}]}, type: "libraries"}}
      expect(samples.libraryRequest.create).toBeCalledWith(expectedBody)
    })
  })

  describe('filtering samples', () => {
    let mockSamples

    beforeEach(() => {
      mockSamples = new Response(SamplesJson).deserialize.samples

      wrapper = mount(Samples, { localVue,
        methods: {
          provider() {
            return
          }
        },
        data() {
          return {
            items: mockSamples,
            filter: mockSamples[0].name
          }
        }
      })
    })

    it('will filter the samples in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/sample2/)
    })
  })

})
