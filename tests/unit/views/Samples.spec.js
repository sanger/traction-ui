import Samples from '@/views/Samples'
import SamplesJson from '../../data/samples'
import Modal from '@/components/Modal'
import { mount, localVue } from '../testHelper'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'

describe('Samples.vue', () => {

  let wrapper, samples

  describe('sample request', () => {
    beforeEach(() => {
      wrapper = mount(Samples, { localVue, methods: { provider() { return } } })
      samples = wrapper.vm
    })

    it('will create a sample request', () => {
      let request = samples.sampleRequest
      expect(request.resource).toBeDefined()
    })

    it('will get a list of samples',  async () => {
      samples.sampleRequest.execute = jest.fn()
      samples.sampleRequest.execute.mockResolvedValue(SamplesJson)

      let response = await samples.getSamples()
      let expected = new Response(SamplesJson)
      expect(response).toEqual(expected.deserialize.samples)
    })
  })

  describe('building the table', () => {

    let mockSamples

    beforeEach(() => {
      mockSamples = new Response(SamplesJson).deserialize.samples
      wrapper = mount(Samples, { localVue, methods: { getSamples() { return mockSamples } }})
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

      let fn = samples.createLibrariesInTraction(selectedEnzymeId)
      await expect(fn).rejects.toBe("name name error message 1")
      await flushPromises()
      expect(samples.message).toEqual("name name error message 1")
    })
  })

  describe('modal', () => {
    it('passes selected enzyme id to function on emit event', () => {
      let modal = wrapper.find(Modal)
      wrapper.vm.createLibrariesInTraction = jest.fn()
      modal.vm.$emit('selectEnzyme', 2)
      expect(wrapper.vm.createLibrariesInTraction).toBeCalledWith(2)
    })
  })

})
