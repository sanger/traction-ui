<template>
  <div>
    <div class="w-3/4 mx-auto bg-gray-100 border border-gray-200 bg-gray-100 rounded-md p-4">
      <traction-heading level="2" show-border>Sample report</traction-heading>
      <p class="flex justify-left text-sm">
        This page lets you generate a report (csv) on a subset of samples in Traction.
      </p>
      <traction-form @keydown.enter.prevent>
        <fieldset>
          <traction-heading level="4" show-border>Select samples</traction-heading>
          <p class="flex justify-left text-sm">Enter samples by names or barcode</p>
          <div class="flex flex-row space-x-2 items-center">
            <traction-input
              id="sampleInput"
              v-model="sample_input"
              class="flex py-2 w-full"
              placeholder="sample_1,10STDY1..."
              @enter-key-press="addSample"
            />
            <traction-button
              id="searchSamples"
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
              @click="removeSample(row.item.id)"
            >
              -
            </traction-button>
          </template>
        </traction-table>
      </div>
      <div class="flex flex-row justify-between border-t border-gray-400 pt-4">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DownloadIcon from '@/icons/DownloadIcon.vue'
import useAlert from '@/composables/useAlert'
import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper'

const { showAlert } = useAlert()
const api = useRootStore().api

let sample_input = ref('')
const fields = [
  { key: 'id', label: 'Sample ID' },
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
  { key: 'remove', label: '' },
]
const samples = ref([])
const addSample = async () => {
  if (sample_input.value) {
    const request = api.traction.samples
    const promise = request.get({ filter: { name: sample_input.value } })

    const response = await handleResponse(promise)

    const { success, body: { data } = {}, errors = [] } = response

    if (!success) {
      showAlert(`Error fetching samples: ${errors}`, 'danger')
      return
    }

    if (data.length === 0) {
      showAlert('No samples found with the provided input', 'warning')
      return
    }

    // Add the fetched samples to the samples array
    for (const sample of data) {
      // Check if the sample already exists in the samples array
      const exists = samples.value.some((s) => s.id === sample.id)
      if (!exists) {
        // Format the sample attributes according to the fields
        const formattedSample = fields.reduce((acc, field) => {
          acc[field.key] = sample.attributes[field.key] || ''
          return acc
        }, {})
        formattedSample.id = sample.id // Add the id field
        samples.value.push(formattedSample)
      } else {
        showAlert(`Sample ${sample_input.value} already exists in the list`, 'info')
      }
    }
  }

  // Clear the input field after adding the sample
  sample_input.value = ''
}
const removeSample = (sampleId) => {
  const sampleIndex = samples.value.findIndex((sample) => sample.id == sampleId)
  if (sampleIndex !== -1) {
    samples.value.splice(sampleIndex, 1)
  }
}

const reset = () => {
  samples.value = []
}

const arrayToCsv = (data) => {
  return data
    .map(
      (row) =>
        row
          .map(String) // convert every value to String
          .map((v) => v.replaceAll('"', '""')) // escape double quotes
          .map((v) => `"${v}"`) // quote it
          .join(','), // comma-separated
    )
    .join('\r\n') // rows starting on new lines
}

/**
 * Download contents as a file
 * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
 */
function downloadBlob(content, filename, contentType) {
  // Create a blob
  var blob = new Blob([content], { type: contentType })
  var url = URL.createObjectURL(blob)

  // Create a link to download it
  var pom = document.createElement('a')
  pom.href = url
  pom.setAttribute('download', filename)
  pom.click()
}

const downloadReport = () => {
  const headers = fields.map((field) => field.label)

  // Convert the samples to CSV format
  const csvContent = arrayToCsv([headers, ...samples.value.map((sample) => Object.values(sample))])

  // Download the CSV file
  const time = new Date().toLocaleDateString()
  downloadBlob(csvContent, `traction_sample_report_${time}.csv`, 'text/csv')
}
</script>
