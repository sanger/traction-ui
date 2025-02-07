import { mountWithStore } from '@support/testHelper'
import PacbioRunPlateItem from '@/components/pacbio/PacbioRunPlateItem'
import { newWell, newPlate } from '@/stores/utilities/run'
import { it } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'

const smrtLinkVersions = {
  1: { id: 1, name: 'v11', default: true, active: true },
}

const props = {
  plateNumber: 1,
}

describe('PacbioRunPlateItem.vue', () => {
  let plateItem, wrapper, store

  const REVIO = 'Revio'
  const SEQUEL_IIE = 'Sequel IIe'

  describe('when run is a Sequel IIe', () => {
    beforeEach(() => {
      ;({ wrapper, store } = mountWithStore(PacbioRunPlateItem, {
        initialState: {
          pacbioRunCreate: {
            resources: { smrtLinkVersions },
            run: { system_name: SEQUEL_IIE },
            plates: { 1: { ...newPlate(1), sequencing_kit_box_barcode: 'twentyonecharacters00' } },
            wells: {
              1: {
                A1: newWell({ position: 'A1' }),
                C5: newWell({ position: 'C5' }),
              },
            },
          },
        },
        createStore: () => usePacbioRunCreateStore(),
        props,
      }))
      store.instrumentType = PacbioInstrumentTypes.SequelIIe
      plateItem = wrapper.vm
    })

    it('has the correct number of wells', () => {
      const wells = wrapper.findAll('[data-attribute="pacbio-run-well"]')
      expect(wells.length).toEqual(96)
    })

    it('has a plate', () => {
      expect(plateItem.storePlate).toEqual(store.plates[1])
    })

    describe('#instrumentType', () => {
      it('returns the correct instrument type', () => {
        expect(store.instrumentType).toEqual(PacbioInstrumentTypes.SequelIIe)
      })
    })

    it('does not return a serial number', () => {
      expect(wrapper.find('[data-attribute=serial-number]').exists()).toBeFalsy()
    })

    // 1 test is sufficient as this is tested thoroughly in the PacbioInstrumentType.spec.js
    describe('#validateSequencingKitBoxBarcode', () => {
      it('errors if sequencing kit box barcode is not valid', async () => {
        const skbbInput = wrapper.find('[data-attribute=sequencing-kit-box-barcode-1]')
        await skbbInput.setValue('some value')
        expect(plateItem.validateSequencingKitBoxBarcode.valid).toBeFalsy()
      })
    })
  })

  describe('when run is a Revio', () => {
    beforeEach(() => {
      ;({ wrapper, store } = mountWithStore(PacbioRunPlateItem, {
        initialState: {
          pacbioRunCreate: {
            resources: { smrtLinkVersions },
            run: { system_name: REVIO },
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
          },
        },
        createStore: () => usePacbioRunCreateStore(),
        props,
      }))
      store.instrumentType = PacbioInstrumentTypes.Revio
      plateItem = wrapper.vm
    })

    it('has the correct number of wells', () => {
      const wells = wrapper.findAll('[data-attribute="pacbio-run-well"]')
      expect(wells.length).toEqual(4)
    })

    describe('#instrumentType', () => {
      it('returns the correct instrument type', () => {
        expect(store.instrumentType).toEqual(PacbioInstrumentTypes.Revio)
      })
    })

    it('has a plate', () => {
      expect(plateItem.storePlate).toEqual(store.plates[1])
    })

    it('returns the serialNumber', () => {
      expect(wrapper.find('[data-attribute=serial-number]').text()).toEqual('Serial Number: 00373')
    })

    // 1 test is sufficient as this is tested thoroughly in the PacbioInstrumentType.spec.js
    describe('#validateSequencingKitBoxBarcode', () => {
      it('errors if sequencing kit box barcode is not valid', async () => {
        const skbbInput = wrapper.find('[data-attribute=sequencing-kit-box-barcode-1]')
        await skbbInput.setValue('some value')
        expect(plateItem.validateSequencingKitBoxBarcode.valid).toBeFalsy()
      })
    })
  })
})
