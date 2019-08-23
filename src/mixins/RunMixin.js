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
    async handleUpdate (id, attributes) {
      try {
        await this.updateRun(id, attributes)
      } catch (err) {
        this.message = 'Failed to update Run: ' + err
        this.showAlert()
      }
    },
    updateName (id, name) {
      this.handleUpdate(id, {name: name})
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
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
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
