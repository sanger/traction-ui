import { mount, localVue } from '../testHelper'
import Chip from '@/components/Chip'

describe('Chip', () => {

  let wrapper, chip, props, input

  beforeEach(() => {
    props = { id: 1, barcode: 'CHIP-1234', flowcells: [ { id: 1, position: 1}, {id: 2, position: 2}]}
    wrapper = mount(Chip, { localVue, propsData: props } )
    chip = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Chip')
  })

  it('can have an id', () => {
    expect(chip.id).toEqual(props.id)
  })

  it('can have a barcode', () => {
    expect(chip.barcode).toEqual(props.barcode)
    expect(chip.localBarcode).toEqual(props.barcode)
  })

  it('can have some flowcells', () => {
    expect(chip.flowcells).toEqual(props.flowcells)
    expect(wrapper.findAll('.flowcell').length).toEqual(2)
  })

  it('allows the user to scan in a barcode', () => {
    input = wrapper.find('#barcode')
    input.setValue('CHIP-2345')
    expect(chip.localBarcode).toEqual('CHIP-2345')
  })

  it('will have a request', () => {
    expect(chip.request).toBeDefined()
  })

  it('will have a payload', () => {
    chip.localBarcode = 'CHIP-2345'
    let data = chip.payload.data
    expect(data.id).toEqual(props.id)
    expect(data.attributes.barcode).toEqual('CHIP-2345')
  })

  describe('updating the chip', () => {

    beforeEach(() => {
      chip.request.update = jest.fn()
    })

    it('successfully', async () => {
      let successfulResponse = [{ 'data': {}, 'status': 200, 'statusText': 'Success'}]
      chip.request.update.mockResolvedValue(successfulResponse)
      await chip.updateChip()
      expect(chip.request.update).toBeCalledWith(chip.payload)
      expect(chip.message).toEqual('Chip updated')
    })

    it('unsuccessfully', async () => {
      let failedResponse = { 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }
      chip.request.update.mockReturnValue([failedResponse])
      await chip.updateChip()
      expect(chip.message).toEqual('There was an error')
    })

    it('will be updated when the button is clicked', () => {
      chip.updateChip = jest.fn()
      input = wrapper.find('#barcode')
      input.setValue('CHIP-2345')
      input.trigger('change')
      expect(chip.updateChip).toBeCalled()
    })

  })

})