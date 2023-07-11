import { mount, localVue, store } from '@support/testHelper'
import PacbioRunPlateItem from '@/components/pacbio/PacbioRunPlateItem'
import { newWell, newPlate } from '@/store/traction/pacbio/runCreate/run'
import { it } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'

describe('PacbioRunPlateList.vue', () => {
  let plateItem, wrapper, smrtLinkVersions

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
            sequencing_kit_box_barcode: 'skbb',
            wells: {
              A1: newWell({ position: 'A1' }),
              C5: newWell({ position: 'C5' }),
            },
          },
        },
      }

      store.state.traction.pacbio.runCreate.plates = { 1: newPlate(1) }

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
      expect(plateItem.plate).toEqual(store.state.traction.pacbio.runCreate.plates[1])
    })

    describe('#instrumentType', () => {
      it('returns the correct instrument type', () => {
        expect(plateItem.instrumentType).toEqual(PacbioInstrumentTypes.SequelIIe)
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
            sequencing_kit_box_barcode: 'skbb',
            wells: {
              A1: newWell({ position: 'A1' }),
              B1: newWell({ position: 'B1' }),
            },
          },
          2: {
            plate_number: 2,
            sequencing_kit_box_barcode: 'skbb',
            wells: {
              A1: newWell({ position: 'A1' }),
              D1: newWell({ position: 'D1' }),
            },
          },
        },
      }

      store.state.traction.pacbio.runCreate.plates = { 1: newPlate(1) }

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
      expect(plateItem.plate).toEqual(store.state.traction.pacbio.runCreate.plates[1])
    })
  })
})
