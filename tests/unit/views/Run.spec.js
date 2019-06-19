import Run from '@/views/Run'
import Runs from '@/views/Runs'
import { mount, localVue, store } from '../testHelper'
import RunWithLibraryJson from '../../data/runWithLibrary'
import tubeWithLibraryJson from '../../data/tubeWithLibrary'
import successfulDestroyJson from '../../data/successfulDestroy'
import createRunJson from '../../data/createRun'
import createChipJson from '../../data/createChip'
import createFlowcellJson from '../../data/createFlowcell'
import RunsJson from '../../data/runs'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import Alert from '@/components/Alert'
import * as RunApi from '@/api/Run'

describe('Run.vue', () => {

  let wrapper, run, props, input, router, runs, foundRun, runId

  beforeAll(() => {
    runs = new Response(RunsJson).deserialize.runs
    store.commit('addRuns', runs)
  })

  beforeEach(() => {
    runId = runs[0].id
    props = { id: runId }
    router = new VueRouter({ routes:
      [{ path: '/runs', name: 'Runs', component: Runs }]
    })
    wrapper = mount(Run, { localVue, router, store, propsData: props }  )
    wrapper.setData({name: 'runrunrun', state: 'pending', chip: {}})
    run = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Run')
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
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

  describe('create button', () => {
    it('will only show if the record is new', () => {
      expect(wrapper.find('#create').exists()).toBeFalsy()
    })
  })

  describe('#provider sets the data', () => {

    beforeEach(() => {
    })

    it('existing run', () => {
      foundRun = runs[0]

      wrapper = mount(Run, { localVue, router, store, propsData: props })
      run = wrapper.vm
      expect(run.state).toEqual(foundRun.state)
      expect(run.chip).toEqual(foundRun.chip)
    })

    it('new run', async () => {
      foundRun = RunApi.build()
      store.commit('addRun', foundRun)

      wrapper = mount(Run, { localVue, router, store, propsData: {id: foundRun.id} } )
      run = wrapper.vm
      expect(run.state).toEqual(foundRun.state)
      expect(run.chip).toEqual(foundRun.chip)
    })
  })

  describe('name input', () => {
  
    it('updates the name v-model', () => {

      let name = 'runaway'
      input = wrapper.find('#name')
      input.setValue(name)
      expect(run.name).toEqual(name)

      input.trigger('change')
      expect(store.getters.run(runId).name).toEqual(name)
    })
  })

  describe('update', () => {

    let name

    beforeEach(() => {
      run.updateName = jest.fn()
      name = 'runaway'
    })

    it('if it is a new run', () => {
      let newRun = RunApi.build()
      wrapper.setProps({id: newRun.id})
      run.name = name
      run.update()
      expect(store.getters.run(newRun.id).name).toEqual(name)
      expect(run.updateName).not.toBeCalled()
    })

    it('if it is an existing run', () => {
      run.name = name
      run.update()
      expect(store.getters.run(runId).name).toEqual(name)
      expect(run.updateName).toBeCalled()
    })
  })

  describe('#runsRequest', () => {
    it('will have a request', () => {
      expect(run.runsRequest).toBeDefined()
    })
  })

  describe('#alert', () => {
    beforeEach(() => {
      run.showAlert = jest.fn()
    })

    it('emits an event with the message', () => {
      run.alert('emit this message')
      expect(run.showAlert).toBeCalled()
    })
  })

  describe('#showAlert', () => {
    beforeEach(() => {
      run.message = 'show this message'
    })

    it('emits an event with the message', () => {
      run.showAlert()
      expect(wrapper.find(Alert).text()).toMatch(/show this message/)
    })
  })

  // TODO: we have to mock out parts of the api method which are not relevant.
  // This is a massive code smell. Need to refactor or find a better way to test.
  describe('#create', () => {

    let failedResponse

    beforeEach(() => {
      run.api.traction.tubes.get = jest.fn()
      run.api.traction.runs.create = jest.fn()
      run.api.traction.runs.destroy = jest.fn()
      run.api.traction.runs.destroy.mockResolvedValue(successfulDestroyJson)
      run.api.traction.chips.create = jest.fn()
      run.api.traction.chips.destroy = jest.fn()
      run.api.traction.chips.destroy.mockResolvedValue(successfulDestroyJson)
      run.api.traction.flowcells.create = jest.fn()
      failedResponse = { status: 404, statusText: 'Record not found', data: { errors: { title: ['The record identified by 100 could not be found.'] }} }

      foundRun = new Response(RunWithLibraryJson).deserialize.runs[0]
      foundRun.id = 'new'
      store.commit('addRun', foundRun)
      wrapper = mount(Run, { localVue, router, store, propsData: { id: 'new' } })
      run = wrapper.vm
  
    })

    describe('when the run is valid', () => {

      beforeEach(() => {
       
        run.api.traction.runs.create.mockResolvedValue(createRunJson)
        run.api.traction.chips.create.mockResolvedValue(createChipJson)
        run.api.traction.tubes.get.mockResolvedValue(tubeWithLibraryJson)
      })

      it('success', async () => {

        run.api.traction.flowcells.create.mockResolvedValue(createFlowcellJson)

        await run.create()
        expect(run.message).toEqual('run was successfully created')
      })

      it('failure', async () => {

        run.api.traction.flowcells.create.mockReturnValue(failedResponse)

        await run.create()
        expect(run.message).toEqual('run could not be created')

      })

      it('clicking the button', async () => {

        run.showAlert = jest.fn()

        run.api.traction.flowcells.create.mockResolvedValue(createFlowcellJson)

        let button = wrapper.find('#create')
        button.trigger('click')

        // without this no message
        await flushPromises()

        expect(run.message).toEqual('run was successfully created')

      })

    })

    describe('when the run is not valid', () => {

      beforeEach(() => {
        run.api.traction.tubes.get.mockReturnValue(failedResponse)
      })

      it('will not try to create the run', async () => {
        await run.create()

        expect(run.message.length).not.toEqual(0)
      })

    })
  })

})
