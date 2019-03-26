import Run from '@/views/Run'
import Runs from '@/views/Runs'
import { mount, localVue, store } from '../testHelper'
import RunWithLibraryJson from '../../data/runWithLibrary'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'

describe('Run.vue', () => {

  let wrapper, run, props, input, button, router

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
      expect(id).toEqual(`ID: ${run.id}`)
    })

    it('shows the current state of the run', () => {
      let state = wrapper.find('#state').text()
      expect(state).toMatch(`state: ${run.state}`)
    })
  })

  describe('setting the data', () => {

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

  it('#payload', () => {
    let data = run.payload({nick: 'nack'}).data
    expect(data.id).toEqual(run.id)
    expect(data.attributes).toEqual({nick: 'nack'})
  })

  describe('#getRun', () => {

    beforeEach(() => {
      run.runsRequest.find = jest.fn()
    })

    it('successfully', async () => {
      run.runsRequest.find.mockResolvedValue(RunWithLibraryJson)
      let foundRun = await run.getRun(1)
      let expectedRun = new Response(RunWithLibraryJson).deserialize.runs[0]
      expect(run.runsRequest.find).toBeCalledWith(1)
      expect(foundRun).toEqual(expectedRun)
    })

    it('unsuccessfully', async () => {
      let failedResponse = { 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }
      run.runsRequest.find.mockReturnValue(failedResponse)
      await run.getRun(1)
      expect(run.message).toEqual('There was an error')
    })
  })

  describe('#updateRun', () => {

    beforeEach(() => {
      run.runsRequest.update = jest.fn()
    })

    it('successfully', async () => {
      let successfulResponse = [{ 'data': {}, 'status': 200, 'statusText': 'Success'}]
      run.runsRequest.update.mockResolvedValue(successfulResponse)
      await run.updateRun({dib: 'dab'})
      expect(run.runsRequest.update).toBeCalledWith(run.payload({dib: 'dab'}))
      expect(run.message).toEqual('Run updated')
    })

    it('unsuccessfully', async () => {
      let failedResponse = [{ 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }]
      run.runsRequest.update.mockReturnValue(failedResponse)
      await run.updateRun({dib: 'dab'})
      expect(run.message).toEqual('There was an error')
    })

  })

  describe('updateName', () => {
    it('allows the user to update the name', () => {
      input = wrapper.find('#name')
      input.setValue('runaway')
      expect(run.name).toEqual('runaway')
    })
  })

  describe('modifying the run', () => {
    beforeEach(() => {
      run.updateRun = jest.fn()
    })

    it('changing the name', async() => {
      input = wrapper.find('#name')
      input.setValue('runaway')
      input.trigger('change')
      expect(run.updateRun).toBeCalledWith({name: 'runaway'})
    })

    it('setting the state to started', () => {
      input = wrapper.find('#startRun')
      input.trigger('click')
      expect(run.updateRun).toBeCalledWith({state: 'started'})
    })

    it('setting the state to completed', () => {
      input = wrapper.find('#completeRun')
      input.trigger('click')
      expect(run.updateRun).toBeCalledWith({state: 'completed'})
    })

    it('setting the state to cancelled', () => {
      input = wrapper.find('#cancelRun')
      input.trigger('click')
      expect(run.updateRun).toBeCalledWith({state: 'cancelled'})
    })
  })

  describe('start button', () => {

    it('is disabled is the run state is not pending', () => {
      run.state = 'started'
      button = wrapper.find('#startRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is enabled when the run state is pending', () => {
      button = wrapper.find('#startRun')
      expect(button.attributes('disabled')).toBeFalsy()
    })
  })

  describe('complete button', () => {

    it('is disabled is the run state is completed', () => {
      run.state = 'completed'
      button = wrapper.find('#completeRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', () => {
      run.state = 'cancelled'
      button = wrapper.find('#completeRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is is enabled when the run state is pending or started', () => {
      button = wrapper.find('#completeRun')
      expect(button.attributes('disabled')).toBeFalsy()
    })
  })

  describe('cancel button', () => {

    it('is disabled is the run state is completed', () => {
      run.state = 'completed'
      button = wrapper.find('#cancelRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', () => {
      run.state = 'cancelled'
      button = wrapper.find('#cancelRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is is enabled when the run state is pending or started', () => {
      run.state = 'pending'
      button = wrapper.find('#cancelRun')
      expect(button.attributes('disabled')).toBeFalsy()
    })
  })

  describe('#runsRequest', () => {
    it('will have a request', () => {
      expect(run.runsRequest).toBeDefined()
    })
  })
})
