import { mount, createTestingPinia } from '@support/testHelper'
import PacbioRunPlateItem from '@/components/pacbio/PacbioRunPlateItem'
import { newWell, newPlate } from '@/stores/utilities/run'
import { it } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreateV1.js'

const smrtLinkVersions = {
  1: { id: 1, name: 'v11', default: true, active: true },
}

const props = {
  plateNumber: 1,
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
  const wrapperObj = mount(PacbioRunPlateItem, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioRunCreate: { ...state },
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
  })
  const storeObj = usePacbioRunCreateStore()
  return { wrapperObj, storeObj }
}

describe('PacbioRunPlateItem.vue', () => {
  let plateItem, wrapper, store

  const REVIO = 'Revio'
  const SEQUEL_IIE = 'Sequel IIe'

  describe('when run is a Sequel IIe', () => {
    beforeEach(() => {
      const { wrapperObj, storeObj } = mountWithStore({
        state: {
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
      })
      wrapper = wrapperObj
      store = storeObj
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

    // why is this not showing up? I wonder if this is an issue with traction-input
    // this is tested elsehwere but it vexes me.
    it.skip('returns the sequencing kit box barcode', () => {
      expect(wrapper.find('[data-attribute="sequencing-kit-box-barcode-1"]').text()).toEqual(
        'twentyonecharacters00',
      )
    })

    describe('#instrumentType', () => {
      it('returns the correct instrument type', () => {
        expect(plateItem.instrumentType).toEqual(PacbioInstrumentTypes.SequelIIe)
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
      const { wrapperObj, storeObj } = mountWithStore({
        state: {
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
      })
      wrapper = wrapperObj
      store = storeObj
      store.instrumentType = PacbioInstrumentTypes.Revio
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
      expect(plateItem.storePlate).toEqual(store.plates[1])
    })

    // why is this not showing up? I wonder if this is an issue with traction-input
    // this is tested elsehwere but it vexes me.
    it.skip('returns the sequencing kit box barcode', () => {
      expect(wrapper.find('[data-attribute=sequencing-kit-box-barcode-1]').text()).toEqual(
        '1021188000301570037320231019',
      )
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
