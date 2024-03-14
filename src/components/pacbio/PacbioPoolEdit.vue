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
          <div :class="['w-full', `${border}`]">
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
          <traction-sub-section title="Pool information" class="mt-2 py-6">
            <div class="grid gap-5 grid-cols-6 mb-10 text-sm min-h-32" data-type="pool-edit">
              <label> Auto tagging</label>
              <label v-if="!!tubeItem.barcode"> Pool Barcode </label>
              <label v-else></label>
              <label>Template Prep Kit Box Barcode </label>
              <label> Volume</label>
              <label> Concentration</label>
              <label> Insert Size</label>
              <div class="w-full flex justify-center">
                <traction-toggle v-model="autoTag" data-attribute="check-box" />
              </div>
              <label v-if="!!tubeItem.barcode" data-attribute="barcode" class="font-bold flex-wrap">
                {{ tubeItem.barcode }}
              </label>
              <label v-else></label>
              <traction-input
                v-model="poolItem.template_prep_kit_box_barcode"
                data-attribute="template-prep-kit-box-barcode"
              />
              <traction-input v-model="poolItem.volume" data-attribute="volume" />
              <traction-input v-model="poolItem.concentration" data-attribute="concentration" />
              <traction-input v-model="poolItem.insert_size" data-attribute="insert-size" />
            </div>
          </traction-sub-section>
        </div>
      </div>
    </traction-section>
    <PacbioPoolAliquotList :auto-tag="autoTag" :validated="validated" :notify="onFieldUpdate" />
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
import PacbioPoolAliquotList from '@/components/pacbio/PacbioPoolAliquotList.vue'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import useAlert from '@/composables/useAlert.js'
import { ref, computed } from 'vue'
import { eachRecord } from '@/lib/csv/pacbio.js'

const busy = ref(false)
const autoTag = ref(false)
const parsedFile = ref(null)
const validated = ref(true)
const { poolItem, tubeItem, selectedRequests, createPool, updatePool, updateLibraryFromCsvRecord } =
  usePacbioPoolCreateStore()
const { showAlert } = useAlert()

const persisted = computed(() => !!poolItem.id)
const poolType = computed(() => {
  switch (selectedRequests.length) {
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

const create = () => {
  busy.value = true
  createPool().then(({ success, barcode, errors }) => {
    success
      ? showAlert(
          `Pool successfully created with barcode ${barcode}`,
          'success',
          'pool-create-message',
        )
      : showAlert(errors, 'danger', 'pool-create-message')
    busy.value = false
  })
}

const update = () => {
  busy.value = true
  validated.value = true
  updatePool().then(({ success, errors }) => {
    success
      ? showAlert(`Pool successfully updated`, 'success', 'pool-create-message')
      : showAlert(errors, 'danger', 'pool-create-message')
    busy.value = false
  })
}
// Allows users to upload a file to autopopulate the pool's selected libraries
const uploadFile = async (evt) => {
  if (evt?.target?.files?.length) {
    const file = evt.target.files[0]
    try {
      const csv = await file.text()
      eachRecord(csv, updateLibraryFromCsvRecord)
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

// Function passed to child components in notify prop, to be used when any attribute
// in the child component is changed. The validated flag is reset to true when the user
// clicks the update button and the changed values are checked and saved.
const onFieldUpdate = () => {
  validated.value = false
}
</script>
