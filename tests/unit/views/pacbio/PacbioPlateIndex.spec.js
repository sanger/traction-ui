import PacbioPlates from '@/views/pacbio/PacbioPlateIndex'
import { mount, store, Data, router, flushPromises } from '@support/testHelper'

describe('PacbioPlates.vue', () => {
  let wrapper, plates

  beforeEach(async () => {
    const get = vi.spyOn(store.state.api.v1.traction.pacbio.plates, 'get')
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

  describe('#alert', () => {
    it('shows an alert', () => {
      plates.showAlert = vi.fn()
      plates.alert('message', 'type')
      expect(plates.showAlert).toBeCalledWith('message', 'type')
    })
  })
})
