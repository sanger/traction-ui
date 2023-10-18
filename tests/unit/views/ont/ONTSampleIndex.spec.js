import ONTSampleIndex from '@/views/ont/ONTSampleIndex.vue'
import { mount, store, Data, flushPromises, router } from '@support/testHelper'
import { vi } from 'vitest'

describe('OntSampleIndex', () => {
  let wrapper

  beforeEach(async () => {
    const get = vi.spyOn(store.state.api.traction.ont.requests, 'get')
    get.mockReturnValue(Data.TractionOntRequests)

    wrapper = mount(ONTSampleIndex, {
      store,
    })
    await flushPromises()
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of wrapper.vm.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('displays each of the requests', async () => {
      const expectedRequests = Data.TractionOntRequests.data.data.length
      expect(wrapper.findAll('tr').length).toEqual(expectedRequests + 1)
    })
  })

  describe('pagination', () => {
    beforeEach(async () => {
      const filtered_data = { ...Data.TractionOntRequests }
      filtered_data.data.data.splice(2, 4)
      const get = vi.spyOn(store.state.api.traction.pacbio.runs, 'get')
      get.mockReturnValue(Data.TractionOntRequests)

      wrapper = mount(ONTSampleIndex, {
        store,
      })
      await flushPromises()

      get.mockReturnValue(filtered_data)
      // This push causes pacbio runs to be fetched because of filterCard watchers
      // And we return filtered_data
      await router.push({ query: { page_size: 2, page_number: 1 } })
    })

    it('will paginate the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
      expect(wrapper.vm.page_number).toEqual(1)
      expect(wrapper.vm.page_size).toEqual(2)
    })

    it('calls fetcher with the correct data given the query params', async () => {
      await router.push({
        query: { page_size: 2, page_number: 2, filter_value: '123', filter_input: 'barcode' },
      })
      wrapper.vm.fetchOntRequests = vi.fn()
      wrapper.vm.fetchOntRequests.mockReturnValue({
        success: true,
        errors: [],
        meta: { page_count: 1 },
      })

      await wrapper.vm.fetchRequests()
      expect(wrapper.vm.fetchOntRequests).toBeCalledWith({
        page: { size: '2', number: '2' },
        filter: { 123: 'barcode' },
      })
    })
  })
})
