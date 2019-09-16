<template>
  <div class="run">
    <alert ref='alert'></alert>

    {{ this.currentRun }}

    <router-link :to="{name: 'SaphyrRuns'}">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

    <b-button v-if="newRecord" class="float-right" id="create" variant="success" @click="create">Create</b-button>

    <h1 class="runInfo" id="id">Run ID: {{ this.currentRun.id }}</h1>
    <h2 class="runInfo" id="state">State: {{ this.currentRun.state }}</h2>

    <b-form-input :value="runName" @change="updateName" class="runInfo" id="name" placeholder="name" type="text"/>

    <chip @alert="showAlert"></chip> 

  </div>
</template>

<script>
import Chip from '@/components/Chip'
import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions, mapState } = createNamespacedHelpers('traction/saphyr/runs')

export default {
  name: 'Run',
  mixins: [Helper],
  methods: {
    async updateName(name) {
      let response = await this.updateRunName(name)

      if (response.successful) {
        this.showAlert('Run name updated', 'success')
      } else {
        this.showAlert('There was an error: ' + response.errors.message, 'danger')
      }
    },
    ...mapActions([
      'updateRunName',
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
