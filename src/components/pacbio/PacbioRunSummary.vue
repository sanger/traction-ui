<template>
  <div class="bg-gray-100 rounded p-3">
    <traction-heading level="4" :show-border="true"> Summary </traction-heading>

    <div class="flex flex-col w-full">
      <p id="importText" class="text-left">
        Create a {{ runItem.system_name }} run with
        {{ pluralise(plateCount, '0 plates', '1 plate', `${plateCount} plates`) }} and
        {{ pluralise(wellCount, '0 wells', '1 well', `${wellCount} wells`) }}
      </p>
      <div class="flex flex-row space-x-8 mt-5">
        <traction-button v-if="newRecord" id="reset" full-width theme="reset" @click="resetRun()">
          Reset
        </traction-button>
        <traction-button
          :id="runType.id"
          full-width
          :theme="runType.theme"
          :data-action="runType.id"
          @click="save"
        >
          {{ runType.label }}
        </traction-button>
      </div>
    </div>
  </div>
</template>

<script>
import { pluralise } from '@/lib/stringHumanisation'
import { RunTypeEnum } from '@/store/traction/pacbio/runCreate/run'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions, mapMutations } = createNamespacedHelpers(
  'traction/pacbio/runCreate',
)

export default {
  name: 'PacbioRunSummary',
  components: {},
  props: {
    id: {
      type: [String, Number],
      default: 0,
    },
  },
  computed: {
    newRecord: ({ runType }) => runType.type === RunTypeEnum.New,
    plateCount: ({ runItem }) => (runItem.system_name === 'Revio' ? 2 : 1),
    wellCount: ({ wells }) => Object.keys(wells).length,
    ...mapGetters(['runItem', 'runType', 'wells']),
  },
  methods: {
    pluralise,
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
  },
}
</script>

<style scoped></style>
