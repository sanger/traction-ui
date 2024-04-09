<template>
  <DataFetcher :fetcher="provider">
    <div class="flex flex-row items-center gap-2">
      <router-link id="backToRunsButton" :to="{ name: 'PacbioRunIndex' }" class="text-gray-700">
        <TractionArrowIcon class="inline-block h-4 w-4" />
        <span class="align-middle">Back to runs</span>
      </router-link>
      <traction-button
        v-if="newRecord"
        id="reset"
        theme="reset"
        class="float-right"
        @click="resetRun()"
        >Reset</traction-button
      >

      <div class="spacer me-auto"></div>
      <traction-button
        :id="runTypeItem.id"
        class="float-right"
        :theme="runTypeItem.theme"
        :data-action="runTypeItem.id"
        @click="save"
        >{{ runTypeItem.label }}</traction-button
      >
    </div>

    <div class="grid grid-cols-2 w-full space-x-4 mb-6">
      <PacbioRunInfoEdit ref="pacbioRunInfoEdit" :new-record="newRecord" />
      <PacbioRunWellDefaultEdit ref="pacbioRunWellDefaultEdit" />
    </div>

    <div class="grid grid-cols-2 w-full space-x-4 mb-6">
      <PacbioRunPoolLibraryList ref="pacbioRunPoolLibraryList" />
      <PacbioPlateList ref="plate" @alert="showAlert" />
    </div>
  </DataFetcher>
</template>

<script>
import TractionArrowIcon from '@/components/shared/icons/TractionArrowIcon.vue'
import PacbioRunInfoEdit from '@/components/pacbio/V1/PacbioRunInfoEditV1.vue'
import PacbioRunWellDefaultEdit from '@/components/pacbio/V1/PacbioRunWellDefaultEditV1.vue'
import PacbioRunPoolLibraryList from '@/components/pacbio/V1/PacbioRunPoolLibraryListV1.vue'
import PacbioPlateList from '@/components/pacbio/V1/PacbioRunPlateListV1.vue'
import DataFetcher from '@/components/DataFetcher.vue'
import { RunTypeEnum } from '@/stores/utilities/run.js'

import { mapState, mapActions } from 'pinia'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreateV1.js'

export default {
  name: 'PacbioRunShow',
  components: {
    TractionArrowIcon,
    PacbioRunInfoEdit,
    PacbioRunWellDefaultEdit,
    PacbioRunPoolLibraryList,
    PacbioPlateList,
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
      return this.runTypeItem.type === RunTypeEnum.New
    },
    ...mapState(usePacbioRunCreateStore, ['runTypeItem']),
  },
  methods: {
    async resetRun() {
      this.clearRunData()
      await this.setRun({ id: this.id })
      await this.setDefaultWellAttributes()
      await this.setInstrumentData()
      this.showAlert('Run has been reset', 'success', 'run-validation-message')
    },
    ...mapActions(usePacbioRunCreateStore, [
      'setRun',
      'saveRun',
      'fetchSmrtLinkVersions',
      'setDefaultWellAttributes',
      'setInstrumentData',
      'clearRunData',
    ]),

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
              `Run successfully ${this.runTypeItem.action}d`,
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
      await this.setInstrumentData()
      return { success: true }
    },
  },
}
</script>
