import Samples from '@/views/Samples'
import SamplesJson from '../../data/samples'
import Alert from '@/components/Alert'
import { mount, localVue } from '../testHelper'
import DataList from '@/api/DataList'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'

describe('Samples.vue', () => {

  let wrapper, samples, data, props

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
    expect(JsonApiResponse).toEqual(expected.data)
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

  it.skip('contains the correct data', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(data.body.length)
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

    describe('#createLibrariesInTraction', () => {
      let response

      beforeEach(() => {
        samples.tractionApiLibrary.create = jest.fn()
      })

      it('success', async () => {
        response = {status: 201}
        samples.tractionApiLibrary.data = response
        samples.tractionApiLibrary.create.mockReturnValue(response)
        samples.createLibrariesInTraction()
        await flushPromises()

        let sample_ids = []
        for (let i = 0; i < samples.selected.length; i++) {
          let id = samples.selected[i].id
          sample_ids.push( {'sample_id': id} )
        }

        let body = { data: { type: 'libraries', attributes: { libraries: sample_ids }}}
        expect(samples.tractionApiLibrary.create).toBeCalledWith(body)
        expect(samples.message).toEqual("Libraries created in Traction")
      })

      it('failuree', async () => {
        response = {message: 'Something went wrong'}
        samples.tractionApiLibrary.errors = response
        samples.tractionApiLibrary.create.mockReturnValue(response)
        let fn = samples.createLibrariesInTraction()
        await expect(fn).rejects.toBe("Something went wrong")

        let sample_ids = []
        for (let i = 0; i < samples.selected.length; i++) {
          let id = samples.selected[i].id
          sample_ids.push( {'sample_id': id} )
        }

        let body = { data: { type: 'libraries', attributes: { libraries: sample_ids }}}
        expect(samples.tractionApiLibrary.create).toBeCalledWith(body)
        expect(samples.message).toEqual("Something went wrong")
      })
    })

  })

})
