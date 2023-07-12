import { mount, localVue, store } from '@support/testHelper'
import PacbioRunPlateList from '@/components/pacbio/PacbioRunPlateList'
import { newWell } from '@/store/traction/pacbio/runCreate/run'
import { it } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'

describe('PacbioRunPlateList.vue', () => {
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
            sequencing_kit_box_barcode: 'skbb',
            wells: {
              A1: newWell({ position: 'A1' }),
              C5: newWell({ position: 'C5' }),
            },
          },
        },
      }

      store.state.traction.pacbio.runCreate.instrumentType = PacbioInstrumentTypes.SequelIIe

      wrapper = mount(PacbioRunPlateList, {
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

    describe('#instrumentType', () => {
      it('returns the correct instrument type', () => {
        expect(plate.instrumentType).toEqual(PacbioInstrumentTypes.SequelIIe)
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

      store.state.traction.pacbio.runCreate.instrumentType = PacbioInstrumentTypes.Revio

      wrapper = mount(PacbioRunPlateList, {
        localVue,
        store,
      })
      plate = wrapper.vm
    })

    it('has the correct number of wells', () => {
      const wells = wrapper.findAll('[data-attribute="pacbio-run-well"]')
      expect(wells.length).toEqual(4)
    })

    describe('#instrumentType', () => {
      it('returns the correct instrument type', () => {
        expect(plate.instrumentType).toEqual(PacbioInstrumentTypes.Revio)
      })
    })
  })
})
