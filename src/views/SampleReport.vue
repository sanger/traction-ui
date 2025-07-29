<template>
  <div>
    <div class="w-3/4 mx-auto bg-gray-100 border border-gray-200 bg-gray-100 rounded-md p-4">
      <traction-heading level="2" show-border>Sample report</traction-heading>
      <p class="flex justify-left text-sm">
        This page lets you generate a report (csv) on a subset of samples in Traction.
      </p>
      <traction-form @keydown.enter.prevent>
        <fieldset>
          <traction-heading level="4" show-border>Report type</traction-heading>
          <div class="flex flex-row space-x-2 items-center justify-left">
            <p class="flex text-sm">Pre-defined structures for the data and data fetching logic.</p>
          </div>
          <traction-select
            v-model="report_type"
            data-type="report-type"
            class="flex py-2 w-full"
            :options="report_options"
            @change="reset()"
          />
        </fieldset>
        <fieldset>
          <traction-heading level="4" show-border>Select samples</traction-heading>
          <div class="flex flex-row space-x-2 items-center justify-left">
            <p class="flex text-sm">Enter samples by names or container barcode</p>
          </div>
          <div class="flex flex-row space-x-2 items-center">
            <traction-input
              id="sampleInput"
              v-model="sample_input"
              class="flex py-2 w-full"
              placeholder="sample_1,10STDY1..."
              :disabled="!report_type"
              @enter-key-press="addSample"
            />
            <traction-button
              id="searchSamples"
              class="flex items-center"
              theme="default"
              :disabled="!report_type"
              @click="addSample"
              >Add</traction-button
            >
          </div>
        </fieldset>
      </traction-form>
    </div>
    <div
      v-if="report_type"
      class="flex flex-col w-3/4 max-h-svh mx-auto bg-gray-100 border border-gray-200 rounded-md p-4 my-2 space-y-2"
    >
      <traction-heading level="4" show-border class="w-full">Preview</traction-heading>
      <div class="overflow-x-auto overflow-y-auto">
        <traction-table
          id="sampleReportTable"
          :items="samples"
          :fields="fields"
          empty-text="No samples added yet"
        >
          <template #cell(remove)="row">
            <traction-button
              :id="'remove-btn-' + row.item.id"
              size="sm"
              class="mr-2"
              theme="accent"
              @click="removeSample(row.item.request_id)"
            >
              -
            </traction-button>
          </template>
        </traction-table>
      </div>
      <div class="flex flex-row justify-between">
        <traction-button
          id="reset"
          class="items-center cursor-pointer"
          theme="default"
          @click="reset()"
        >
          Reset
        </traction-button>
        <traction-button
          id="download"
          class="items-center cursor-pointer bg-sp-400 hover:bg-sp-300"
          :disabled="samples.length === 0"
          @click="downloadReport"
        >
          Download
          <download-icon class="pl-1" />
        </traction-button>
      </div>
    </div>
    <div v-else class="w-3/4 mx-auto bg-gray-100 border border-gray-200 rounded-md p-4 my-2">
      <p class="flex justify-left text-sm">
        Please select a report type to start generating your sample report.
      </p>
    </div>
  </div>
</template>

<!--
  SampleReport page
  This page allows users to generate a report of samples from Traction.
  Users can search for samples by name or container barcode, and the report will include
  relevant information from both Traction and Sequencescape.
-->
<script setup>
import { ref, computed } from 'vue'
import DownloadIcon from '@/icons/DownloadIcon.vue'
import useAlert from '@/composables/useAlert'
import { downloadBlob, arrayToCsv } from '@/lib/csv/creator.js'
import Reports from '@/lib/reports'

let sample_input = ref('')
const report_type = ref('KinnexSamples') // Default report type, can be extended later
const report_options = ref([...Object.values(Reports)])
const samples = ref([])
const report = computed(() => Reports[report_type.value])
const fields = computed(() => {
  return [
    ...report.value.csvStructure.map((field) => ({
      key: field.key,
      label: field.label,
    })),
    { key: 'remove', label: '' },
  ] // Add a remove button column
})
const { showAlert } = useAlert()

/**
 * Function to add a sample to the report.
 * It fetches samples from Traction and Sequencescape based on the input.
 * If samples are found, they are added to the samples array.
 * If no samples are found, a warning is shown.
 */
const addSample = async () => {
  if (sample_input.value) {
    const fetchedSamples = await report.value.fetchFunction(sample_input.value, samples.value)
    if (fetchedSamples.errors && fetchedSamples.errors.message) {
      showAlert(fetchedSamples.errors.message, fetchedSamples.errors.type)
      return
    }

    samples.value.push(...fetchedSamples.data)
    // Clear the input field after adding samples
    sample_input.value = ''
  }
}

/**
 * Function to remove a sample from the report.
 * It finds the sample by its request_id and removes it from the samples array.
 */
const removeSample = (request_id) => {
  const sampleIndex = samples.value.findIndex((sample) => sample.request_id == request_id)
  if (sampleIndex !== -1) {
    samples.value.splice(sampleIndex, 1)
  }
}

/**
 * Function to reset the samples array.
 */
const reset = () => {
  samples.value = []
}

/**
 * Function to download the report as a CSV file.
 * It formats the samples according to the csvStructure and triggers a download.
 */
const downloadReport = () => {
  const headers = report.value.csvStructure.map((field) => field.label)

  // format the samples to match the csvStructure
  const formattedSamples = samples.value.map((sample) => {
    const formattedSample = {}
    report.value.csvStructure.forEach((field) => {
      formattedSample[field.key] = sample[field.key] || ''
    })
    return Object.values(formattedSample)
  })

  // Convert the samples to CSV format
  const csvContent = arrayToCsv([headers, ...formattedSamples])

  // Download the CSV file
  const time = new Date().toLocaleDateString()

  downloadBlob(csvContent, `traction_sample_report_${time}.csv`, 'text/csv')
}
</script>
