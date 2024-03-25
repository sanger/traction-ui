import { mount, createTestingPinia } from '@support/testHelper.js'
import PacbioRunPlateList from '@/components/pacbio/V1/PacbioRunPlateListV1.vue'
import { newWell } from '@/stores/utilities/run.js'
import { it } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreateV1.js'

const smrtLinkVersions = {
  1: { id: 1, name: 'v11', default: true, active: true },
}

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * state - initial state of the store.
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 */
function mountWithStore({ state = {}, stubActions = false, plugins = [] } = {}) {
  const wrapperObj = mount(PacbioRunPlateList, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioRunCreate: { resources: { smrtLinkVersions }, ...state },
          },
          stubActions,
          plugins,
        }),
      ],
    },
  })
  const storeObj = usePacbioRunCreateStore()
  return { wrapperObj, storeObj }
}

describe('PacbioRunPlateList.vue', () => {
  let plate, wrapper

  const REVIO = 'Revio'
  const SEQUEL_IIE = 'Sequel IIe'

  describe('when run is a Sequel IIe', () => {
    beforeEach(() => {
      const { wrapperObj, storeObj } = mountWithStore({
        state: {
          run: { system_name: SEQUEL_IIE },
          plates: { 1: { plate_number: 1, sequencing_kit_box_barcode: 'twentyonecharacters00' } },
          wells: {
            1: {
              A1: newWell({ position: 'A1' }),
              C5: newWell({ position: 'C5' }),
            },
          },
        },
      })
      wrapper = wrapperObj
      plate = wrapper.vm
      storeObj.instrumentType = PacbioInstrumentTypes.SequelIIe
    })

    it('will be defined', () => {
      expect(plate).toBeDefined()
    })

    it('has the correct number of wells', () => {
      const wells = wrapper.findAll('[data-attribute="pacbio-run-well"]')
      expect(wells.length).toEqual(96)
    })
  })

  describe('when run is a Revio', () => {
    beforeEach(() => {
      const { wrapperObj, storeObj } = mountWithStore({
        state: {
          run: { system_name: REVIO },
          plates: {
            1: {
              plate_number: 1,
              sequencing_kit_box_barcode: '1021188000301570037320231019',
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
      })
      wrapper = wrapperObj
      plate = wrapper.vm
      storeObj.instrumentType = PacbioInstrumentTypes.Revio
    })

    it('has the correct number of wells', () => {
      const wells = wrapper.findAll('[data-attribute="pacbio-run-well"]')
      expect(wells.length).toEqual(8)
    })
  })

  describe('when run is a Revio but there is only 1 plate', () => {
    beforeEach(() => {
      const { wrapperObj, storeObj } = mountWithStore({
        state: {
          run: { system_name: REVIO },
          plates: {
            1: {
              plate_number: 1,
              sequencing_kit_box_barcode: '1021188000301570037320231019',
            },
          },
          wells: {
            1: {
              A1: newWell({ position: 'A1' }),
              B1: newWell({ position: 'B1' }),
            },
          },
          instrumentType: PacbioInstrumentTypes.Revio,
        },
      })
      wrapper = wrapperObj
      plate = wrapper.vm
      storeObj.instrumentType = PacbioInstrumentTypes.Revio
    })

    it('has the correct number of wells', () => {
      const wells = wrapper.findAll('[data-attribute="pacbio-run-well"]')
      expect(wells.length).toEqual(4)
    })
  })
})
