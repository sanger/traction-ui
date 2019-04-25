import Libraries from '@/views/Libraries'
import { mount, localVue, store } from '../testHelper'

describe('Libraries.vue', () => {

  let wrapper, libraries, mockLibraries

  describe('library request', () => {
    mockLibraries =  [
      { barcode: 'TRAC-8', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }},
      { barcode: 'TRAC-8', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }}
    ]

    beforeEach(() => {
      wrapper = mount(Libraries, { localVue,
        store,
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

  describe('#deleteLibraries', () => {

    beforeEach(() => {
      mockLibraries =  [
        { barcode: 'TRAC-8', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }},
        { barcode: 'TRAC-8', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }}
      ]

      wrapper = mount(Libraries, { localVue,
        store,
        propsData: {
          items: mockLibraries
        }
      })
      libraries = wrapper.vm

      let checkboxes = wrapper.findAll(".selected")
      checkboxes.at(0).trigger('click')

      libraries.libraryRequest.execute = jest.fn()
    })

    it('will create a list of selected libraries', () => {
      expect(libraries.selected.length).toEqual(1)
    })

    it('successfully', async () => {
      let mockResponse =  {
        data: {},
        status: 204,
        statusText: "OK"
      }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      libraries.libraryRequest.execute.mockResolvedValue(promise)

      await libraries.deleteLibraries()
      expect(libraries.message).toEqual(`Libraries ${libraries.selected.join(',')} successfully deleted`)
    })

    it('unsuccessfully', async () => {
      let mockResponse =  {  data: { errors: { it: ['was a bust'] } }, status: 422 }

      let promise = new Promise((reject) => {
        reject(mockResponse)
      })

      libraries.libraryRequest.execute.mockResolvedValue(promise)

      await libraries.deleteLibraries()
      expect(libraries.message).toEqual(['it was a bust'])
    })

  })

  describe('#libraryRequest', () => {
    it('will have a request', () => {
      expect(libraries.libraryRequest).toBeDefined()
    })
  })

  describe('#emitAlert', () => {
    it('emits an event with the message', () => {
      wrapper.setData({ message: 'show this message' })
      libraries.emitAlert
      expect(wrapper.emitted().alert).toBeTruthy()
    })
  })
})
