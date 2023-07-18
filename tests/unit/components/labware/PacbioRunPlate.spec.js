import { mount, localVue, store } from '@support/testHelper'
import PacbioRunPlate from '@/components/pacbio/PacbioRunPlate'
import { newWell } from '@/store/traction/pacbio/runCreate/run'
import { it } from 'vitest'
import { LabwareTypes } from '@/lib/LabwareTypes'

describe('PacbioRunPlate.vue', () => {
  let plate, wrapper, smrtLinkVersions

  const REVIO = 'Revio'
  const SEQUEL_IIE = 'Sequel IIe'

  beforeEach(() => {
    smrtLinkVersions = {
      1: { id: 1, name: 'v11', default: true },
    }
    store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions
  })

  describe('when run is a Sequel IIe', () => {
    beforeEach(() => {
      store.state.traction.pacbio.runCreate.run = {
        system_name: SEQUEL_IIE,
        plates: {
          1: {
            plate_number: 1,
            sequencing_kit_box_barcode: 'twentyonecharacters00',
            wells: {
              A1: newWell({ position: 'A1' }),
              C5: newWell({ position: 'C5' }),
            },
          },
        },
      }

      wrapper = mount(PacbioRunPlate, {
        localVue,
        store,
      })
      plate = wrapper.vm
    })

    it('will be defined', () => {
      expect(plate).toBeDefined()
    })

    it('has the correct number of wells', () => {
      const wells = wrapper.findAll('[data-attribute="pacbio-run-well"]')
      expect(wells.length).toEqual(96)
    })

    describe('#computed', () => {
      it('labware returns the correct information', () => {
        expect(plate.labware.plateCount).toEqual(1)
        expect(plate.labware.labwareType).toEqual(LabwareTypes.Plate96)
      })
      it('isRevio', () => {
        expect(plate.isRevio).toEqual(false)
      })

      it('isSequel', () => {
        expect(plate.isSequel).toEqual(true)
      })
    })

    describe('#methods', () => {
      it('returns the sequencingKitBoxBarcode', () => {
        expect(plate.sequencingKitBoxBarcode(1)).toEqual('twentyonecharacters00')
      })

      describe('validateSequencingKitBoxBarcode', () => {
        const plateNumber = 1

        it('errors if SequencingKitBoxBarcode is not valid', async () => {
          const skbbInput = wrapper.find('#sequencing-kit-box-barcode-1')
          await skbbInput.setValue('some value')
          expect(plate.validateSequencingKitBoxBarcode(plateNumber)).toEqual({
            valid: false,
            error: 'Invalid Sequencing Kit Barcode (length 10/21)',
          })
        })

        it('does not error if SequencingKitBoxBarcode is valid', async () => {
          expect(plate.validateSequencingKitBoxBarcode(plateNumber)).toEqual({
            valid: true,
            error: '',
          })
        })

        it('does not error if SequencingKitBoxBarcode is empty', async () => {
          const skbbInput = wrapper.find('#sequencing-kit-box-barcode-1')
          await skbbInput.setValue('')
          expect(plate.validateSequencingKitBoxBarcode(plateNumber)).toEqual({
            valid: null,
            error: '',
          })
        })
      })
    })
  })

  describe('when run is a Revio', () => {
    beforeEach(() => {
      store.state.traction.pacbio.runCreate.run = {
        system_name: REVIO,
        plates: {
          1: {
            plate_number: 1,
            sequencing_kit_box_barcode: '1021188000301570037320231019',
            wells: {
              A1: newWell({ position: 'A1' }),
              B1: newWell({ position: 'B1' }),
            },
          },
          2: {
            plate_number: 2,
            sequencing_kit_box_barcode: '1021188000301570123420231019',
            wells: {
              A1: newWell({ position: 'A1' }),
              D1: newWell({ position: 'D1' }),
            },
          },
        },
      }

      wrapper = mount(PacbioRunPlate, {
        localVue,
        store,
      })
      plate = wrapper.vm
    })

    it('will be defined', () => {
      expect(plate).toBeDefined()
    })

    it('has the correct number of wells', () => {
      const wells = wrapper.findAll('[data-attribute="pacbio-run-well"]')
      expect(wells.length).toEqual(4)
    })

    describe('#computed', () => {
      it('labware returns the correct information', () => {
        expect(plate.labware.plateCount).toEqual(1)
        expect(plate.labware.labwareType).toEqual(LabwareTypes.Plate4)
      })
      it('isRevio', () => {
        expect(plate.isRevio).toEqual(true)
      })

      it('isSequel', () => {
        expect(plate.isSequel).toEqual(false)
      })
    })

    describe('#methods', () => {
      it('returns the sequencingKitBoxBarcode', () => {
        expect(plate.sequencingKitBoxBarcode(1)).toEqual('1021188000301570037320231019')
        expect(plate.sequencingKitBoxBarcode(2)).toEqual('1021188000301570123420231019')
      })

      it('returns the serialNumber', () => {
        expect(plate.serialNumber(1)).toEqual('00373')
        expect(plate.serialNumber(2)).toEqual('01234')
      })

      describe('validateSequencingKitBoxBarcode', () => {
        const plateNumber = 1

        it('errors if SequencingKitBoxBarcode is not valid', async () => {
          const skbbInput = wrapper.find('#sequencing-kit-box-barcode-1')
          await skbbInput.setValue('some value')
          expect(plate.validateSequencingKitBoxBarcode(plateNumber)).toEqual({
            valid: false,
            error: 'Invalid Sequencing Kit Barcode (length 10/28)',
          })
        })

        it('does not error if SequencingKitBoxBarcode is valid', async () => {
          expect(plate.validateSequencingKitBoxBarcode(plateNumber)).toEqual({
            valid: true,
            error: '',
          })
        })

        it('does not error if SequencingKitBoxBarcode is empty', async () => {
          const skbbInput = wrapper.find('#sequencing-kit-box-barcode-1')
          await skbbInput.setValue('')
          expect(plate.validateSequencingKitBoxBarcode(plateNumber)).toEqual({
            valid: null,
            error: '',
          })
        })
      })
    })
  })
})
