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
    // getRun (id) {
    //   return this.$store.getters.run(id)
    // },
    async handleUpdate (id, attributes) {
      try {
        await this.updateRun(id, attributes)
      } catch (err) {
        this.message = 'Failed to update Run: ' + err
        this.showAlert()
      }
    },
    // updateName (id, name) {
    //   this.handleUpdate(id, {name: name})
    // },
    // async buildRun() {
    //   let run = Run.build()
    //   this.$store.commit('addRun', run)
    //   let runId = run.id
    //   this.$router.push({ path: `/run/${runId}` })
    // },
    async showRun(id) {
      this.$router.push({ path: `/run/${id}` })
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
