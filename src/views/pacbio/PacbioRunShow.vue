<template>
  <DataFetcher :fetcher="provider">
    <router-link :to="{ name: 'PacbioRunIndex' }">
      <traction-button id="backToRunsButton" class="float-right">Back</traction-button>
    </router-link>

    <traction-button
      v-if="newRecord"
      id="reset"
      theme="reset"
      class="float-right"
      @click="resetRun()"
      >Reset</traction-button
    >
    <traction-button
      :id="runType.id"
      class="float-right"
      :theme="runType.theme"
      :data-action="runType.id"
      @click="save"
      >{{ runType.label }}</traction-button
    >

    <br />
    <br />

    <div>
      <div class="grid grid-cols-2 w-full space-x-4 mb-6">
        <PacbioRunInfoEdit ref="pacbioRunInfoEdit" />
        <PacbioRunWellDefaultEdit ref="pacbioRunWellDefaultEdit" />
      </div>

      <div class="grid grid-cols-2 w-full space-x-4">
        <pacbioPoolList ref="pacbioPoolList"></pacbioPoolList>
        <Plate ref="plate" @alert="showAlert"></Plate>
      </div>
    </div>
  </DataFetcher>
</template>

<script>
import PacbioRunInfoEdit from '@/components/pacbio/PacbioRunInfoEdit'
import PacbioRunWellDefaultEdit from '@/components/pacbio/PacbioRunWellDefaultEdit'
import pacbioPoolList from '@/components/pacbio/PacbioPoolList'
import Plate from '@/components/pacbio/PacbioRunPlateItem'
import DataFetcher from '@/components/DataFetcher'
import { RunTypeEnum } from '@/store/traction/pacbio/runCreate/run'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions, mapMutations } = createNamespacedHelpers(
  'traction/pacbio/runCreate',
)

export default {
  name: 'PacbioRunShow',
  components: {
    PacbioRunInfoEdit,
    PacbioRunWellDefaultEdit,
    pacbioPoolList,
    Plate,
    DataFetcher,
  },
  props: {
    id: {
      type: [String, Number],
      default: 0,
    },
  },
  computed: {
    newRecord() {
      return this.runType.type === RunTypeEnum.New
    },
    ...mapGetters(['runType']),
  },
  methods: {
    async resetRun() {
      this.clearRunData()
      await this.setRun({ id: this.id })
      await this.setDefaultWellAttributes()
      this.showAlert('Run has been reset', 'success', 'run-validation-message')
    },
    ...mapActions(['setRun', 'saveRun', 'fetchSmrtLinkVersions', 'setDefaultWellAttributes']),
    ...mapMutations(['clearRunData']),

    redirectToRuns() {
      this.$router.push({ name: 'PacbioRunIndex' })
    },
    alertOnFail({ success, errors }) {
      if (!success) {
        this.showAlert(errors, 'danger')
      }
    },
    save() {
      this.saveRun().then(({ success, errors }) => {
        success
          ? this.showAlert(
              `Run successfully ${this.runType.action}d`,
              'success',
              'run-create-message',
            )
          : this.showAlert(
              'Failed to create run in Traction: ' + errors,
              'danger',
              'run-create-message',
            )
        if (success) {
          this.redirectToRuns()
        }
      })
    },
    async provider() {
      // Seeds required data and loads the page via the DataFetcher
      // Set smrtLinkVersions first as setRun depends on it
      await this.fetchSmrtLinkVersions()
      this.clearRunData()
      await this.setRun({ id: this.id })
      // Sets the runCreate/defaultWellAttributes store on loading the view
      await this.setDefaultWellAttributes()
      return { success: true }
    },
  },
}
</script>
