import Libraries from '@/views/Libraries'
import Alert from '@/components/Alert'
import { mount, localVue } from '../testHelper'
import DataList from '@/api/DataList'
import LibrariesJson from '../../data/libraries'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'

describe('Libraries.vue', () => {

  let wrapper, libraries, data, librariesResponse

  describe('library request', () => {

    beforeEach(() => {
      wrapper = mount(Libraries, { localVue })
      libraries = wrapper.vm
    })

    it('will create a library request', () => {
      let request = libraries.libraryRequest
      expect(request.resource).toBeDefined()
    })

    it('will get a list of libraries', async () => {
      libraries.libraryRequest.execute = jest.fn()
      libraries.libraryRequest.execute.mockResolvedValue(LibrariesJson)

      let librariesResponse = await libraries.getLibraries()
      let expected = new Response(LibrariesJson)
      expect(librariesResponse).toEqual(expected.deserialize.libraries)
    })

  })

  describe('building the table', () => {

    let mockLibraries

    beforeEach(() => {
      mockLibraries = new Response(LibrariesJson).deserialize.libraries
      wrapper = mount(Libraries, { localVue, methods: { getLibraries() { return mockLibraries } }})
      libraries = wrapper.vm
    })

    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of libraries.fields) {
        expect(headers.filter(header => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(mockLibraries.length)
    })

    describe('selecting libraries', () => {

      beforeEach(() => {
        let checkboxes = wrapper.findAll(".selected")
        checkboxes.at(0).trigger('click')
        checkboxes.at(1).trigger('click')
        checkboxes.at(2).trigger('click')
      })

      it('will create a list of selected libraries', () => {
        expect(libraries.selected.length).toEqual(3)
      })

      it('can delete the selected libraries', () => {
        
      })
    })

 

    // describe('deleting the libraries', () => {

    // })

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

})
