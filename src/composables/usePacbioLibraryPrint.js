import { getCurrentDate } from '@/lib/DateHelpers.js'
import { usePrintingStore } from '@/stores/printing.js'

export default function usePacbioLibraryPrint() {
  const createLabels = (printBarcodes) => {
    const date = getCurrentDate()
    return printBarcodes.map(({ barcode, source_identifier }) => {
      return {
        barcode,
        first_line: 'Pacbio - Library',
        second_line: date,
        third_line: barcode,
        fourth_line: source_identifier,
        label_name: 'main_label',
      }
    })
  }

  const printLabels = async (printerName, printBarcodes) => {
    const { createPrintJob } = usePrintingStore()
    return await createPrintJob({
      printerName,
      labels: createLabels(printBarcodes),
      copies: 1,
    })
  }
  return {
    printLabels,
  }
}
