import Samples from '@/views/pacbio/PacbioSampleIndex'
import { mount, localVue, store, Data } from '../../testHelper'
import VueRouter from 'vue-router'
import Response from '@/api/Response'

// TODO: why do we need to set sortDesc to false? I think we also need to isolate tests
describe('Samples.vue', () => {
  let wrapper, samples, mockSamples, router

  beforeEach(() => {
    mockSamples = new Response(Data.TractionPacbioSamples).deserialize.requests
    store.commit('traction/pacbio/requests/setRequests', mockSamples)

    router = new VueRouter({
      routes: [
        {
          path: '/pacbio/samples',
          name: 'PacbioSamples',
          component: Samples,
          props: true,
        },
      ],
    })

    wrapper = mount(Samples, {
      store,
      router,
      localVue,
    })

    // TODO: Vue no longer allows you to override methods in mount. This causes all sorts of issues which we need to fix.
    wrapper.setData({ sortDesc: false })
    samples = wrapper.vm
    samples.provider = jest.fn()
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of samples.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(6)
    })
  })

  // TODO: this is tested throughout the app and it is exactly the same
  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      samples.showAlert('show this message', 'danger')
      wrapper.vm.$nextTick(() => {
        expect(wrapper.findComponent({ ref: 'alert' }).html()).toMatch('show this message')
      })
    })
  })

  describe('printerModal', () => {
    beforeEach(() => {
      wrapper = mount(Samples, { store, router, localVue })
      wrapper.setData({ sortDesc: false })

      samples = wrapper.vm
      samples.handlePrintLabel = jest.fn()
    })

    it('passes selected printer to function on emit event', () => {
      samples.selected = [{ id: 1 }]
      let modal = wrapper.findComponent({ ref: 'printerModal' })
      modal.vm.$emit('selectPrinter', 'printer1')
      expect(samples.handlePrintLabel).toBeCalledWith('printer1')
    })
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.findComponent({ ref: 'alert' }).exists()).toBeTruthy()
    })
  })

  describe('sample metadata modal', () => {
    it('contains sample metadata modal', () => {
      expect(wrapper.findComponent({ ref: 'sampleMetadata' }).exists()).toBeTruthy()
    })
  })

  describe('Details button', () => {
    let button

    it('is present for each sample', () => {
      button = wrapper.find('#details-btn-1')
      expect(button.text()).toEqual('Show Details')
    })
  })

  describe('Create library button', () => {
    let button
    beforeEach(() => {
      button = wrapper.findComponent({ ref: 'libraryCreateBtn' })
    })

    it('create library button is disabled when no sample are selected', () => {
      samples.selected = []
      expect(button.props('disabled')).toBe(true)
    })

    it('create library button is disabled when no sample are selected', () => {
      samples.selected = [{ id: 1 }]
      samples.$nextTick(() => {
        expect(button.props('disabled')).toBe(false)
      })
    })
  })
})
