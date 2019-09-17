<template>
  <div class="run">
    <alert ref='alert'></alert>

    {{ this.currentRun }}

    <router-link :to="{name: 'SaphyrRuns'}">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

    <b-button v-if="newRecord" class="float-right" id="create" variant="success" @click="create">Create</b-button>
    <b-button v-if="!newRecord" class="float-right" id="update" variant="primary" @click="update">Update</b-button>

    <h1 class="runInfo" id="id">Run ID: {{ this.currentRun.id }}</h1>
    <h2 class="runInfo" id="state">State: {{ this.currentRun.state }}</h2>

    <b-form-input :value="runName" @change="setRunName" class="runInfo" id="name" placeholder="name" type="text"/>

    <chip @alert="showAlert"></chip> 

  </div>
</template>

<script>
import Chip from '@/components/Chip'
import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions, mapState, mapMutations } = createNamespacedHelpers('traction/saphyr/runs')

export default {
  name: 'Run',
  mixins: [Helper],
  methods: {
    async create() {
      let success = await this.createRun()

      if (success) {
        this.$router.push({ name: 'SaphyrRuns' })
      } else {
        this.showAlert('Failed to create run', 'danger')
      }
    },
    async update() {
      let success = await this.updateRun()

      if (success) {
        this.$router.push({ name: 'SaphyrRuns' })
      } else {
        this.showAlert('Failed to update run', 'danger')
      }
    },
    ...mapActions([
      'createRun',
      'updateRun'
    ]),
    ...mapMutations([
      'setRunName',
    ]),
  },
  components: {
    Chip,
    Alert
  },
  computed: {
    newRecord () {
      return isNaN(this.currentRun.id)
    },
    ...mapGetters([
      'currentRun'
    ]),
    ...mapState({
      currentRun: state => state.currentRun,
      runName: state => state.currentRun.name
    })
  },
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

</style>
