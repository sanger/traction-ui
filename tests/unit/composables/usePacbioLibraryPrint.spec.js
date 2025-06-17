import { createPinia, setActivePinia } from 'pinia'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import usePacbioLibraryPrint from '@/composables/usePacbioLibraryPrint.js'
import { usePrintingStore } from '@/stores/printing.js'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import { successfulResponse, failedResponse } from '@support/testHelper.js'

vi.mock('@/stores/printing.js', () => ({
  usePrintingStore: vi.fn(),
}))

vi.mock('@/lib/DateHelpers.js', () => ({
  getCurrentDate: vi.fn(),
}))

describe('#usePacbioLibraryPrint', () => {
  const printBarcodes = [
    { id: 1, barcode: 'TRAC-1', source_identifier: 'SQSC-1' },
    { id: 2, barcode: 'TRAC-2', source_identifier: 'SQSC-2' },
  ]
  const expectedCreatedLabels = [
    {
      barcode: 'TRAC-1',
      first_line: 'Pacbio - Library',
      second_line: '01-Jan-2023',
      third_line: 'TRAC-1',
      fourth_line: 'SQSC-1',
      label_name: 'main_label',
    },
    {
      barcode: 'TRAC-2',
      first_line: 'Pacbio - Library',
      second_line: '01-Jan-2023',
      third_line: 'TRAC-2',
      fourth_line: 'SQSC-2',
      label_name: 'main_label',
    },
  ]
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    getCurrentDate.mockReturnValue('01-Jan-2023')
  })

  it('prints labels correctly', async () => {
    const { printLabels } = usePacbioLibraryPrint()
    const successResponse = successfulResponse()
    const createPrintJob = vi.fn().mockResolvedValue(successResponse)
    usePrintingStore.mockReturnValue({ createPrintJob })

    const result = await printLabels('printer1', printBarcodes)
    expect(createPrintJob).toHaveBeenCalledWith({
      printerName: 'printer1',
      labels: expectedCreatedLabels,
      copies: 1,
    })
    expect(result).toEqual(successResponse)
  })

  it('returns error on failed response ', async () => {
    const { printLabels } = usePacbioLibraryPrint()
    const failureResponse = failedResponse()
    const createPrintJob = vi.fn().mockResolvedValue(failureResponse)
    usePrintingStore.mockReturnValue({ createPrintJob })
    const result = await printLabels('printer1', printBarcodes)
    expect(result).toEqual(failureResponse)
  })
})
