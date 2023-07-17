import { mount, localVue, store } from '@support/testHelper'
import PacbioRunPlateItem from '@/components/pacbio/PacbioRunPlateItem'
import { newWell, newPlate } from '@/store/traction/pacbio/runCreate/run'
import { it } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'

const smrtLinkVersions = {
  1: { id: 1, name: 'v11', default: true },
}

store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions

describe('PacbioRunPlateItem.vue', () => {
  let plateItem, wrapper

  const REVIO = 'Revio'
  const SEQUEL_IIE = 'Sequel IIe'

  describe('when run is a Sequel IIe', () => {
    beforeEach(() => {
      store.state.traction.pacbio.runCreate = {
        run: { system_name: SEQUEL_IIE },
        plates: { 1: { ...newPlate(1), sequencing_kit_box_barcode: 'twentyonecharacters00' } },
        wells: {
          1: {
            A1: newWell({ position: 'A1' }),
            C5: newWell({ position: 'C5' }),
          },
        },
      }

      store.state.traction.pacbio.runCreate.instrumentType = PacbioInstrumentTypes.SequelIIe

      wrapper = mount(PacbioRunPlateItem, {
        localVue,
        store,
        propsData: {
          plateNumber: 1,
        },
      })
      plateItem = wrapper.vm
    })

    it('has the correct number of wells', () => {
      const wells = wrapper.findAll('[data-attribute="pacbio-run-well"]')
      expect(wells.length).toEqual(96)
    })

    it('has a plate', () => {
      expect(plateItem.storePlate).toEqual(store.state.traction.pacbio.runCreate.plates[1])
    })

    describe('#instrumentType', () => {
      it('returns the correct instrument type', () => {
        expect(plateItem.instrumentType).toEqual(PacbioInstrumentTypes.SequelIIe)
      })
    })

    describe('#methods', () => {
      it('does not return a serial number', () => {
        expect(wrapper.find('[data-attribute=serial-number]').exists()).toBeFalsy()
      })

      // why is this not showing up?
      it.skip('returns the sequencing kit box barcode', async () => {
        expect(wrapper.find('[data-attribute=sequencing-kit-box-barcode-1]').text()).toEqual(
          'twentyonecharacters00',
        )
      })

      describe('validateSequencingKitBoxBarcode', () => {
        it('errors if SequencingKitBoxBarcode is not valid', async () => {
          const skbbInput = wrapper.find('[data-attribute=sequencing-kit-box-barcode-1]')
          await skbbInput.setValue('some value')
          expect(plateItem.validateSequencingKitBoxBarcode()).toEqual({
            valid: false,
            error: 'Invalid Sequencing Kit Barcode',
          })
        })

        it('does not error if SequencingKitBoxBarcode is valid', async () => {
          expect(plateItem.validateSequencingKitBoxBarcode()).toEqual({
            valid: true,
            error: '',
          })
        })

        it('does not error if SequencingKitBoxBarcode is empty', async () => {
          const skbbInput = wrapper.find('[data-attribute=sequencing-kit-box-barcode-1]')
          await skbbInput.setValue('')
          expect(plateItem.validateSequencingKitBoxBarcode()).toEqual({
            valid: null,
            error: '',
          })
        })
      })
    })
  })

  describe('when run is a Revio', () => {
    beforeEach(() => {
      store.state.traction.pacbio.runCreate = {
        run: {
          system_name: REVIO,
        },
        plates: {
          1: {
            plate_number: 1,
            sequencing_kit_box_barcode: '1021188000301570037320231019',
          },
          2: {
            plate_number: 2,
            sequencing_kit_box_barcode: '1021188000301570123420231019',
          },
        },
        wells: {
          1: {
            A1: newWell({ position: 'A1' }),
            B1: newWell({ position: 'B1' }),
          },
          2: {
            A1: newWell({ position: 'A1' }),
            D1: newWell({ position: 'D1' }),
          },
        },
      }

      store.state.traction.pacbio.runCreate.instrumentType = PacbioInstrumentTypes.Revio

      wrapper = mount(PacbioRunPlateItem, {
        localVue,
        store,
        propsData: {
          plateNumber: 1,
        },
      })
      plateItem = wrapper.vm
    })

    it('has the correct number of wells', () => {
      const wells = wrapper.findAll('[data-attribute="pacbio-run-well"]')
      expect(wells.length).toEqual(4)
    })

    describe('#instrumentType', () => {
      it('returns the correct instrument type', () => {
        expect(plateItem.instrumentType).toEqual(PacbioInstrumentTypes.Revio)
      })
    })

    it('has a plate', () => {
      expect(plateItem.storePlate).toEqual(store.state.traction.pacbio.runCreate.plates[1])
    })

    // why is this not showing up?
    it.skip('returns the sequencing kit box barcode', async () => {
      expect(wrapper.find('[data-attribute=sequencing-kit-box-barcode-1]').text()).toEqual(
        '1021188000301570037320231019',
      )
    })

    describe('#methods', () => {
      it('returns the serialNumber', () => {
        expect(wrapper.find('[data-attribute=serial-number]').text()).toEqual(
          'Serial Number: 00373',
        )
      })
    })

    describe('validateSequencingKitBoxBarcode', () => {
      it('errors if SequencingKitBoxBarcode is not valid', async () => {
        const skbbInput = wrapper.find('[data-attribute=sequencing-kit-box-barcode-1]')
        await skbbInput.setValue('some value')
        expect(plateItem.validateSequencingKitBoxBarcode()).toEqual({
          valid: false,
          error: 'Invalid Sequencing Kit Barcode',
        })
      })

      it('does not error if SequencingKitBoxBarcode is valid', async () => {
        expect(plateItem.validateSequencingKitBoxBarcode()).toEqual({
          valid: true,
          error: '',
        })
      })

      it('does not error if SequencingKitBoxBarcode is empty', async () => {
        const skbbInput = wrapper.find('[data-attribute=sequencing-kit-box-barcode-1]')
        await skbbInput.setValue('')
        expect(plateItem.validateSequencingKitBoxBarcode()).toEqual({
          valid: null,
          error: '',
        })
      })
    })
  })
})
