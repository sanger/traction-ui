import Runs from '@/views/Runs'
import Run from '@/views/Run'
import { mount, localVue, store } from '../testHelper'
import VueRouter from 'vue-router'
import RunsJson from '../../data/runs'
import Response from '@/api/Response'
import Alert from '@/components/Alert'
import flushPromises from 'flush-promises'

describe('Runs.vue', () => {

  let wrapper, runs, router

  beforeEach(() => {
    router = new VueRouter({ routes:
      [
        { path: '/runs', name: 'Runs', component: Runs },
        { path: '/run', name: 'Run', component: Run, props: {id: true} },
        { path: '/run/:id', component: Run, props: true } ]
    })

    wrapper = mount(Runs, { localVue, router, store, methods: { provider () { return } } } )

    let mockRuns = new Response(RunsJson).deserialize.runs
    wrapper.setData({items: mockRuns})

    runs = wrapper.vm
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
  })

  it('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  describe('sorting', () => {
    it('will sort the runs by created at', () => {
      wrapper.setData({items: new Response(RunsJson).deserialize.runs})
      expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/TRAC-234/)
    })
  })

  describe('#provider sets the data', () => {
    it('when runs exists', async () => {
      let mockResponse = new Response(RunsJson).deserialize.runs
      wrapper = mount(Runs, { localVue, router, store, methods: { getRuns() { return mockResponse } } } )
      runs = wrapper.vm

      await flushPromises()
      expect(runs.items).toEqual(mockResponse)
    })

    it('when no runs are returned', async () => {
      let mockResponse = []
      wrapper = mount(Runs, { localVue, router, store, methods: { getRuns () { return mockResponse } } } )
      runs = wrapper.vm
      await flushPromises()
      expect(runs.items).toEqual(mockResponse)
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
      expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/TRAC-123/)
    })
  })

  describe('complete button', () => {
    let button

    it('is is enabled when the run state is pending', () => {
      // run at(0) is in state pending
      button = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(4).find('#completeRun')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is is enabled when the run state is started', () => {
      // run at(1) is in state started
      button = wrapper.find('tbody').findAll('tr').at(1).findAll('td').at(4).find('#completeRun')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is disabled if the run state is completed', () => {
      // run at(2) is in state completed
      button = wrapper.find('tbody').findAll('tr').at(2).findAll('td').at(4).find('#completeRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', () => {
      // run at(3) is in state cancelled
      button = wrapper.find('tbody').findAll('tr').at(3).findAll('td').at(4).find('#completeRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('on click completeRun is called', () => {
      runs.completeRun = jest.fn()

      button = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(4).find('#completeRun')
      button.trigger('click')

      let runId = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(0).text()
      expect(runs.completeRun).toBeCalledWith(runId)
    })
  })

  describe('cancel button', () => {
    let button

    it('is is enabled when the run state is pending', () => {
      // run at(0) is in state pending
      button = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(4).find('#cancelRun')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is is enabled when the run state is started', () => {
      // run at(1) is in state started
      button = wrapper.find('tbody').findAll('tr').at(1).findAll('td').at(4).find('#cancelRun')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is disabled if the run state is completed', () => {
      // run at(2) is in state completed
      button = wrapper.find('tbody').findAll('tr').at(2).findAll('td').at(4).find('#cancelRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', () => {
      // run at(3) is in state cancelled
      button = wrapper.find('tbody').findAll('tr').at(3).findAll('td').at(4).find('#cancelRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('on click completeRun is called', () => {
      runs.cancelRun = jest.fn()

      button = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(4).find('#cancelRun')
      button.trigger('click')

      let runId = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(0).text()
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
})
