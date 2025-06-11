import { getCurrentDate } from '@/lib/DateHelpers.js'
import { usePrintingStore } from '@/stores/printing.js'

/**
 * Composable function for handling Pacbio library printing.
 * @returns {Object} - An object containing the printLabels function
 *
 */
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
        round_label_bottom_line: source_identifier,
        label_name: 'main_label',
      }
    })
  }

  /**
   * Prints labels using the specified printer.
   * @param {string} printerName - The name of the printer.
   * @param {Array} printBarcodes - An array of objects containing barcode and source_identifier for each label to print.
   * eg. [{barcode: 'TRAC-1', source_identifier: 'TRAC-1'}]
   * @returns {Promise<Object>} - A promise that resolves to the result of the print job.
   */
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
