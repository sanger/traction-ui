import {
  fetchTractionSamples,
  fetchSequencescapeStudies,
  fetchFunction,
} from '@/lib/reports/KinnexReport.js'
import useRootStore from '@/stores'
import {
  createPinia,
  setActivePinia,
  successfulResponse,
  failedResponse,
} from '@support/testHelper.js'
import PacbioRequestFactory from '@tests/factories/PacbioRequestFactory.js'
import SequencescapeStudyFactory from '@tests/factories/SequencescapeStudyFactory.js'
const pacbioRequestFactory = PacbioRequestFactory({ includeRelationships: true })
const sequencescapeStudyFactory = SequencescapeStudyFactory()

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

const request = pacbioRequestFactory.content.data[0]
const sample = pacbioRequestFactory.content.included[7]
const ssStudy = sequencescapeStudyFactory.content.data[0]
const ssStudyMetadata = sequencescapeStudyFactory.content.included[0]
const ssFacultySponsor = sequencescapeStudyFactory.content.included[1]

const formattedSample = (sample, request, study, facultySponsor) => {
  const s = {
    request_id: request.id,
    barcode: request.attributes.barcode,
    cost_code: request.attributes.cost_code,
    library_type: request.attributes.library_type,
    external_study_id: request.attributes.external_study_id,
    date_of_sample_collection: sample.attributes.date_of_sample_collection,
    supplier_name: sample.attributes.supplier_name,
    donor_id: sample.attributes.donor_id,
    species: sample.attributes.species,
    sanger_sample_id: sample.attributes.sanger_sample_id,
  }
  if (study && facultySponsor) {
    return {
      ...s,
      study_number: study.id,
      uuid: study.attributes.uuid,
      study_name: study.attributes.name,
      submitting_faculty: facultySponsor.attributes.name,
    }
  }
  return s
}

describe('KinnexReport', () => {
  let rootStore, tractionRequestGet, sequencescapeStudyGet

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    // Mock the root store and its API
    rootStore = useRootStore()
    tractionRequestGet = vi.fn()
    rootStore.api.traction.pacbio.requests.get = tractionRequestGet

    sequencescapeStudyGet = vi.fn()
    rootStore.api.sequencescape.studies.get = sequencescapeStudyGet
  })

  describe('fetchTractionSamples', () => {
    it('returns empty array and shows alert if both responses fail', async () => {
      tractionRequestGet.mockResolvedValue(failedResponse())

      const { data, errors } = await fetchTractionSamples('input', [])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'Error fetching samples from Traction: error1 There was an error.',
        type: 'danger',
      })
    })

    it('returns empty array and shows alert if no data found', async () => {
      tractionRequestGet.mockResolvedValue(successfulResponse({ statusCode: 200, data: [] }))

      const { data, errors } = await fetchTractionSamples('input', [])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'No samples found in Traction with the provided input',
        type: 'warning',
      })
    })

    it('removes duplicates and returns formatted samples', async () => {
      // Duplicates because the same sample is found in both requests
      tractionRequestGet.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })

      const { data, errors } = await fetchTractionSamples('input', [])
      expect(errors).toEqual({})
      expect(data).toHaveLength(1)
      expect(data[0]).toEqual(formattedSample(sample, request))
    })

    it('successful if only one of the requests returns data', async () => {
      tractionRequestGet.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })
      // Second call is for source_identifier fetch
      tractionRequestGet.mockResolvedValueOnce(successfulResponse({ statusCode: 200, data: [] }))

      const { data, errors } = await fetchTractionSamples('input', [])
      expect(errors).toEqual({})
      expect(data).toHaveLength(1)
      expect(data[0]).toEqual(formattedSample(sample, request))
    })

    it('fetches multiple samples from Traction API across filter types', async () => {
      const request2 = pacbioRequestFactory.content.data[1]
      const sample2 = pacbioRequestFactory.content.included[8]

      tractionRequestGet.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })
      // Second call is for source_identifier fetch
      tractionRequestGet.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request2], included: [sample2] }),
      })
      const { data, errors } = await fetchTractionSamples('sample1,sample2', [])
      expect(errors).toEqual({})
      expect(data).toEqual([formattedSample(sample, request), formattedSample(sample2, request2)])
      expect(tractionRequestGet).toHaveBeenCalledWith({
        filter: { sample_name: 'sample1,sample2' },
        include: 'sample',
      })
      expect(tractionRequestGet).toHaveBeenCalledWith({
        filter: { source_identifier: 'sample1,sample2' },
        include: 'sample',
      })
    })
  })

  describe('fetchSequencescapeStudies', () => {
    it('returns empty array and shows alert if response fails', async () => {
      sequencescapeStudyGet.mockResolvedValue(failedResponse())
      const { data, errors } = await fetchSequencescapeStudies([{ external_study_id: 'ext' }])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'Error fetching studies from Sequencescape: error1 There was an error.',
        type: 'danger',
      })
    })

    it('returns empty array and shows alert if no data found', async () => {
      sequencescapeStudyGet.mockResolvedValue(successfulResponse({ statusCode: 200 }))
      const { data, errors } = await fetchSequencescapeStudies([{ external_study_id: 'ext' }])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'No studies found in Sequencescape with the provided input',
        type: 'warning',
      })
    })

    it('returns formatted studies from Sequencescape', async () => {
      sequencescapeStudyGet.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () =>
          Promise.resolve({
            data: [ssStudy],
            included: [ssFacultySponsor, ssStudyMetadata],
          }),
      })

      const { data, errors } = await fetchSequencescapeStudies([{ external_study_id: 'ext' }])
      expect(errors).toEqual({})
      expect(data).toHaveLength(1)
      expect(data[0]).toEqual({
        study_number: ssStudy.id,
        uuid: ssStudy.attributes.uuid,
        study_name: ssStudy.attributes.name,
        submitting_faculty: ssFacultySponsor.attributes.name,
      })
    })
  })

  describe('fetchFunction', () => {
    it('correctly combines multiple samples and studies', async () => {
      const request2 = pacbioRequestFactory.content.data[1]
      const sample2 = pacbioRequestFactory.content.included[8]

      tractionRequestGet.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })
      // Second call is for source_identifier fetch
      tractionRequestGet.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request2], included: [sample2] }),
      })
      sequencescapeStudyGet.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () =>
          Promise.resolve({
            data: [ssStudy],
            included: [ssFacultySponsor, ssStudyMetadata],
          }),
      })

      const result = await fetchFunction('sample1,sample2', [])

      expect(result.data).toEqual([
        formattedSample(sample, request, ssStudy, ssFacultySponsor),
        formattedSample(sample2, request2, ssStudy, ssFacultySponsor),
      ])
      expect(result.errors).toEqual({})
    })

    it('returns errors if traction returns no samples', async () => {
      tractionRequestGet.mockResolvedValue(successfulResponse({ statusCode: 200, data: [] }))

      const { data, errors } = await fetchFunction('input', [])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'No samples found in Traction with the provided input',
        type: 'warning',
      })
    })

    it('returns errors if traction returns but sequencescape does not', async () => {
      tractionRequestGet.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })
      sequencescapeStudyGet.mockResolvedValue(successfulResponse({ statusCode: 200 }))

      const { data, errors } = await fetchFunction('input', [])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'No studies found in Sequencescape with the provided input',
        type: 'warning',
      })
    })
  })
})
