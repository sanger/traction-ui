import Libraries from '@/views/pacbio/PacbioLibraryIndex'
import { mount, Data, store, router, flushPromises } from '@support/testHelper'
import Response from '@/api/Response'
import { expect } from 'vitest'

describe('Libraries.vue', () => {
  let wrapper, libraries

  beforeEach(async () => {
    const get = vi.spyOn(store.state.api.traction.pacbio.libraries, 'get')
    get.mockResolvedValue(Data.TractionPacbioLibraries)

    wrapper = mount(Libraries, {
      store,
      router,
    })
    await flushPromises()
    libraries = wrapper.vm
  })

  describe('building the table', () => {
    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of libraries.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(5)
    })
  })

  describe('pagination', () => {
    beforeEach(async () => {
      const filtered_data = { ...Data.TractionPacbioLibraries }
      filtered_data.data.data.splice(1, 4)
      const get = vi.spyOn(store.state.api.traction.pacbio.libraries, 'get')
      get.mockResolvedValue(Data.TractionPacbioLibraries)

      wrapper = mount(Libraries, {
        store,
      })
      await flushPromises()

      get.mockReturnValue(filtered_data)
      // This push causes pacbio libraries to be fetched because of filterCard watchers
      // And we return filtered_data
      await router.push({ query: { page_size: 1, page_number: 1 } })
    })

    it('will paginate the runs in the table', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.vm.page_number).toEqual(1)
      expect(wrapper.vm.page_size).toEqual(1)
    })

    it('calls fetcher with the correct data given the query params', async () => {
      await router.push({
        query: { page_size: 2, page_number: 2, filter_value: '123', filter_input: 'barcode' },
      })
      wrapper.vm.setLibraries = vi.fn()
      wrapper.vm.setLibraries.mockReturnValue({
        success: true,
        errors: [],
        meta: { page_count: 1 },
      })

      await wrapper.vm.fetchLibraries()
      expect(wrapper.vm.setLibraries).toBeCalledWith({
        page: { size: '2', number: '2' },
        filter: { 123: 'barcode' },
      })
    })
  })

  describe('#handleLibraryDelete', () => {
    let mockLibraries
    beforeEach(() => {
      mockLibraries = [
        {
          id: '721',
          barcode: 'TRAC-2-721',
        },
        {
          id: '722',
          barcode: 'TRAC-2-722',
        },
      ]
      libraries.deleteLibraries = vi.fn()
      libraries.showAlert = vi.fn()
      wrapper.setData({
        selected: mockLibraries,
      })
    })

    it('calls the correct functions', async () => {
      libraries.deleteLibraries.mockReturnValue([new Response(Data.TractionPacbioLibraries)])
      await libraries.handleLibraryDelete()

      expect(libraries.deleteLibraries).toBeCalledWith(mockLibraries.map((s) => s.id))
      expect(libraries.showAlert).toBeCalledWith(
        'Libraries 721, 722 successfully deleted',
        'success',
      )
    })

    it('calls showAlert when there is an error', async () => {
      const failedResponse = {
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

  describe('Edit button', () => {
    let button

    it('is present for each library', async () => {
      router.push = vi.fn()
      button = wrapper.find('#editPool-1')
      expect(button.text()).toEqual('Edit')
      await button.trigger('click')
      expect(router.push).toHaveBeenCalledTimes(1)
      expect(router.push).toHaveBeenCalledWith({ name: 'PacbioPoolCreate', params: { id: '1' } })
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
        expect(label.barcode).toEqual('TRAC-1')
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
          copies: 1,
        })
      })
    })
  })
})
