import { mount, store } from '@support/testHelper'
import Chip from '@/components/saphyr/SaphyrChip'
import * as Run from '@/api/v1/SaphyrRun.js'

describe('Chip', () => {
  let wrapper, chip, run, props

  beforeEach(() => {
    run = Run.build()

    store.commit('traction/saphyr/runs/setCurrentRun', run)

    props = {
      chip: {
        id: '1',
        type: 'chips',
        barcode: 'BARCODESTRING',
        flowcells: [{ id: '1' }, { id: '2' }],
      },
    }

    wrapper = mount(Chip, {
      store,
      props,
    })
    chip = wrapper.vm
  })

  describe('props', () => {
    it('must have a chip', () => {
      expect(chip.chip).toEqual(props.chip)
      expect(wrapper.find('#barcode').element.value).toEqual(props.chip.barcode)
    })
  })

  it('can have some flowcells', () => {
    expect(wrapper.findAll('.flowcell').length).toEqual(2)
  })

  describe('setBarcode', () => {
    let newBarcode

    beforeEach(() => {
      newBarcode = 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX'
      chip.alert = vi.fn()
      chip.isChipBarcodeValid = vi.fn()
      chip.setChipBarcode = vi.fn()
    })

    it('successful when chip is valid', () => {
      chip.isChipBarcodeValid.mockReturnValue(true)
      chip.setBarcode(newBarcode)
      expect(chip.setChipBarcode).toBeCalledWith(newBarcode)
      expect(chip.alert).toBeCalledWith('Chip barcode is valid', 'success')
    })

    it('is unsuccessful when chip is not valid', () => {
      chip.isChipBarcodeValid.mockReturnValue(false)
      chip.setBarcode(newBarcode)
      expect(chip.setChipBarcode).not.toBeCalled()
      expect(chip.alert).toBeCalledWith('Chip barcode is not valid', 'danger')
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
