import { mount } from '@support/testHelper'
import useRootStore from '@/stores'
import SampleReport from '@/views/SampleReport.vue'

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))
import { createPinia, setActivePinia } from '@support/testHelper.js'

describe('SampleReport', () => {
  let rootStore, get
  const buildWrapper = () => {
    return mount(SampleReport)
  }

  // TODO: hypothetical sample data for testing
  const sample = {
    id: 1,
    attributes: {
      submission_date: '2023-10-01',
      sanger_sample_id: 'SANGER-123',
      supplier_sample_name: 'Supplier Sample',
      cohort: 'Cohort A',
      study_number: 'Study 001',
      study_name: 'Study Name A',
      sample_type: 'Type A',
      cost_code: 'Cost-123',
      species: 'Species A',
      cell_type: 'Cell Type A',
      no_of_requested_cell_type: 100,
      supplied_concentration: 1.5,
      supplied_volume: 10,
      submitting_faculty: 'Faculty A',
      library_type: 'Library Type A',
      // TODO: this field is a field for the table not the report. This should be removed
      remove: '',
    },
  }

  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
        up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)

    // Mock the root store and its API
    rootStore = useRootStore()
    get = vi.fn()
    rootStore.api.traction.samples.get = get
  })

  describe('sample input', () => {
    it('adds a sample when the input is not empty', async () => {
      const wrapper = buildWrapper()
      get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [sample] }),
      })

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('sample1')
      await wrapper.find('#searchSamples').trigger('click')
      expect(wrapper.vm.samples).toEqual([{ id: sample.id, ...sample.attributes }])
    })

    it('does not add a sample when the service returns no data', async () => {
      const wrapper = buildWrapper()
      get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      })

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('123')
      await wrapper.find('#searchSamples').trigger('click')
      expect(wrapper.vm.samples).toEqual([])
      expect(mockShowAlert).toBeCalledWith('No samples found with the provided input', 'warning')
    })

    it('does not add a sample if it already exists in the list', async () => {
      const wrapper = buildWrapper()
      get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        json: () => Promise.resolve({ data: [sample] }),
      })
      wrapper.vm.samples = [{ id: sample.id, ...sample.attributes }]

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('sample1')
      await wrapper.find('#searchSamples').trigger('click')
      expect(wrapper.vm.samples).toEqual([{ id: sample.id, ...sample.attributes }])
      expect(mockShowAlert).toBeCalledWith('Sample sample1 already exists in the list', 'info')
    })

    it('shows an error alert if the service returns an error', async () => {
      const wrapper = buildWrapper()
      get.mockRejectedValue('Internal Server Error')

      const sampleInput = wrapper.find('#sampleInput')
      await sampleInput.setValue('errorSample')
      await wrapper.find('#searchSamples').trigger('click')
      expect(mockShowAlert).toBeCalledWith(
        'Error fetching samples: Internal Server Error',
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
      wrapper.vm.samples = [
        { id: sample.id, ...sample.attributes },
        { id: 2, ...sample.attributes },
      ]
      await wrapper.vm.$nextTick()
      const rows = wrapper.findAll('tr')
      expect(rows.length).toBe(3) // 2 samples + header row
    })

    it('removes the correct row on remove button click', async () => {
      const wrapper = buildWrapper()
      wrapper.vm.samples = [
        { id: sample.id, ...sample.attributes },
        { id: 2, ...sample.attributes },
      ]
      await wrapper.vm.$nextTick()
      const rows = wrapper.findAll('tr')
      expect(wrapper.vm.samples.length).toBe(2)
      expect(rows.length).toBe(3) // 2 samples + header row

      const removeButton = wrapper.find('#remove-btn-1')
      await removeButton.trigger('click')
      expect(wrapper.vm.samples).toEqual([{ id: 2, ...sample.attributes }])
      expect(wrapper.findAll('tr').length).toBe(2) // 1 sample + header row
    })
  })

  describe('report actions', () => {
    describe('Reset', () => {
      it('resets the sample list when reset button is clicked', async () => {
        const wrapper = buildWrapper()
        wrapper.vm.samples = [
          { id: sample.id, ...sample.attributes },
          { id: 2, ...sample.attributes },
        ]
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
        wrapper.vm.samples = [{ id: sample.id, ...sample.attributes }]
        await wrapper.vm.$nextTick()
        expect(wrapper.find('#download').element.disabled).toBe(false)
      })
    })
  })
})
