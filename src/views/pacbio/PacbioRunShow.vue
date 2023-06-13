<template>
  <DataFetcher :fetcher="provider">
    <ul class="flex flex-row justify-end">
      <li>
        <router-link id="backToRunsButton" :to="{ name: 'PacbioRunIndex' }" class="text-gray-700">
          <TractionArrowIcon class="inline-block h-4 w-4" />
          <span class="vertical-middle">Back to runs</span>
        </router-link>
      </li>
    </ul>

    <div>
      <div class="grid grid-cols-2 w-full space-x-4 mb-6">
        <PacbioRunInfoEdit ref="pacbioRunInfoEdit" />
        <PacbioRunWellDefaultEdit ref="pacbioRunWellDefaultEdit" />
      </div>

      <div class="grid grid-cols-2 w-full space-x-4 mb-6">
        <pacbioPoolList ref="pacbioPoolList" />
        <Plate ref="plate" @alert="showAlert" />
      </div>

      <div class="flex flex-col items-center">
        <PacbioRunSummary class="w-1/2" @reset-run="resetRun" @save="save" />
      </div>
    </div>
  </DataFetcher>
</template>

<script>
import TractionArrowIcon from '@/components/shared/icons/TractionArrowIcon.vue'
import PacbioRunInfoEdit from '@/components/pacbio/PacbioRunInfoEdit'
import PacbioRunWellDefaultEdit from '@/components/pacbio/PacbioRunWellDefaultEdit'
import pacbioPoolList from '@/components/pacbio/PacbioPoolList'
import PacbioRunSummary from '@/components/pacbio/PacbioRunSummary'
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
    TractionArrowIcon,
    PacbioRunInfoEdit,
    PacbioRunWellDefaultEdit,
    pacbioPoolList,
    PacbioRunSummary,
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

<style scoped>
.vertical-middle {
  vertical-align: middle;
}
</style>
