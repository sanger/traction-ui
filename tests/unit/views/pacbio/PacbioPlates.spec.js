import PacbioPlates from '@/views/pacbio/PacbioPlates'
import { mount, localVue, store, Data } from '../../testHelper'
import Response from '@/api/Response'
import VueRouter from 'vue-router'

describe('PacbioPlates.vue', () => {
  let wrapper, plates, mockPlates, router

  beforeEach(() => {
    mockPlates = new Response(Data.PacbioPlates).deserialize.plates
    store.commit('traction/pacbio/plates/setPlates', mockPlates)

    router = new VueRouter({
      routes: [
        {
          path: '/pacbio/plates',
          name: 'PacbioPlates',
          component: PacbioPlates,
        },
      ],
    })

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
    plates.provider = jest.fn()
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
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(mockPlates.length)
    })
  })

  describe('Plate display button', () => {
    let button

    it('is present for each plate', () => {
      button = wrapper.find('#details-btn-1')
      expect(button.text()).toEqual('Show Plate')
    })

    it('has a plate component on button click', async () => {
      button = wrapper.find('#details-btn-1')
      await button.trigger('click')
      expect(wrapper.findComponent({ ref: 'plate' }).exists()).toBeTruthy()
      expect(button.text()).toEqual('Hide Plate')
    })
  })

  describe('perPage', () => {
    beforeEach(() => {
      wrapper = mount(PacbioPlates, {
        store,
        router,
        localVue,
      })
      wrapper.setData({ perPage: 1 })
    })

    it('states how many rows the table should contain', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
    })
  })

  describe('#alert', () => {
    it('shows an alert', () => {
      plates.showAlert = jest.fn()
      plates.alert('message', 'type')
      expect(plates.showAlert).toBeCalledWith('message', 'type')
    })
  })
})
