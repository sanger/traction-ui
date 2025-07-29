import PacbioPlates from '@/views/pacbio/PacbioPlateIndex.vue'
import { mount, store, router, flushPromises } from '@support/testHelper.js'
import PacbioPlateFactory from '@tests/factories/PacbioPlateFactory.js'

describe.skip('PacbioPlates.vue', () => {
  let wrapper, plates
  const pacbioPlateFactory = PacbioPlateFactory()
  beforeEach(async () => {
    const get = vi.spyOn(store.state.api.traction.pacbio.plates, 'get')
    get.mockResolvedValue(pacbioPlateFactory.responses.fetch)

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
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of plates.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(3)
    })
  })

  describe('Plate display button', () => {
    let button

    it('is present for each plate', () => {
      // first plate ID in the mocked data
      button = wrapper.find(`#details-btn-${pacbioPlateFactory.storeData.selected.plate.id}`)
      expect(button.text()).toEqual('Show Plate')
    })

    it('has a plate component on button click', async () => {
      button = wrapper.find(`#details-btn-${pacbioPlateFactory.storeData.selected.plate.id}`)
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
