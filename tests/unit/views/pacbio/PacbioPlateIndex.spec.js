import PacbioPlates from '@/views/pacbio/PacbioPlateIndex'
import { mount, localVue, store, Data, router } from '@support/testHelper'
import flushPromises from 'flush-promises'

describe('PacbioPlates.vue', () => {
  let wrapper, plates

  beforeEach(async () => {
    const get = vi.spyOn(store.state.api.traction.pacbio.plates, 'get')
    get.mockResolvedValue(Data.PacbioPlatesRequest)

    wrapper = mount(PacbioPlates, {
      store,
      router,
      localVue,
      stubs: {
        Plate: true, // Stubbed to prevent unnecessarily loading the plate SVG
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
      let headers = wrapper.findAll('th')
      for (let field of plates.fields) {
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
      expect(wrapper.findComponent({ ref: 'plate' }).exists()).toBeTruthy()
      expect(button.text()).toEqual('Hide Plate')
    })
  })

  describe('perPage', () => {
    beforeEach(async () => {
      const get = vi.spyOn(store.state.api.traction.pacbio.plates, 'get')
      get.mockResolvedValue(Data.PacbioPlatesRequest)

      wrapper = mount(PacbioPlates, {
        store,
        router,
        localVue,
      })
      wrapper.setData({ perPage: 1 })
      await flushPromises()
    })

    it('states how many rows the table should contain', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
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
