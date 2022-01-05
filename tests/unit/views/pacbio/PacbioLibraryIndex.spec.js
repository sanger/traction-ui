import Libraries from '@/views/pacbio/PacbioLibraryIndex'
import { mount, localVue, Data, store, router } from 'testHelper'
import * as consts from '@/consts/consts'
import Response from '@/api/Response'

describe('Libraries.vue', () => {
  let wrapper, libraries, mockLibraries

  beforeEach(() => {
    mockLibraries = [
      {
        id: 1,
        barcode: 'TRAC-8',
        material: {
          id: 6,
          type: 'libraries',
          state: 'pending',
          sample_names: 'sample_d,sample_e',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          created_at: '03/12/2019 11:49',
        },
        pool: {
          id: '1',
          type: 'pools',
        },
      },
      {
        id: 2,
        barcode: 'TRAC-8',
        material: {
          id: 6,
          type: 'libraries',
          state: 'pending',
          sample_names: 'sample_d,sample_e',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          created_at: '03/12/2019 11:49',
        },
        pool: {
          id: '1',
          type: 'pools',
        },
      },
    ]

    store.commit('traction/pacbio/libraries/setLibraries', mockLibraries)

    wrapper = mount(Libraries, {
      store,
      router,
      localVue,
    })
    libraries = wrapper.vm
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      let headers = wrapper.findAll('th')
      for (let field of libraries.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })
  })

  describe('perPage', () => {
    beforeEach(() => {
      wrapper = mount(Libraries, {
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

  describe('#handleLibraryDelete', () => {
    beforeEach(() => {
      libraries.deleteLibraries = jest.fn()
      libraries.showAlert = jest.fn()
      wrapper.setData({ selected: mockLibraries })
    })

    it('calls the correct functions', async () => {
      libraries.deleteLibraries.mockReturnValue([new Response(Data.TractionPacbioLibraries)])
      await libraries.handleLibraryDelete()

      expect(libraries.deleteLibraries).toBeCalledWith(mockLibraries.map((s) => s.id))
      expect(libraries.showAlert).toBeCalledWith('Libraries 1, 2 successfully deleted', 'success')
    })

    it('calls showAlert when there is an error', async () => {
      let failedResponse = {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: { data: { errors: { it: ['did not work'] } } },
      }
      libraries.deleteLibraries.mockReturnValue([new Response(failedResponse)])

      await libraries.handleLibraryDelete()

      expect(libraries.deleteLibraries).toBeCalled()

      expect(libraries.showAlert).toBeCalledWith(consts.MESSAGE_ERROR_DELETION_FAILED, 'danger')
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      libraries.showAlert('show this message', 'danger')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
    })
  })

  // TODO: Why isnt this working
  describe('printerModal', () => {
    beforeEach(() => {
      wrapper.setData({ sortDesc: false })
      libraries.handlePrintLabel = jest.fn()
    })

    it('passes selected printer to function on emit event', () => {
      libraries.selected = [{ id: 1 }]
      let modal = wrapper.findComponent({ ref: 'printerModal' })
      modal.vm.$emit('selectPrinter', 'printer1')

      expect(libraries.handlePrintLabel).toBeCalledWith('printer1')
    })
  })

  describe('Edit button', () => {
    let button

    it('is present for each library', () => {
      button = wrapper.find('#editLibrary-1')
      expect(button.text()).toEqual('Edit')
    })

    it('on click show is true', () => {
      button = wrapper.find('#editLibrary-1')
      button.trigger('click')
      expect(wrapper.find('#PacbioEditLibraryModal')).toBeDefined()
    })
  })
})
