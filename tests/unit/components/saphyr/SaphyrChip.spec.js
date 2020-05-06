import { mount, localVue, Vuex } from '../../testHelper'
import Chip from '@/components/saphyr/SaphyrChip'
import * as Run from '@/api/SaphyrRun'

describe('Chip', () => {

  let wrapper, chip, run, actions

  beforeEach(() => {
    run = Run.build()
        
    actions = {
      updateChipBarcode: jest.fn()
    }

    let store = new Vuex.Store({
      modules: {
        traction: {
          namespaced: true,
          modules: {
            saphyr: {
              namespaced: true,
              modules: {
                runs: {
                  namespaced: true,
                  state: {
                    currentRun: run
                  },
                  getters: {
                    currentRun: state => state.currentRun,
                  },
                  actions
                }
              }

            }
          }
        }
      }
    })

    wrapper = mount(Chip, { localVue, store } )
    chip = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('SaphyrChip')
  })

  it('can have state', () => {
    expect(chip.chipBarcode).toEqual(run.chip.barcode)
    expect(chip.flowcells).toEqual(run.chip.flowcells)
  })

  it('can have getters', () => {
    expect(chip.currentRun).toBeDefined()
  })

  it('can have some flowcells', () => {
    expect(wrapper.findAll('.flowcell').length).toEqual(2)
  })

  describe('setBarcode', () => {
    let newBarcode

    beforeEach(() => {
      newBarcode = 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX'
      chip.alert = jest.fn()
      chip.isChipBarcodeValid = jest.fn()
      chip.setChipBarcode = jest.fn()
    })

    it('successful when chip is valid', () => {
      chip.isChipBarcodeValid.mockReturnValue(true)
      chip.setBarcode(newBarcode)
      expect(chip.setChipBarcode).toBeCalledWith(newBarcode)
      expect(chip.alert).not.toBeCalled()
    })

    it('is unsuccessful when chip is not valid', () => {
      chip.isChipBarcodeValid.mockReturnValue(false)
      chip.setBarcode(newBarcode)
      expect(chip.setChipBarcode).not.toBeCalled()
      expect(chip.alert).toBeCalled()
    })
  })

  describe('isChipBarcodeValid', () => {
    it('returns true when barcode is valid', () => {
      expect(chip.isChipBarcodeValid('barcodewithlength')).toEqual(true)
    })

    it('returns false when barcode is not valid', () => {
      expect(chip.isChipBarcodeValid('badbarcode')).toEqual(false)
    })
  })

  describe('alert', () => {
    it('emits an event with the message', () => {
      chip.alert('emit this message', 'success')
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0][0]).toEqual('emit this message')
      expect(wrapper.emitted().alert[0][1]).toEqual('success')
    })
  })

})
