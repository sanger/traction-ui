import PacbioPoolIndex from '@/views/pacbio/PacbioPoolIndex'
import { mount, localVue, store, router } from '@support/testHelper'
import storePools from '@tests/data/StorePools'

describe('PacbioPoolIndex.vue', () => {
  let wrapper, poolsVm

  beforeEach(() => {
    store.state.traction.pacbio.pools = storePools
    wrapper = mount(PacbioPoolIndex, {
      store,
      router,
      localVue,
    })
    poolsVm = wrapper.vm
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of poolsVm.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })
  })

  describe('perPage', () => {
    beforeEach(() => {
      wrapper = mount(PacbioPoolIndex, {
        store,
        router,
        localVue,
        data() {
          return { perPage: 1 }
        },
      })
    })

    it('states how many rows the table should contain', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      poolsVm.showAlert('show this message', 'danger')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
    })
  })

  describe('printerModal', () => {
    beforeEach(() => {
      wrapper.setData({ sortDesc: false })
      poolsVm.handlePrintLabel = vi.fn()
    })

    it('passes selected printer to function on emit event', () => {
      poolsVm.selected = [{ id: 1 }]
      let modal = wrapper.findComponent({ ref: 'printerModal' })
      modal.vm.$emit('selectPrinter', 'printer1')

      expect(poolsVm.handlePrintLabel).toBeCalledWith('pacbio', 'printer1')
    })
  })

  describe('Edit button', () => {
    let button

    it('is present for each pool', () => {
      button = wrapper.find('#editPool-1')
      expect(button.text()).toEqual('Edit')
    })

    it('on click show it shows the pool edit page', () => {
      button = wrapper.find('#editPool-1')
      button.trigger('click')
      expect(wrapper.vm.$route.path).toBe('/pacbio/pool/1')
    })
  })
})
