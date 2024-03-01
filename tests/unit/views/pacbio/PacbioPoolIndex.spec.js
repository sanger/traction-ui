import PacbioPoolIndex from '@/views/pacbio/PacbioPoolIndex'
import { mount, store, Data, router, flushPromises } from '@support/testHelper'

describe('PacbioPoolIndex.vue', () => {
  let wrapper, pools

  beforeEach(async () => {
    const get = vi.spyOn(store.state.api.traction.pacbio.pools, 'get')
    get.mockResolvedValue(Data.TractionPacbioPoolsV1)
    wrapper = mount(PacbioPoolIndex, {
      store,
      router,
    })
    await flushPromises()
    pools = wrapper.vm
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of pools.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      pools.showAlert('show this message', 'danger')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
    })
  })

  describe('Edit button', () => {
    let button

    it('is present for each pool', () => {
      button = wrapper.find('#editPool-1')
      expect(button.text()).toEqual('Edit')
    })

    it('on click show it shows the pool edit page', async () => {
      button = wrapper.find('#editPool-1')
      button.trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toBe('/pacbio/pool/1')
    })
  })

  describe('Printing labels', () => {
    beforeEach(() => {
      pools.selected = [
        { id: 1, barcode: 'TRAC-1', source_identifier: 'SQSC-1' },
        { id: 2, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
        { id: 3, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
      ]
    })

    describe('#createLabels', () => {
      it('will have the correct number of labels', () => {
        expect(pools.createLabels().length).toEqual(3)
      })

      it('will have the correct text for each label', () => {
        const label = pools.createLabels()[0]
        expect(label.barcode).toEqual('TRAC-1')
        expect(label.first_line).toEqual('Pacbio - Pool')
        expect(/\d{2}-\w{3}-\d{2}/g.test(label.second_line)).toBeTruthy()
        expect(label.third_line).toEqual('TRAC-1')
        expect(label.fourth_line).toEqual('SQSC-1')
        expect(label.label_name).toEqual('main_label')
      })
    })

    describe('#printLabels', () => {
      beforeEach(() => {
        pools.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: true, message: 'success' }
        })

        const modal = wrapper.findComponent({ ref: 'printerModal' })
        modal.vm.$emit('selectPrinter', 'printer1')
      })

      it('should create a print job', () => {
        expect(pools.createPrintJob).toBeCalledWith({
          printerName: 'printer1',
          labels: pools.createLabels(),
          copies: 1,
        })
      })
    })
  })
})
