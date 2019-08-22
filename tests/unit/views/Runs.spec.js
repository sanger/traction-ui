import Runs from '@/views/Runs'
import Run from '@/views/Run'
import { mount, localVue } from '../testHelper'
import VueRouter from 'vue-router'
import RunsJson from '../../data/runs'
import Response from '@/api/Response'
import Alert from '@/components/Alert'
import Vuex from 'vuex'

describe('Runs.vue', () => {

  // router = new VueRouter({ routes:
  //   [
  //     { path: '/runs', name: 'Runs', component: Runs },
  //     { path: '/run', name: 'Run', component: Run, props: {id: true} },
  //     { path: '/run/:id', component: Run, props: true } ]
  // })
  //
  // wrapper = mount(Runs, { localVue, router, store, methods: { provider () { return } } } )

  let store, wrapper, runs, mockRuns

  beforeEach(() => {
    localVue.use(Vuex)

    mockRuns = new Response(RunsJson).deserialize.runs

    store = new Vuex.Store({
      modules: {
        traction: {
          namespaced: true,
          modules: {
            saphyr: {
              namespaced: true,
              state: {
                runs: mockRuns
              },
              actions: {
                getRuns: jest.fn()
              }
            }
          }
        }
      }
    })

    wrapper = mount(Runs, { store, localVue })
    runs = wrapper.vm
  })


  describe('created hook', () => {
    it('sets the runs data', () => {
      expect(runs.$store.state.traction.saphyr.runs).toEqual(mockRuns)
    })
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
  })

  it('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('contains a table with run data', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(mockRuns.length)
  })

  describe('sorting', () => {
    it('will sort the runs by created at', () => {
      expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/TRAC-456/)
    })
  })

  describe('filtering runs', () => {

    beforeEach(() => {
      wrapper = mount(Runs, { store,
        localVue,
        data() {
          return {
            filter: mockRuns[0].chip_barcode
          }
        }
      })
    })

    it('will filter the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/TRAC-123/)
    })
  })

  describe('start button', () => {
    let button

    it('is enabled when the run state is pending', () => {
      // run at(3) is in state pending
      button = wrapper.find('#startRun-1')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is disabled is the run state is not pending', () => {
      // run at(2) is in state started
      button = wrapper.find('#startRun-2')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('on click startRun is called', () => {
      // run at(3) is in state pending
      runs.startRun = jest.fn()

      button = wrapper.find('#startRun-1')
      button.trigger('click')

      let runId = wrapper.find('tbody').findAll('tr').at(3).findAll('td').at(0).text()
      expect(runs.startRun).toBeCalledWith(runId)
    })
  })

  describe('complete button', () => {
    let button

    it('is is enabled when the run state is pending', () => {
      // run at(3) is in state pending
      button = wrapper.find('#completeRun-1')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is is enabled when the run state is started', () => {
      // run at(2) is in state started
      button = wrapper.find('#completeRun-2')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is disabled if the run state is completed', () => {
      // run at(1) is in state completed
      button = wrapper.find('#completeRun-3')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', () => {
      // run at(0) is in state cancelled
      button = wrapper.find('#completeRun-4')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('on click completeRun is called', () => {
      // run at(2) is in state started
      runs.completeRun = jest.fn()

      button = wrapper.find('#completeRun-2')
      button.trigger('click')

      let runId = wrapper.find('tbody').findAll('tr').at(2).findAll('td').at(0).text()
      expect(runs.completeRun).toBeCalledWith(runId)
    })
  })

  describe('cancel button', () => {
    let button

    it('is is enabled when the run state is pending', () => {
      // run at(3) is in state pending
      button = wrapper.find('#cancelRun-1')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is is enabled when the run state is started', () => {
      // run at(2) is in state started
      button = wrapper.find('#cancelRun-2')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is disabled if the run state is completed', () => {
      // run at(1) is in state completed
      button = wrapper.find('#cancelRun-3')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', () => {
      // run at(0) is in state cancelled
      button = wrapper.find('#cancelRun-4')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('on click completeRun is called', () => {
      // run at(2) is in state started
      runs.cancelRun = jest.fn()

      button = wrapper.find('#cancelRun-2')
      button.trigger('click')

      let runId = wrapper.find('tbody').findAll('tr').at(2).findAll('td').at(0).text()
      expect(runs.cancelRun).toBeCalledWith(runId)
    })
  })

  describe('new run button', () => {

    it('contains a create new run button', () => {
      expect(wrapper.contains('button')).toBe(true)
    })

    it('will redirect to the run when newRun is clicked', async () => {
      runs.showRun = jest.fn()
      let button = wrapper.find('#newRun')
      button.trigger('click')
      expect(runs.showRun).toBeCalled()
    })
  })

  describe('#showAlert', () => {
    beforeEach(() => {
      runs.message = 'show this message'
    })

    it('emits an event with the message', () => {
      runs.showAlert()
      expect(wrapper.find(Alert).text()).toMatch(/show this message/)
    })
  })

  describe ('pagination', () => {

    beforeEach(() => {
      wrapper = mount(Runs, { store,
        localVue,
        data() {
          return {
            items: mockRuns,
            perPage: 2,
            currentPage: 1
          }
        }
      })
    })

    it('will paginate the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })

  })

})
