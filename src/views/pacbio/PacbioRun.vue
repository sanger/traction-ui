<template>
  <div class="run">
    <alert ref='alert'></alert>

    <router-link :to="{name: 'PacbioRuns'}">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

    <b-button v-if="newRecord" class="float-right" id="create" variant="success" @click="create">Create</b-button>

    <br>
    <br>

    <div>
      <pacbioRunInfo></pacbioRunInfo>
      <br>
      <pacbioLibrariesTable></pacbioLibrariesTable>
      <plate></plate>
    </div>

  </div>
</template>

<script>
import PacbioRunInfo from '@/components/PacbioRunInfo'
import PacbioLibrariesTable from '@/components/PacbioLibrariesTable'
import Plate from '@/components/Plate'
import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapActions } = createNamespacedHelpers('traction/pacbio/runs')

export default {
  name: 'Run',
  mixins: [Helper],
  methods: {
    async create () {
      try {
        await this.createRun()
        this.redirectToRuns()
      } catch (err) {
        this.showAlert('Failed to create run', 'danger')
      }
    },
    ...mapActions([
      'createRun'
    ]),
    redirectToRuns() {
      this.$router.push({ name: 'PacbioRuns' })
    }
  },
  components: {
    Alert,
    PacbioRunInfo,
    PacbioLibrariesTable,
    Plate
  },
  computed: {
    newRecord () {
      return isNaN(this.currentRun.id)
    },
    ...mapGetters([
      'currentRun'
    ]),
    ...mapState({
      currentRun: state => state.currentRun
    })
  },
}
</script>

<style>

button {
  margin-right: 2px;
  margin-left: 2px;
}

</style>
