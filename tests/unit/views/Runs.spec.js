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

  it('contains a create new run button', () => {
    expect(wrapper.contains('button')).toBe(true)
  })

  it('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
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
      expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/TRAC-456/)
    })
  })

  describe('complete button', () => {
    let button

    it.skip('is disabled is the run state is completed', () => {
      runs.state = 'completed'
      button = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(4).find('#completeRun')
      console.log(button.attributes())
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it.skip('is disabled is the run state is cancelled', () => {
      runs.state = 'cancelled'
      button = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(4).find('#completeRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it.skip('is is enabled when the run state is pending or started', () => {
      button = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(4).find('#completeRun')
      expect(button.attributes('disabled')).toBeFalsy()
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

    beforeEach(() => {
      let mockRuns = new Response(RunsJson).deserialize.runs
      wrapper.setData({items: mockRuns})
    })

    it.skip('is disabled is the run state is completed', () => {
      runs.state = 'completed'
      button = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(4).find('#completeRun')
      console.log(button.attributes())
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it.skip('is disabled is the run state is cancelled', () => {
      runs.state = 'cancelled'
      button = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(4).find('#completeRun')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it.skip('is is enabled when the run state is pending or started', () => {
      button = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(4).find('#completeRun')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('on click cancelRun is called', () => {
      runs.cancelRun = jest.fn()

      button = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(4).find('#cancelRun')
      button.trigger('click')

      let runId = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(0).text()
      expect(runs.cancelRun).toBeCalledWith(runId)
    })
  })

})
