import { mount, localVue, Vuex } from '../testHelper'
import Chip from '@/components/Chip'
import * as Run from '@/api/Run'
import Response from '@/api/Response'

describe('Chip', () => {

  let wrapper, chip, props, input, run, actions

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
    expect(wrapper.name()).toEqual('Chip')
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

  describe.skip('#updateBarcode', () => {
    it('allows the user to scan in a barcode', () => {
      chip.updateBarcode = jest.fn()
      input = wrapper.find('#barcode')
      input.setValue('CHIP-2345')
      input.trigger('change')
      expect(chip.updateBarcode).toBeCalled()
    })
  })

  describe('updateBarcode', () => {
    let newBarcode

    beforeEach(() => {
      newBarcode = 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX'
      chip.alert = jest.fn()
    })

    it('successful', () => {
      let successfulResponse = { 'data': {}, 'status': 200, 'statusText': 'Success' }
      actions.updateChipBarcode.mockReturnValue(new Response(successfulResponse))

      chip.updateBarcode(newBarcode)
      expect(chip.alert).toBeCalled()
    })

    describe.skip('existing record', () => {
      beforeEach(() => {
        chip.chipRequest.update = jest.fn()
        chip.alert = jest.fn()
      })

      it('successfully', async () => {
        let successfulResponse = [{ 'data': {}, 'status': 200, 'statusText': 'Success'}]
        chip.chipRequest.update.mockReturnValue(successfulResponse)
        await chip.updateChip()
        expect(chip.chipRequest.update).toBeCalledWith(chip.payload)
        expect(chip.alert).toBeCalledWith('Chip updated')
      })

      it('unsuccessfully', async () => {
        let failedResponse = { 'data': { errors: { barcode: ['error message'] }}, 'status': 500, 'statusText': 'Internal Server Error' }
        chip.chipRequest.update.mockReturnValue([failedResponse])
        await chip.updateChip()
        expect(chip.alert).toBeCalledWith('There was an error: barcode error message')
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

  describe('alert', () => {
    it('emits an event with the message', () => {
      chip.alert('emit this message', 'success')
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0][0]).toEqual('emit this message')
      expect(wrapper.emitted().alert[0][1]).toEqual('success')
    })
  })

})
