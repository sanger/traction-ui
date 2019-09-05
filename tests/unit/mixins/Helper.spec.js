// describe('#handlePrintLabel', () => {
//   let request
//
//   beforeEach(() => {
//     samples.selected = [{ id: 1, type: 'samples', name: 'enz1', barcode: 'TRAC-1' }]
//
//     request = store.getters.api.printMyBarcode.print_jobs
//     request.create = jest.fn()
//   })
//
//   it('passes selected printer to function on emit event', () => {
//     let successfulResponse =  {
//       data: {},
//       status: 201,
//       statusText: "OK"
//     }
//
//     let successfulPromise = new Promise((resolve) => {
//       resolve(successfulResponse)
//     })
//
//     request.create.mockResolvedValue(successfulPromise)
//     let modal = wrapper.find(PrinterModal)
//     modal.vm.$emit('selectPrinter', 'printer1')
//
//     expect(request.create).toBeCalled()
//   })
//
//   it('successfully prints label', async () => {
//     let successfulResponse =  {
//       data: {},
//       status: 201,
//       statusText: "OK"
//     }
//
//     let successfulPromise = new Promise((resolve) => {
//       resolve(successfulResponse)
//     })
//
//     request.create.mockResolvedValue(successfulPromise)
//     await samples.handlePrintLabel('printer1')
//     expect(wrapper.find(Alert).vm.message).toEqual(consts.MESSAGE_SUCCESS_PRINTER)
//   })
//
//   it('unsuccessfully', async () => {
//     let failedResponse =  {
//       data: {
//         errors: {
//           it: ['was a bust']
//         }
//       },
//       status: 422
//     }
//
//     let failedPromise = new Promise((reject) => {
//       reject(failedResponse)
//     })
//
//     request.create.mockReturnValue(failedPromise)
//     await samples.handlePrintLabel('printer1')
//     expect(wrapper.find(Alert).vm.message).toEqual('it was a bust')
//   })
//
// })
//
// describe('#handlePrintLabel', () => {
//   let printerName
//
//   beforeEach(() => {
//     printerName = "abc123"
//     samples.selected = [{ id: 1, type: 'libraries', enzyme_name: 'enz1', barcode: 'TRAC-1' }]
//     samples.printLabels = jest.fn()
//     samples.showAlert = jest.fn()
//   })
//
//   it('passes selected printer to function on emit event', () => {
//     samples.handlePrintLabel = jest.fn()
//
//     let successfulResponse =  { data: {}, status: 201, statusText: "OK" }
//
//     let expectedResponse = new Response(successfulResponse)
//     samples.printLabels.mockReturnValue(expectedResponse)
//
//     let modal = wrapper.find(PrinterModal)
//     modal.vm.$emit('selectPrinter', printerName)
//     expect(modal.emitted().selectPrinter[0]).toEqual([printerName])
//   })
//
//   it('does not store any library barcodes', async () => {
//     let mockResponse = { data: { errors: { name: ['name error message 1']}},
//       status: 422,
//       statusText: "Unprocessible entity"
//     }
//
//     samples.tractionSaphyrLibraryRequest.create.mockResolvedValue(mockResponse)
//
//     let selectedEnzymeId = 1
//     samples.selected = [{id: 1}]
//
//     await expect(samples.createLibrariesInTraction(selectedEnzymeId)).rejects.toThrow(
//       consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + "name name error message 1"
//     )
//     expect(samples.barcodes).toEqual([])
//   })
//
//   it('does something', async () => {
//     let expectedResponse = new Response(successfulResponse)
//
//     samples.printLabels.mockReturnValue(expectedResponse)
//
//     await samples.handlePrintLabel(printerName)
//
//     expect(samples.printLabels).toBeCalledWith(printerName, samples.selected)
//     expect(samples.message).toEqual('Printed successfully')
//     expect(samples.showAlert).toBeCalled()
//   })
//
//   it('unsuccessfully', async () => {
//     samples.tractionSaphyrTubeRequest.get.mockResolvedValue(failedResponse)
//     await expect(samples.handleTractionTubes()).rejects.toThrow(
//       consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
//   })
//
//   it('when no tubes exist', async () => {
//     samples.tractionSaphyrTubeRequest.get.mockResolvedValue(emptyResponse)
//     await expect(samples.handleTractionTubes()).rejects.toThrow(
//       consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
//   })
//
//   it('when there are no barcodes', async () => {
//     wrapper.setData({ barcodes: '' })
//     await expect(samples.handleTractionTubes()).rejects.toThrow(
//       consts.MESSAGE_WARNING_NO_BARCODES)
//   })
// })
