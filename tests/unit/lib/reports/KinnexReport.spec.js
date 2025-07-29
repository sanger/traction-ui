import {
  fetchTractionSamples,
  fetchSequencescapeStudies,
  fetchFunction,
} from '@/lib/reports/KinnexReport.js'
import useRootStore from '@/stores'
import { createPinia, setActivePinia } from '@support/testHelper.js'
import PacbioRequestFactory from '@tests/factories/PacbioRequestFactory.js'
const pacbioRequestFactory = PacbioRequestFactory({ includeRelationships: true })

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

const request = pacbioRequestFactory.content.data[0]
const sample = pacbioRequestFactory.content.included[7]

// Mocked data from Sequencescape
const ssStudy = {
  id: '1',
  type: 'studies',
  attributes: {
    name: 'Study 1',
    uuid: 'fec8a1fa-b9e2-11e9-9123-fa163e99b035',
  },
  relationships: {
    study_metadata: {
      data: {
        type: 'study_metadata',
        id: '1',
      },
    },
  },
}

const ssStudyMetadata = {
  id: '1',
  type: 'study_metadata',
  relationships: {
    faculty_sponsor: {
      data: {
        type: 'faculty_sponsors',
        id: '1',
      },
    },
  },
}

const ssFacultySponsor = {
  id: '1',
  type: 'faculty_sponsors',
  attributes: {
    name: 'Faculty Sponsor 1',
  },
}

describe('KinnexReport', () => {
  let rootStore, get, ssGet

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    // Mock the root store and its API
    rootStore = useRootStore()
    get = vi.fn()
    rootStore.api.traction.pacbio.requests.get = get

    ssGet = vi.fn()
    rootStore.api.sequencescape.studies.get = ssGet
  })

  describe('fetchTractionSamples', () => {
    it('returns empty array and shows alert if both responses fail', async () => {
      get.mockRejectedValue('Internal Server Error')

      const { data, errors } = await fetchTractionSamples('input', [])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'Error fetching samples from Traction: Internal Server Error',
        type: 'danger',
      })
    })

    it('returns empty array and shows alert if no data found', async () => {
      get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [], included: [] }),
      })

      const { data, errors } = await fetchTractionSamples('input', [])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'No samples found in Traction with the provided input',
        type: 'warning',
      })
    })

    it('removes duplicates and returns formatted samples', async () => {
      // Duplicates because the same sample is found in both requests
      get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })

      const { data, errors } = await fetchTractionSamples('input', [])
      expect(errors).toEqual({})
      expect(data).toHaveLength(1)
      expect(data[0]).toEqual({
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
      })
    })

    it('successful if only one of the requests returns data', async () => {
      get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })
      // Second call is for source_identifier fetch
      get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [], included: [] }),
      })

      const { data, errors } = await fetchTractionSamples('input', [])
      expect(errors).toEqual({})
      expect(data).toHaveLength(1)
      expect(data[0]).toEqual({
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
      })
    })

    it('fetches multiple samples from Traction API across filter types', async () => {
      const request2 = pacbioRequestFactory.content.data[1]
      const sample2 = pacbioRequestFactory.content.included[8]

      get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })
      // Second call is for source_identifier fetch
      get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request2], included: [sample2] }),
      })
      const { data, errors } = await fetchTractionSamples('sample1,sample2', [])
      expect(errors).toEqual({})
      expect(data).toEqual([
        {
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
        },
        {
          request_id: request2.id,
          barcode: request2.attributes.barcode,
          cost_code: request2.attributes.cost_code,
          library_type: request2.attributes.library_type,
          external_study_id: request2.attributes.external_study_id,
          date_of_sample_collection: sample2.attributes.date_of_sample_collection,
          supplier_name: sample2.attributes.supplier_name,
          donor_id: sample2.attributes.donor_id,
          species: sample2.attributes.species,
          sanger_sample_id: sample2.attributes.sanger_sample_id,
        },
      ])
      expect(get).toHaveBeenCalledWith({
        filter: { sample_name: 'sample1,sample2' },
        include: 'sample',
      })
      expect(get).toHaveBeenCalledWith({
        filter: { source_identifier: 'sample1,sample2' },
        include: 'sample',
      })
    })
  })

  describe('fetchSequencescapeStudies', () => {
    it('returns empty array and shows alert if response fails', async () => {
      ssGet.mockRejectedValue('Internal Server Error')
      const { data, errors } = await fetchSequencescapeStudies([{ external_study_id: 'ext' }])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'Error fetching studies from Sequencescape: Internal Server Error',
        type: 'danger',
      })
    })

    it('returns empty array and shows alert if no data found', async () => {
      ssGet.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [], included: [] }),
      })
      const { data, errors } = await fetchSequencescapeStudies([{ external_study_id: 'ext' }])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'No studies found in Sequencescape with the provided input',
        type: 'warning',
      })
    })

    it('returns formatted studies from Sequencescape', async () => {
      ssGet.mockResolvedValue({
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

      get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })
      // Second call is for source_identifier fetch
      get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request2], included: [sample2] }),
      })
      ssGet.mockResolvedValue({
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
        {
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
          study_number: ssStudy.id,
          uuid: ssStudy.attributes.uuid,
          study_name: ssStudy.attributes.name,
          submitting_faculty: ssFacultySponsor.attributes.name,
        },
        {
          request_id: request2.id,
          barcode: request2.attributes.barcode,
          cost_code: request2.attributes.cost_code,
          library_type: request2.attributes.library_type,
          external_study_id: request2.attributes.external_study_id,
          date_of_sample_collection: sample2.attributes.date_of_sample_collection,
          supplier_name: sample2.attributes.supplier_name,
          donor_id: sample2.attributes.donor_id,
          species: sample2.attributes.species,
          sanger_sample_id: sample2.attributes.sanger_sample_id,
          study_number: ssStudy.id,
          uuid: ssStudy.attributes.uuid,
          study_name: ssStudy.attributes.name,
          submitting_faculty: ssFacultySponsor.attributes.name,
        },
      ])
      expect(result.errors).toEqual({})
    })

    it('returns errors if traction returns no samples', async () => {
      get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [], included: [] }),
      })

      const { data, errors } = await fetchFunction('input', [])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'No samples found in Traction with the provided input',
        type: 'warning',
      })
    })

    it('returns errors if traction returns but sequencescape does not', async () => {
      get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })
      ssGet.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () =>
          Promise.resolve({
            data: [],
            included: [],
          }),
      })

      const { data, errors } = await fetchFunction('input', [])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'No studies found in Sequencescape with the provided input',
        type: 'warning',
      })
    })
  })
})
