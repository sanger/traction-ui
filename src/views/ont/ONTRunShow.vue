<template>
  <DataFetcher :fetcher="provider">
    <div class="flex flex-row justify-end mt-2">
      <router-link :to="{ name: 'ONTRunIndex' }">
        <traction-button id="backToRunsButton" class="float-right">Back</traction-button>
      </router-link>
      <traction-button
        v-if="newRecord"
        id="resetButton"
        type="reset"
        theme="default"
        class="float-right"
        @click="ontRunCreateStore.newRun"
        >Reset</traction-button
      >

      <traction-button
        :id="currentAction.id"
        class="float-right"
        :theme="currentAction.theme"
        :disabled="!runValid"
        @click="runAction"
        >{{ currentAction.label }}</traction-button
      >
    </div>
    <ONTRunInformation></ONTRunInformation>
    <ONTRunInstrumentFlowcells></ONTRunInstrumentFlowcells>
  </DataFetcher>
</template>
<script setup>
/**
 * @name ONTRun
 * @description This component is used to display the form for creating a new ONT Run or editing an existing one.
 * @param {Number|String} id - The id of the run to edit page
 */
import DataFetcher from '@/components/DataFetcher.vue'
import ONTRunInformation from '@/components/ont/runs/ONTRunInformation.vue'
import ONTRunInstrumentFlowcells from '@/components/ont/runs/ONTRunInstrumentFlowcells.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOntRunCreateStore } from '@/stores/ontRunCreate.js'
import { useOntRunsStore } from '@/stores/ontRuns.js'
import useAlert from '@/composables/useAlert.js'

// Props
const props = defineProps({
  id: {
    type: [String, Number],
    default: 0,
  },
})

// Stores
const ontRunCreateStore = useOntRunCreateStore()
const ontRunsStore = useOntRunsStore()
const router = useRouter()

// State
const newRecord = ref(isNaN(props.id))
const actions = {
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

const { showAlert } = useAlert()

// Computed
const currentRun = computed(() => ontRunCreateStore.currentRun)
const currentAction = computed(() => actions[newRecord.value ? 'create' : 'update'])

// Validate the run
const runValid = computed(() => {
  const flowCellsValid = currentRun.value.flowcell_attributes?.every((fc) => {
    return (
      (!!fc.tube_barcode && !!fc.flowcell_id && Object.values(fc.errors).length === 0) ||
      (!fc.tube_barcode && !fc.flowcell_id)
    )
  })
  return (
    currentRun.value.instrument_name &&
    currentRun.value.state &&
    currentRun.value.rebasecalling_process &&
    flowCellsValid
  )
})

// Methods
async function runAction() {
  const response = await ontRunCreateStore[currentAction.value.method]()
  if (response.success) {
    redirectToRuns()
  } else {
    const action = newRecord.value ? 'create' : 'update'
    // You may want to use a global alert or event bus here
    // For now, just log
    // showAlert is not defined in this context, so use console.error or implement your own
    showAlert(
      `Failed to ${action} run in Traction: ${response.errors}`,
      'danger',
      'run-validation-message',
    )
  }
}

function redirectToRuns() {
  router.push({ name: 'ONTRunIndex' })
}

async function provider() {
  await ontRunsStore.fetchInstruments()
  if (props.id === 'new') {
    ontRunCreateStore.newRun()
    newRecord.value = true
  } else if (!newRecord.value) {
    await ontRunCreateStore.fetchRun(parseInt(props.id))
    newRecord.value = false
  }
  return { success: true }
}
</script>
