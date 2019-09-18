import Api from '@/mixins/Api'
import handlePromise from '@/api/PromiseHelper'
import * as Run from '@/api/Run'
import truncate from 'lodash-es/truncate'

export default {
  name: 'RunMixin',
  mixins: [Api],
  data () {
    return {
    }
  },
  methods: {
    getRun (id) {
      return this.$store.getters.run(id)
    },
    async getRuns () {
      let promise = this.tractionSaphyrRunsRequest.get()
      let response = await handlePromise(promise)

      if (response.successful) {
        if(response.empty) {
          return []
        }

        let runs = response.deserialize.runs
        this.$store.commit('addRuns', runs)

        runs = runs.map(run => {
          run.chip_barcode = truncate(run.chip_barcode, { length: 40 })

          return run
        })

        return runs
      } else {
        this.showAlert(response.errors.message)

        return []
      }
    },
    async handleUpdate (id, attributes) {
      try {
        await this.updateRun(id, attributes)
      } catch (err) {
        this.showAlert('Failed to update Run: ' + err)
      }
    },
    async updateRun (id, attributes) {
      let promises = this.tractionSaphyrRunsRequest.update(this.payload(id, attributes))
      let response = await handlePromise(promises[0])

      if (response.successful) {
        this.$store.commit('addRun', response.deserialize.runs[0])
        this.showAlert('Run updated')
      } else {
        throw Error(response.errors.message)
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
    async showRun(pipeline, id) {
      let runId, run
      if (id === undefined) {
        run = Run.build()
        this.$store.commit('addRun', run)
        runId = run.id
      } else {
        runId = id
      }
      this.$router.push({ path: `/${pipeline}/run/${runId}` })
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
  },
  computed: {
    tractionSaphyrRunsRequest () {
      return this.api.traction.saphyr.runs
    },
    tractionSaphyrTubeRequest () {
      return this.api.traction.saphyr.tubes
    },
    saphyrRequest () {
      return this.api.traction.saphyr
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
