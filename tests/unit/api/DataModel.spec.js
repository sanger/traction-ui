import { mount } from '../testHelper'
import DataModel from '@/api/DataModel'

describe('DataModel', () => {

  let wrapper, dataModel, data, response

  beforeEach(() => {
    wrapper = mount(DataModel, { propsData: { resource: 'samples', baseURL: "http://examplehost:1234", apiNamespace: "abc/v1" } })
    dataModel = wrapper.vm
    dataModel.execute = jest.fn()
  })

  describe('get', () => {

    it('returns an appropriate response', () => {
      response = {data: { body: [{ name: 'enz1' }, { name: 'enz2' }] }}
      dataModel.execute.mockReturnValue(response)
      expect(dataModel.get()).toEqual(response)
      expect(dataModel.execute).toBeCalledWith('get', dataModel.resource)
    })

  })

  describe('post', () => {

    it('returns an appropriate response', () => {
      data = { data: { attributes: { requests: [{ sequencescape_request_id: 1, name: 'sample1', species: 'dog'}] }}}
      response = {data: {status: 201}}
      dataModel.execute.mockReturnValue(response)
      expect(dataModel.create(data)).toEqual(response)
      expect(dataModel.execute).toBeCalledWith('post', dataModel.resource, data)
    })

  })

  describe('patch', () => {

    it('returns an appropriate response', () => {
      let id = 1
      data = { data: { attributes: { requests: [{ sequencescape_request_id: id, name: 'sample1', species: 'dog'}] }}}
      response = {status: 200}
      dataModel.execute.mockReturnValue(response)
      expect(dataModel.update(id, data)).toEqual(response)
      expect(dataModel.execute).toBeCalledWith('patch', `${dataModel.resource}/${id}`, data)
    })

  })

  describe('find', () => {

    it('returns an appropriate response', () => {
      let id = 123
      response = {status: 200}
      dataModel.execute.mockReturnValue(response)
      expect(dataModel.find(id)).toEqual(response)
      expect(dataModel.execute).toBeCalledWith('get', `${dataModel.resource}/${id}`)
    })

  })

  describe('destroy', () => {

    it('returns an appropriate response', () => {
      let id = 123
      response = {status: 200}
      dataModel.execute.mockReturnValue(response)
      expect(dataModel.destroy(id)).toEqual(response)
      expect(dataModel.execute).toBeCalledWith('delete', `${dataModel.resource}/${id}`)
    })

  })
})
