import Run from '@/views/Run'
import Runs from '@/views/Runs'
import { mount, localVue, store } from '../testHelper'
import RunWithLibraryJson from '../../data/runWithLibrary'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'

describe('Run.vue', () => {

  let wrapper, run, props, input, router

  beforeEach(() => {
    props = { id: 1 }
    router = new VueRouter({ routes:
      [{ path: '/runs', name: 'Runs', component: Runs }]
    })
    wrapper = mount(Run, { localVue, router, store, propsData: props, methods: { provider () { return } } } )
    wrapper.setData({name: 'runrunrun', state: 'pending', chip: {}})
    run = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Run')
  })

  describe('props', () => {
    it('can have an id', () => {
      expect(run.id).toEqual(props.id)
    })
  })

  describe('data', () => {
    it('can have an name', () => {
      expect(run.name).toEqual('runrunrun')
    })

    it('will have a state', () => {
      expect(run.state).toEqual('pending')
    })

    it('will have a chip', () => {
      expect(run.chip).toBeDefined()
      expect(wrapper.contains('.chip')).toBeTruthy()
    })
  })

  describe('displaying the data', () => {
    it('shows the current id of the run', () => {
      let id = wrapper.find('#id').text()
      expect(id).toEqual(`Run ID: ${run.id}`)
    })

    it('shows the current state of the run', () => {
      let state = wrapper.find('#state').text()
      expect(state).toMatch(`state: ${run.state}`)
    })
  })

  describe('#provider sets the data', () => {

    let mockResponse

    beforeEach(() => {
    })

    it('when the run exists', async () => {
      mockResponse = new Response(RunWithLibraryJson).deserialize.runs[0]
      wrapper = mount(Run, { localVue, router, propsData: props, methods: { getRun () { return mockResponse } } } )
      run = wrapper.vm
      await flushPromises()
      expect(run.state).toEqual(mockResponse.state)
      expect(run.chip).toEqual(mockResponse.chip)
    })

    it('when no run is returned', async () => {
      mockResponse = { state: null, chip: null }
      wrapper = mount(Run, { localVue, router, propsData: props, methods: { getRun () { return mockResponse } } } )
      run = wrapper.vm
      await flushPromises()
      expect(run.state).toBeNull()
      expect(run.chip).toBeNull()
    })
  })

  describe('name input', () => {
    beforeEach(() => {
      run.updateName = jest.fn()
    })

    it('updates the name v-model', () => {
      input = wrapper.find('#name')
      input.setValue('runaway')
      expect(run.name).toEqual('runaway')

      input.trigger('change')
      expect(run.updateName).toBeCalledWith(run.id, 'runaway')
    })
  })

  describe('#runsRequest', () => {
    it('will have a request', () => {
      expect(run.runsRequest).toBeDefined()
    })
  })
})
