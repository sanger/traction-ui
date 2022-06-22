<template>
  <div class="run">
    <router-link :to="{ name: 'PacbioRunIndex' }">
      <b-button id="backToRunsButton" class="float-right">Back</b-button>
    </router-link>

    <b-button v-if="newRecord" id="reset" variant="primary" class="float-right" @click="resetRun()"
      >Reset</b-button
    >
    <b-button
      :id="currentAction.id"
      class="float-right"
      :variant="currentAction.variant"
      @click="runAction"
      >{{ currentAction.label }}</b-button
    >

    <br />
    <br />

    <div>
      <b-row>
        <b-col cols="6">
          <pacbioRunInfoEdit ref="pacbioRunInfoEdit"></pacbioRunInfoEdit>
          <br />
        </b-col>
        <b-col>
          <pacbioRunWellDefaultEdit ref="pacbioRunWellDefaultEdit"></pacbioRunWellDefaultEdit>
          <br />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <pacbioPoolList ref="pacbioPoolList"></pacbioPoolList>
        </b-col>
        <b-col>
          <Plate v-if="currentRun.id" ref="plate" @alert="showAlert"></Plate>
        </b-col>
      </b-row>
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
import * as consts from '@/consts/consts'

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
            variant: 'success',
            label: 'Create',
            method: 'createRun',
          },
          update: {
            id: 'update',
            variant: 'primary',
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
      let responses = await this[this.currentAction.method]()

      if (responses.length == 0) {
        this.redirectToRuns()
      } else {
        this.showAlert(
          consts.MESSAGE_ERROR_CREATE_RUN_FAILED + responses,
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
