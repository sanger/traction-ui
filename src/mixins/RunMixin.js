import Api from '@/mixins/Api'
import handlePromise from '@/api/PromiseHelper'
import * as Run from '@/api/Run'

export default {
  name: 'RunMixin',
  mixins: [Api],
  data () {
    return {
      message: ''
    }
  },
  methods: {
    getRun (id) {
      return this.$store.getters.run(id)
    },
    async getRuns () {
      let promise = this.runsRequest.get()
      let response = await handlePromise(promise)

      if (response.successful) {
        let runs = response.deserialize.runs
        this.$store.commit('addRuns', runs)
        return runs
      } else {
        this.message = response.errors.message
        this.showAlert()
        return []
      }
    },
    async handleUpdate (id, attributes) {
      try {
        await this.updateRun(id, attributes)
      } catch (err) {
        this.message = 'Failed to update Run: ' + err
        this.showAlert()
      }
    },
    async updateRun (id, attributes) {
      let promises = this.runsRequest.update(this.payload(id, attributes))
      let response = await handlePromise(promises[0])

      if (response.successful) {
        this.message = 'Run updated'
        this.$store.commit('addRun', response.deserialize.runs[0])
        this.showAlert()
      } else {
        throw response.errors.message
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
    async showRun(id) {
      let runId, run
      if (id === undefined) {
        run = Run.build()
        this.$store.commit('addRun', run)
        runId = run.id
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
      return this.api.traction.saphyr.runs
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
