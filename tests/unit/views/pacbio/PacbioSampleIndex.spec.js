import Samples from '@/views/pacbio/PacbioSampleIndex'
import { mount, localVue, store, Data, router } from '@support/testHelper'
import Response from '@/api/Response'
import { beforeEach, describe, expect, it } from 'vitest'

// TODO: why do we need to set sortDesc to false? I think we also need to isolate tests
describe('Samples.vue', () => {
  let wrapper, samples, mockSamples

  beforeEach(() => {
    mockSamples = new Response(Data.TractionPacbioSamples).deserialize.requests
    store.commit('traction/pacbio/requests/setRequests', mockSamples)

    wrapper = mount(Samples, {
      store,
      router,
      localVue,
    })

    // TODO: Vue no longer allows you to override methods in mount. This causes all sorts of issues which we need to fix.
    wrapper.setData({ sortDesc: false })
    samples = wrapper.vm
    samples.provider = vi.fn()
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of samples.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(12)
    })
  })

  // TODO: this is tested throughout the app and it is exactly the same
  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      samples.showAlert('show this message', 'danger')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
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

  describe('Printing labels', () => {
    beforeEach(() => {
      samples.selected = [
        { id: 1, barcode: 'TRAC-1', source_identifier: 'SQSC-1' },
        { id: 2, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
        { id: 3, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
      ]
    })

    describe('#createLabels', () => {
      it('will have the correct number of labels', () => {
        expect(samples.createLabels().length).toEqual(3)
      })

      it('will have the correct text for each label', () => {
        const label = samples.createLabels()[0]
        expect(label.first_line).toEqual('Pacbio - Sample')
        expect(/\d{2}-\w{3}-\d{2}/g.test(label.second_line)).toBeTruthy()
        expect(label.third_line).toEqual('TRAC-1')
        expect(label.fourth_line).toEqual('SQSC-1')
        expect(label.label_name).toEqual('main_label')
      })
    })

    describe('#printLabels', () => {
      beforeEach(() => {
        samples.createPrintJob = vi.fn()

        const modal = wrapper.findComponent({ ref: 'printerModal' })
        modal.vm.$emit('selectPrinter', 'printer1')
      })

      it('should create a print job', () => {
        expect(samples.createPrintJob).toBeCalledWith({
          printerName: 'printer1',
          labels: samples.createLabels(),
          copies: '1',
        })
      })
    })
  })
})
