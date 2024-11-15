// Shared tests for the functionality of importing and scanning labware into LabWhere,
// available on the Reception page
//
import * as Reception from '@/services/traction/Reception.js'
import { expect, it } from 'vitest'
import { store } from '@support/testHelper.js'

export const sharedTestsForImportAndScanIn = (
  wrapper,
  scanBarcodesInLabwhereLocation,
  mockShowAlert,
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

      it('does not call create resource functionality', async () => {
        expect(Reception.createReceptionResource).not.toHaveBeenCalled()
      })

      it('does call scan in LabWhere functionality', () => {
        expect(scanBarcodesInLabwhereLocation).not.toHaveBeenCalled()
      })
    })

    describe('Fails to import labware', () => {
      store.state.traction.messages = []

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

      it('does not call scanIn LabWhere functionality', () => {
        expect(scanBarcodesInLabwhereLocation).not.toHaveBeenCalled()
      })
    })
  })

  describe('Successful import', () => {
    describe('Successfully import and scan in to LabWhere ', () => {
      let mockedCreateReception
      let mockedCreateMessages
      let tractionReceptionsCreate
      let foundBarcodes
      let attributes
      let importedBarcodes

      beforeEach(async () => {
        vi.resetAllMocks()
        vi.clearAllMocks()
        store.state.traction.messages = []
        mockedCreateReception = vi
          .spyOn(Reception, 'createReceptionResource')
          .mockImplementation(() => {})
        mockedCreateMessages = vi.spyOn(Reception, 'createMessages').mockImplementation(() => {
          return [{ text: '1 labware(s) successfully imported to Traction', type: 'success' }]
        })

        tractionReceptionsCreate = wrapper.vm.api.traction.receptions.create

        foundBarcodes = new Set(['NT1'])
        attributes = { source: 'traction-ui.sequencescape', request_attributes: [{}] }
        wrapper.vm.labwareData = { foundBarcodes, attributes }
        importedBarcodes = Array.from(foundBarcodes)

        scanBarcodesInLabwhereLocation.mockResolvedValueOnce({
          success: true,
          message: 'Scan in 1 barcode(s) to location location1',
        })

        await wrapper.vm.importLabware()
      })

      it('calls created reception functionality ', async () => {
        expect(mockedCreateReception).toBeCalledWith(
          tractionReceptionsCreate,
          foundBarcodes,
          attributes,
        )
      })

      it('create response messages accordingly ', async () => {
        expect(mockedCreateMessages).toBeCalled()
      })

      it('displays success message for importing ', async () => {
        expect(mockShowAlert).toHaveBeenCalledWith(
          '1 labware(s) successfully imported to Traction',
          'success',
        )
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
        store.state.traction.messages = []
        vi.resetAllMocks()
        vi.clearAllMocks()
        vi.spyOn(Reception, 'createReceptionResource').mockImplementation(() => {})
        vi.spyOn(Reception, 'createMessages').mockImplementation(() => {
          return [{ text: '1 labware(s) successfully imported to Traction', type: 'success' }]
        })

        wrapper.vm.labwareData = {
          foundBarcodes: new Set(['NT1']),
          attributes: { source: 'traction-ui.sequencescape', request_attributes: [{}] },
        }

        scanBarcodesInLabwhereLocation.mockReturnValue({
          success: false,
          errors: ['Failed to scan in 1 barcode(s) to location location1'],
        })

        await wrapper.vm.importLabware()
      })

      it('displays success message for importing ', async () => {
        expect(mockShowAlert).toHaveBeenCalledWith(
          '1 labware(s) successfully imported to Traction',
          'success',
        )
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
