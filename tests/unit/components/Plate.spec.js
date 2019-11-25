import { mount, localVue, Vuex } from '../testHelper'
import Plate from '@/components/Plate'
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

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Plate')
  })

  describe('alert', () => {
    it('emits an event with the message', () => {
      plate.alert('emit this message', 'success')
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0][0]).toEqual('emit this message')
      expect(wrapper.emitted().alert[0][1]).toEqual('success')
    })
  })

  describe('wells', () => {

    it('has the correct number of columns', () => {
      for (const column in PlateMap.columns) {
        expect(wrapper.find(`#column${column}`).exists()).toBeTruthy()
      }
    })

    it('has the correct number of rows', () => {
      for (const row in PlateMap.rows) {
        expect(wrapper.find(`#row${row}`).exists()).toBeTruthy()
      }
    })

    it('has the correct number of wells', () => {
      let ellipses = wrapper.findAll('ellipse')
      expect(ellipses.length).toEqual(Object.keys(PlateMap.wells).length)
    })


  })

  describe('tooltip', () => {
    it('showBarcode will return barcode if it exists', () => {
      expect(plate.showBarcode(well.position)).toEqual(well.libraries[0].barcode)
    })

    it('showBarcode will be an empty string if well exists but there are no libraries', () => {
      expect(plate.showBarcode('B1')).toEqual("")
    })

    it('showBarcode will return nothing if well does not exists', () => {
      expect(plate.showBarcode('X1')).not.toBeDefined()
    })
  })

})