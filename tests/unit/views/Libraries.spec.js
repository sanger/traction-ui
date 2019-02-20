import Libraries from '@/views/Libraries'
import Alert from '@/components/Alert'
import { mount, localVue } from '../testHelper'
import DataList from '@/api/DataList'
import LibrariesJson from '../../data/libraries'
import Response from '@/api/Response'

describe('Libraries.vue', () => {

  let wrapper, libraries, data, JsonApiResponse, librariesResponse

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

  describe.skip('table', () => {

    beforeEach(() => {
      libraries.getLibraries = jest.fn()
      librariesResponse = new Response(LibrariesJson).deserialize.libraries
      libraries.getLibraries.mockReturnValue(libraries)
      libraries = new Response(LibrariesJson).deserialize.libraries
    })

    it('contains the correct fields', () => {
      for (let field of libraries.fields) {
        console.log(field.label)
      }
    })

    it('contains the correct data', () => {
      libraries = new Response(LibrariesJson).deserialize.libraries
      libraries.getLibraries.mockReturnValue(libraries)
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(libraries.length)
    })

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
