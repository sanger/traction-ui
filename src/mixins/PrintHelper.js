/**
 * A helper mixin to store commonly used functionality
 */

 const MESSAGE_SUCCESS_PRINTER = 'Printed successfully'

 export default {
   name: 'PrintHelper',
   methods: {
     async handlePrintLabel(pipeline, printerName) {

        const params = {
          printerName: printerName,
          barcodesList: this.selected.map(v => (v["barcode"])),
          copies: "1",
        }
        const printJobV2Response = await this.printJobV2(params)

        const successful = printJobV2Response.success
        const message = printJobV2Response.data.message

       if (successful) {
         this.showAlert(MESSAGE_SUCCESS_PRINTER, 'success')
       } else {
         this.showAlert(message, 'danger')
       }
     },
   },
 }
