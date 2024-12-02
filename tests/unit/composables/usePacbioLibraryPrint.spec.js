import { createPinia, setActivePinia } from 'pinia'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import usePacbioLibraryPrint from '@/composables/usePacbioLibraryPrint.js'
import { usePrintingStore } from '@/stores/printing.js'
import { getCurrentDate } from '@/lib/DateHelpers.js'

vi.mock('@/stores/printing.js', () => ({
  usePrintingStore: vi.fn(),
}))

vi.mock('@/lib/DateHelpers.js', () => ({
  getCurrentDate: vi.fn(),
}))

describe('#usePacbioLibraryPrint', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('creates labels correctly', () => {
    const { createLabels } = usePacbioLibraryPrint()
    const printBarcodes = [
      { barcode: 'barcode1', source_identifier: 'source1' },
      { barcode: 'barcode2', source_identifier: 'source2' },
    ]
    getCurrentDate.mockReturnValue('01-Jan-2023')
    const labels = createLabels(printBarcodes)
    expect(labels).toEqual([
      {
        barcode: 'barcode1',
        first_line: 'Pacbio - Library',
        second_line: '01-Jan-2023',
        third_line: 'barcode1',
        fourth_line: 'source1',
        label_name: 'main_label',
      },
      {
        barcode: 'barcode2',
        first_line: 'Pacbio - Library',
        second_line: '01-Jan-2023',
        third_line: 'barcode2',
        fourth_line: 'source2',
        label_name: 'main_label',
      },
    ])
  })

  it('prints labels correctly', async () => {
    const { printLabels } = usePacbioLibraryPrint()
    const createPrintJob = vi.fn().mockResolvedValue({ success: true, message: 'success' })
    usePrintingStore.mockReturnValue({ createPrintJob })
    const printBarcodes = [
      { barcode: 'barcode1', source_identifier: 'source1' },
      { barcode: 'barcode2', source_identifier: 'source2' },
    ]
    getCurrentDate.mockReturnValue('01-Jan-2023')
    const result = await printLabels('printer1', printBarcodes)
    expect(createPrintJob).toHaveBeenCalledWith({
      printerName: 'printer1',
      labels: [
        {
          barcode: 'barcode1',
          first_line: 'Pacbio - Library',
          second_line: '01-Jan-2023',
          third_line: 'barcode1',
          fourth_line: 'source1',
          label_name: 'main_label',
        },
        {
          barcode: 'barcode2',
          first_line: 'Pacbio - Library',
          second_line: '01-Jan-2023',
          third_line: 'barcode2',
          fourth_line: 'source2',
          label_name: 'main_label',
        },
      ],
      copies: 1,
    })
    expect(result).toEqual({ success: true, message: 'success' })
  })
})
