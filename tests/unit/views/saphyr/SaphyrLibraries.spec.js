import Libraries from '@/views/saphyr/SaphyrLibraries'
import { mount, localVue, store, Data } from '../../testHelper'
import Alert from '@/components/Alert'
import * as consts from '@/consts/consts'
import VueRouter from 'vue-router'
import Response from '@/api/Response'

describe('Libraries.vue', () => {
  let wrapper, libraries, mockLibraries

  beforeEach(() => {
    mockLibraries =  [
      { id: 1, barcode: 'TRAC-8', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }},
      { id: 2, barcode: 'TRAC-9', material: {id: 6, type: 'libraries', state: 'pending', sample_name: 'sample_d', enzyme_name: 'Nb.BsrDI', created_at: '03/12/2019 11:49' }}
    ]

    store.commit('traction/saphyr/tubes/setLibraries', mockLibraries)

    const router = new VueRouter({
      routes: [{
        path: '/libraries',
        name: 'Libraries',
        component: Libraries,
        props: true
      }]
    })

    wrapper = mount(Libraries, {
      store,
      router,
      localVue,
      stubs: {
        Alert: Alert,
        PrinterModal: true
      }
    })
    libraries = wrapper.vm
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of libraries.fields) {
        expect(headers.filter(header => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })
  })

  describe('#handleLibraryDelete', () => {
    beforeEach(() => {
      libraries.deleteLibraries = jest.fn()
      libraries.showAlert = jest.fn()
      wrapper.setData({ selected: mockLibraries })
    })

    it('calls the correct functions', async () => {
      libraries.deleteLibraries.mockReturnValue([new Response(Data.TractionSaphyrLibraries)])
      await libraries.handleLibraryDelete()

      expect(libraries.deleteLibraries).toBeCalledWith(mockLibraries.map(s => s.id))
      expect(libraries.showAlert).toBeCalledWith('Libraries TRAC-8, TRAC-9 successfully deleted', 'success')
    })

    it('calls showAlert when there is an error', async () => {
      let failedResponse = { status: 422, statusText: 'Unprocessable Entity', data: { data: { errors: { it: ['did not work'] }} } }
      libraries.deleteLibraries.mockReturnValue([new Response(failedResponse)])

      await libraries.handleLibraryDelete()

      expect(libraries.deleteLibraries).toBeCalled()

      expect(libraries.showAlert).toBeCalledWith(consts.MESSAGE_ERROR_DELETION_FAILED, 'danger')
    })

  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      libraries.showAlert('show this message', 'danger')
      wrapper.vm.$nextTick(() => {
        expect(wrapper.findComponent({ref: 'alert'}).html()).toMatch('show this message')
      })
    })
  })

  describe('printerModal', () => {
    beforeEach(() => {
      libraries.handlePrintLabel = jest.fn()
    })

    it('passes selected printer to function on emit event', () => {
      libraries.selected = [{id: 1}]
      let modal = wrapper.findComponent({ref: 'printerModal'})
      modal.vm.$emit('selectPrinter', 'printer1')

      expect(libraries.handlePrintLabel).toBeCalledWith('printer1')
    })
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.findComponent({ref: 'alert'}).exists()).toBeTruthy()
    })
  })
})
