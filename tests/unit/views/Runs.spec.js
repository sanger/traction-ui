import Runs from '@/views/Runs'
import NewRun from '@/views/NewRun'
import { mount, localVue } from '../testHelper'
import VueRouter from 'vue-router'
import RunsJson from '../../data/runs'
import Response from '@/api/Response'

describe('Runs.vue', () => {

  let wrapper, runs

  beforeEach(() => {
    const router = new VueRouter({ routes:
      [{ path: '/newrun', name: 'NewRun', component: NewRun, props: true }]
    })

    wrapper = mount(Runs, { localVue, router })
    runs = wrapper.vm
  })

  it('contains a create new run button', () => {
    expect(wrapper.contains('button')).toBe(true)
  })

  it('will create a run request', () => {
    let request = runs.runRequest
    expect(request.resource).toBeDefined()
  })

  it('#getRuns will get a list of samples', async () => {
    runs.runRequest.execute = jest.fn()
    runs.runRequest.execute.mockResolvedValue(RunsJson)

    let JsonApiResponse = await runs.getRuns()
    let expected = new Response(RunsJson)
    expect(JsonApiResponse).toEqual(expected.deserialize.runs)
  })

  describe('#createNewRun', () => {

    beforeEach(() => {
      runs.runRequest.execute = jest.fn()
    })

    it('success', async () => {
      let mockResponse = {status: 201, data: { data: [{id: 1, type: "runs", attributes: {state: 'pending', 'chip-barcode': null }}]}}
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

      let fn = runs.createNewRun()
      await expect(fn).rejects.toMatch("state state error message 1")
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

  it('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

})
