import Runs from '@/views/Runs'
import Run from '@/views/Run'
import { mount, localVue, store } from '../testHelper'
import VueRouter from 'vue-router'
import RunsJson from '../../data/runs'
import RunJson from '../../data/runWithLibrary'
import Response from '@/api/Response'
import Alert from '@/components/Alert'
import flushPromises from 'flush-promises'

describe('Runs.vue', () => {

  let wrapper, runs

  beforeEach(() => {
    const router = new VueRouter({ routes:
      [
        { path: '/runs', name: 'Runs', component: Runs },
        { path: '/run', name: 'Run', component: Run, props: {id: true} },
        { path: '/run/:id', component: Run, props: true } ]
    })

    wrapper = mount(Runs, { localVue, router, store })
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

  it('will sort the runs by created at', () => {
    wrapper.setData({items: new Response(RunsJson).deserialize.runs})
    expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/TRAC-123/)
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

  describe('#createRun', () => {
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

  describe('#showRun', () => {

    let mockResponse

    it('with no id will create a run', async () => {
      mockResponse = new Response(RunJson)
      runs.createRun = jest.fn()
      runs.createRun.mockResolvedValue(mockResponse)
      await runs.showRun()
      expect(runs.createRun).toBeCalled()
      expect(wrapper.vm.$route.path).toBe(`/run/${mockResponse.deserialize.runs[0].id}`)
    })

    it('with an id will redirect to the run', async () => {
      await runs.showRun(1)
      expect(wrapper.vm.$route.path).toBe('/run/1')
    })

    it('with an error will provide a message', async () => {
      mockResponse = [{ 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }]
      runs.createRun = jest.fn()
      runs.createRun.mockReturnValue(mockResponse)
      await runs.showRun()
      expect(runs.message).toEqual('There was an error')
    })

    it('will redirect to the run when newRun is clicked', async () => {
      runs.runRequest.execute = jest.fn()
      runs.runRequest.execute.mockResolvedValue(RunsJson)
      let mockResponse = new Response(RunJson)
      let id = mockResponse.deserialize.runs[0].id
      runs.createRun = jest.fn()
      runs.createRun.mockResolvedValue(mockResponse)
      let button = wrapper.find('#newRun')
      button.trigger('click')
      await flushPromises()
      expect(wrapper.vm.$route.path).toBe(`/run/${id}`)
    })

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

  describe('#runRequest', () => {
    it('will have a request', () => {
      expect(runs.runRequest).toBeDefined()
    })
  })

  it('#payload', () => {
    let payload = runs.payload.data
    expect(payload.type).toEqual('runs')
    expect(payload.attributes).toBeDefined()
  })
})
