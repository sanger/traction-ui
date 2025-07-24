import { handleResponse } from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'
import useRootStore from '@/stores'

/**
 * Function to fetch samples from Traction API based on the input.
 * It makes two sample requests: one for sample names and another for source identifiers.
 * It combines the results and returns the samples found.
 *
 * @param {string} sample_input - The input to search for samples.
 * @param {Array} samples - The array of existing samples to avoid duplicates.
 * @returns {Object} An object containing the fetched samples and any errors encountered.
 */
const fetchTractionSamples = async (sample_input, samples) => {
  const api = useRootStore().api

  const tractionSamples = []
  const request = api.traction.pacbio.requests

  // We cant search by both sample name and source identifier at the same time, so we make two requests
  // This can result in overfetching, but it is necessary to ensure we get all relevant samples
  const promise = request.get({ filter: { sample_name: sample_input }, include: 'sample' })
  const source_promise = request.get({
    filter: { source_identifier: sample_input },
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
    return {
      data: [],
      errors: { message: `Error fetching samples from Traction: ${errors}`, type: 'danger' },
    }
  }

  if (!data.length) {
    return {
      data: [],
      errors: { message: 'No samples found in Traction with the provided input', type: 'warning' },
    }
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
    const exists = samples.some((sample) => sample.request_id == request.id)

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
    }
  }

  return { data: tractionSamples, errors: {} }
}

/**
 * Function to fetch samples from Sequencescape API based on the traction samples found.
 * It retrieves sample metadata, studies, and faculty sponsors for each sample.
 *
 * @param {Array} samples - The array of samples to fetch from Sequencescape.
 * @returns {Object} An object containing the formatted samples and any errors encountered.
 */
const fetchSequencescapeSamples = async (samples) => {
  const api = useRootStore().api

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
    return {
      data: [],
      errors: { message: `Error fetching samples from Sequencescape: ${errors}`, type: 'danger' },
    }
  }

  if (!data.length) {
    return {
      data: [],
      errors: {
        message: 'No samples found in Sequencescape with the provided input',
        type: 'warning',
      },
    }
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

  return { data: sequencescapeSamples, errors: {} }
}

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

export { csvStructure, fetchTractionSamples, fetchSequencescapeSamples }
