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

  describe('#getRuns', () => {

    beforeEach(() => {
      cmp.runsRequest.get = jest.fn()
      cmp.showAlert = jest.fn()
    })

    it('successfully', async () => {
      cmp.runsRequest.get.mockResolvedValue(RunsJson)
      let foundRuns = await cmp.getRuns()
      let expectedRuns = new Response(RunsJson).deserialize.runs
      expect(cmp.runsRequest.get).toBeCalled()
      expect(foundRuns).toEqual(expectedRuns)
      expect(Object.keys(store.getters.runs).length).toEqual(expectedRuns.length)
    })

    it('unsuccessfully', async () => {
      let failedResponse = {
        data: { errors: { runs: ['error message 1'] }},
        status: 422,
        statusText: "Unprocessible entity"
      }

      cmp.runsRequest.get.mockReturnValue(failedResponse)
      let foundRuns = await cmp.getRuns()
      expect(foundRuns).toEqual([])
      expect(cmp.message).toEqual('runs error message 1')
      expect(cmp.showAlert).toBeCalled()
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

  describe('#updateRun', () => {

    beforeEach(() => {
      cmp.runsRequest.update = jest.fn()
      cmp.showAlert = jest.fn()
    })

    it('successfully', async () => {
      let promise = new Promise((resolve) => {
        resolve(RunJson)
      })
      cmp.runsRequest.update.mockReturnValue([promise])

      let run = new Response(RunJson).deserialize.runs[0]

      await cmp.updateRun(runId, attributes)

      let payload = cmp.payload(runId, attributes)
      expect(cmp.runsRequest.update).toBeCalledWith(payload)
      expect(cmp.message).toEqual('Run updated')
      expect(store.getters.run(run.id)).toEqual(run)
    })

    it('unsuccessfully', async () => {
      let failedResponse = [{ data: { errors: { run: ['error message']}},
        status: 500,
        statusText: "Unprocessible entity"
      }]

      cmp.runsRequest.update.mockReturnValue(failedResponse)

      let message
      try {
        await cmp.updateRun(runId, attributes)
      } catch (err) {
        message = err
      }
      expect(message).toEqual('run error message')
    })
  })

  describe('Updating the run using #updateRun', () => {
    beforeEach(() => {
      cmp.updateRun = jest.fn()
    })

    describe('#updateName', () => {
      it('calls updateRun with the given arguments', async () => {
        let name = "aname"
        await cmp.updateName(runId, name)
        expect(cmp.updateRun).toBeCalledWith(runId, {name: name})
      })
    })

    describe('#startRun', () => {
      it('calls updateRun with the given arguments', async () => {
        await cmp.startRun(runId)
        expect(cmp.updateRun).toBeCalledWith(runId, {state: 'started'})
      })
    })

    describe('#completeRun', () => {
      it('calls updateRun with the given arguments', async () => {
        await cmp.completeRun(runId)
        expect(cmp.updateRun).toBeCalledWith(runId, {state: 'completed'})
      })
    })

    describe('#cancelRun', () => {
      it('calls updateRun with the given arguments', async () => {
        await cmp.cancelRun(runId)
        expect(cmp.updateRun).toBeCalledWith(runId, {state: 'cancelled'})
      })
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

  describe('#payload', () => {
    it('returns an object with the given id and attributes', () => {
      let data = cmp.payload(runId, attributes).data
      expect(data.id).toEqual(runId)
      expect(data.attributes).toEqual({foo: 'bar'})
    })
  })

  describe('#runsRequest', () => {
    it('will have a runsRequest', () => {
      expect(cmp.runsRequest).toBeDefined()
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
