import Samples from '@/views/Samples'
import Modal from '@/components/Modal'
import { mount, localVue, store } from '../testHelper'
import Libraries from '../../data/libraries'

describe('Samples.vue', () => {

  let wrapper, samples, mockSamples

    beforeEach(() => {
      mockSamples = [
        { "id": "1", "name": "sample_d", "external_id": 4, "species": "human", "barcode": "TRAC-1", "created_at": "02/27/2019 04:05" },
        { "id": "1", "name": "sample_d", "external_id": 4, "species": "human", "barcode": "TRAC-1", "created_at": "02/27/2019 04:05" }
      ]

      wrapper = mount(Samples, { localVue,
        store,
        propsData: {
          items: mockSamples
        },
        methods: { provider() { return } }
      })
      samples = wrapper.vm
    })

    it('has a create libraries with enzyme button', () => {
      expect(wrapper.contains('#createLibrariesWithEnzymeButton')).toBe(true)
      let button = wrapper.find('#createLibrariesWithEnzymeButton').text()
      expect(button).toEqual("Create Libraries with Enzyme")
    })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of samples.fields) {
        expect(headers.filter(header => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(mockSamples.length)
    })

    describe('selecting samples', () => {

      beforeEach(() => {
        let checkboxes = wrapper.findAll(".selected")
        checkboxes.at(0).trigger('click')
      })

      it('will create a list of selected requests', () => {
        expect(samples.selected.length).toEqual(1)
      })

    })
  })

  describe('#createLibrariesInTraction', () => {

    beforeEach(() => {
      samples.libraryRequest.execute = jest.fn()
    })

    it('success', async () => {
      let mockResponse =  {
        data: {
          data: [
             { id: 1, type: "libraries", attributes: { name: "testname1" }},
             { id: 2, type: "libraries", attributes: { name: "testname2" }}
          ]
        },
        status: 200,
        statusText: "OK"
      }

      samples.libraryRequest.execute.mockResolvedValue(mockResponse)

      let selectedEnzymeId = 1
      samples.selected = [{id: 1}]

      await samples.createLibrariesInTraction(selectedEnzymeId)
      expect(samples.message).toEqual("Libraries 1,2 created in Traction")
    })

    it('failure', async () => {

      let mockResponse = {
        data: {
          errors: {
            name: ['name error message 1']
          }
        },
        status: 422,
        statusText: "Unprocessible entity"
      }

      samples.libraryRequest.execute.mockReturnValue(mockResponse)

      let selectedEnzymeId = 1
      samples.selected = [{id: 1}]

      await samples.createLibrariesInTraction(selectedEnzymeId)
      expect(samples.message).toEqual("name name error message 1")
    })
  })

  describe('modal', () => {
    it('passes selected enzyme id to function on emit event', () => {

      samples.selected = [{id: 1}]

      let modal = wrapper.find(Modal)
      samples.libraryRequest.create = jest.fn()
      samples.libraryRequest.create.mockResolvedValue(Libraries)

      modal.vm.$emit('selectEnzyme', 2)
      let expectedBody = {data: {attributes: {libraries: [{enzyme_id: 2, sample_id: 1}]}, type: "libraries"}}
      expect(samples.libraryRequest.create).toBeCalledWith(expectedBody)
    })
  })

  describe('emitAlert', () => {
    it('emits an event with the message', () => {
      wrapper.setData({ message: 'show this message' })
      samples.emitAlert
      expect(wrapper.emitted().alert).toBeTruthy()
    })
  })

})
