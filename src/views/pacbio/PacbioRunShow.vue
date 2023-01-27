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
      :id="currentAction.id"
      class="float-right"
      :theme="currentAction.theme"
      @click="runAction"
      >{{ currentAction.label }}</traction-button
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
          <Plate v-if="currentRun.id" ref="plate" @alert="showAlert"></Plate>
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

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapActions } = createNamespacedHelpers('traction/pacbio/runs')

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
    actions: {
      type: Object,
      default() {
        return {
          create: {
            id: 'create',
            theme: 'create',
            label: 'Create',
            method: 'createRun',
          },
          update: {
            id: 'update',
            theme: 'update',
            label: 'Update',
            method: 'updateRun',
          },
        }
      },
    },
  },
  data() {
    return {
      newRecord: isNaN(this.id),
    }
  },
  computed: {
    currentAction() {
      return this.actions[this.newRecord ? 'create' : 'update']
    },
    ...mapGetters(['currentRun']),
    ...mapState({
      currentRun: (state) => state.currentRun,
    }),
  },
  created() {
    this.provider()
  },
  methods: {
    async runAction() {
      const responses = await this[this.currentAction.method]()

      if (responses.length == 0) {
        this.redirectToRuns()
      } else {
        this.showAlert(
          'Failed to create run in Traction: ' + responses,
          'danger',
          'run-validation-message',
        )
      }
    },
    resetRun() {
      this.newRun()
      this.showAlert('Run has been reset', 'success', 'run-validation-message')
    },
    ...mapActions(['createRun', 'updateRun', 'editRun', 'newRun']),
    redirectToRuns() {
      this.$router.push({ name: 'PacbioRunIndex' })
    },
    async provider() {
      await this.$store.dispatch('traction/pacbio/runCreate/fetchSmrtLinkVersions')
      if (this.id === 'new') {
        this.newRun()
      } else if (!this.newRecord) {
        await this.editRun(parseInt(this.$route.params.id))
      } else {
        this.$router.push({ name: '404' })
      }
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
