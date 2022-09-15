/**
 * A helper mixin to store commonly used functionality
 */
 import { printJob } from '@/api/PrintJobRequests'

 const MESSAGE_SUCCESS_PRINTER = 'Printed successfully'
 const IS_SQUIX = true // TODO: replace with better thing - e.g. load from config

 export default {
   name: 'PrintHelper',
   methods: {
     async handlePrintLabel(pipeline, printerName) {
       let successful, errors, message

       if(IS_SQUIX) { // Squix printer

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
