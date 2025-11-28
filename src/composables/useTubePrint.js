import { getCurrentDate } from '@/lib/DateHelpers.js'
import { usePrintingStore } from '@/stores/printing.js'
import { splitBarcodeByPrefix } from '@/lib/LabelPrintingHelpers.js'

/**
 * Composable function for handling tube label printing, including library and pool labels.
 * @returns {Object} - An object containing the printLabels function
 *
 */
export default function useTubePrint() {
  const createLabels = (printBarcodes, labelDescription) => {
    const date = getCurrentDate()
    return printBarcodes.map(({ barcode, source_identifier }) => {
      const { prefix: round_label_lower_line, id: round_label_bottom_line } =
        splitBarcodeByPrefix(barcode)
      return {
        barcode,
        first_line: labelDescription,
        second_line: date,
        third_line: barcode,
        fourth_line: source_identifier,
        round_label_bottom_line,
        round_label_lower_line,
        label_name: 'main_label',
      }
    })
  }

  /**
   * Prints labels using the specified printer.
   * @param {string} printerName - The name of the printer.
   * @param {Array} printBarcodes - An array of objects containing barcode and source_identifier for each label to print.
   * @param {string} labelDescription - Description to be printed on the first line of the label.
   * eg. [{barcode: 'TRAC-1', source_identifier: 'TRAC-1'}]
   * @returns {Promise<Object>} - A promise that resolves to the result of the print job.
   */
  const printLabels = async (printerName, printBarcodes, labelDescription) => {
    const { createPrintJob } = usePrintingStore()
    return await createPrintJob({
      printerName,
      labels: createLabels(printBarcodes, labelDescription),
      copies: 1,
    })
  }
  return {
    printLabels,
  }
}
