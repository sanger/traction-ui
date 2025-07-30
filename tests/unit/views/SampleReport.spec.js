import { mount } from '@support/testHelper.js'
import useRootStore from '@/stores'
import SampleReport from '@/views/SampleReport.vue'
import { createPinia, setActivePinia, flushPromises } from '@support/testHelper.js'
import { fetchFunction } from '@/lib/reports/KinnexReport.js'
import Reports from '@/lib/reports'

const mockShowAlert = vi.fn()

// We need to hoist and mock the fetch functions to control their behavior in tests
// and also keep the original functionality of the rest of the module
// See https://vitest.dev/api/vi.html#vi-mock
const mocks = vi.hoisted(() => {
  return {
    fetchFunction: vi.fn(),
  }
})

vi.mock('@/composables/useAlert.js', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))
vi.mock('@/lib/csv/creator.js', async (importOriginal) => {
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
    fetchFunction: mocks.fetchFunction,
  }
})

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
    rootStore.api.sequencescape.studies.get = ss_get
  })

  describe('report type', () => {
    it('contains a list of report types', () => {
      const expectedOptions = [...Object.values(Reports).map((r) => r.text)]
      const wrapper = buildWrapper()
      expect(
        wrapper
          .find('[data-type=report-type]')
          .findAll('option')
          .map((element) => element.text()),
      ).toEqual(expectedOptions)
    })

    it('resets the sample list when the report type changes', async () => {
      const wrapper = buildWrapper()
      wrapper.vm.samples = [{ request_id: 1 }, { request_id: 2 }]
      expect(wrapper.vm.samples.length).toBe(2)

      const select = wrapper.find('[data-type=report-type]')
      await select.setValue('mock-report-type')

      expect(wrapper.vm.samples.length).toBe(0)
    })
  })

  describe('sample input', () => {
    it('adds a sample when the input is not empty', async () => {
      const wrapper = buildWrapper()
      vi.mocked(fetchFunction).mockResolvedValue({
        data: [{ request_id: 1 }],
        errors: {},
      })

      const sampleInput = wrapper.find('[data-attribute=sample-input]')
      await sampleInput.setValue('sample1')
      await wrapper.find('#searchSamples').trigger('click')
      await flushPromises()

      expect(wrapper.vm.samples).toEqual([{ request_id: 1 }])
    })

    it('is disabled when the report type is not set', async () => {
      const wrapper = buildWrapper()
      wrapper.vm.report_type = null
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-attribute=sample-input]').element.disabled).toBe(true)
      expect(wrapper.find('#searchSamples').element.disabled).toBe(true)
    })

    it('shows the correct error message when no samples are found', async () => {
      const wrapper = buildWrapper()
      vi.mocked(fetchFunction).mockResolvedValue({
        data: [],
        errors: { message: 'Internal server error', type: 'danger' },
      })

      const sampleInput = wrapper.find('[data-attribute=sample-input]')
      await sampleInput.setValue('nonexistent-sample')
      await wrapper.find('#searchSamples').trigger('click')
      await flushPromises()

      expect(wrapper.vm.samples).toEqual([])
      expect(mockShowAlert).toHaveBeenCalledWith('Internal server error', 'danger')
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

    it('does not show the table when a report has not been selected', async () => {
      const wrapper = buildWrapper()
      wrapper.vm.report_type = null
      await wrapper.vm.$nextTick()

      expect(wrapper.find('#sampleReportTable').exists()).toBe(false)
      expect(wrapper.text()).toContain(
        'Please select a report type to start generating your sample report',
      )
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
        wrapper.vm.samples = [{ request_id: 1 }]
        await wrapper.vm.$nextTick()

        // Get the mocked downloadBlob from the module mock
        const { downloadBlob } = await import('@/lib/csv/creator')

        await wrapper.find('#download').trigger('click')

        const time = new Date().toLocaleDateString()

        expect(downloadBlob).toHaveBeenCalledWith(
          // Just check headers as this is testing elswhere
          expect.stringContaining(
            '"Date of Sample Collection","Sample ID","Sanger Sample ID","Supplier Sample Name","Study Number","Study Name","Cost Code","Species","Submitting Faculty","Library Type","Sample Type"',
          ),
          `traction_sample_report_${time}.csv`,
          'text/csv',
        )
      })
    })

    describe('reset', () => {
      it('clears the sample list', () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [{ request_id: 1 }, { request_id: 2 }]
        expect(wrapper.vm.samples.length).toBe(2)
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
