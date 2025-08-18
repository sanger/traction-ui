<template>
  <div data-type="pool">
    <traction-section
      number="4"
      title="Pooled Samples"
      :tag="`${poolType}`"
      data-attribute="pool-type"
    >
      <div>
        <div>
          <label class="flex text-left" for="qcFileInput">Select file</label>
          <div id="borderDiv" :class="['w-full', `${border}`]">
            <input
              id="qcFileInput"
              class="block w-full rounded border file:border-0"
              type="file"
              accept="text/csv, .csv"
              @change="uploadFile"
            />
          </div>
        </div>

        <div>
          <traction-sub-section title="Pool information" class="py-6">
            <div class="grid gap-5 grid-cols-6 mb-10 text-sm min-h-32" data-type="pool-edit">
              <label> Auto tagging</label>
              <label v-if="!!tubeItem.barcode"> Pool Barcode </label>
              <label v-else></label>
              <label> Kit Barcode </label>
              <label> Volume </label>
              <label> Concentration </label>
              <label> Insert Size </label>
              <div class="w-full flex justify-center">
                <traction-toggle v-model="autoTag" data-attribute="check-box" />
              </div>
              <label v-if="!!tubeItem.barcode" data-attribute="barcode" class="font-bold flex-wrap">
                {{ tubeItem.barcode }}
              </label>
              <label v-else></label>
              <traction-input v-model="poolItem.kit_barcode" data-attribute="kit-barcode" />
              <traction-input v-model="poolItem.volume" data-attribute="volume" />
              <traction-input v-model="poolItem.concentration" data-attribute="concentration" />
              <traction-input v-model="poolItem.insert_size" data-attribute="insert-size" />
            </div>
          </traction-sub-section>
        </div>
      </div>
    </traction-section>
    <OntPoolLibraryList :auto-tag="autoTag" :validated="validated" :notify="onFieldUpdate" />
    <div class="text-right py-8">
      <traction-button
        v-if="!persisted"
        data-action="create-pool"
        theme="create"
        :disabled="busy"
        @click="create()"
      >
        <span class="button-text">Create Pool </span>
        <traction-spinner v-show="busy"></traction-spinner>
      </traction-button>
      <traction-button
        v-if="persisted"
        data-action="update-pool"
        theme="update"
        :disabled="busy"
        @click="update()"
      >
        <span class="button-text">Update Pool </span>
        <traction-spinner v-show="busy"></traction-spinner>
      </traction-button>
    </div>
  </div>
</template>

<script setup>
import OntPoolLibraryList from '@/components/ont/OntPoolLibraryList.vue'
import { ref, computed } from 'vue'
import { eachRecord } from '@/lib/csv/pacbio.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'
import useAlert from '@/composables/useAlert.js'

const busy = ref(false)
const autoTag = ref(false)
const parsedFile = ref(null)
const validated = ref(true)
const ontPoolCreateStore = useOntPoolCreateStore()
const poolItem = computed(() => ontPoolCreateStore.poolItem)
const tubeItem = computed(() => ontPoolCreateStore.tubeItem)
const selectedRequests = computed(() => ontPoolCreateStore.selectedRequests)

const persisted = computed(() => !!poolItem.value.id)

const { showAlert } = useAlert() // useAlert is a composable function that is used to create an alert.It is used to show a success or failure message.

const poolType = computed(() => {
  switch (selectedRequests.value.length) {
    case 0:
      return 'Empty'
    case 1:
      return 'Library'
    default:
      return 'Pool'
  }
})

const border = computed(() => {
  if (parsedFile.value === null) return 'border-0'
  else {
    const borderColour = parsedFile.value ? 'border-success' : 'border-failure'
    return `rounded border ${borderColour}`
  }
})

async function create() {
  busy.value = true
  const { success, barcode, errors } = await ontPoolCreateStore.createPool()
  if (success) {
    showAlert(`Pool successfully created with barcode ${barcode}`, 'success', 'pool-create-message')
  } else {
    showAlert(errors, 'danger', 'pool-create-message')
  }
  busy.value = false
}

async function update() {
  busy.value = true
  validated.value = true
  const { success, errors } = await ontPoolCreateStore.updatePool()
  if (success) {
    showAlert('Pool successfully updated', 'success', 'pool-create-message')
  } else {
    showAlert(errors, 'danger', 'pool-create-message')
  }
  busy.value = false
}

async function uploadFile(evt) {
  if (evt?.target?.files?.length) {
    const file = evt.target.files[0]
    try {
      const csv = await file.text()
      eachRecord(csv, (record) => ontPoolCreateStore.updateLibraryFromCsvRecord(record))
      parsedFile.value = true
    } catch (error) {
      console.error(error)
      showAlert(error, 'danger', 'pool-create-message')
      parsedFile.value = false
    }
  } else {
    parsedFile.value = null
    return
  }
}

function onFieldUpdate() {
  validated.value = false
}
</script>
