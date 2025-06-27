<template>
  <div>
    <div class="w-3/4 mx-auto bg-gray-100 border border-gray-200 bg-gray-100 rounded-md p-4">
      <traction-heading level="2" show-border>Sample report</traction-heading>
      <p class="flex justify-left text-sm">
        This page lets you generate a report of a subset of samples in the system.
      </p>
      <traction-form @submit="() => {}" @reset="() => {}" @keydown.enter.prevent>
        <fieldset>
          <traction-heading level="4" show-border>Select samples</traction-heading>
          <p class="flex justify-left text-sm">Enter samples by names or barcode</p>
          <div class="flex flex-row space-x-2 items-center">
            <traction-input
              id="sampleInput"
              v-model="sample_input"
              class="flex py-2 w-full"
              placeholder="kinnex_sample..."
              @enter-key-press="addSample"
            />
            <traction-button
              id="search-samples"
              class="flex items-center"
              theme="default"
              @click="addSample"
              >Add</traction-button
            >
          </div>
        </fieldset>
      </traction-form>
    </div>
    <div
      class="flex flex-col w-3/4 mx-auto bg-gray-100 border border-gray-200 rounded-md p-4 my-2 overflow-x-auto"
    >
      <traction-heading level="4" show-border class="w-full">Preview</traction-heading>
      <traction-table id="sample-report-table" :items="samples" :fields="sampleFields">
        <template #cell(remove)="row">
          <traction-button
            :id="'remove-btn-' + row.item.sample_id"
            size="sm"
            class="mr-2"
            theme="accent"
            @click="removeSample(row.item.sample_id)"
          >
            -
          </traction-button>
        </template>
      </traction-table>
      <div v-show="!samples.length" data-type="scanned-samples" class="text-gray-400">
        No samples scanned yet
      </div>
      <div class="flex flex-row justify-end">
        <traction-button
          id="download"
          class="items-center cursor-pointer bg-sp-400 hover:bg-sp-300"
        >
          Download
          <download-icon class="pl-1" />
        </traction-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DownloadIcon from '@/icons/DownloadIcon.vue'

let sample_input = ref('')
const sampleFields = [
  { key: 'sample_id', label: 'Sample ID' },
  { key: 'submission_date', label: 'Date Submitted' },
  { key: 'sanger_sample_id', label: 'Sanger Sample ID' },
  { key: 'supplier_sample_name', label: 'Supplier Sample Name' },
  { key: 'cohort', label: 'Cohort' },
  { key: 'study_number', label: 'Study Number' },
  { key: 'study_name', label: 'Study Name' },
  { key: 'sample_type', label: 'Sample Type' },
  { key: 'cost_code', label: 'Cost Code' },
  { key: 'species', label: 'Species' },
  { key: 'cell_type', label: 'Cell Type' },
  { key: 'no_of_requested_cell_type', label: 'Number Of Requested Cell Type' },
  { key: 'supplied_concentration', label: 'Supplied Concentration (ng/uL)' },
  { key: 'supplied_volume', label: 'Supplied Volume (uL)' },
  { key: 'submitting_faculty', label: 'Submitting Faculty' },
  { key: 'library_type', label: 'Library Type' },
  { key: 'sample_type', label: 'Sample Type' },
  { key: 'remove', label: '' },
]
const samples = ref([])
const addSample = () => {
  // Temporary logic
  if (sample_input.value && !samples.value.includes(sample_input.value)) {
    samples.value.push({ sample_id: sample_input.value })
  }

  // Clear the input field after adding the sample
  sample_input.value = ''
}
const removeSample = (sampleId) => {
  const sampleIndex = samples.value.findIndex((sample) => sample.sample_id == sampleId)
  if (sampleIndex !== -1) {
    samples.value.splice(sampleIndex, 1)
  }
}
</script>
