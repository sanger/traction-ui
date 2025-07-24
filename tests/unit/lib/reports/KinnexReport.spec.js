import { fetchTractionSamples, fetchSequencescapeSamples } from '@/lib/reports/KinnexReport'
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
const ssSample = {
  id: '2',
  type: 'samples',
  attributes: {
    uuid: '123',
    sanger_sample_id: 'id-123',
  },
  relationships: {
    sample_metadata: {
      data: {
        type: 'sample_metadata',
        id: '1',
      },
    },
    studies: {
      data: [
        {
          type: 'studies',
          id: '1',
        },
      ],
    },
  },
}

const ssStudy = {
  id: '1',
  type: 'studies',
  attributes: {
    name: 'Study 1',
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

const ssSampleMetadata = {
  id: '1',
  type: 'sample_metadata',
  attributes: {
    cohort: 'Cohort 1',
    concentration: 50,
    volume: 100,
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
    rootStore.api.sequencescape.samples.get = ssGet
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
        cost_code: request.attributes.cost_code,
        library_type: request.attributes.library_type,
        date_of_sample_collection: sample.attributes.date_of_sample_collection,
        supplier_name: sample.attributes.supplier_name,
        donor_id: sample.attributes.donor_id,
        species: sample.attributes.species,
        external_id: sample.attributes.external_id,
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
        cost_code: request.attributes.cost_code,
        library_type: request.attributes.library_type,
        date_of_sample_collection: sample.attributes.date_of_sample_collection,
        supplier_name: sample.attributes.supplier_name,
        donor_id: sample.attributes.donor_id,
        species: sample.attributes.species,
        external_id: sample.attributes.external_id,
      })
    })

    it('fetches multiple samples from Traction API across filter types', async () => {
      const sample2 = {
        ...sample,
        id: '3',
        attributes: { ...sample.attributes, name: 'sample2', donor_id: 'another-id' },
      }
      const request2 = {
        ...request,
        id: 2,
        attributes: {
          ...request.attributes,
          sample_name: 'sample2',
          supplier_name: 'Supplier C',
          library_type: 'PacBio-2',
        },
        relationships: {
          sample: {
            data: {
              type: 'samples',
              id: '3',
            },
          },
        },
      }
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
          cost_code: request.attributes.cost_code,
          date_of_sample_collection: sample.attributes.date_of_sample_collection,
          donor_id: sample.attributes.donor_id,
          library_type: request.attributes.library_type,
          species: sample.attributes.species,
          supplier_name: sample.attributes.supplier_name,
          external_id: sample.attributes.external_id,
        },
        {
          request_id: request2.id,
          cost_code: request2.attributes.cost_code,
          date_of_sample_collection: sample2.attributes.date_of_sample_collection,
          donor_id: sample2.attributes.donor_id,
          library_type: request2.attributes.library_type,
          species: sample2.attributes.species,
          supplier_name: sample2.attributes.supplier_name,
          external_id: sample2.attributes.external_id,
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

  describe('fetchSequencescapeSamples', () => {
    it('returns empty array and shows alert if response fails', async () => {
      ssGet.mockRejectedValue('Internal Server Error')
      const { data, errors } = await fetchSequencescapeSamples([{ external_id: 'ext' }])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'Error fetching samples from Sequencescape: Internal Server Error',
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
      const { data, errors } = await fetchSequencescapeSamples([{ external_id: 'ext' }])
      expect(data).toEqual([])
      expect(errors).toEqual({
        message: 'No samples found in Sequencescape with the provided input',
        type: 'warning',
      })
    })

    it('returns formatted samples from Sequencescape', async () => {
      ssGet.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () =>
          Promise.resolve({
            data: [ssSample],
            included: [ssFacultySponsor, ssSampleMetadata, ssStudyMetadata, ssStudy],
          }),
      })

      const { data, errors } = await fetchSequencescapeSamples([{ external_id: 'uuid' }])
      expect(errors).toEqual({})
      expect(data).toHaveLength(1)
      expect(data[0]).toEqual({
        id: ssSample.id,
        sanger_sample_id: ssSample.attributes.sanger_sample_id,
        uuid: ssSample.attributes.uuid,
        cohort: ssSampleMetadata.attributes.cohort,
        concentration: ssSampleMetadata.attributes.concentration,
        volume: ssSampleMetadata.attributes.volume,
        study_number: ssStudy.id,
        study_name: ssStudy.attributes.name,
        submitting_faculty: ssFacultySponsor.attributes.name,
      })
    })
  })
})
