import { mount } from '@support/testHelper'
import useRootStore from '@/stores'
import SampleReport from '@/views/SampleReport.vue'

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))
vi.mock('@/lib/csv/creator', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    downloadBlob: vi.fn(), // mock the downloadBlob method
  }
})
import { createPinia, setActivePinia, flushPromises } from '@support/testHelper.js'

describe('SampleReport', () => {
  let rootStore, get, ss_get
  const buildWrapper = () => {
    return mount(SampleReport)
  }

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

  const expectedSample = {
    // SS Attributes
    id: ss_sample.id,
    sanger_sample_id: ss_sample.attributes.sanger_sample_id,
    uuid: ss_sample.attributes.uuid,
    cohort: ss_sampleMetadata.attributes.cohort,
    concentration: ss_sampleMetadata.attributes.concentration,
    volume: ss_sampleMetadata.attributes.volume,
    study_number: ss_study.id,
    study_name: ss_study.attributes.name,
    submitting_faculty: ss_facultySponsor.attributes.name,

    // Traction attributes
    request_id: request.id,
    cost_code: request.attributes.cost_code,
    library_type: request.attributes.library_type,
    date_of_sample_collection: sample.attributes.date_of_sample_collection,
    supplier_name: sample.attributes.supplier_name,
    donor_id: sample.attributes.donor_id,
    species: sample.attributes.species,
    external_id: sample.attributes.external_id,
  }

  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
        up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)

    // Mock the root store and its API
    rootStore = useRootStore()
    get = vi.fn()
    rootStore.api.traction.pacbio.requests.get = get

    ss_get = vi.fn()
    rootStore.api.sequencescape.samples.get = ss_get
  })

  describe('sample input', () => {
    it('adds a sample when the input is not empty', async () => {
      const wrapper = buildWrapper()
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

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('sample1')
      await wrapper.find('#searchSamples').trigger('click')
      await flushPromises()

      expect(wrapper.vm.samples).toEqual([expectedSample])
    })

    it('does not add a sample when the service returns no data', async () => {
      const wrapper = buildWrapper()
      get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [], included: [] }),
      })

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('123')
      await wrapper.find('#searchSamples').trigger('click')
      await flushPromises()

      expect(wrapper.vm.samples).toEqual([])
      expect(mockShowAlert).toBeCalledWith(
        'No samples found in Traction with the provided input',
        'warning',
      )
    })

    it('does not add a sample if it already exists in the list', async () => {
      const wrapper = buildWrapper()
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
      wrapper.vm.samples = [{ request_id: request.id }]

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('sample1')
      await wrapper.find('#searchSamples').trigger('click')
      await flushPromises()

      expect(wrapper.vm.samples).toEqual([{ request_id: request.id }])
      expect(mockShowAlert).toBeCalledWith('Sample sample1 already exists in the list', 'info')
    })

    it('shows an error alert if the service returns an error', async () => {
      const wrapper = buildWrapper()
      get.mockRejectedValue('Internal Server Error')

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('errorSample')
      await wrapper.find('#searchSamples').trigger('click')
      await flushPromises()

      expect(mockShowAlert).toBeCalledWith(
        'Error fetching samples from Traction: Internal Server Error',
        'danger',
      )
    })

    it('shows an error alert if sequencescape returns an error', async () => {
      const wrapper = buildWrapper()
      // Traction success
      get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [request], included: [sample] }),
      })
      // Sequencescape error
      ss_get.mockRejectedValue('Internal Server Error')

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('errorSample')
      await wrapper.find('#searchSamples').trigger('click')
      await flushPromises()

      expect(mockShowAlert).toBeCalledWith(
        'Error fetching samples from Sequencescape: Internal Server Error',
        'danger',
      )
    })
  })

  describe('sample table', () => {
    it('displays the correct columns', () => {
      const wrapper = buildWrapper()
      const table = wrapper.find('#sampleReportTable')
      const headers = table.findAll('th')
      for (const field of wrapper.vm.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
      expect(headers.length).toBe(wrapper.vm.fields.length)
    })

    it('shows no samples when the list is empty', () => {
      const wrapper = buildWrapper()
      expect(wrapper.find('[data-testid="empty-text"]').isVisible()).toBe(true)
      expect(wrapper.find('[data-testid="empty-text"]').text()).toBe('No samples added yet')
    })

    it('shows the correct sample data', async () => {
      const wrapper = buildWrapper()
      wrapper.vm.samples = [{ id: request.id }, { id: 2 }]
      await wrapper.vm.$nextTick()
      const rows = wrapper.findAll('tr')
      expect(rows.length).toBe(3) // 2 samples + header row
    })

    it('removes the correct row on remove button click', async () => {
      const wrapper = buildWrapper()
      wrapper.vm.samples = [{ id: request.id }, { id: 2 }]
      await wrapper.vm.$nextTick()
      const rows = wrapper.findAll('tr')
      expect(wrapper.vm.samples.length).toBe(2)
      expect(rows.length).toBe(3) // 2 samples + header row

      const removeButton = wrapper.find('#remove-btn-1')
      await removeButton.trigger('click')
      expect(wrapper.vm.samples).toEqual([{ id: 2 }])
      expect(wrapper.findAll('tr').length).toBe(2) // 1 sample + header row
    })
  })

  describe('report actions', () => {
    describe('Reset', () => {
      it('resets the sample list when reset button is clicked', async () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [{ request_id: request.id }, { request_id: 2 }]
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.samples.length).toBe(2)

        await wrapper.find('#reset').trigger('click')
        expect(wrapper.vm.samples.length).toBe(0)
        expect(wrapper.find('[data-testid="empty-text"]').isVisible()).toBe(true)
        expect(wrapper.find('[data-testid="empty-text"]').text()).toBe('No samples added yet')
      })
    })

    describe('Download', () => {
      it('is disabled when no samples are present', () => {
        const wrapper = buildWrapper()
        expect(wrapper.find('#download').element.disabled).toBe(true)
      })

      it('is enabled when samples are present', async () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [{ id: request.id }]
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#download').element.disabled).toBe(false)
      })
    })
  })

  describe('methods', () => {
    describe('downloadReport', () => {
      it('downloads a CSV file with the correct content', async () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [expectedSample]
        await wrapper.vm.$nextTick()

        // Get the mocked downloadBlob from the module mock
        const { downloadBlob } = await import('@/lib/csv/creator')

        await wrapper.find('#download').trigger('click')

        const time = new Date().toLocaleDateString()

        expect(downloadBlob).toHaveBeenCalledWith(
          // Just check headers as this is testing elswhere
          expect.stringContaining(
            '"Date of Sample Collection","Sample ID","Sanger Sample ID","Supplier Sample Name","Cohort","Study Number","Study Name","Cost Code","Species","Supplied Concentration (ng/uL)","Supplied Volume (uL)","Submitting Faculty","Library Type","Sample Type"',
          ),
          `traction_sample_report_${time}.csv`,
          'text/csv',
        )
      })
    })

    describe('reset', () => {
      it('clears the sample list', () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [expectedSample]
        expect(wrapper.vm.samples.length).toBe(1)
        wrapper.vm.reset()
        expect(wrapper.vm.samples.length).toBe(0)
      })
    })

    describe('removeSample', () => {
      it('removes the sample given the request_id', () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [{ request_id: request.id }, { request_id: 2 }]
        expect(wrapper.vm.samples.length).toBe(2)

        wrapper.vm.removeSample(request.id)
        expect(wrapper.vm.samples.length).toBe(1)
        expect(wrapper.vm.samples[0].request_id).toBe(2)
      })

      it('does not throw an error if the index is out of bounds', () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [{ request_id: request.id }]
        expect(() => wrapper.vm.removeSample(5)).not.toThrow()
      })
    })

    describe('fetchTractionSamples', () => {
      it('fetches samples from Traction API', async () => {
        const wrapper = buildWrapper()
        wrapper.vm.sample_input = 'sample1'
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

        const tractionSamples = await wrapper.vm.fetchTractionSamples()
        expect(tractionSamples).toEqual([
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
        ])
        expect(get).toHaveBeenCalledWith({
          filter: { sample_name: 'sample1' },
          include: 'sample',
        })
      })

      it('fetches multiple samples from Traction API across filter types', async () => {
        const wrapper = buildWrapper()
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
        wrapper.vm.sample_input = 'sample1,sample2'
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
        const tractionSamples = await wrapper.vm.fetchTractionSamples()
        expect(tractionSamples).toEqual([
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
      })

      it('shows an error alert if Traction API returns an error', async () => {
        const wrapper = buildWrapper()
        get.mockRejectedValue('Internal Server Error')

        await wrapper.vm.fetchTractionSamples()
        expect(mockShowAlert).toBeCalledWith(
          'Error fetching samples from Traction: Internal Server Error',
          'danger',
        )
      })

      it('shows a warning if the sample already exists', async () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [{ request_id: request.id }]
        wrapper.vm.sample_input = 'sample1'
        get.mockResolvedValue({
          status: 200,
          statusText: 'OK',
          ok: true,
          json: () => Promise.resolve({ data: [request], included: [sample] }),
        })

        await wrapper.vm.fetchTractionSamples()
        expect(mockShowAlert).toBeCalledWith('Sample sample1 already exists in the list', 'info')
      })
    })

    describe('fetchSequencescapeSamples', () => {
      it('fetches samples from Sequencescape API', async () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [expectedSample]
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

        const sequencescapeSamples = await wrapper.vm.fetchSequencescapeSamples(wrapper.vm.samples)
        expect(sequencescapeSamples).toEqual([
          {
            id: ss_sample.id,
            sanger_sample_id: ss_sample.attributes.sanger_sample_id,
            uuid: ss_sample.attributes.uuid,
            cohort: ss_sampleMetadata.attributes.cohort,
            concentration: ss_sampleMetadata.attributes.concentration,
            volume: ss_sampleMetadata.attributes.volume,
            study_number: ss_study.id,
            study_name: ss_study.attributes.name,
            submitting_faculty: ss_facultySponsor.attributes.name,
          },
        ])
        expect(ss_get).toHaveBeenCalledWith({
          filter: { uuid: expectedSample.external_id },
          include: 'sample_metadata,studies.study_metadata.faculty_sponsor',
        })
      })

      it('shows an error alert if Sequencescape API returns an error', async () => {
        const wrapper = buildWrapper()
        ss_get.mockRejectedValue('Internal Server Error')

        await wrapper.vm.fetchSequencescapeSamples([expectedSample])
        expect(mockShowAlert).toBeCalledWith(
          'Error fetching samples from Sequencescape: Internal Server Error',
          'danger',
        )
      })
    })
  })
})
