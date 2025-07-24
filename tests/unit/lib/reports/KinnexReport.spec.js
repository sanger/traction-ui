import { fetchTractionSamples, fetchSequencescapeSamples } from '@/lib/reports/KinnexReport'
import useRootStore from '@/stores'
import { createPinia, setActivePinia } from '@support/testHelper.js'
import { expect } from 'vitest'

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

// TODO: hypothetical sample data for testing - move to factories or fixtures
const request = {
  id: 1,
  type: 'requests',
  attributes: {
    library_type: 'Pacbio_HiFi',
    estimate_of_gb_required: null,
    number_of_smrt_cells: null,
    cost_code: 'aCostCodeExample',
    external_study_id: '123',
    sample_name: 'Supplier B',
    barcode: 'NT6746',
    sample_species: 'human',
    created_at: '2025/06/23 13:05',
    source_identifier: 'NT6746',
    sample_retention_instruction: null,
  },
  relationships: {
    sample: {
      data: {
        type: 'samples',
        id: '2',
      },
    },
  },
}

const sample = {
  id: '2',
  type: 'samples',
  attributes: {
    name: 'test-sample-1',
    date_of_sample_collection: '2025-06-23',
    donor_id: 'donor-123',
    species: 'human',
    external_id: '123',
    retention_instruction: null,
    supplier_name: 'Supplier B',
    sanger_sample_id: 'id-123',
  },
}

const ss_sample = {
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

const ss_study = {
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

const ss_studyMetadata = {
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

const ss_sampleMetadata = {
  id: '1',
  type: 'sample_metadata',
  attributes: {
    cohort: 'Cohort 1',
    concentration: 50,
    volume: 100,
  },
}

const ss_facultySponsor = {
  id: '1',
  type: 'faculty_sponsors',
  attributes: {
    name: 'Faculty Sponsor 1',
  },
}

describe('KinnexReport', () => {
  let rootStore, get, ss_get

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    // Mock the root store and its API
    rootStore = useRootStore()
    get = vi.fn()
    rootStore.api.traction.pacbio.requests.get = get

    ss_get = vi.fn()
    rootStore.api.sequencescape.samples.get = ss_get
  })

  describe('fetchTractionSamples', () => {
    it('returns empty array and shows alert if both responses fail', async () => {
      get.mockRejectedValue('Internal Server Error')

      const result = await fetchTractionSamples('input', [])
      expect(result).toEqual([])
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Error fetching samples from Traction: Internal Server Error',
        'danger',
      )
    })

    it('returns empty array and shows alert if no data found', async () => {
      get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [], included: [] }),
      })

      const result = await fetchTractionSamples('input', [])
      expect(result).toEqual([])
      expect(mockShowAlert).toHaveBeenCalledWith(
        'No samples found in Traction with the provided input',
        'warning',
      )
    })

    it('removes duplicates and returns formatted samples', async () => {
      // Duplicates because the same sample is found in both requests
      get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })

      const result = await fetchTractionSamples('input', [])
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
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

    it('shows info alert if sample already exists', async () => {
      // Duplicates because the same sample is found in both requests
      get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })

      // Set the returned request to be one that already exists
      const result = await fetchTractionSamples('input', [{ request_id: request.id }])
      expect(result).toEqual([])
      expect(mockShowAlert).toHaveBeenCalledWith(
        expect.stringContaining('Sample input already exists in the list'),
        'info',
      )
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

      const result = await fetchTractionSamples('input', [])
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
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
      const result = await fetchTractionSamples('sample1,sample2', [])
      expect(result).toEqual([
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
      ss_get.mockRejectedValue('Internal Server Error')
      const result = await fetchSequencescapeSamples([{ external_id: 'ext' }])
      expect(result).toEqual([])
      expect(mockShowAlert).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching samples from Sequencescape: Internal Server Error'),
        'danger',
      )
    })

    it('returns empty array and shows alert if no data found', async () => {
      ss_get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [], included: [] }),
      })
      const result = await fetchSequencescapeSamples([{ external_id: 'ext' }])
      expect(result).toEqual([])
      expect(mockShowAlert).toHaveBeenCalledWith(
        'No samples found in Sequencescape with the provided input',
        'warning',
      )
    })

    it('returns formatted samples from Sequencescape', async () => {
      ss_get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () =>
          Promise.resolve({
            data: [ss_sample],
            included: [ss_facultySponsor, ss_sampleMetadata, ss_studyMetadata, ss_study],
          }),
      })

      const result = await fetchSequencescapeSamples([{ external_id: 'uuid' }])
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: ss_sample.id,
        sanger_sample_id: ss_sample.attributes.sanger_sample_id,
        uuid: ss_sample.attributes.uuid,
        cohort: ss_sampleMetadata.attributes.cohort,
        concentration: ss_sampleMetadata.attributes.concentration,
        volume: ss_sampleMetadata.attributes.volume,
        study_number: ss_study.id,
        study_name: ss_study.attributes.name,
        submitting_faculty: ss_facultySponsor.attributes.name,
      })
    })
  })
})
