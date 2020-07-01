<template>
  <div class="run">
    <alert ref='alert'></alert>

    <router-link :to="{name: 'SaphyrRuns'}">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

    <b-button v-if="newRecord" class="float-right" id="create" variant="success" @click="create">Create</b-button>
    <b-button v-if="!newRecord" class="float-right" id="update" variant="primary" @click="update">Update</b-button>

    <h1 class="runInfo" id="id">Run ID: {{ this.currentRun.id }}</h1>
    <h2 class="runInfo" id="state">State: {{ this.currentRun.state }}</h2>

    <b-form-input :value="runName" @change="setRunName" class="runInfo" id="name" placeholder="name" type="text"/>

    <chip v-bind:chip="this.currentRun.chip" @alert="showAlert"></chip>

  </div>
</template>

<script>
import Chip from '@/components/saphyr/SaphyrChip'
import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions, mapState, mapMutations } = createNamespacedHelpers('traction/saphyr/runs')

export default {
  name: 'SaphyrRun',
  mixins: [Helper],
  props: {
    id: {
      type: [String, Number]
    }
  },
  data () {
    return {
      newRecord: isNaN(this.id)
    }
  },
  methods: {
    async create () {
      try {
        await this.createRun()
        this.redirectToRuns()
      } catch (err) {
        this.showAlert('Failed to create run', 'danger')
      }
    },
    async update () {
      try {
        await this.updateRun()
        this.redirectToRuns()
      } catch (err) {
        this.showAlert('Failed to update run', 'danger')
      }
    },
    ...mapActions([
      'createRun',
      'updateRun',
      'editRun',
      'newRun',
    ]),
    ...mapMutations([
      'setRunName'
    ]),
    redirectToRuns() {
      this.$router.push({ name: 'SaphyrRuns' })
    },
    async provider() {
      if (this.id === "new") {
        this.newRun()
      } else if (!this.newRecord){
        await this.editRun(parseInt(this.$route.params.id))
      } else {
        this.$router.push({ name: '404' })
      }
    }
  },
  components: {
    Chip,
    Alert
  },
  computed: {
    ...mapGetters([
      'currentRun'
    ]),
    ...mapState({
      currentRun: state => state.currentRun,
      runName: state => state.currentRun.name
    })
  },
  created() {
    this.provider()
  }
}
</script>

<style>

.runInfo {
  text-align: left;
  margin-top: 5px;
}

button {
  margin-right: 2px;
  margin-left: 2px;
}

/* .run_row {
  border: 1px solid #42b983;
  padding-top: .75rem;
  padding-bottom: .75rem;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 0px;
  margin-left: 0px;
} */

</style>
