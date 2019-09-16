import { mount, localVue, Vuex } from '../testHelper'
import Chip from '@/components/Chip'
import * as Run from '@/api/Run'
import Response from '@/api/Response'

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

  describe('updateBarcode', () => {
    let newBarcode

    beforeEach(() => {
      newBarcode = 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX'
      chip.alert = jest.fn()
    })

    it('successful', async () => {
      let successfulResponse = { 'data': {}, 'status': 200, 'statusText': 'Success' }
      let expectedResponse = new Response(successfulResponse)
      actions.updateChipBarcode.mockReturnValue(expectedResponse)

      await chip.updateBarcode(newBarcode)
      expect(chip.alert).toBeCalledWith('Chip barcode updated', 'success')
    })


    it('unsuccessful', async () => {
      let failedResponse = { 'data': { errors: { barcode: ['error message'] } }, 'status': 500, 'statusText': 'Internal Server Error' }
      let expectedResponse = new Response(failedResponse)
      actions.updateChipBarcode.mockReturnValue(expectedResponse)

      await chip.updateBarcode(newBarcode)
      expect(chip.alert).toBeCalledWith('There was an error: barcode error message', 'danger')
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
