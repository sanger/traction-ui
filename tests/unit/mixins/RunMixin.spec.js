import RunMixin from '@/mixins/RunMixin'
import { mount, localVue, store } from '../testHelper'
import RunWithLibraryJson from '../../data/runWithLibrary'
import RunsJson from '../../data/runs'
import RunJson from '../../data/runWithLibrary'
import Response from '@/api/Response'
import VueRouter from 'vue-router'
import Run from '@/views/Run'

const Cmp = {
  template: '<div class="testRunMixin"></div>',
  name: 'testRunMixin',
  mixins: [RunMixin],
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

  let wrapper, cmp, runId, attributes

  beforeEach(() => {
    let router = new VueRouter({ routes:
      [
        { path: '/run/:id', component: Run, props: true } ]
    })

    wrapper = mount(Cmp, { store, router, localVue })
    cmp = wrapper.vm
    runId = 1
    attributes = {foo: 'bar'}
  })

  describe('#payload', () => {
    it('returns an object with the given id and attributes', () => {
      let data = cmp.payload(runId, attributes).data
      expect(data.id).toEqual(runId)
      expect(data.attributes).toEqual({foo: 'bar'})
    })
  })

  describe('#getRun', () => {

    beforeEach(() => {
      cmp.runsRequest.find = jest.fn()
    })

    it('successfully', async () => {
      cmp.runsRequest.find.mockResolvedValue(RunWithLibraryJson)
      let foundRun = await cmp.getRun(runId)
      let expectedRun = new Response(RunWithLibraryJson).deserialize.runs[0]
      expect(cmp.runsRequest.find).toBeCalledWith(runId)
      expect(foundRun).toEqual(expectedRun)
    })

    it('unsuccessfully', async () => {
      let failedResponse = { 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }
      cmp.runsRequest.find.mockReturnValue(failedResponse)
      let foundRun = await cmp.getRun(runId)
      expect(foundRun).toEqual({ state: null, chip: null })
      expect(cmp.message).toEqual('There was an error')
    })
  })

  describe('#getRuns', () => {

    beforeEach(() => {
      cmp.runsRequest.get = jest.fn()
    })

    it('successfully', async () => {
      cmp.runsRequest.get.mockResolvedValue(RunsJson)
      let foundRuns = await cmp.getRuns()
      let expectedRuns = new Response(RunsJson).deserialize.runs
      expect(cmp.runsRequest.get).toBeCalled()
      expect(foundRuns).toEqual(expectedRuns)
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
    })
  })

  describe('#updateRun', () => {

    beforeEach(() => {
      cmp.runsRequest.update = jest.fn()
    })

    it('successfully', async () => {
      let successfulResponse = [{ 'data': {}, 'status': 200, 'statusText': 'Success'}]
      cmp.runsRequest.update.mockResolvedValue(successfulResponse)

      await cmp.updateRun(runId, attributes)

      let payload = cmp.payload(runId, attributes)
      expect(cmp.runsRequest.update).toBeCalledWith(payload)
      expect(cmp.message).toEqual('Run updated')
    })

    it('unsuccessfully', async () => {
      let failedResponse = [{ 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }]
      cmp.runsRequest.update.mockReturnValue(failedResponse)
      await cmp.updateRun(runId, attributes)
      expect(cmp.message).toEqual('There was an error')
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

  describe('#createRun', () => {

    beforeEach(() => {
      cmp.runsRequest.create = jest.fn()
    })

    it('successfully', async () => {
      let mockResponse = {status: 201, data: { data: [{id: 1, type: "runs" }]}}
      cmp.runsRequest.create.mockResolvedValue(mockResponse)

      let response = await cmp.createRun()
      expect(cmp.runsRequest.create).toBeCalledWith(cmp.createPayload)
      expect(response).toEqual(new Response(mockResponse))
    })

    it('unsuccessfully', async () => {
      let failedResponse = { 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }
      cmp.runsRequest.create.mockReturnValue(failedResponse)
      let response = await cmp.createRun()
      expect(cmp.runsRequest.create).toBeCalledWith(cmp.createPayload)
      expect(response).toEqual(new Response(failedResponse))
    })
  })

  describe('#showRun', () => {

    beforeEach(() => {
      cmp.createRun = jest.fn()
    })

    let mockResponse

    it('with no id will create a run', async () => {
      let mockResponse = new Response(RunJson)
      cmp.createRun.mockResolvedValue(mockResponse)

      await cmp.showRun()

      expect(cmp.createRun).toBeCalled()
      expect(wrapper.vm.$route.path).toBe(`/run/${mockResponse.deserialize.runs[0].id}`)
    })

    it('with an id will redirect to the run', async () => {
      await cmp.showRun(1)
      expect(wrapper.vm.$route.path).toBe('/run/1')
    })

    it('with an error will provide a message', async () => {
      mockResponse = { 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }
      cmp.createRun.mockReturnValue(mockResponse)
      await cmp.showRun()
      expect(cmp.message).toEqual('There was an error')
    })

  })

  describe('#runsRequest', () => {
    it('will have a request', () => {
      expect(cmp.runsRequest).toBeDefined()
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
