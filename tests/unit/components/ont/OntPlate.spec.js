import OntPlate from '@/components/ont/OntPlate'
import OntWell from '@/components/ont/OntWell'
import PlateMap from '@/config/PlateMap'
import { mount } from '../../testHelper'

describe('OntPlate.vue', () => {

  let plate, wrapper, wells

  beforeEach(() => {
    wells = [
      {
        position: 'A1',
        material: [
          { name: 'SampleName1' },
          { name: 'SampleName12' }
        ]
      },
      {
        position: 'A7',
        material: [{
          name: 'SampleName2'
        }]
      }
    ]

    wrapper = mount(OntPlate, { 
      propsData: { wells: wells },
    })
    plate = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntPlate')
  })

  it('will be passed wells as a prop', () => {
    expect(plate.wells).toEqual(wells)
  })

  describe('#getWellAt', () => {
    it('gets the well at the given position', () => {
      expect(plate.getWellAt('A1')).toEqual(wells[0])
    })
  })

  describe('#createEmptyWell', () => {
    it('creates an empty well for the given position', () => {
      let expected = { position: 'A1', material: {} }
      expect(plate.createEmptyWell('A1')).toEqual(expected)
    })
  })

  describe('SVG wells', () => {
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
  
  it('has a OntWell component', () => {
    expect(wrapper.contains(OntWell)).toBe(true)
  })

})