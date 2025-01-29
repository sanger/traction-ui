import {
  flushPromises,
  mountWithStore,
  successfulResponse,
} from '@support/testHelper.js'
import { expect, it, vi } from 'vitest'
import PacbioLibraryBatchCreate from '@/views/pacbio/PacbioLibraryBatchCreate.vue'
import { usePacbioLibraryBatchCreateStore } from '@/stores/pacbioLibraryBatchCreate.js'

import PrinterFactory from '@tests/factories/PrinterFactory.js'
import PacbioTagSetFactory from '@tests/factories/PacbioTagSetFactory.js'
import PacbioLibraryBatchFactory from '@tests/factories/PacbioLibraryBatchFactory.js'
import useRootStore from '@/stores'

const pacbioTagSetFactory = PacbioTagSetFactory()
const printerFactory = PrinterFactory()
const pacbioLibraryBatchFactory = PacbioLibraryBatchFactory()

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

describe('PacbioLibraryBatchCreate.vue', () => {
  let wrapper, pacbioLibraryBatchCreateStore

  beforeEach(async () => {
    const plugins = [
      ({ store }) => {
        if (store.$id === 'root') {
          store.api.traction.pacbio.tag_sets.get = vi.fn(() => pacbioTagSetFactory.responses.fetch)
          store.api.traction.printers.get = vi.fn(() => printerFactory.responses.fetch)
        }
      },
    ]
    const { wrapperObj, storeObj } = mountWithStore(PacbioLibraryBatchCreate,{
      plugins,
      createStore: () => usePacbioLibraryBatchCreateStore(),
    })
    wrapper = wrapperObj
    pacbioLibraryBatchCreateStore = storeObj
    await flushPromises()
  })

  describe('building the component', () => {
    it('displays initial state correctly', async () => {
      const select = wrapper.find('select[data-type="tag-set-list"]')
      expect(select.exists()).toBe(true)
      const options = select.findAll('option')
      expect(options.length).toEqual(Object.values(pacbioTagSetFactory.storeData.tagSets).length)

      const printerSelect = wrapper.find('select[data-type="printer-options"]')
      expect(printerSelect.exists()).toBe(true)
      const printerOptions = printerSelect.findAll('option')
      expect(printerOptions.length).toEqual(
        printerFactory.storeData.getPrintersOfType('tube').length,
      )

      const csvInput = wrapper.find('input[id="csvFileInput"]')
      expect(csvInput.exists()).toBe(true)
      const csvPreviewBtn = wrapper.find('button[data-type="csv-preview-btn"]')
      expect(csvPreviewBtn.exists()).toBe(true)
      expect(csvPreviewBtn.element.disabled).toBe(true)
      expect(wrapper.find('div[data-type="csv-preview"]').exists()).toBe(false)

      const resetBtn = wrapper.find('#reset')
      expect(resetBtn.exists()).toBe(true)
      expect(resetBtn.element.disabled).toBe(false)

      const createBtn = wrapper.find('#create')
      expect(createBtn.exists()).toBe(true)
      expect(createBtn.element.disabled).toBe(true)

      const createdLibaries = wrapper.find('div[data-type="created-libraries"]')
      expect(createdLibaries.text()).toBe('No Libraries Created Yet')

      expect(wrapper.find('#print-button').element.disabled).toBe(true)

      const emptyBarcodes = wrapper.find('div[data-type="empty-barcodes"]')
      expect(emptyBarcodes.text()).toBe('No Barcodes to Print Yet')
    })

    it('contains the correct data on mount', async () => {
      expect(wrapper.vm.selectedPrinterName).toEqual('')
      expect(wrapper.vm.printerOptions.length).toEqual(
        printerFactory.storeData.getPrintersOfType('tube').length,
      )
      expect(wrapper.vm.selectedTagSet).toEqual(
        pacbioTagSetFactory.storeData.findTagSetByName('Pacbio_96_barcode_plate_v3').id,
      )
      expect(wrapper.vm.state.csvData).toEqual([])
      expect(wrapper.vm.state.resultData).toEqual([])
      expect(wrapper.vm.printBarcodes).toEqual([])
    })
  })

  describe('#onSelectFile', () => {
    it('parses the CSV file and updates state on success', async () => {
      const csvContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
        pacbioTagSetFactory.storeData.tags,
      )
      const csvFile = {
        text: () => Promise.resolve(csvContent),
      }
      const event = { target: { files: [csvFile] } }
      await wrapper.vm.onSelectFile(event)
      await flushPromises()
      expect(wrapper.vm.state.csvData.length).toEqual(2)
      // Check the preview button is enabled
      const csvPreviewBtn = wrapper.find('button[data-type="csv-preview-btn"]')
      expect(csvPreviewBtn.exists()).toBe(true)
      expect(csvPreviewBtn.element.disabled).toBe(false)
    })

    it('shows an alert on error', async () => {
      const csvFile = {
        text: () => Promise.reject('error'),
      }
      const event = { target: { files: [csvFile] } }
      await wrapper.vm.onSelectFile(event)
      await flushPromises()
      expect(mockShowAlert).toBeCalledWith('error', 'danger')

      // Check the preview button is disabled
      const csvPreviewBtn = wrapper.find('button[data-type="csv-preview-btn"]')
      expect(csvPreviewBtn.exists()).toBe(true)
      expect(csvPreviewBtn.element.disabled).toBe(true)
    })
  })

  describe('#onPreviewCsv', () => {
    let csvContent
    beforeEach(async () => {
      csvContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
        pacbioTagSetFactory.storeData.tags,
      )
      const csvFile = {
        text: () => Promise.resolve(csvContent),
      }
      const event = { target: { files: [csvFile] } }
      await wrapper.vm.onSelectFile(event)
      await flushPromises()
    })
    it('toggles the csv preview table display', async () => {
      const csvPreviewBtn = wrapper.find('button[data-type="csv-preview-btn"]')
      expect(csvPreviewBtn.text()).toBe('Hide CSV Data')
      // Click the button to show the preview table
      expect(wrapper.find('div[data-type="csv-preview"]').exists()).toBe(true)
      await csvPreviewBtn.trigger('click')
      await wrapper.vm.$nextTick()
      expect(csvPreviewBtn.text()).toBe('Show CSV Data')
      expect(wrapper.find('div[data-type="csv-preview"]').exists()).toBe(false)
    })
  })

  describe('#createLibraryBatchButton', () => {
    it('disables the create button when csv data is not present', async () => {
      const createBtn = wrapper.find('#create')
      expect(createBtn.element.disabled).toBe(true)
    })
    it('disables the create button when tagset is not present', async () => {
      const csvContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
        pacbioTagSetFactory.storeData.tags,
      )
      const csvFile = {
        text: () => Promise.resolve(csvContent),
      }
      const event = { target: { files: [csvFile] } }
      await wrapper.vm.onSelectFile(event)
      await flushPromises()
      wrapper.vm.selectedTagSet = null
      await flushPromises()
      const createBtn = wrapper.find('#create')
      expect(createBtn.element.disabled).toBe(true)
    })
  })

  describe('#createLibraryBatch', () => {
    beforeEach(async () => {
      const csvContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
        pacbioTagSetFactory.storeData.tags,
      )
      const csvFile = {
        text: () => Promise.resolve(csvContent),
      }
      const event = { target: { files: [csvFile] } }
      await wrapper.vm.onSelectFile(event)
    })
    it('creates a library batch and updates state', async () => {
      const expectedResult = pacbioLibraryBatchFactory.storeData.librariesInBatch

      pacbioLibraryBatchCreateStore.createLibraryBatch = vi.fn().mockResolvedValue({
        success: true,
        result: expectedResult,
      })

      wrapper.find('#create').trigger('click')
      await flushPromises()
      expect(wrapper.vm.state.resultData).toEqual(expectedResult)

      // Check the created libraries
      const libraryBatchTable = wrapper.find('#library-batch-table')
      expect(libraryBatchTable.exists()).toBe(true)

      // Check the table rows
      const rows = libraryBatchTable.findAll('tbody tr')
      expect(rows.length).toBe(expectedResult.length)

      //Check the Barcode list to print
      const barcodeList = wrapper.find('#list-barcodes-to-print')
      expect(barcodeList.exists()).toBe(true)

      const listItems = barcodeList.findAll('li')
      expect(listItems.length).toBe(expectedResult.length)
      expectedResult.forEach((library, index) => {
        expect(listItems.at(index).text()).toBe(library.barcode)
      })
    })

    it('shows an alert on error', async () => {
      pacbioLibraryBatchCreateStore.createLibraryBatch = vi
        .fn()
        .mockResolvedValue({ success: false, errors: 'error' })
      wrapper.find('#create').trigger('click')
      await wrapper.vm.$nextTick()
      expect(mockShowAlert).toBeCalledWith('error', 'danger')

      // Check the created libraries
      const createdLibaries = wrapper.find('div[data-type="created-libraries"]')
      expect(createdLibaries.text()).toBe('No Libraries Created Yet')

      const emptyBarcodes = wrapper.find('div[data-type="empty-barcodes"]')
      expect(emptyBarcodes.text()).toBe('No Barcodes to Print Yet')
    })
  })

  describe('#printButton', async () => {
    it('enables the print button when barcodes are present and a printer is selected', async () => {
      wrapper.vm.state.resultData = pacbioLibraryBatchFactory.storeData.librariesInBatch
      wrapper.vm.selectedPrinterName = printerFactory.storeData.selected.printer.id
      await flushPromises()

      const printButton = wrapper.find('#print-button')
      expect(printButton.element.disabled).toBe(false)
    })
    it('disables the print button when barcodes are not present', async () => {
      wrapper.vm.selectedPrinterName = printerFactory.storeData.selected.printer.id
      const printButton = wrapper.find('#print-button')
      expect(printButton.element.disabled).toBe(true)
    })
    it('disables the print button when a printer is not selected', async () => {
      wrapper.vm.resultData = pacbioLibraryBatchFactory.storeData.librariesInBatch
      const printButton = wrapper.find('#print-button')
      expect(printButton.element.disabled).toBe(true)
    })
  })

  describe('#printLabels', async () => {
    let create
    beforeEach(async () => {
      const rootStore = useRootStore()
      create = vi.fn()
      rootStore.api = { printMyBarcode: { print_jobs: { create } } }
    })
    it('creates a print job and shows a success alert', async () => {
      create.mockResolvedValue(successfulResponse())
      wrapper.vm.resultData = pacbioLibraryBatchFactory.storeData.librariesInBatch
      wrapper.vm.selectedPrinterName = printerFactory.storeData.selected.printer.name
      wrapper.vm.onPrintAction()
      await flushPromises()

      expect(mockShowAlert).toBeCalledWith('Barcode(s) successfully printed', 'success')
    })

    it('shows an alert on error', async () => {
      const mockResponse = {
        status: '422',
        ok: false,
        json: () =>
          Promise.resolve({
            errors: [{ source: { pointer: '/data/attributes/printer' }, detail: "can't be blank" }],
          }),
      }
      create.mockResolvedValue(mockResponse)
      wrapper.vm.resultData = pacbioLibraryBatchFactory.storeData.librariesInBatch
      wrapper.vm.selectedPrinterName = printerFactory.storeData.selected.printer.name
      wrapper.vm.onPrintAction()
      await flushPromises()
      expect(mockShowAlert).toBeCalledWith("printer can't be blank", 'danger')
    })
  })

  describe('#resetButton', () => {
    it('resets the state of the component', async () => {
      const csvContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
        pacbioTagSetFactory.storeData.tags,
      )
      const csvFile = {
        text: () => Promise.resolve(csvContent),
      }
      const event = { target: { files: [csvFile] } }
      await wrapper.vm.onSelectFile(event)

      wrapper.find('#create').trigger('click')
      await flushPromises()

      wrapper.find('#reset').trigger('click')
      await flushPromises()

      expect(wrapper.vm.state.csvData).toEqual([])
      expect(wrapper.vm.state.resultData).toEqual([])
      expect(wrapper.vm.printBarcodes).toEqual([])
      expect(wrapper.vm.csvFileInput.value.value).toEqual(undefined)
      expect(wrapper.vm.selectedTagSet).toEqual(
        pacbioTagSetFactory.storeData.findTagSetByName('Pacbio_96_barcode_plate_v3').id,
      )
    })
  })
})
