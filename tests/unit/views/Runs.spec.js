import Runs from '@/views/Runs'
import { mount, localVue } from '../testHelper'
import VueRouter from 'vue-router'
import RunsJson from '../../data/runs'
import Response from '@/api/Response'

describe('Runs.vue', () => {

  let wrapper, data, runs

  beforeEach(() => {
    const router = new VueRouter()
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

  it('will get a list of samples', async () => {
    runs.runRequest.execute = jest.fn()
    runs.runRequest.execute.mockResolvedValue(RunsJson)

    let JsonApiResponse = await runs.getRuns()
    let expected = new Response(RunsJson)
    expect(JsonApiResponse).toEqual(expected.deserialize.runs)
  })

  it('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

})
