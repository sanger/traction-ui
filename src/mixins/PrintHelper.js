/**
 * A helper mixin to store commonly used functionality
 */
//  import { printJob } from '@/api/PrintJobRequests'

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

        // TODO: figure out how pipeline is being used in this previous code,
        // and make sure we're including the same info in the V2 request.
        //
        // let { successful, errors: { message } = {} } = await printJob(
        //   printerName,
        //   this.selected,
        //   pipeline,
        // )

       if (successful) {
         this.showAlert(MESSAGE_SUCCESS_PRINTER, 'success')
       } else {
         this.showAlert(message, 'danger')
       }
     },
   },
 }
