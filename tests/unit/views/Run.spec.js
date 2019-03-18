import Run from '@/views/Run'
import { mount, localVue } from '../testHelper'
import flushPromises from 'flush-promises'

describe('Run.vue', () => {

  let wrapper, run, props, input, button

  beforeEach(() => {
    props = { id: 1, name: 'runrunrun', state: 'pending' }
    wrapper = mount(Run, { localVue, propsData: props } )
    run = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Run')
  })

  it('can have an id', () => {
    expect(run.id).toEqual(props.id)
  })

  it('will have a request', () => {
    expect(run.request).toBeDefined()
  })

  it('will have a state', () => {
    expect(run.state).toEqual(props.state)
    expect(run.localState).toEqual(props.state)
  })

  it('shows the current id of the run', () => {
    let id = wrapper.find('#id').text()
    expect(id).toEqual(`ID: ${run.id}`)
  })

  it('shows the current state of the run', () => {
    let state = wrapper.find('#state').text()
    expect(state).toMatch(`state: ${run.state}`)
  })

  it('will have a chip', () => {
    expect(run.chip).toBeDefined()
    expect(wrapper.contains('.chip')).toBeTruthy()
  })

  it('can have an name which will default to the id', () => {
    expect(run.name).toEqual(props.name)

    const { name, ...propsNoName } = props
    wrapper = mount(Run, { localVue, propsData: propsNoName } )
    run = wrapper.vm
    expect(run.localName).toEqual(props.id)
  })

  it('allows the user to update the name', () => {
    input = wrapper.find('#name')
    input.setValue('runaway')
    expect(run.localName).toEqual('runaway')
  })

  it('can have a payload', () => {
    let data = run.payload({nick: 'nack'}).data
    expect(data.id).toEqual(run.id)
    expect(data.attributes).toEqual({nick: 'nack'})
  })

  describe('updating the run', () => {

    beforeEach(() => {
      run.request.update = jest.fn()
    })

    it('successfully', async () => {
      let successfulResponse = [{ 'data': {}, 'status': 200, 'statusText': 'Success'}]
      run.request.update.mockResolvedValue(successfulResponse)
      await run.updateRun({dib: 'dab'})
      expect(run.request.update).toBeCalledWith(run.payload({dib: 'dab'}))
      expect(run.message).toEqual('Run updated')
    })

    it('unsuccessfully', async () => {
      let failedResponse = [{ 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }]
      run.request.update.mockReturnValue(failedResponse)
      await run.updateRun({dib: 'dab'})
      expect(run.message).toEqual('There was an error')
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
      run.localState = 'started'
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
      run.localState = 'completed'
      button = wrapper.find('#completeRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', () => {
      run.localState = 'cancelled'
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
      run.localState = 'completed'
      button = wrapper.find('#cancelRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', () => {
      run.localState = 'cancelled'
      button = wrapper.find('#cancelRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is is enabled when the run state is pending or started', () => {
      run.localState = 'pending'
      button = wrapper.find('#cancelRun')
      expect(button.attributes('disabled')).toBeFalsy()
    })
  })



})
