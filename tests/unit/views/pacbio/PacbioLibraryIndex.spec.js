import Libraries from '@/views/pacbio/PacbioLibraryIndex'
import { mount, localVue, Data, store, router } from '@support/testHelper'
import * as consts from '@/consts/consts'
import Response from '@/api/Response'

describe('Libraries.vue', () => {
  let wrapper, libraries, mockLibraries

  beforeEach(() => {
    const setLibrariesAction = vi.spyOn(store.getters.api.traction.pacbio.libraries, 'get')
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
        run_suitability: {
          ready_for_run: true,
          errors: [],
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
        run_suitability: {
          ready_for_run: true,
          errors: [],
        },
      },
    ]
    setLibrariesAction.mockImplementation(() => {
      store.commit('traction/pacbio/libraries/setLibraries', mockLibraries)
    })

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
      libraries.deleteLibraries = vi.fn()
      libraries.showAlert = vi.fn()
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

  describe('Edit button', () => {
    let button

    it('is present for each library', async () => {
      button = wrapper.find('#editPool-1')
      expect(button.text()).toEqual('Edit')
      expect(button.props('to')).toStrictEqual({ name: 'PacbioPoolCreate', params: { id: '1' } })
    })
  })

  describe('Printing labels', () => {
    beforeEach(() => {
      libraries.selected = [
        { id: 1, barcode: 'TRAC-1', source_identifier: 'SQSC-1' },
        { id: 2, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
        { id: 3, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
      ]
    })

    describe('#createLabels', () => {
      it('will have the correct number of labels', () => {
        expect(libraries.createLabels().length).toEqual(3)
      })

      it('will have the correct text for each label', () => {
        const label = libraries.createLabels()[0]
        expect(label.first_line).toEqual('Pacbio - Library')
        expect(/\d{2}-\w{3}-\d{2}/g.test(label.second_line)).toBeTruthy()
        expect(label.third_line).toEqual('TRAC-1')
        expect(label.fourth_line).toEqual('SQSC-1')
        expect(label.label_name).toEqual('main_label')
      })
    })

    describe('#printLabels', () => {
      beforeEach(() => {
        libraries.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: true, message: 'success' }
        })

        const modal = wrapper.findComponent({ ref: 'printerModal' })
        modal.vm.$emit('selectPrinter', 'printer1')
      })

      it('should create a print job', () => {
        expect(libraries.createPrintJob).toBeCalledWith({
          printerName: 'printer1',
          labels: libraries.createLabels(),
          copies: '1',
        })
      })
    })
  })
})
