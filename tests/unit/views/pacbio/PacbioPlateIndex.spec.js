import PacbioPlates from '@/views/pacbio/PacbioPlateIndex'
import { mount, store, Data, router, flushPromises } from '@support/testHelper'

describe('PacbioPlates.vue', () => {
  let wrapper, plates

  beforeEach(async () => {
    const get = vi.spyOn(store.state.api.traction.pacbio.plates, 'get')
    get.mockResolvedValue(Data.PacbioPlatesRequest)

    wrapper = mount(PacbioPlates, {
      store,
      router,
      stubs: {
        // Plate: true, // Stubbed to prevent unnecessarily loading the plate SVG
      },
    })

    wrapper.setData({ sortDesc: false })
    plates = wrapper.vm
    await flushPromises()
  })

  describe('building the table', () => {
    it('will have a table', () => {
      expect(wrapper.find('table').exists()).toBeTruthy()
    })

    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of plates.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })
  })

  describe('Plate display button', () => {
    let button

    it('is present for each plate', () => {
      // btn-61 because that is the first plate ID in the mocked data
      button = wrapper.find('#details-btn-61')
      expect(button.text()).toEqual('Show Plate')
    })

    it('has a plate component on button click', async () => {
      button = wrapper.find('#details-btn-61')
      await button.trigger('click')
      // Here we flush promises because the getPlate promise needs to be resolved to see the plate
      await flushPromises()
      expect(wrapper.findComponent({ ref: 'plate' }).exists()).toBeTruthy()
      expect(button.text()).toEqual('Hide Plate')
    })
  })

  describe('pagination', () => {
    beforeEach(async () => {
      const filtered_data = { ...Data.PacbioPlatesRequest }
      filtered_data.data.data.splice(1, 2)
      const get = vi.spyOn(store.state.api.traction.pacbio.plates, 'get')
      get.mockResolvedValue(Data.PacbioPlatesRequest)

      wrapper = mount(PacbioPlates, {
        store,
      })
      await flushPromises()

      get.mockReturnValue(filtered_data)
      // This push causes pacbio plates to be fetched because of filterCard watchers
      // And we return filtered_data
      await router.push({ query: { page_size: 1, page_number: 1 } })
    })

    it('will paginate the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.vm.page_number).toEqual(1)
      expect(wrapper.vm.page_size).toEqual(1)
    })

    it('calls fetcher with the correct data given the query params', async () => {
      await router.push({
        query: { page_size: 2, page_number: 2, filter_value: '123', filter_input: 'barcode' },
      })
      wrapper.vm.setPlates = vi.fn()
      wrapper.vm.setPlates.mockReturnValue({ success: true, errors: [], meta: { page_count: 1 } })

      await wrapper.vm.fetchPlates()
      expect(wrapper.vm.setPlates).toBeCalledWith({
        page: { size: '2', number: '2' },
        filter: { 123: 'barcode' },
      })
    })
  })

  describe('#alert', () => {
    it('shows an alert', () => {
      plates.showAlert = vi.fn()
      plates.alert('message', 'type')
      expect(plates.showAlert).toBeCalledWith('message', 'type')
    })
  })
})
