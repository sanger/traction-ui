import SaphyrRun from '@/views/saphyr/SaphyrRun'
import Runs from '@/views/saphyr/SaphyrRuns'
import { mount, localVue, store, Data, Vuex } from '../../testHelper'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import Alert from '@/components/Alert'

// import RunWithLibraryJson from '../../../data/runWithLibrary'
import tubeWithLibraryJson from '../../../data/tubeWithLibrary'
import successfulDestroyJson from '../../../data/successfulDestroy'
import createRunJson from '../../../data/createRun'
import createChipJson from '../../../data/createChip'
import createFlowcellJson from '../../../data/createFlowcell'


describe('Run.vue', () => {

  let wrapper, mockRun, actions, saphyrRun, router

  router = new VueRouter({ routes:
    [{ path: '/runs', name: 'Runs', component: Runs }]
  })

  beforeEach(() => {
    mockRun =  {
      id: '1',
      name: '',
      state: 'pending',
      chip: {
        barcode: '',
        flowcells: [
          { position: 1, library: { barcode: '' } },
          { position: 2, library: { barcode: '' } }
        ]
      }
    }

    actions = {
      updateRunName: jest.fn()
    }

    let store = new Vuex.Store({
      modules: {
        traction: {
          namespaced: true,
          modules: {
            saphyr: {
              namespaced: true,
              modules: {
                runs: {
                  namespaced: true,
                  state: {
                    currentRun: mockRun,
                    runName: mockRun.name
                  },
                  getters: {
                    currentRun: state => state.currentRun,
                  },
                  actions
                }
              }

            }
          }
        }
      }
    })

    wrapper = mount(SaphyrRun, { localVue, store, router })
    saphyrRun = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Run')
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
  })

  describe('displaying the data', () => {
    it('shows the current id of the run', () => {
      let id = wrapper.find('#id').text()
      expect(id).toEqual(`Run ID: ${mockRun.id}`)
    })

    it('shows the current state of the run', () => {
      let state = wrapper.find('#state').text()
      expect(state).toMatch(`State: ${mockRun.state}`)
    })
  })

  describe('create button', () => {
    it('will only show if the record is new', () => {
      expect(wrapper.find('#create').exists()).toBeFalsy()
    })
  })


  describe('updateName', () => {
    let name

    beforeEach(() => {
      name = 'a new name'
      saphyrRun.showAlert = jest.fn()
    })

    it('successful', async () => {
      let successfulResponse = { 'data': {}, 'status': 200, 'statusText': 'Success' }
      let expectedResponse = new Response(successfulResponse)
      actions.updateRunName.mockReturnValue(expectedResponse)

      await saphyrRun.updateName(name)
      expect(saphyrRun.showAlert).toBeCalledWith('Run name updated', 'success')
    })

    it('unsuccessful', async () => {
      let failedResponse = { 'data': { errors: { run: ['error message'] } }, 'status': 500, 'statusText': 'Internal Server Error' }
      let expectedResponse = new Response(failedResponse)
      actions.updateRunName.mockReturnValue(expectedResponse)

      await saphyrRun.updateName(name)
      expect(saphyrRun.showAlert).toBeCalledWith('There was an error: run error message', 'danger')
    })
  })

  describe('#showAlert', () => {
    it('emits an event with the message', () => {
      saphyrRun.showAlert('show this message', 'success')
      expect(wrapper.find(Alert).text()).toMatch(/show this message/)
    })
  })

  // TODO: we have to mock out parts of the api method which are not relevant.
  // This is a massive code smell. Need to refactor or find a better way to test.
  describe.skip('#create', () => {

    let failedResponse

    beforeEach(() => {
      saphyrRun.api.traction.saphyr.tubes.get = jest.fn()
      saphyrRun.api.traction.saphyr.runs.create = jest.fn()
      saphyrRun.api.traction.saphyr.runs.destroy = jest.fn()
      saphyrRun.api.traction.saphyr.runs.destroy.mockResolvedValue(successfulDestroyJson)
      saphyrRun.api.traction.saphyr.chips.create = jest.fn()
      saphyrRun.api.traction.saphyr.chips.destroy = jest.fn()
      saphyrRun.api.traction.saphyr.chips.destroy.mockResolvedValue(successfulDestroyJson)
      saphyrRun.api.traction.saphyr.flowcells.create = jest.fn()
      failedResponse = { status: 404, statusText: 'Record not found', data: { errors: { title: ['The record identified by 100 could not be found.'] }} }

      let foundRun = new Response(Data.RunWithLibrary).deserialize.runs[0]
      foundRun.id = 'new'
      store.commit('addRun', foundRun)
      wrapper = mount(SaphyrRun, { localVue, router, store, propsData: { id: 'new' } })
      saphyrRun = wrapper.vm
    })

    describe('when the run is valid', () => {

      beforeEach(() => {
        saphyrRun.api.traction.saphyr.runs.create.mockResolvedValue(createRunJson)
        saphyrRun.api.traction.saphyr.chips.create.mockResolvedValue(createChipJson)
        saphyrRun.api.traction.saphyr.tubes.get.mockResolvedValue(tubeWithLibraryJson)
      })

      it('success', async () => {

        saphyrRun.api.traction.saphyr.flowcells.create.mockResolvedValue(createFlowcellJson)

        await saphyrRun.create()
        expect(saphyrRun.message).toEqual('run was successfully created')
      })

      it('failure', async () => {

        saphyrRun.api.traction.saphyr.flowcells.create.mockReturnValue(failedResponse)

        await saphyrRun.create()
        expect(saphyrRun.message).toEqual('run could not be created')

      })

      it('clicking the button', async () => {

        saphyrRun.showAlert = jest.fn()

        saphyrRun.api.traction.saphyr.flowcells.create.mockResolvedValue(createFlowcellJson)

        let button = wrapper.find('#create')
        button.trigger('click')

        // without this no message
        await flushPromises()

        expect(saphyrRun.message).toEqual('run was successfully created')

      })

    })

    describe('when the run is not valid', () => {

      beforeEach(() => {
        saphyrRun.api.traction.saphyr.tubes.get.mockReturnValue(failedResponse)
      })

      it('will not try to create the run', async () => {
        await saphyrRun.create()

        expect(saphyrRun.message.length).not.toEqual(0)
      })

    })
  })

})
