import Reception from '@/views/Reception'
import Alert from '@/components/Alert'
import { mount, localVue } from './testHelper'
import DataList from '@/api/DataList'
import DataModel from '@/api/DataModel'

describe('Reception.vue', () => {

  let wrapper, reception, data

  beforeEach(() => {
    data = [
      { "id": 1, "name": "DN11111", "species": "cat" },
      { "id": 2, "name": "DN11112", "species": "cat" },
      { "id": 3, "name": "DN11113", "species": "dog" },
      { "id": 4, "name": "DN11114", "species": "dog" },
      { "id": 5, "name": "DN11115", "species": "cat" }
    ]
    wrapper = mount(Reception, { localVue })
    wrapper.find(DataList).vm.data = data
    reception = wrapper.vm
  })

  it('has a data list', () => {
    expect(wrapper.contains(DataList)).toBe(true)
  })

  it('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('contains the correct data', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(data.length)
  })

  describe('selected', () => {

    let checkboxes

    beforeEach(() => {
      let checkboxes = wrapper.findAll(".selected")
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
        reception.tractionApi.update = jest.fn()
      })

      it('success', () => {
        response = {status: 201}
        reception.tractionApi.data = response
        reception.tractionApi.update.mockReturnValue(response)
        reception.exportRequestsIntoTraction()
        expect(reception.message).toEqual("Samples imported")
        expect(reception.tractionApi.update).toBeCalledWith(reception.selected)
      })

      it('failure', () => {
        response = {message: 'Something went wrong'}
        reception.tractionApi.errors = response
        reception.tractionApi.update.mockReturnValue(response)
        reception.exportRequestsIntoTraction()
        expect(reception.message).toEqual("Something went wrong")
        expect(reception.tractionApi.update).toBeCalledWith(reception.selected)
      })
    })

    describe('#updateSequencescapeRequests', () => {
      let response

      beforeEach(() => {
        reception.sequencescapeApi.update = jest.fn()
      })

      it('success', () => {
        response = {status: 201}
        reception.sequencescapeApi.data = response
        reception.sequencescapeApi.update.mockReturnValue(response)
        reception.updateSequencescapeRequests()
        expect(reception.message).toEqual("Samples imported")
        expect(reception.sequencescapeApi.update).toBeCalledWith(reception.selected)
      })

      it('failure', () => {
        response = {message: 'Something went wrong'}
        reception.sequencescapeApi.errors = response
        reception.sequencescapeApi.update.mockReturnValue(response)
        reception.updateSequencescapeRequests()
        expect(reception.message).toEqual('Something went wrong')
        expect(reception.sequencescapeApi.update).toBeCalledWith(reception.selected)
      })

    })

    describe('#exportRequests', () =>{

      beforeEach(() => {
        reception.exportRequestsIntoTraction = jest.fn()
        reception.updateSequencescapeRequests = jest.fn()
      })

      it('calls both exportRequestsIntoTraction and updateSequencescapeRequests', () => {
        wrapper.find('#exportRequests').trigger('click')
        expect(reception.exportRequestsIntoTraction).toBeCalled()
        expect(reception.updateSequencescapeRequests).toBeCalled()
      })

      it('incremenets the dataListKey', () => {
        expect(reception.dataListKey).toEqual(0)
        wrapper.find('#exportRequests').trigger('click')
        expect(reception.dataListKey).toEqual(1)
      })

    })

    describe('rerenders', () => {

      beforeEach(() => {
        // data = [
        //   { "id": 1, "name": "DN11111", "species": "cat" },
        //   { "id": 2, "name": "DN11112", "species": "cat" }
        // ]
        // wrapper.find(DataList).vm.data = data
        reception.updateSequencescapeRequests = jest.fn()
      })

      it('only shows the updated data', () => {
        reception.forceRerender

        expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
      })
    })
  })

})
