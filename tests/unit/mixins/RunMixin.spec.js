import RunMixin from '@/mixins/RunMixin'
import { mount, localVue, store } from '../testHelper'
import RunsJson from '../../data/runs'
import RunJson from '../../data/runWithLibrary'
import Response from '@/api/Response'
import VueRouter from 'vue-router'
import Run from '@/views/Run'

const Cmp = {
  template: '<div class="testRunMixin"></div>',
  name: 'testRunMixin',
  mixins: [RunMixin],
  store,
  props: {
  },
  methods: {
  },
  data () {
    return {
      message: ''
    }
  }
}

describe('RunMixin', () => {

  let wrapper, cmp, runId, attributes, runs

  beforeEach(() => {
    let router = new VueRouter({ routes:
      [
        { path: '/run/:id', component: Run, props: true } ]
    })

    wrapper = mount(Cmp, { store, router, localVue })
    cmp = wrapper.vm
    attributes = {foo: 'bar'}
    runs = new Response(RunsJson).deserialize.runs
    runId = runs[0].id
  })

  describe('#getRun', () => {

    beforeEach(() => {
      store.commit('addRuns', runs)
    })

    it('will retrieve run from store', () => {
      let run = cmp.getRun(runId)
      expect(run).toEqual(runs[0])
    })

  })

  describe('#handleUpdate', () => {
    beforeEach(() => {
      cmp.updateRun = jest.fn()
      cmp.showAlert = jest.fn()
    })

    it('calls updateRun', async () => {
      await cmp.handleUpdate(runId, attributes)
      expect(cmp.updateRun).toBeCalled()
      expect(cmp.showAlert).not.toBeCalled()
    })

    it('calls showAlert when there is an error', async () => {
      cmp.updateRun.mockImplementation(() => {
        throw 'error message'
      })

      await cmp.handleUpdate(runId, attributes)
      expect(cmp.updateRun).toBeCalled()
      expect(cmp.message).toEqual('Failed to update Run: error message')
      expect(cmp.showAlert).toBeCalled()
    })
  })

  describe('#showRun', () => {

    beforeEach(() => {
      cmp.createRun = jest.fn()
      cmp.showAlert = jest.fn()
    })

    it('with no id will build a run and add it to the store', () => {

      cmp.showRun()

      expect(store.getters.run('new')).toBeDefined()
      expect(wrapper.vm.$route.path).toBe(`/run/new`)
    })

    it('with an id will redirect to the run', async () => {
      await cmp.showRun(1)
      expect(wrapper.vm.$route.path).toBe('/run/1')
    })

  })

  describe('#tractionSaphyrRunsRequest', () => {
    it('will have a tractionSaphyrRunsRequest', () => {
      expect(cmp.tractionSaphyrRunsRequest).toBeDefined()
    })
  })

  describe('#tractionSaphyrTubeRequest', () => {
    it('will have a tractionSaphyrTubeRequest', () => {
      expect(cmp.tractionSaphyrTubeRequest).toBeDefined()
    })
  })

  describe('#saphyrRequest', () => {
    it('will have a saphyrRequest', () => {
      expect(cmp.saphyrRequest).toBeDefined()
    })
  })

  describe('#createPayload', () => {
    it('returns an object for a new run', () => {
      let data = cmp.createPayload.data
      expect(data.type).toEqual("runs")
      expect(data.attributes).toEqual({runs: [{}]})
    })
  })
})
