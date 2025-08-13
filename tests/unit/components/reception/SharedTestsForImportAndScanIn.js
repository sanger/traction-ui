// Shared tests for the functionality of importing and scanning labware into LabWhere,
// available on the Reception page
//
import * as Reception from '@/services/traction/Reception.js'
import { expect, it } from 'vitest'

export const sharedTestsForImportAndScanIn = (
  wrapper,
  scanBarcodesInLabwhereLocation,
  mockShowAlert,
  sourceLibrary,
) => {
  describe('Unsuccessful Import ', () => {
    vi.mock('@/services/labwhere/client.js')
    vi.spyOn(console, 'error').mockImplementation(() => {})

    describe('Fails to find labware', () => {
      beforeEach(async () => {
        wrapper.vm.reception.fetchFunction.mockRejectedValue('Failed fetch')
        await wrapper.vm.fetchLabware()
        wrapper.vm.reception.fetchFunction = vi.fn()
        vi.spyOn(Reception, 'createReceptionResource').mockImplementation(() => {})
      })
      it('shows error alert message', () => {
        expect(mockShowAlert).toHaveBeenCalledWith('Failed fetch', 'danger')
      })
    })

    describe('Fails to import labware', () => {
      it('calls create resource functionality', async () => {
        await wrapper.vm.importLabware()
        expect(Reception.createReceptionResource).toHaveBeenCalled()
      })

      it('shows error alert message', async () => {
        const message = 'The princess is in another castle'
        vi.spyOn(Reception, 'createReceptionResource').mockRejectedValueOnce(new Error(message))
        await wrapper.vm.importLabware()
        expect(mockShowAlert).toHaveBeenCalledWith(new Error(message), 'danger')
      })
    })
  })

  describe('Successful import', () => {
    let foundBarcodes
    let attributes
    let importedBarcodes

    beforeEach(async () => {
      vi.spyOn(Reception, 'createReceptionResource').mockResolvedValueOnce({
        success: true,
        data: { attributes: { labware: { NT1: { imported: 'success' } } } },
      })

      foundBarcodes = new Set(['NT1'])
      attributes = { source: 'traction-ui.sequencescape', request_attributes: [{}] }
      wrapper.vm.labwareData = { foundBarcodes, attributes }
      importedBarcodes = Array.from(foundBarcodes)
    })

    describe('Successfully import and scan in to LabWhere ', () => {
      beforeEach(async () => {
        scanBarcodesInLabwhereLocation.mockResolvedValueOnce({
          success: true,
          message: 'Scan in 1 barcode(s) to location location1',
        })

        await wrapper.vm.importLabware()
      })

      it('displays success message for importing ', async () => {
        expect(mockShowAlert).toHaveBeenCalledWith(`NT1 imported from ${sourceLibrary}.`, 'success')
      })

      it('calls scan in LabWhere ', async () => {
        expect(scanBarcodesInLabwhereLocation).toBeCalledWith(
          'user1',
          'location1',
          importedBarcodes.join('\n'),
        )
      })

      it('displays success message for scanning in labware to LabWhere ', async () => {
        expect(mockShowAlert).toHaveBeenCalledWith(
          'Scan in 1 barcode(s) to location location1',
          'success',
        )
      })
    })

    describe('Successfully import but fail to scan in to LabWhere ', async () => {
      beforeEach(async () => {
        scanBarcodesInLabwhereLocation.mockReturnValue({
          success: false,
          errors: ['Failed to scan in 1 barcode(s) to location location1'],
        })

        await wrapper.vm.importLabware()
      })

      it('displays success message for importing ', async () => {
        expect(mockShowAlert).toHaveBeenCalledWith(`NT1 imported from ${sourceLibrary}.`, 'success')
      })

      it('displays error message for scanning in labware to LabWhere ', async () => {
        expect(mockShowAlert).toHaveBeenCalledWith(
          'Failed to scan in 1 barcode(s) to location location1',
          'danger',
        )
      })
    })
  })
}
