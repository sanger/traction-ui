import { mount, localVue, Vuex } from '../../testHelper'
import Plate from '@/components/pacbio/PacbioPlate'
import * as Run from '@/api/PacbioRun'
import PlateMap from '@/config/PlateMap'


describe('Plate.vue', () => {

  let plate, wrapper, run, well

  beforeEach(() => {
    // TODO: Yuk! Needs to be done elsewhere
    run = Run.build()
    well = Run.buildWell('A','1')
    well.libraries = [{ id: 1, barcode: 'TRAC-1'}]
    run.plate.wells[0] = well

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
                  // TODO: we are actually recreating the methods that are in the store.
                  getters: {
                    currentRun: state => state.currentRun,
                    well: state => (position) => {
                      return state.currentRun.plate.wells.find(well => well.position === position)
                    }
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

  describe('wells', () => {
    it('has the correct number of wells', () => {
      let ellipses = wrapper.findAll('ellipse')
      expect(ellipses.length).toEqual(Object.keys(PlateMap.wells).length)
    })
  })

})