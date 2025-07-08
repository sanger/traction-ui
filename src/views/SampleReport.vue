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

<!--
  SampleReport page
  This page allows users to generate a report of samples from Traction.
  Users can search for samples by name or container barcode, and the report will include
  relevant information from both Traction and Sequencescape.


  Currently this is setup for Kinnex samples but to extend to other report types we can abstract
  the csvStructure and the fetching of samples from Traction and Sequencescape and create a dropdown
  to select the report type.
-->
<script setup>
import { ref } from 'vue'
import DownloadIcon from '@/icons/DownloadIcon.vue'
import useAlert from '@/composables/useAlert'
import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'
import { downloadBlob, arrayToCsv } from '@/lib/csv/creator.js'
const { showAlert } = useAlert()
const api = useRootStore().api

let sample_input = ref('')
const samples = ref([])
const csvStructure = [
  { key: 'date_of_sample_collection', label: 'Date of Sample Collection' },
  // Request id but user facing 'Sample'
  { key: 'id', label: 'Sample ID' },
  { key: 'sanger_sample_id', label: 'Sanger Sample ID' },
  { key: 'supplier_name', label: 'Supplier Sample Name' },
  { key: 'cohort', label: 'Cohort' },
  // { key: 'study_number', label: 'Study Number' },
  // { key: 'study_name', label: 'Study Name' },
  { key: 'cost_code', label: 'Cost Code' },
  { key: 'name', label: 'Sample Name' },
  { key: 'source_identifier', label: 'Source Identifier' },
  { key: 'species', label: 'Species' },
  // { key: 'cell_type', label: 'Cell Type' },
  // { key: 'no_of_requested_cell_type', label: 'Number Of Requested Cell Type' },
  { key: 'concentration', label: 'Supplied Concentration (ng/uL)' },
  { key: 'volume', label: 'Supplied Volume (uL)' },
  // { key: 'submitting_faculty', label: 'Submitting Faculty' },
  { key: 'library_type', label: 'Library Type' },
  { key: 'donor_id', label: 'Sample Type' },
]

const fields = [...csvStructure, { key: 'remove', label: '' }]

const addSample = async () => {
  if (sample_input.value) {
    const tractionSamples = await fetchTractionSamples()
    if (!tractionSamples) {
      showAlert('No samples found in Traction with the provided input', 'warning')
      sample_input.value = ''
      return
    }

    const sequencescapeSamples = await fetchSequencescapeSamples(tractionSamples)
    if (!sequencescapeSamples) {
      showAlert('No samples found in Sequencescape with the provided input', 'warning')
      sample_input.value = ''
      return
    }

    // Combine the traction samples and sequencescape samples
    const combinedSamples = tractionSamples.map((sample) => {
      const seqSample = sequencescapeSamples.find((s) => s.uuid === sample.external_id)
      return {
        ...sample,
        ...seqSample,
      }
    })

    samples.value.push(...combinedSamples)

    // Clear the input field after adding samples
    sample_input.value = ''
  }
}

const fetchTractionSamples = async () => {
  const tractionSamples = []
  const request = api.traction.pacbio.requests
  // TODO support by source identifier (barcode)
  const promise = request.get({ filter: { sample_name: sample_input.value }, include: 'sample' })
  const response = await handleResponse(promise)
  const { success, body: { data, included = [] } = {}, errors = [] } = response
  const { samples: serviceSamples } = groupIncludedByResource(included)

  if (!success) {
    showAlert(`Error fetching samples from Traction: ${errors}`, 'danger')
    return
  }

  // Add the fetched data to the samples array
  for (const request of data) {
    // Check if the request (sample) already exists in the samples array
    const exists = samples.value.some((sample) => sample.id == request.id)

    if (!exists) {
      // Find the corresponding sample
      const sample = serviceSamples.find((s) => s.id == request.relationships.sample.data.id)

      const formattedSample = {
        id: request.id,
        date_of_sample_collection: request.attributes.date_of_sample_collection || '',
        sanger_sample_id: request.attributes.sanger_sample_id || '',
        supplier_name: request.attributes.supplier_name || '',
        cost_code: request.attributes.cost_code || '',
        library_type: request.attributes.library_type || '',
        source_identifier: request.attributes.source_identifier || '',
        name: sample.attributes.name || '',
        donor_id: sample.attributes.donor_id || '',
        species: sample.attributes.species || '',
        external_id: sample.attributes.external_id || '',
      }

      // Add the sample to the sample list
      tractionSamples.push(formattedSample)
    } else {
      showAlert(`Sample ${sample_input.value} already exists in the list`, 'info')
    }
  }
  return tractionSamples
}

const fetchSequencescapeSamples = async (samples) => {
  const sequencescapeSamples = []
  const sampleUuids = samples.map((sample) => sample.external_id).join(',')
  const request = api.sequencescape.samples

  const promise = request.get({ filter: { uuid: sampleUuids }, include: 'sample_metadata' })
  const response = await handleResponse(promise)
  const { success, body: { data, included = [] } = {}, errors = [] } = response
  const { sample_metadata } = groupIncludedByResource(included)

  if (!success) {
    showAlert(`Error fetching samples from Sequencescape: ${errors}`, 'danger')
    return
  }

  // Add the fetched data to the samples array
  for (const sample of data) {
    // Find the corresponding metadata
    const s_metadata = sample_metadata.find(
      (s) => s.id == sample.relationships.sample_metadata.data.id,
    )

    // Format the sample/sample_metadata attributes according to the csvStructure
    const formattedSample = {
      cohort: s_metadata.attributes.cohort || '',
      concentration: s_metadata.attributes.concentration || '',
      volume: s_metadata.attributes.volume || '',
      uuid: sample.attributes.uuid || '',
    }

    // Add the sample to the sample list
    sequencescapeSamples.push(formattedSample)
  }
  return sequencescapeSamples
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
