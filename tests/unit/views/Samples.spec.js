import Samples from '@/views/Samples'
import Modal from '@/components/Modal'
import Alert from '@/components/Alert'
import { mount, localVue } from '../testHelper'
import DataList from '@/api/DataList'
import flushPromises from 'flush-promises'

describe('Samples.vue', () => {

  let wrapper, samples, data

  beforeEach(() => {
    data = { body: [
      { "id": 1, "attributes": { "name": "DN11111", "species": "cat", "barcode": "TRAC-1" }},
      { "id": 2, "attributes": { "name": "DN11112", "species": "cat", "barcode": "TRAC-2" }},
      { "id": 3, "attributes": { "name": "DN11113", "species": "dog", "barcode": "TRAC-3" }},
      { "id": 4, "attributes": { "name": "DN11114", "species": "dog", "barcode": "TRAC-4" }},
      { "id": 5, "attributes": { "name": "DN11115", "species": "cat", "barcode": "TRAC-5" }}
    ]}
    wrapper = mount(Samples, { localVue })
    wrapper.find(DataList).vm.data = data
    samples = wrapper.vm
  })

  it('has a data list', () => {
    expect(wrapper.contains(DataList)).toBe(true)
  })

  it('has a alert', () => {
    expect(wrapper.contains(Alert)).toBe(true)
  })

  it('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('contains a modal component', () => {
    expect(wrapper.contains(Modal)).toBe(true)
  })

  it('contains the correct data', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(data.body.length)
  })

  describe('selected', () => {

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

        let selectedEnzymeId = 1
        samples.createLibrariesInTraction(selectedEnzymeId)
        await flushPromises()

        let libraryAttrs = []
        for (let i = 0; i < samples.selected.length; i++) {
          let sampleId = samples.selected[i].id
          libraryAttrs.push( {'sample_id': sampleId, 'enzyme_id': selectedEnzymeId} )
        }

        let body = { data: { type: 'libraries', attributes: { libraries: libraryAttrs }}}
        expect(samples.tractionApiLibrary.create).toBeCalledWith(body)
        expect(samples.message).toEqual("Libraries created in Traction")
      })

      it('failure', async () => {
        response = {message: 'Something went wrong'}
        samples.tractionApiLibrary.errors = response
        samples.tractionApiLibrary.create.mockReturnValue(response)

        let selectedEnzymeId = 1
        let fn = samples.createLibrariesInTraction(selectedEnzymeId)
        await expect(fn).rejects.toBe("Something went wrong")

        let libraryAttrs = []
        for (let i = 0; i < samples.selected.length; i++) {
          let sampleId = samples.selected[i].id
          let enzymeId = 1
          libraryAttrs.push( {'sample_id': sampleId, 'enzyme_id': selectedEnzymeId} )
        }

        let body = { data: { type: 'libraries', attributes: { libraries: libraryAttrs }}}
        expect(samples.tractionApiLibrary.create).toBeCalledWith(body)
        expect(samples.message).toEqual("Something went wrong")
      })
    })

  })

  describe('modal', () => {
    // it('button is disabled unless samples are selected', () => {
    //   expect(wrapper.find(Modal).props().disabled).toBe(true)
    // })
    //
    // it('button is not disabled when samples are selected', () => {
    //   expect(wrapper.find(Modal).props().disabled).toBe(false)
    // })

    it('passes selected enzyme id to function on emit event', () => {
      let modal = wrapper.find(Modal)
      wrapper.vm.createLibrariesInTraction = jest.fn()
      modal.vm.$emit('selectEnzyme', 2)
      expect(wrapper.vm.createLibrariesInTraction).toBeCalledWith(2)
    })
  })
})
