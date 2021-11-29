import { mount, localVue, store } from 'testHelper'
import Plate from '@/components/pacbio/PacbioRunPlateItem'
import PlateMap from '@/config/PlateMap'
import { Data } from 'testHelper'
import Response from '@/api/Response'

describe('Plate.vue', () => {
  let plate, wrapper

  beforeEach(() => {
    let run = new Response(Data.PacbioRun).deserialize.runs[0]
    store.commit('traction/pacbio/runs/setCurrentRun', run)

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
