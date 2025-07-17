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
  { key: 'id', label: 'Sample ID' },
  { key: 'sanger_sample_id', label: 'Sanger Sample ID' },
  { key: 'supplier_name', label: 'Supplier Sample Name' },
  { key: 'cohort', label: 'Cohort' },
  { key: 'study_number', label: 'Study Number' },
  { key: 'study_name', label: 'Study Name' },
  { key: 'cost_code', label: 'Cost Code' },
  { key: 'species', label: 'Species' },
  { key: 'concentration', label: 'Supplied Concentration (ng/uL)' },
  { key: 'volume', label: 'Supplied Volume (uL)' },
  { key: 'submitting_faculty', label: 'Submitting Faculty' },
  { key: 'library_type', label: 'Library Type' },
  { key: 'donor_id', label: 'Sample Type' },
]

const fields = [...csvStructure, { key: 'remove', label: '' }]

/**
 * Function to add a sample to the report.
 * It fetches samples from Traction and Sequencescape based on the input.
 * If samples are found, they are added to the samples array.
 * If no samples are found, a warning is shown.
 */
const addSample = async () => {
  if (sample_input.value) {
    const tractionSamples = await fetchTractionSamples()
    if (!tractionSamples.length) {
      sample_input.value = ''
      return
    }

    const sequencescapeSamples = await fetchSequencescapeSamples(tractionSamples)
    if (!sequencescapeSamples.length) {
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

/**
 * Function to fetch samples from Traction API based on the input.
 * It makes two sample requests: one for sample names and another for source identifiers.
 * It combines the results and returns the samples found.
 */
const fetchTractionSamples = async () => {
  const tractionSamples = []
  const request = api.traction.pacbio.requests

  // We cant search by both sample name and source identifier at the same time, so we make two requests
  // This can result in overfetching, but it is necessary to ensure we get all relevant samples
  const promise = request.get({ filter: { sample_name: sample_input.value }, include: 'sample' })
  const source_promise = request.get({
    filter: { source_identifier: sample_input.value },
    include: 'sample',
  })
  // Await both promises
  const [response, source_response] = await Promise.all([
    handleResponse(promise),
    handleResponse(source_promise),
  ])

  // Combine data and included arrays from both responses
  // If either response is successful, we can proceed
  const success = response.success || source_response.success
  // Add errors from both responses to a single array
  const errors = []
  if (response.errors) errors.push(response.errors)
  // If they both have the same errors, we only want to show them once
  if (source_response.errors && source_response.errors != response.errors)
    errors.push(source_response.errors)

  let data = [...(response.body?.data || []), ...(source_response.body?.data || [])]
  const included = [...(response.body?.included || []), ...(source_response.body?.included || [])]
  const { samples: serviceSamples } = groupIncludedByResource(included)

  // If either response has errors, we show an alert and return as it means something went wrong
  // and we don't want to misrepresent the data with incomplete samples
  if (!success || errors.length) {
    showAlert(`Error fetching samples from Traction: ${errors}`, 'danger')
    return tractionSamples
  }

  if (!data.length) {
    showAlert('No samples found in Traction with the provided input', 'warning')
    return tractionSamples
  }

  // Remove duplicates from the data array based on request_id
  // Duplicates can occur if the same sample is found in both requests
  data = data.reduce((acc, request) => {
    if (!acc.some((r) => r.id === request.id)) {
      acc.push(request)
    }
    return acc
  }, [])

  // Add the fetched data to the samples array
  for (const request of data) {
    // Check if the request (sample) already exists in the samples array
    const exists = samples.value.some((sample) => sample.request_id == request.id)

    if (!exists) {
      // Find the corresponding sample
      const sample = serviceSamples.find((s) => s.id == request.relationships.sample.data.id)

      const formattedSample = {
        // Include request_id so we can check for duplicates
        request_id: request.id || '',
        cost_code: request.attributes.cost_code || '',
        library_type: request.attributes.library_type || '',
        date_of_sample_collection: sample.attributes.date_of_sample_collection || '',
        supplier_name: sample.attributes.supplier_name || '',
        donor_id: sample.attributes.donor_id || '',
        species: sample.attributes.species || '',
        external_id: sample.attributes.external_id || '',
      }

      // Add the sample to the sample list
      tractionSamples.push(formattedSample)
    } else {
      // TODO improve this error message for source_identifier inputs (this may print the same thing multiple times)
      showAlert(`Sample ${sample_input.value} already exists in the list`, 'info')
    }
  }

  return tractionSamples
}

/**
 * Function to fetch samples from Sequencescape API based on the traction samples found.
 * It retrieves sample metadata, studies, and faculty sponsors for each sample.
 */
const fetchSequencescapeSamples = async (samples) => {
  const sequencescapeSamples = []
  const sampleUuids = samples.map((sample) => sample.external_id).join(',')
  const request = api.sequencescape.samples

  const promise = request.get({
    filter: { uuid: sampleUuids },
    include: 'sample_metadata,studies.study_metadata.faculty_sponsor',
  })
  const response = await handleResponse(promise)
  const { success, body: { data, included = [] } = {}, errors = [] } = response
  const { sample_metadata, studies, study_metadata, faculty_sponsors } =
    groupIncludedByResource(included)

  if (!success) {
    showAlert(`Error fetching samples from Sequencescape: ${errors}`, 'danger')
    return []
  }

  if (!data.length) {
    showAlert('No samples found in Sequencescape with the provided input', 'warning')
    return []
  }

  // Add the fetched data to the samples array
  for (const sample of data) {
    // Find the corresponding metadata
    const s_metadata = sample_metadata.find(
      (s) => s.id == sample.relationships.sample_metadata.data.id,
    )

    // Find the corresponding study
    // Note: This assumes that each sample has only one study associated with it
    const study = studies.find((s) => s.id == sample.relationships.studies.data[0].id)
    const stdy_metadata = study_metadata.find(
      (s) => s.id == study.relationships.study_metadata.data.id,
    )
    const faculty_sponsor = faculty_sponsors.find(
      (s) => s.id == stdy_metadata.relationships.faculty_sponsor.data.id,
    )

    // Format the sample/sample_metadata attributes according to the csvStructure
    const formattedSample = {
      id: sample.id || '',
      sanger_sample_id: sample.attributes.sanger_sample_id || '',
      uuid: sample.attributes.uuid || '',
      cohort: s_metadata.attributes.cohort || '',
      concentration: s_metadata.attributes.concentration || '',
      volume: s_metadata.attributes.volume || '',
      study_number: study.id || '',
      study_name: study.attributes.name || '',
      submitting_faculty: faculty_sponsor.attributes.name || '',
    }

    // Add the sample to the sample list
    sequencescapeSamples.push(formattedSample)
  }

  return sequencescapeSamples
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
