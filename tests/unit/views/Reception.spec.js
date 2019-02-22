import Reception from '@/views/Reception'
import Alert from '@/components/Alert'
import { mount, localVue } from '../testHelper'
import flushPromises from 'flush-promises'
import SSRequestsJson from '../../data/ssRequests'
import Response from '@/api/Response'

describe('Reception.vue', () => {

  let wrapper, reception, data

  beforeEach(() => {
    wrapper = mount(Reception, { localVue })
    reception = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Reception')
  })

  it('has a alert', () => {
    expect(wrapper.contains(Alert)).toBe(true)
  })

  it('will create a sample request', () => {
    let request = reception.sampleRequest
    expect(request.resource).toBe('samples')
  })

  it('will create a ss request request', () => {
    let request = reception.ssRequestRequest
    expect(request.resource).toBe('requests')
  })

  it('#getSSRequests will get a list of ss requests', async () => {
    reception.ssRequestRequest.execute = jest.fn()
    reception.ssRequestRequest.execute.mockResolvedValue(SSRequestsJson)

    let JsonApiResponse = await reception.getSSRequests()
    let expected = new Response(SSRequestsJson)
    expect(JsonApiResponse).toEqual(expected.deserialize.requests)
  })

  it('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it.skip('contains the correct data', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(data.body.length)
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
      reception.ssRequestRequest.execute = jest.fn()
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

      reception.ssRequestRequest.execute.mockResolvedValue(mockResponse)

      reception.selected = [{sequencescape_request_id: 1}]
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

      reception.ssRequestRequest.execute.mockReturnValue(mockResponse)
      reception.selected = [{sequencescape_request_id: 1}]
      let fn = reception.updateSequencescapeRequests()
      await expect(fn).rejects.toEqual(["name name error message 1, species species error message 1"])
      await flushPromises()
      expect(reception.message).toEqual(["name name error message 1, species species error message 1"])
    })

  })

  describe('#exportRequests', () =>{

    beforeEach(() => {
      reception.sampleRequest.execute = jest.fn()
      reception.ssRequestRequest.execute = jest.fn()

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
        expect(reception.ssRequestRequest.execute).toBeCalled()

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

        let fn = reception.exportRequests()
        expect(reception.sampleRequest.execute).toBeCalled()
        expect(reception.ssRequestRequest.execute).not.toBeCalled()
      })
    })

  })

  describe('#selectedJSON', () => {
    it('returns the json formatted request', () => {
      let selected = [{
       id: "4",
       samples: [
         {  name: "sample_d",
            sample_metadata:
              { sample_common_name: "human" }
          }
        ]
      }]

      let expected = [{ sequencescape_request_id: '4', name: 'sample_d', species: 'human' }]
      expect(reception.selectedJSON(selected)).toEqual(expected)
    })
  })

})
