import Runs from '@/views/Runs'
import Run from '@/views/Run'
import { mount, localVue } from '../testHelper'
import VueRouter from 'vue-router'
import RunsJson from '../../data/runs'
import RunJson from '../../data/runWithLibrary'
import Response from '@/api/Response'
import Alert from '@/components/Alert'

describe('Runs.vue', () => {

  let wrapper, runs

  beforeEach(() => {
    const router = new VueRouter({ routes:
      [ { path: '/run', name: 'Run', component: Run, props: true } ]
    })

    wrapper = mount(Runs, { localVue, router })
    runs = wrapper.vm
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
  })

  it('contains a create new run button', () => {
    expect(wrapper.contains('button')).toBe(true)
  })

  it('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('will create a run request', () => {
    let request = runs.runRequest
    expect(request.resource).toBeDefined()
  })

  it('will have a payload', () => {
    let payload = runs.payload.data
    expect(payload.type).toEqual('runs')
    expect(payload.attributes).toBeDefined()
  })

  describe('#getRuns', () => {
    it('will get a list of runs on success',  async () => {
      runs.runRequest.execute = jest.fn()
      runs.runRequest.execute.mockResolvedValue(RunsJson)

      await runs.getRuns()
      let expected = new Response(RunsJson)
      expect(runs.items).toEqual(expected.deserialize.runs)
    })

    it('will return get an empty list on failure',  async () => {
      let mockResponse = {
        data: { errors: { runs: ['error message 1'] }},
        status: 422,
        statusText: "Unprocessible entity"
      }

      runs.runRequest.execute = jest.fn()
      runs.runRequest.execute.mockResolvedValue(mockResponse)

      await runs.getRuns()
      expect(runs.message).toEqual("runs error message 1")
      expect(runs.items).toEqual([])
    })
  })

  describe('create run', () => {
    beforeEach(() => {
      runs.runRequest.create = jest.fn()
    })

    it('success', async () => {
      let mockResponse = {status: 201, data: { data: [{id: 1, type: "runs" }]}}
      runs.runRequest.create.mockResolvedValue(mockResponse)

      let response = await runs.createRun()
      expect(runs.runRequest.create).toBeCalledWith(runs.payload)
      expect(response).toEqual(new Response(mockResponse))
    })

  })

  describe('find run', () => {
    beforeEach(() => {
      runs.runRequest.find = jest.fn()
    })

    it('success', async () => {
      let mockResponse = {status: 200, data: { data: [{id: 1, type: "runs" }]}}
      runs.runRequest.find.mockResolvedValue(mockResponse)

      let response = await runs.findRun(1)
      expect(runs.runRequest.find).toBeCalledWith(1)
      expect(response).toEqual(new Response(mockResponse))
    })
  })

  describe('show run', () => {

    let mockResponse

    it('with no id will create a run', async () => {
      mockResponse = new Response(RunJson)
      runs.createRun = jest.fn()
      runs.createRun.mockResolvedValue(mockResponse)
      await runs.showRun()
      expect(runs.createRun).toBeCalled()
      expect(wrapper.vm.$route.name).toBe('Run')
      expect(wrapper.vm.$route.params).toEqual(mockResponse.deserialize.runs[0])
    })

    it('with an id will find a run', async () => {
      mockResponse = new Response(RunJson)
      runs.findRun = jest.fn()
      runs.findRun.mockResolvedValue(mockResponse)
      await runs.showRun(1)
      expect(runs.findRun).toBeCalledWith(1)
      expect(wrapper.vm.$route.name).toBe('Run')
    })

    it('with an error will provide a message', async () => {
      mockResponse = [{ 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }]
      runs.findRun = jest.fn()
      runs.findRun.mockReturnValue(mockResponse)
      await runs.showRun(1)
      expect(runs.findRun).toBeCalled()
      expect(runs.message).toEqual('There was an error')
    })

  })

  it('will redirect to the run when newRun is clicked', () => {
    runs.runRequest.execute = jest.fn()
    runs.runRequest.execute.mockResolvedValue(RunsJson)
    let mockResponse = new Response(RunJson)
    runs.createRun = jest.fn()
    runs.createRun.mockResolvedValue(mockResponse)
    let button = wrapper.find('#newRun')
    button.trigger('click')
    expect(wrapper.vm.$route.name).toBe('Run')
  })
 
  describe('filtering runs', () => {
    let mockRuns

    beforeEach(() => {
      mockRuns = new Response(RunsJson).deserialize.runs

      wrapper = mount(Runs, { localVue,
        methods: {
          provider() {
            return
          }
        },
        data() {
          return {
            items: mockRuns,
            filter: mockRuns[0].chip_barcode
          }
        }
      })
    })

    it('will filter the libraries in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/TRAC-456/)
    })
  })


})
