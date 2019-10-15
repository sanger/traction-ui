<template>
  <div class="run">
    <alert ref='alert'></alert>

    <router-link :to="{name: 'PacbioRuns'}">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

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
const { mapGetters, mapState } = createNamespacedHelpers('traction/pacbio/runs')

export default {
  name: 'Run',
  mixins: [Helper],
  methods: {
  },
  components: {
    Alert,
    PacbioRunInfo,
    PacbioLibrariesTable,
    Plate
  },
  computed: {
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
