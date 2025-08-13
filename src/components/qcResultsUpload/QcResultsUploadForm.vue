<template>
  <div class="w-3/5 mx-auto bg-gray-100 border border-gray-200 bg-gray-100 rounded-md p-4">
    <traction-form @submit="onSubmit">
      <traction-heading level="3" show-border
        >Which QC Results would you like to upload?</traction-heading
      >
      <traction-select
        id="used-by-select-input"
        v-model="usedBySelected"
        class="my-5"
        :options="usedByOptions"
        :state="!!usedBySelected ? true : null"
        required
      ></traction-select>
      <traction-heading level="3" show-border>CSV File</traction-heading>

      <div :class="['w-full', 'my-4', `${border}`]">
        <input
          id="qcResultsUploadFile"
          ref="qcResultsUploadFile"
          class="block w-full rounded border file:border-0"
          type="file"
          accept="text/csv, .csv"
          required
          @change="fileSelected"
        />
      </div>

      <div class="pt-2 space-x-4 pb-4 flex flex-row justify-end">
        <traction-button
          id="upload-button"
          type="submit"
          theme="create"
          size="lg"
          :disabled="disableUpload"
        >
          Upload File
          <UploadIcon class="pl-1" />
          <traction-spinner v-show="busy"></traction-spinner>
        </traction-button>
        <traction-button
          id="reenable-button"
          size="lg"
          :disabled="!disableUpload"
          theme="reset"
          @click="reEnable()"
          >Re-enable</traction-button
        >
      </div>
    </traction-form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createQcResultsUploadResource } from '@/services/traction/QcResultsUpload'
import UploadIcon from '@/icons/UploadIcon.vue'
import useRootStore from '@/stores'
import useAlert from '@/composables/useAlert.js'

// Options for the select input
const usedByOptions = [
  { value: null, text: 'Please select a option' },
  { value: 'extraction', text: 'Extraction' },
]

// State
const file = ref(null)
const usedBySelected = ref('extraction')
const busy = ref(false)
const disableUpload = ref(false)
const uploadSuccessful = ref(null) // true, false, or null

// Refs for DOM elements
const qcResultsUploadFile = ref(null)

// Store and API
const rootStore = useRootStore()

// Alert composable
const { showAlert } = useAlert()

// Border class for file input based on upload status
const border = computed(() => {
  if (uploadSuccessful.value === true) {
    return 'rounded border border-success'
  } else if (uploadSuccessful.value === false) {
    return 'rounded border border-failure'
  }
  return 'border-0'
})

// Methods
function reEnable() {
  if (qcResultsUploadFile.value) {
    qcResultsUploadFile.value.value = ''
  }
  uploadSuccessful.value = null
  file.value = null
  disableUpload.value = !disableUpload.value
}

const fileSelected = (evt) => {
  if (evt?.target?.files?.length) {
    file.value = evt.target.files[0]
  } else {
    file.value = null
    return
  }
}

const onSubmit = async () => {
  await postCSV()
}

const postCSV = async () => {
  busy.value = true
  disableUpload.value = true

  const csv = await file.value?.text()
  const data = { csv, usedBySelected: usedBySelected.value }
  const { success, errors } = await createQcResultsUploadResource(
    rootStore.api.traction.qc_results_uploads.create,
    data,
  )
  uploadSuccessful.value = success

  if (success) {
    showAlert(`Successfully imported: ${file.value.name}`, 'success')
  } else {
    showAlert(errors || 'Unable to upload QC File', 'danger')
  }
  busy.value = false
}
</script>
