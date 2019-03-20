import Runs from '@/views/Runs'
import NewRun from '@/views/NewRun'
import { mount, localVue } from '../testHelper'
import VueRouter from 'vue-router'
import RunsJson from '../../data/runs'
import Response from '@/api/Response'
import Alert from '@/components/Alert'

describe('Runs.vue', () => {

  let wrapper, runs

  beforeEach(() => {
    const router = new VueRouter({ routes:
      [{ path: '/newrun', name: 'NewRun', component: NewRun, props: true }]
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

  describe('#createNewRun', () => {

    beforeEach(() => {
      runs.runRequest.execute = jest.fn()
    })

    it('success', async () => {
      let mockResponse = {status: 201, data: { data: [{id: 1, type: "runs", attributes: {state: 'pending', 'chip_barcode': null }}]}}
      runs.runRequest.execute.mockResolvedValue(mockResponse)

      await runs.createNewRun()
      expect(wrapper.vm.$route.name).toBe('NewRun')
    })

    it('failure', async () => {
      let mockResponse = {
        data: {
          errors: {
            state: ['state error message 1']
          }
        },
        status: 422,
        statusText: "Unprocessible entity"
      }

      runs.runRequest.execute.mockResolvedValue(mockResponse)

      await runs.createNewRun()
      expect(runs.message).toEqual("state state error message 1")
    })
  })

  describe('#editRun', () => {
    it('routes to the NewRun view', () => {
      let existingRunItem = {id: 1}
      runs.editRun(existingRunItem)
      expect(wrapper.vm.$route.name).toBe('NewRun')
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


})
