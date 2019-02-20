import Samples from '@/views/Samples'
import SamplesJson from '../../data/samples'
import Modal from '@/components/Modal'
import Alert from '@/components/Alert'
import { mount, localVue } from '../testHelper'
import DataList from '@/api/DataList'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'

describe('Samples.vue', () => {

  let wrapper, samples, data

  beforeEach(() => {
    wrapper = mount(Samples, { localVue })
    samples = wrapper.vm
  })

  it('will create a sample request', () => {
    let request = samples.sampleRequest
    expect(request.resource).toBeDefined()
  })

  it('will get a list of samples', async () => {
    samples.sampleRequest.execute = jest.fn()
    samples.sampleRequest.execute.mockResolvedValue(SamplesJson)

    let JsonApiResponse = await samples.getSamples()
    let expected = new Response(SamplesJson)
    expect(JsonApiResponse).toEqual(expected.deserialize.samples)
  })

  it.skip('has a data list', () => {
    expect(wrapper.contains(DataList)).toBe(true)
  })

  it.skip('has a alert', () => {
    expect(wrapper.contains(Alert)).toBe(true)
  })

  it.skip('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('contains a modal component', () => {
    expect(wrapper.contains(Modal)).toBe(true)
  })

  it.skip('contains the correct data', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(data.body.length)
  })

  describe('#createLibrariesInTraction', () => {
    let response

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

  describe.skip('selected', () => {
    let checkboxes

    beforeEach(() => {
      checkboxes = wrapper.findAll(".selected")
      checkboxes.at(0).trigger('click')
      checkboxes.at(1).trigger('click')
      checkboxes.at(2).trigger('click')
    })

    it('will find the sample which have been selected', () => {
      expect(samples.selected.length).toEqual(3)
    })

  })
})
