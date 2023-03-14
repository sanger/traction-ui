<template>
  <div class="run">
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
      <traction-row>
        <traction-col cols="6">
          <pacbioRunInfoEdit ref="pacbioRunInfoEdit"></pacbioRunInfoEdit>
          <br />
        </traction-col>
        <traction-col>
          <pacbioRunWellDefaultEdit ref="pacbioRunWellDefaultEdit"></pacbioRunWellDefaultEdit>
          <br />
        </traction-col>
      </traction-row>
      <traction-row>
        <traction-col cols="6">
          <pacbioPoolList ref="pacbioPoolList"></pacbioPoolList>
        </traction-col>
        <traction-col>
          <Plate v-if="!newRecord" ref="plate" @alert="showAlert"></Plate>
        </traction-col>
      </traction-row>
    </div>
  </div>
</template>

<script>
import PacbioRunInfoEdit from '@/components/pacbio/PacbioRunInfoEdit'
import PacbioRunWellDefaultEdit from '@/components/pacbio/PacbioRunWellDefaultEdit'
import pacbioPoolList from '@/components/pacbio/PacbioPoolList'
import Plate from '@/components/pacbio/PacbioRunPlateItem'
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
  created() {
    const smrtLinkVersions = this.fetchSmrtLinkVersions()
    this.clearRunData()
    const run = this.setRun({ id: this.id })
    smrtLinkVersions.then(this.alertOnFail)
    run.then(this.alertOnFail)
  },
  methods: {
    resetRun() {
      this.clearRunData()
      this.showAlert('Run has been reset', 'success', 'run-validation-message')
    },
    ...mapActions(['setRun', 'saveRun', 'fetchSmrtLinkVersions']),
    ...mapMutations(['clearRunData']),

    redirectToRuns() {
      this.$router.push({ name: 'PacbioRunIndex' })
    },
    alertOnFail({ success, errors }) {
      if (!success) {
        this.showAlert(errors, 'danger')
      }
    },
    // TODO: Still to test through e2e tests.
    save() {
      this.saveRun().then(({ success, errors }) => {
        success
          ? this.showAlert(`Run successfully created/updated`, 'success', 'run-create-message')
          : this.showAlert(errors, 'danger', 'run-create-message')
      })
    },
  },
}
</script>

<style>
button {
  margin-right: 2px;
  margin-left: 2px;
}
</style>
