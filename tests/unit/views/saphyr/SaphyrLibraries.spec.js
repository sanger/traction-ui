import Libraries from '@/views/saphyr/SaphyrLibraries'
import { mount, localVue, store, Data } from '@support/testHelper'
import VueRouter from 'vue-router'
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
          sample_name: 'sample_d',
          enzyme_name: 'Nb.BsrDI',
          created_at: '03/12/2019 11:49',
        },
      },
      {
        id: 2,
        barcode: 'TRAC-9',
        material: {
          id: 6,
          type: 'libraries',
          state: 'pending',
          sample_name: 'sample_d',
          enzyme_name: 'Nb.BsrDI',
          created_at: '03/12/2019 11:49',
        },
      },
    ]

    // We mock the request response, to allow the provider to trigger our
    // behaviour for us. We might be better of mocking the action itself, but
    // that gets surprisingly tricky as the store gets heavily modularised.
    // Before we used to inject the state directly, but that caused issues
    // when the component triggered the set requests action itself.
    vi.spyOn(store.getters['traction/saphyr/tubes/libraryRequest'], 'get').mockResolvedValue(
      Data.TractionSaphyrLibraries,
    )

    const router = new VueRouter({
      routes: [
        {
          path: '/libraries',
          name: 'Libraries',
          component: Libraries,
          props: true,
        },
      ],
    })

    wrapper = mount(Libraries, {
      store,
      router,
      localVue,
      stubs: {
        PrinterModal: true,
      },
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
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(6)
    })
  })

  describe('#handleLibraryDelete', () => {
    beforeEach(() => {
      libraries.deleteLibraries = vi.fn()
      libraries.showAlert = vi.fn()
      wrapper.setData({ selected: mockLibraries })
    })

    it('calls the correct functions', async () => {
      libraries.deleteLibraries.mockReturnValue([new Response(Data.TractionSaphyrLibraries)])
      await libraries.handleLibraryDelete()

      expect(libraries.deleteLibraries).toBeCalledWith(mockLibraries.map((s) => s.id))
      expect(libraries.showAlert).toBeCalledWith(
        'Libraries TRAC-8, TRAC-9 successfully deleted',
        'success',
      )
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

      expect(libraries.showAlert).toBeCalledWith('Failed to delete: ', 'danger')
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

  describe('Printing labels', () => {
    beforeEach(() => {
      libraries.selected = [
        { id: 1, barcode: 'TRAC-1' },
        { id: 2, barcode: 'TRAC-2' },
        { id: 3, barcode: 'TRAC-2' },
      ]
    })

    describe('#createLabels', () => {
      it('will have the correct number of labels', () => {
        expect(libraries.createLabels().length).toEqual(3)
      })

      it('will have the correct text for each label', () => {
        const label = libraries.createLabels()[0]
        expect(label.barcode).toEqual('TRAC-1')
        expect(label.first_line).toEqual('Saphyr - Library')
        expect(/\d{2}-\w{3}-\d{2}/g.test(label.second_line)).toBeTruthy()
        expect(label.third_line).toEqual('TRAC-1')
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
