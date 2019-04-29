import Api from '@/mixins/Api'
import handlePromise from '@/api/PromiseHelper'

export default {
  name: 'RunMixin',
  mixins: [Api],
  data () {
    return {
      message: ''
    }
  },
  methods: {
    async getRun (id) {
      let promise = this.runsRequest.find(id)
      let response = await handlePromise(promise)

      if (response.successful) {
        return response.deserialize.runs[0]
      } else {
        this.message = 'There was an error'
        return { state: null, chip: null }
      }
    },
    async getRuns () {
      let promise = this.runsRequest.get()
      let response = await handlePromise(promise)

      if (response.successful) {
        return response.deserialize.runs
      } else {
        this.message = response.errors.message
        this.showAlert()
        return []
      }
    },
    async handleUpdate (id, attributes) {
      try {
        this.updateRun(id, attributes)
      } catch (err) {
        this.message = err
        this.showAlert()
      }
    },
    async updateRun (id, attributes) {
      let promises = this.runsRequest.update(this.payload(id, attributes))
      let response = await handlePromise(promises[0])

      if (response.successful) {
        this.message = 'Run updated'
        this.showAlert()
      } else {
        throw 'There was an error'
      }
    },
    updateName (id, name) {
      this.handleUpdate(id, {name: name})
    },
    startRun(id) {
      this.handleUpdate(id, {state: 'started'})
    },
    completeRun (id) {
      this.handleUpdate(id, {state: 'completed'})
    },
    cancelRun (id) {
      this.handleUpdate(id, {state: 'cancelled'})
    },
    async createRun () {
      let promise = this.runsRequest.create(this.createPayload)
      return await handlePromise(promise)
    },
    async showRun(id) {
      let runId
      if (id === undefined) {
        let response = await this.createRun()
        if (response.successful) {
          runId = response.deserialize.runs[0].id
        } else {
          this.message = 'There was an error'
          return
        }
      } else {
        runId = id
      }
      this.$router.push({ path: `/run/${runId}` })
    },
    payload (id, attributes) {
      return {
        data: {
          id: id,
          type: 'runs',
          attributes: attributes
        }
      }
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  },
  computed: {
    runsRequest () {
      return this.api.traction.runs
    },
    createPayload () {
      return {
        data: {
          type: 'runs',
          attributes: {
            runs: [ { } ]
          }
        }
      }
    }
  }
}
