import Libraries from '@/views/Libraries'
import { mount, localVue } from '../testHelper'
import LibrariesJson from '../../data/libraries'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'

describe('Libraries.vue', () => {

  let wrapper, libraries, mockLibraries

  describe('library request', () => {
    mockLibraries =  [
      { "type": "libraries", "id": "6", "state": "pending", "barcode": "TRAC-8", "sample_name": "sample_d", "enzyme_name": "Nb.BsrDI", "created_at": "03/12/2019 11:49" },
      { "type": "libraries", "id": "6", "state": "pending", "barcode": "TRAC-8", "sample_name": "sample_d", "enzyme_name": "Nb.BsrDI", "created_at": "03/12/2019 11:49" }
    ]

    beforeEach(() => {
      wrapper = mount(Libraries, { localVue,
        propsData: {
          items: mockLibraries
        }
      })
      libraries = wrapper.vm
    })

    it('will create a library request', () => {
      let request = libraries.libraryRequest
      expect(request.resource).toBeDefined()
    })

    it('will get a list of libraries on success',  async () => {
      expect(libraries.items).toEqual(mockLibraries)
    })

  })

  describe('building the table', () => {

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
      let checkboxes = wrapper.findAll(".selected")
      checkboxes.at(0).trigger('click')
    })

    it('will create a list of selected libraries', () => {
      expect(libraries.selected.length).toEqual(1)
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

})
