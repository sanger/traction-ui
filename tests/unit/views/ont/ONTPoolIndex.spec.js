import ONTPoolIndex from '@/views/ont/ONTPoolIndex.vue'
import { mount, store, Data, router, flushPromises, nextTick } from '@support/testHelper'
import { vi } from 'vitest'

describe('OntPoolIndex', () => {
  let wrapper, pools

  beforeEach(async () => {
    const get = vi.spyOn(store.state.api.traction.ont.pools, 'get')
    get.mockResolvedValue(Data.TractionOntPools)
    wrapper = mount(ONTPoolIndex, {
      store,
      router,
    })
    await flushPromises()
  })

  it('displays each of the pools', async () => {
    const expectedPools = Data.TractionOntPools.data.data.length
    await nextTick()
    expect(wrapper.find('tbody').findAll('[data-testid="row"]').length).toEqual(expectedPools)
  })

  describe('Printing labels', () => {
    beforeEach(() => {
      pools = wrapper.vm
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
        expect(label.first_line).toEqual('Ont - Pool')
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
