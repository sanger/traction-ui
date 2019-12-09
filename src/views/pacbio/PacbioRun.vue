<template>
  <div class="run">
    <alert ref='alert'></alert>

    <router-link :to="{name: 'PacbioRuns'}">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

    <b-button v-if="newRecord" class="float-right" id="create" variant="success" @click="create">Create</b-button>
    <b-button v-if="!newRecord" class="float-right" id="update" variant="primary" @click="update">Update</b-button>

    <br>
    <br>

    <div>
      <pacbioRunInfo></pacbioRunInfo>
      <br>
      <b-row>
        <b-col cols="6">
          <pacbioLibrariesTable></pacbioLibrariesTable>
        </b-col>
        <b-col>
          <Plate @alert="showAlert"></Plate>
        </b-col>
      </b-row>
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
  props: {
    id: {
      type: [Number]
    },
  },
  methods: {
    async create () {
      let responses = await this.createRun()

      if (responses.length == 0) {
        this.redirectToRuns()
      } else {
          this.showAlert(responses, 'danger')
      }
    },
    async update () {
      let responses = await this.updateRun()

      if (responses.length == 0) {
        this.redirectToRuns()
      } else {
        this.showAlert(responses, 'danger')
      }
    },
    ...mapActions([
      'createRun',
      'updateRun',
      'getAndSetRun'
    ]),
    redirectToRuns() {
      this.$router.push({ name: 'PacbioRuns' })
    }
  },
  created () {
    let id = parseInt(this.$route.params.id)
    this.getAndSetRun(id)
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
