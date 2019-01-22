import Reception from '@/views/Reception'
import Alert from '@/components/Alert'
import { mount, localVue } from '../testHelper'
import DataList from '@/api/DataList'
import flushPromises from 'flush-promises'

describe('Reception.vue', () => {

  let wrapper, reception, data

  beforeEach(() => {

    // TODO: is this sustainable?
    DataList.created = jest.fn()

    data = { body: [
      { "id": 1, "name": "DN11111", "species": "cat" },
      { "id": 2, "name": "DN11112", "species": "cat" },
      { "id": 3, "name": "DN11113", "species": "dog" },
      { "id": 4, "name": "DN11114", "species": "dog" },
      { "id": 5, "name": "DN11115", "species": "cat" }
    ]}
    wrapper = mount(Reception, { localVue })
    wrapper.find(DataList).vm.data = data
    reception = wrapper.vm
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

    it('will find the requests which have been selected', () => {
      expect(reception.selected.length).toEqual(3)
    })

    describe('#exportRequestsIntoTraction', () => {
      let response

      beforeEach(() => {
        reception.tractionApi.create = jest.fn()
      })

      it('success', async () => {
        response = {status: 201}
        reception.tractionApi.data = response
        reception.tractionApi.create.mockReturnValue(response)
        reception.exportRequestsIntoTraction()
        await flushPromises()
        let body = { data: { attributes: { samples: reception.selected }}}
        expect(reception.tractionApi.create).toBeCalledWith(body)
        expect(reception.message).toEqual("Samples imported into Traction")
      })

      it('failure', async () => {
        response = {message: 'Something went wrong'}
        reception.tractionApi.errors = response
        reception.tractionApi.create.mockReturnValue(response)
        let fn = reception.exportRequestsIntoTraction()
        await expect(fn).rejects.toBe("Something went wrong")
        await flushPromises()
        let body = { data: { attributes: { samples: reception.selected }}}
        expect(reception.tractionApi.create).toBeCalledWith(body)
        expect(reception.message).toEqual("Something went wrong")
      })
    })

    describe('#updateSequencescapeRequests', () => {
      let response

      beforeEach(() => {
        reception.sequencescapeApi.update = jest.fn()
      })

      it('success', async () => {
        response = {status: 201}
        reception.sequencescapeApi.data = response
        reception.sequencescapeApi.update.mockReturnValue(response)
        reception.updateSequencescapeRequests()
        await flushPromises()
        expect(reception.message).toEqual('Samples updated in SS')
        expect(reception.sequencescapeApi.update).toHaveBeenCalledTimes(reception.selected.length)
      })

      it('failure', async () => {
        response = {message: 'Something went wrong'}
        reception.sequencescapeApi.errors = response
        reception.sequencescapeApi.update.mockReturnValue(response)
        let fn = reception.updateSequencescapeRequests()
        await expect(fn).rejects.toBe("Something went wrong")
        await flushPromises()
        expect(reception.message).toEqual('Something went wrong')
        expect(reception.sequencescapeApi.update).toHaveBeenCalledTimes(reception.selected.length)
      })

    })

    describe('#exportRequests', () =>{

      beforeEach(() => {
        reception.exportRequestsIntoTraction = jest.fn()
        reception.updateSequencescapeRequests = jest.fn()
      })

      describe('when exportRequestsIntoTraction is successful', () => {
        it('calls updateSequencescapeRequests', async () => {
          let response = {status: 201}
          reception.exportRequestsIntoTraction.mockResolvedValue(response)
          reception.updateSequencescapeRequests.mockResolvedValue(response)
          wrapper.find('#exportRequests').trigger('click')
          expect(reception.exportRequestsIntoTraction).toBeCalled()
          await flushPromises()
          expect(reception.updateSequencescapeRequests).toBeCalled()
        })
      })

      describe('when exportRequestsIntoTraction fails', () => {
        it('does not call updateSequencescapeRequests', () => {
          let response = {message: 'Something went wrong'}
          reception.exportRequestsIntoTraction.mockReturnValue(response)
          wrapper.find('#exportRequests').trigger('click')
          expect(reception.exportRequestsIntoTraction).toBeCalled()
          expect(reception.updateSequencescapeRequests).not.toBeCalled()
        })
      })

    })

  })

})
