import PacbioPoolIndex from '@/views/pacbio/PacbioPoolIndex'
import { mount, store, Data, router, flushPromises } from '@support/testHelper'

describe('PacbioPoolIndex.vue', () => {
  let wrapper, pools

  beforeEach(async () => {
    const get = vi.spyOn(store.state.api.traction.pacbio.pools, 'get')
    get.mockResolvedValue(Data.TractionPacbioPools)
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

  describe('pagination', () => {
    beforeEach(async () => {
      const filtered_data = { ...Data.TractionPacbioPools }
      filtered_data.data.data.splice(1, 2)
      const get = vi.spyOn(store.state.api.traction.pacbio.pools, 'get')
      get.mockReturnValue(Data.TractionPacbioPools)

      wrapper = mount(PacbioPoolIndex, {
        store,
      })
      await flushPromises()

      get.mockReturnValue(filtered_data)
      // This push causes pacbio pools to be fetched because of filterCard watchers
      // And we return filtered_data
      await router.push({ query: { page_size: 1, page_number: 1 } })
    })

    it('will paginate the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.vm.page_number).toEqual(1)
      expect(wrapper.vm.page_size).toEqual(1)
    })

    it('calls fetcher with the correct data given the query params', async () => {
      await router.push({
        query: { page_size: 2, page_number: 2, filter_value: '123', filter_input: 'barcode' },
      })
      wrapper.vm.setPools = vi.fn()
      wrapper.vm.setPools.mockReturnValue({ success: true, errors: [], meta: { page_count: 1 } })

      await wrapper.vm.fetchPools()
      expect(wrapper.vm.setPools).toBeCalledWith({
        page: { size: '2', number: '2' },
        filter: { 123: 'barcode' },
      })
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
      expect(wrapper.vm.$route.path).toBe('/pacbio/pool/1')
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
