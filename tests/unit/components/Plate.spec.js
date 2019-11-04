import { mount, localVue, Vuex } from '../testHelper'
import Plate from '@/components/Plate'
import * as Run from '@/api/PacbioRun'

describe('Plate.vue', () => {

  let plate, wrapper, run

  beforeEach(() => {
    run = Run.build()

    let store = new Vuex.Store({
      modules: {
        traction: {
          namespaced: true,
          modules: {
            pacbio: {
              namespaced: true,
              modules: {
                runs: {
                  namespaced: true,
                  state: {
                    currentRun: run
                  },
                  getters: {
                    currentRun: state => state.currentRun,
                  }
                }
              }

            }
          }
        }
      }
    })

    wrapper = mount(Plate, { localVue, store })
    plate = wrapper.vm
  })

  it('will be defined', () => {
    expect(plate).toBeDefined()
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Plate')
  })

  it('can have state', () => {
    expect(plate.plateBarcode).toEqual(run.plate.barcode)
  })

  it('has a Plate Barcode input', () => {
    expect(wrapper.find('.plateBarcode')).toBeDefined()
  })

  describe('alert', () => {
    it('emits an event with the message', () => {
      plate.alert('emit this message', 'success')
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0][0]).toEqual('emit this message')
      expect(wrapper.emitted().alert[0][1]).toEqual('success')
    })
  })


})