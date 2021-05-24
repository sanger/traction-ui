import PacbioPlates from '@/views/pacbio/PacbioPlates'
import { mount, localVue, store, Data } from '../../testHelper'
import Response from '@/api/Response'
import VueRouter from 'vue-router'

describe('PacbioPlates.vue', () => {
  let wrapper, plates, mockPlates, router

  beforeEach(() => {
    mockPlates = new Response(Data.PacbioPlate).deserialize.plates
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

  describe('Info button', () => {
    let button

    it('is present for each plate', () => {
      button = wrapper.find('#infoPlateBtn-1')
      expect(button.text()).toEqual('+')
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
