/**
 * A helper mixin to store commonly used functionality
 */
 import { printJob } from '@/api/PrintJobRequests'
 import PrinterList from '@/config/PrinterList'

 const MESSAGE_SUCCESS_PRINTER = 'Printed successfully'

 export default {
   name: 'PrintHelper',
   methods: {
     async handlePrintLabel(pipeline, printerName) {
       let successful, errors, message

      // TODO: modify getter to include 'type', and then use this.$store.getters.printers
       let printer
       PrinterList.forEach(v => { if(v["printerName"] == printerName){printer = v} })

       if(printer["type"] == "squix") { // Squix printer

         const params = {
           printerName: printerName,
           barcodesList: this.selected.map(v => (v["barcode"])),
           copies: "1",
         }
         const printJobV2Response = await this.printJobV2(params) // this.printJobV2 is not a function

         successful = printJobV2Response.success
         message = printJobV2Response.data.message

       } else { // Toshiba printer

         // Is this equivalent to the following, without the let?
         //  let { successful, errors: { message } = {} } = await printJob(
         successful, { errors: { message } = {} } = await printJob(
           printerName,
           this.selected,
           pipeline,
         )

       }

       if (successful) {
         this.showAlert(MESSAGE_SUCCESS_PRINTER, 'success')
       } else {
         this.showAlert(message, 'danger')
       }
     },
   },
 }
