import { vi, describe, beforeEach, it, expect } from 'vitest'
import useTubePrint from '@/composables/useTubePrint.js'
import { usePrintingStore } from '@/stores/printing.js'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import { successfulResponse, failedResponse } from '@support/testHelper.js'

vi.mock('@/stores/printing.js', () => ({
  usePrintingStore: vi.fn(),
}))

vi.mock('@/lib/DateHelpers.js', () => ({
  getCurrentDate: vi.fn(),
}))

describe('#useTubePrint', () => {
  const labelDescription = 'Pacbio - Library'
  const printBarcodes = [
    { id: 1, barcode: 'TRAC-2-1', source_identifier: 'SQSC-1' },
    { id: 2, barcode: 'TRAC-2-2', source_identifier: 'SQSC-2' },
  ]
  const expectedCreatedLabels = [
    {
      barcode: 'TRAC-2-1',
      first_line: labelDescription,
      second_line: '01-Jan-2023',
      third_line: 'TRAC-2-1',
      fourth_line: 'SQSC-1',
      round_label_bottom_line: '1',
      round_label_lower_line: 'TRAC-2',
      label_name: 'main_label',
    },
    {
      barcode: 'TRAC-2-2',
      first_line: labelDescription,
      second_line: '01-Jan-2023',
      third_line: 'TRAC-2-2',
      fourth_line: 'SQSC-2',
      round_label_bottom_line: '2',
      round_label_lower_line: 'TRAC-2',
      label_name: 'main_label',
    },
  ]
  beforeEach(() => {
    getCurrentDate.mockReturnValue('01-Jan-2023')
  })

  it('prints labels correctly', async () => {
    const { printLabels } = useTubePrint()
    const successResponse = successfulResponse()
    const createPrintJob = vi.fn().mockResolvedValue(successResponse)
    usePrintingStore.mockReturnValue({ createPrintJob })

    const result = await printLabels('printer1', printBarcodes, labelDescription)
    expect(createPrintJob).toHaveBeenCalledWith({
      printerName: 'printer1',
      labels: expectedCreatedLabels,
      copies: 1,
    })
    expect(result).toEqual(successResponse)
  })

  it('returns error on failed response ', async () => {
    const { printLabels } = useTubePrint()
    const failureResponse = failedResponse()
    const createPrintJob = vi.fn().mockResolvedValue(failureResponse)
    usePrintingStore.mockReturnValue({ createPrintJob })
    const result = await printLabels('printer1', printBarcodes, labelDescription)
    expect(result).toEqual(failureResponse)
  })
})
