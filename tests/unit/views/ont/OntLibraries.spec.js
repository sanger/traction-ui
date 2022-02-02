import OntLibraries from '@/views/ont/OntLibraries'
import { localVue, mount } from 'testHelper'

describe('OntLibraries.vue', () => {
  let wrapper, libraries, librariesData, mutate, mockApollo //, refetchLibraries

  beforeEach(() => {
    mutate = jest.fn()
    mockApollo = {
      mutate: mutate,
      queries: {
        libraries: {
          refetch: jest.fn(),
        },
      },
    }

    librariesData = [
      {
        id: 1,
        tube_barcode: 'TRAC-2-1',
        plate_barcode: 'TRAC-1-1',
        poolSize: 1,
        wellRange: 'A1-H3',
        tag_set: 24,
      },
      {
        id: 2,
        tube_barcode: 'TRAC-2-2',
        plate_barcode: 'TRAC-1-1',
        poolSize: 2,
        wellRange: 'A4-H6',
        tag_set: 24,
      },
      {
        id: 3,
        tube_barcode: 'TRAC-2-3',
        plate_barcode: 'TRAC-1-1',
        poolSize: 3,
        wellRange: 'A7-H9',
        tag_set: 24,
      },
      {
        id: 4,
        tube_barcode: 'TRAC-2-4',
        plate_barcode: 'TRAC-1-1',
        poolSize: 4,
        wellRange: 'A10-H12',
        tag_set: 24,
      },
      {
        id: 5,
        tube_barcode: 'TRAC-2-5',
        plate_barcode: 'TRAC-1-2',
        poolSize: 1,
        wellRange: 'A1-H12',
        tag_set: 96,
      },
    ]

    // create the mock of the method before mounting it for testing
    jest.spyOn(OntLibraries.methods, 'getLibraries').mockImplementation(() => librariesData)

    wrapper = mount(OntLibraries, {
      localVue,
      mocks: {
        $apollo: mockApollo,
      },
      stubs: {
        OntPlate: true,
        PrinterModal: true,
      },
    })

    libraries = wrapper.vm
    // refetchLibraries = mockApollo.queries.libraries.refetch
  })

  it('will have fields', () => {
    let expected = [
      'id',
      'name',
      'poolSize',
      'tubeBarcode',
      'plateBarcode',
      'pool',
      'createdAt',
      'assignedToFlowcell',
    ]
    expect(libraries.fields).toEqual(expected)
  })

  it('will have a table', () => {
    expect(wrapper.find('table').exists()).toBeTruthy()
  })

  it('will have a table with libraries', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(librariesData.length)
  })

  describe('printerModal', () => {
    beforeEach(() => {
      libraries.handlePrintLabel = jest.fn()
    })

    it('passes selected printer to function on emit event', () => {
      libraries.selected = [{ id: 1 }]
      let modal = wrapper.findComponent({ ref: 'printerModal' })
      modal.vm.$emit('selectPrinter', 'printer1')

      expect(libraries.handlePrintLabel).toBeCalledWith('ont', 'printer1')
    })
  })

  describe('Delete button', () => {
    let button
    const libraryName = 'aLibraryName'

    beforeEach(() => {
      button = wrapper.find('#deleteLibrary-btn')
      libraries.showAlert = jest.fn()
      libraries.selected = [{ name: libraryName }]
      libraries.refetchLibraries = jest.fn()
    })

    it('is shows button', () => {
      expect(button.text()).toEqual('Delete Library')
    })

    it('shows an alert on success', async () => {
      let mockResponse = { data: { deleteOntLibrary: { success: true, errors: [] } } }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      mutate.mockReturnValue(promise)

      await button.trigger('click')

      expect(mutate).toBeCalled()
      expect(libraries.showAlert).toBeCalledWith(
        `Library '${libraryName}' was successully deleted`,
        'success',
      )
    })

    it('refetches libraries on success', async () => {
      let mockResponse = { data: { deleteOntLibrary: { success: true, errors: [] } } }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      mutate.mockReturnValue(promise)

      await button.trigger('click')

      expect(libraries.refetchLibraries).toBeCalled()
    })

    it('shows an alert on failure', async () => {
      let mockResponse = {
        data: { deleteOntLibrary: { success: false, errors: ['this is an error'] } },
      }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      mutate.mockReturnValue(promise)

      await button.trigger('click')

      expect(mutate).toBeCalled()
      expect(libraries.showAlert).toBeCalledWith(
        `Failure deleting library '${libraryName}': this is an error`,
        'danger',
      )
    })
  })
})
