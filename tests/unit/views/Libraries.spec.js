import Libraries from '@/views/Libraries'
import { mount, localVue } from '../testHelper'
import LibrariesJson from '../../data/libraries'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'

describe('Libraries.vue', () => {

  let wrapper, libraries

  describe('library request', () => {

    beforeEach(() => {
      wrapper = mount(Libraries, { localVue, methods: { provider() { return } } })
      libraries = wrapper.vm
    })

    it('will create a library request', () => {
      let request = libraries.libraryRequest
      expect(request.resource).toBeDefined()
    })

    describe('#getLibraries', () => {
      it('will get a list of libraries on success',  async () => {
        libraries.libraryRequest.execute = jest.fn()
        libraries.libraryRequest.execute.mockResolvedValue(LibrariesJson)

        await libraries.getLibraries()
        let expected = new Response(LibrariesJson)
        expect(libraries.items).toEqual(expected.deserialize.libraries)
      })


      it('will return get an empty list on failure',  async () => {
        let mockResponse = {
          data: { errors: { library: ['error message 1'] }},
          status: 422,
          statusText: "Unprocessible entity"
        }

        libraries.libraryRequest.execute = jest.fn()
        libraries.libraryRequest.execute.mockReturnValue(mockResponse)

        await libraries.getLibraries()
        await flushPromises()
        expect(libraries.message).toEqual("library error message 1")
        expect(libraries.items).toEqual([])
      })
    })

  })

  describe('building the table', () => {

    let mockLibraries

    beforeEach(() => {
      mockLibraries = new Response(LibrariesJson).deserialize.libraries

      wrapper = mount(Libraries, { localVue,
        methods: {
          provider() {
            return
          }
        },
        data() {
          return {
            items: mockLibraries
          }
        }
      })
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

  })

  describe('selecting libraries', () => {
    let mockLibraries

    beforeEach(() => {
      mockLibraries = new Response(LibrariesJson).deserialize.libraries

      wrapper = mount(Libraries, { localVue,
        methods: {
          provider() {
            return
          }
        },
        data() {
          return {
            items: mockLibraries
          }
        }
      })
      libraries = wrapper.vm

      let checkboxes = wrapper.findAll(".selected")
      checkboxes.at(0).trigger('click')
      checkboxes.at(1).trigger('click')
      checkboxes.at(2).trigger('click')
    })

    it('will create a list of selected libraries', () => {
      expect(libraries.selected.length).toEqual(3)
    })

    describe('deleting', () => {
      beforeEach(() => {
        libraries.libraryRequest.destroy = jest.fn()
      })

      it('successfully', async () => {
        let mockResponse = [{ status: 204, data: "" }]
        libraries.libraryRequest.destroy.mockResolvedValue(mockResponse)
        wrapper.find('#deleteLibraries').trigger('click')
        await flushPromises()
        expect(libraries.message).toEqual(`Libraries ${libraries.selected.join(',')} successfully deleted`)
        expect(libraries.libraryRequest.destroy).toBeCalledWith(libraries.selected)
      })

      it('unsuccessfully', async () => {
        let mockResponse =  [{ data: { errors: { it: ['was a bust'] } }, status: 422 }]
        libraries.libraryRequest.destroy.mockReturnValue(mockResponse)
        wrapper.find('#deleteLibraries').trigger('click')
        await flushPromises()
        expect(libraries.message).toEqual(['it was a bust'])
        expect(libraries.libraryRequest.destroy).toBeCalledWith(libraries.selected)
      })
    })

  })

  describe('filtering libraries', () => {
    let mockLibraries

    beforeEach(() => {
      mockLibraries = new Response(LibrariesJson).deserialize.libraries

      wrapper = mount(Libraries, { localVue,
        methods: {
          provider() {
            return
          }
        },
        data() {
          return {
            items: mockLibraries,
            filter: mockLibraries[0].sample_name
          }
        }
      })
    })

    it('will filter the libraries in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/sample2/)
    })
  })

})
