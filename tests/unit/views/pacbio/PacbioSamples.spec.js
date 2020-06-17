import Samples from '@/views/pacbio/PacbioSamples'
import { mount, localVue, Data } from '../../testHelper'
import VueRouter from 'vue-router'
import Response from '@/api/Response'
import store from '@/store'

describe('Samples.vue', () => {
  let wrapper, samples, mockSamples

  beforeEach(() => {
    mockSamples = new Response(Data.TractionPacbioSamples).deserialize.requests

    const router = new VueRouter({
      routes: [{
        path: '/pacbio/samples',
        name: 'PacbioSamples',
        component: Samples,
        props: true
      }]
    })

    store.commit('traction/pacbio/requests/setRequests', mockSamples)

    wrapper = mount(Samples, {
      store,
      router,
      localVue
    })

    // TODO: Vue no longer allows you to override methods in mount. This causes all sorts of issues which we need to fix.
    wrapper.setData({ sortDesc: false })
    samples = wrapper.vm
    samples.provider = jest.fn()
    // TODO: why do we have to mock method here. 
    samples.handlePrintLabel = jest.fn()

  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of samples.fields) {
          expect(headers.filter(header => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(6)
    })
  })

  describe('#showAlert', () => {
    it.skip('passes the message to function on emit event', () => {
      samples.showAlert('show this message', 'danger')
      expect(wrapper.findComponent({ref: 'alert'}).html()).toMatch('show this message')
    })
  })

  describe('printerModal', () => {

    it('passes selected printer to function on emit event', () => {
      samples.selected = [{ id: 1 }]
      let modal = wrapper.findComponent({ref: 'print'})
      modal.vm.$emit('selectPrinter', 'printer1')
      expect(samples.handlePrintLabel).toBeCalledWith('printer1')
    })
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.findComponent({ref: 'alert'}).exists()).toBeTruthy()
    })
  })

  describe('sample metadata modal', () => {
    it('contains sample metadata modal', () => {
      expect(wrapper.findComponent({ref: 'sampleMetadata'}).exists()).toBeTruthy()
    })
  })

  describe('Details button', () => {
    let button

    it('is present for each sample', () => {
      button = wrapper.find('#details-btn-1')
      expect(button.text()).toEqual('Show Details')
    })
  })
})

