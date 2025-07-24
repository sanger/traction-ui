import { mount } from '@support/testHelper'
import useRootStore from '@/stores'
import SampleReport from '@/views/SampleReport.vue'
import { createPinia, setActivePinia, flushPromises } from '@support/testHelper.js'
import { fetchTractionSamples, fetchSequencescapeSamples } from '@/lib/reports/KinnexReport.js'

const mockShowAlert = vi.fn()

// We need to hoist and mock the fetch functions to control their behavior in tests
// and also keep the original functionality of the rest of the module
// See https://vitest.dev/api/vi.html#vi-mock
const mocks = vi.hoisted(() => {
  return {
    fetchSequencescapeSamples: vi.fn(),
    fetchTractionSamples: vi.fn(),
  }
})

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
vi.mock('@/lib/reports/KinnexReport.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    fetchSequencescapeSamples: mocks.fetchSequencescapeSamples,
    fetchTractionSamples: mocks.fetchTractionSamples,
  }
})

const tractionExpectedSample = {
  request_id: 1,
  cost_code: 'aCostCodeExample',
  library_type: 'Pacbio_HiFi',
  date_of_sample_collection: '2025-06-23',
  supplier_name: 'Supplier B',
  donor_id: 'donor-123',
  species: 'human',
  external_id: '123',
}

const ssExpectedSample = {
  id: '2',
  sanger_sample_id: 'id-123',
  uuid: '123',
  cohort: 'Cohort 1',
  concentration: 50,
  volume: 100,
  study_number: '1',
  study_name: 'Study 1',
  submitting_faculty: 'Faculty Sponsor 1',
}

describe('SampleReport', () => {
  let rootStore, get, ss_get
  const buildWrapper = () => {
    return mount(SampleReport)
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
      vi.mocked(fetchTractionSamples).mockResolvedValue({
        data: [tractionExpectedSample],
        errors: {},
      })
      vi.mocked(fetchSequencescapeSamples).mockResolvedValue({
        data: [ssExpectedSample],
        errors: {},
      })

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('sample1')
      await wrapper.find('#searchSamples').trigger('click')
      await flushPromises()

      expect(wrapper.vm.samples).toEqual([{ ...tractionExpectedSample, ...ssExpectedSample }])
    })

    it('correctly combines multiple samples', async () => {
      const wrapper = buildWrapper()
      vi.mocked(fetchTractionSamples).mockResolvedValue({
        data: [
          tractionExpectedSample,
          // only include information required for linking and some metadata
          { cost_code: 'cost-code-2', species: 'species-1', external_id: 'sample2-id' },
          { cost_code: 'cost-code-3', species: 'species-2', external_id: 'sample3-id' },
          // Sample with no matching Sequencescape data
          { cost_code: 'cost-code-4', species: 'species-3', external_id: 'sample4-id' },
        ],
        errors: {},
      })
      vi.mocked(fetchSequencescapeSamples).mockResolvedValue({
        data: [
          ssExpectedSample,
          // only include information required for linking and some metadata
          { concentration: 5, volume: 10, uuid: 'sample2-id' },
          { concentration: 1, volume: 1, uuid: 'sample3-id' },
        ],
        errors: {},
      })

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('sample1,sample2,sample3')
      await wrapper.find('#searchSamples').trigger('click')
      await flushPromises()

      expect(wrapper.vm.samples).toEqual([
        { ...tractionExpectedSample, ...ssExpectedSample },
        {
          cost_code: 'cost-code-2',
          species: 'species-1',
          external_id: 'sample2-id',
          concentration: 5,
          volume: 10,
          uuid: 'sample2-id',
        },
        {
          cost_code: 'cost-code-3',
          species: 'species-2',
          external_id: 'sample3-id',
          concentration: 1,
          volume: 1,
          uuid: 'sample3-id',
        },
        { cost_code: 'cost-code-4', species: 'species-3', external_id: 'sample4-id' },
      ])
    })

    it('does not add a sample if traction returns empty', async () => {
      const wrapper = buildWrapper()
      vi.mocked(fetchTractionSamples).mockResolvedValue({
        data: [],
        errors: {
          message: 'No samples found in Traction with the provided input',
          type: 'warning',
        },
      })

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('sample1')
      await wrapper.find('#searchSamples').trigger('click')
      await flushPromises()

      expect(mockShowAlert).toHaveBeenCalledWith(
        'No samples found in Traction with the provided input',
        'warning',
      )
      expect(wrapper.vm.samples).toEqual([])
    })

    it('does not add a sample if traction returns but sequencescape does not', async () => {
      const wrapper = buildWrapper()
      vi.mocked(fetchTractionSamples).mockResolvedValue({
        data: [tractionExpectedSample],
        errors: {},
      })
      vi.mocked(fetchSequencescapeSamples).mockResolvedValue({
        data: [],
        errors: {
          message: 'No samples found in Sequencescape with the provided input',
          type: 'warning',
        },
      })

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('sample1')
      await wrapper.find('#searchSamples').trigger('click')
      await flushPromises()

      expect(mockShowAlert).toHaveBeenCalledWith(
        'No samples found in Sequencescape with the provided input',
        'warning',
      )
      expect(wrapper.vm.samples).toEqual([])
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
      wrapper.vm.samples = [{ id: 1 }, { id: 2 }]
      await wrapper.vm.$nextTick()
      const rows = wrapper.findAll('tr')
      expect(rows.length).toBe(3) // 2 samples + header row
    })

    it('removes the correct row on remove button click', async () => {
      const wrapper = buildWrapper()
      wrapper.vm.samples = [{ id: 1 }, { id: 2 }]
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
        wrapper.vm.samples = [{ request_id: 1 }, { request_id: 2 }]
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
        wrapper.vm.samples = [{ id: 1 }]
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#download').element.disabled).toBe(false)
      })
    })
  })

  describe('methods', () => {
    describe('downloadReport', () => {
      it('downloads a CSV file with the correct content', async () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [{ ...tractionExpectedSample, ...ssExpectedSample }]
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
        wrapper.vm.samples = [{ ...tractionExpectedSample, ...ssExpectedSample }]
        expect(wrapper.vm.samples.length).toBe(1)
        wrapper.vm.reset()
        expect(wrapper.vm.samples.length).toBe(0)
      })
    })

    describe('removeSample', () => {
      it('removes the sample given the request_id', () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [{ request_id: 1 }, { request_id: 2 }]
        expect(wrapper.vm.samples.length).toBe(2)

        wrapper.vm.removeSample(1)
        expect(wrapper.vm.samples.length).toBe(1)
        expect(wrapper.vm.samples[0].request_id).toBe(2)
      })

      it('does not throw an error if the index is out of bounds', () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [{ request_id: 1 }]
        expect(() => wrapper.vm.removeSample(5)).not.toThrow()
      })
    })
  })
})
