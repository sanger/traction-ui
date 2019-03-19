import Reception from '@/views/Reception'
import { mount, localVue } from '../testHelper'
import flushPromises from 'flush-promises'
import RequestsJson from '../../data/sequencescapeRequests'
import Response from '@/api/Response'

describe('Reception.vue', () => {

  let wrapper, reception

  describe('request objects', () => {
    beforeEach(() => {
      wrapper = mount(Reception, { localVue, methods: { provider() { return } } })
      reception = wrapper.vm
    })

    it('will create a reception request', () => {
      let request = reception.receptionRequest
      expect(request.resource).toBeDefined()
    })

    it('will create a sample request', () => {
      let request = reception.sampleRequest
      expect(request.resource).toBe('samples')
    })

    describe('#getRequests', () => {
      it('will get a list of requests on success',  async () => {
        reception.receptionRequest.execute = jest.fn()
        reception.receptionRequest.execute.mockResolvedValue(RequestsJson)

        await reception.getRequests()
        let expected = new Response(RequestsJson)

        expect(reception.items.length).toEqual(expected.deserialize.requests.length)
        expect(reception.items[0].id).toEqual("1")
        expect(reception.items[1].id).toEqual("4")
        expect(reception.items[0].name).toEqual("sample_a")
        expect(reception.items[1].name).toEqual("sample_d")
        expect(reception.items[0].species).toEqual("common")
        expect(reception.items[1].species).toEqual("human")
      })

      it('will return get an empty list on failure',  async () => {
        let mockResponse = {
          data: { errors: { request: ['error message 1'] }},
          status: 422,
          statusText: "Unprocessible entity"
        }

        reception.receptionRequest.execute = jest.fn()
        reception.receptionRequest.execute.mockReturnValue(mockResponse)

        await reception.getRequests()
        await flushPromises()
        expect(reception.message).toEqual("request error message 1")
        expect(reception.items).toEqual([])
      })
    })
  })

  describe('building the table', () => {

    let mockRequests

    beforeEach(() => {
      mockRequests = new Response(RequestsJson).deserialize.requests
      wrapper = mount(Reception, { localVue,
        methods: {
          provider() {
            return
          }
        },
        data() {
          return {
            items: mockRequests,
          }
        }
      })
      reception = wrapper.vm
    })

    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of reception.fields) {
        expect(headers.filter(header => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(mockRequests.length)
    })

    describe('selecting requests', () => {

      beforeEach(() => {

        let checkboxes = wrapper.findAll(".selected")
        checkboxes.at(0).trigger('click')
        checkboxes.at(1).trigger('click')
      })

      it('will create a list of selected requests', () => {
        expect(reception.selected.length).toEqual(mockRequests.length)
      })

    })

  })

  describe('#exportRequestsIntoTraction', () => {

    beforeEach(() => {
      reception.sampleRequest.execute = jest.fn()

      reception.selected = [
        { id: "4", samples: [{ name: "sample_d", sample_metadata: { sample_common_name: "human" }}]}
      ]

    })

    it('success', async () => {
      let mockResponse =  {
        data: {
          data: [
             { id: 1, type: "samples", attributes: { name: "testname1" }},
             { id: 2, type: "samples", attributes: { name: "testname2" }}
          ]
        },
        status: 200,
        statusText: "OK"
      }

      reception.sampleRequest.execute.mockResolvedValue(mockResponse)

      await reception.exportRequestsIntoTraction()
      expect(reception.message).toEqual("Samples imported into Traction")
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

      reception.sampleRequest.execute.mockReturnValue(mockResponse)

      let fn = reception.exportRequestsIntoTraction()
      await expect(fn).rejects.toBe("name name error message 1")
      await flushPromises()
      expect(reception.message).toEqual("name name error message 1")
    })
  })

  describe('#updateSequencescapeRequests', () => {

    beforeEach(() => {
      reception.receptionRequest.execute = jest.fn()
    })

    it('success', async () => {
      let mockResponse =  {
        data: {
          data: [
             { id: 1, type: "samples", attributes: { name: "testname1" }},
             { id: 2, type: "samples", attributes: { name: "testname2" }}
          ]
        },
        status: 200,
        statusText: "OK"
      }

      reception.receptionRequest.execute.mockResolvedValue(mockResponse)

      reception.selected = [{external_id: 1}]
      await reception.updateSequencescapeRequests()
      expect(reception.message).toEqual('Samples updated in SS')
    })

    it('failure', async () => {

      let mockResponse = {
        data: {
          errors: {
            name: ['name error message 1'],
            species: ['species error message 1'],
          }
        },
        status: 422,
        statusText: "Unprocessible entity"
      }

      reception.receptionRequest.execute.mockReturnValue(mockResponse)
      reception.selected = [{external_id: 1}]
      let fn = reception.updateSequencescapeRequests()
      await expect(fn).rejects.toEqual(["name name error message 1, species species error message 1"])
      await flushPromises()
      expect(reception.message).toEqual(["name name error message 1, species species error message 1"])
    })

  })

  describe('#exportRequests', () =>{

    beforeEach(() => {
      reception.sampleRequest.execute = jest.fn()
      reception.receptionRequest.execute = jest.fn()

      reception.selected = [
        { id: "4", samples: [{ name: "sample_d", sample_metadata: { sample_common_name: "human" }}]}
      ]
    })

    describe('when exportRequestsIntoTraction is successful', () => {
      it('calls updateSequencescapeRequests', async () => {

        let mockResponse =  {
          data: {
            data: [
               { id: 1, type: "samples", attributes: { name: "testname1" }},
               { id: 2, type: "samples", attributes: { name: "testname2" }}
            ]
          },
          status: 200,
          statusText: "OK"
        }

        reception.sampleRequest.execute.mockResolvedValue(mockResponse)

        await reception.exportRequests()

        expect(reception.sampleRequest.execute).toBeCalled()
        expect(reception.receptionRequest.execute).toBeCalled()

      })
    })

    describe('when exportRequestsIntoTraction fails', () => {
      it('does not call updateSequencescapeRequests', () => {
        let mockResponse = {
          data: {
            errors: {
              name: ['name error message 1']
            }
          },
          status: 422,
          statusText: "Unprocessible entity"
        }

        reception.sampleRequest.execute.mockReturnValue(mockResponse)

        reception.exportRequests()
        expect(reception.sampleRequest.execute).toBeCalled()
        expect(reception.receptionRequest.execute).not.toBeCalled()
      })
    })

  })

  describe('#selectedJSON', () => {
    it('returns the json formatted request', () => {
      let selected = [{
       id: "4",
       name: "sample_d",
       species: "human"
      }]

      let expected = [{ external_id: '4', name: 'sample_d', species: 'human' }]
      expect(reception.selectedJSON(selected)).toEqual(expected)
    })
  })

  describe('filtering requests', () => {
    let wrapper

    beforeEach(() => {
      let mockRequests = new Response(RequestsJson).deserialize.requests

      wrapper = mount(Reception, { localVue,
        methods: {
          provider() {
            return
          }
        },
        data() {
          return {
            items: mockRequests,
            filter: mockRequests[0].state
          }
        }
      })
    })

    it('will filter the libraries in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
      expect(wrapper.find('tbody').findAll('tr').at(0).html()).toMatch(/1/)
    })
  })

})
