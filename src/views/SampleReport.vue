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
          <div class="flex flex-row space-x-2 items-center justify-left">
            <p class="flex text-sm">Enter samples by names or container barcode</p>
            <p class="flex text-sm font-italic text-sp">(PacBio samples only)</p>
          </div>
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
              @click="removeSample(row.item.request_id)"
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

<!--
  SampleReport page
  This page allows users to generate a report of samples from Traction.
  Users can search for samples by name or container barcode, and the report will include
  relevant information from both Traction and Sequencescape.


  Currently this is setup for Kinnex samples but to extend to other report types we can abstract
  can create a dropdown to select the report type and update the report lib to handle different structures.
  Similar to how the reception works.
-->
<script setup>
import { ref } from 'vue'
import DownloadIcon from '@/icons/DownloadIcon.vue'
import useAlert from '@/composables/useAlert'
import { downloadBlob, arrayToCsv } from '@/lib/csv/creator.js'
import {
  fetchTractionSamples,
  fetchSequencescapeStudies,
  csvStructure,
} from '@/lib/reports/KinnexReport.js'
let sample_input = ref('')
const samples = ref([])
const fields = [...csvStructure, { key: 'remove', label: '' }]
const { showAlert } = useAlert()
/**
 * Function to add a sample to the report.
 * It fetches samples from Traction and Sequencescape based on the input.
 * If samples are found, they are added to the samples array.
 * If no samples are found, a warning is shown.
 */
const addSample = async () => {
  if (sample_input.value) {
    const { data: tractionSamples, errors } = await fetchTractionSamples(
      sample_input.value,
      samples.value,
    )
    if (!tractionSamples.length) {
      if (errors && errors.message) {
        showAlert(errors.message, errors.type)
      }
      sample_input.value = ''
      return
    }

    const { data: sequencescapeStudies, errors: ssError } =
      await fetchSequencescapeStudies(tractionSamples)
    if (!sequencescapeStudies.length) {
      if (ssError && ssError.message) {
        showAlert(ssError.message, ssError.type)
      }
      sample_input.value = ''
      return
    }

    // Combine the traction samples and sequencescape studies
    // N.B We might get traction requests that do not have a corresponding sequencescape study
    // But we should still show the traction sample in the report as it contains useful information
    const combinedSamples = tractionSamples.map((sample) => {
      const seqStudy = sequencescapeStudies.find((s) => s.uuid === sample.external_study_id)
      return {
        ...sample,
        ...seqStudy,
      }
    })

    samples.value.push(...combinedSamples)

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
  const headers = csvStructure.map((field) => field.label)

  // format the samples to match the csvStructure
  const formattedSamples = samples.value.map((sample) => {
    const formattedSample = {}
    csvStructure.forEach((field) => {
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
