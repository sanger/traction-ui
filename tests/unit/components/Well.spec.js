import { mount, localVue } from '../testHelper'
import Well from '@/components/Well'
import * as Run from '@/api/PacbioRun'
import store from '@/store'

describe('Well.vue', () => {

  let well, wrapper, props, storeWell, run

  beforeEach(() => {
    props = { row: 'A', column: '1',   cx: "60.440327", cy: "75.818642", rx: "10.906492", ry: "11.032985" }

    storeWell = Run.buildWell(props.row, props.column)
    storeWell.libraries = [{ id: 1, barcode: 'TRAC-1' }, { id: 2, barcode: 'TRAC-2' }]

    run = Run.build()
    run.plate.wells[0] = storeWell

    store.commit('traction/pacbio/runs/setCurrentRun', run)

    wrapper = mount(Well, { 
      localVue, store, 
      propsData: props,
      stubs: {
        WellModal: true
      }
    })

    well = wrapper.vm
  })

  it('will be defined', () => {
    expect(well).toBeDefined()
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Well')
  })

  it('must have a row', () => {
    expect(well.row).toEqual(props.row)
  })

  it('must have a column', () => {
    expect(well.column).toEqual(props.column)
  })

  it('will have position', () => {
    expect(well.position).toEqual('A1')
  })

  it('must have a cx', () => {
    expect(well.cx).toEqual(props.cx)
  })

  it('must have a cy', () => {
    expect(well.cy).toEqual(props.cy)
  })

  it('must have a rx', () => {
    expect(well.rx).toEqual(props.rx)
  })

  it('must have a ry', () => {
    expect(well.ry).toEqual(props.ry)
  })

  it('will have an ellipse with the correct attributes', () => {
    let ellipse = wrapper.find('ellipse')
    expect(ellipse.exists()).toBeTruthy()
    expect(ellipse.attributes('class')).toMatch(well.position)
    expect(ellipse.attributes('cx')).toEqual(well.cx)
    expect(ellipse.attributes('cy')).toEqual(well.cy)
    expect(ellipse.attributes('rx')).toEqual(well.rx)
    expect(ellipse.attributes('ry')).toEqual(well.ry)
  })

  xit('when ellipse is clicked is editable', () => {
    well.showModal = jest.fn()
    let ellipse = wrapper.find('ellipse')
    ellipse.trigger('click')
    expect(well.showModal).toBeCalled()
  })

  describe('library barcodes', () => {

    it('will be present if there are some in the store', () => {
      let expected = storeWell.libraries.map((l) => l.barcode).join(',')
      expect(well.libraryBarcodes).toEqual(expected)
    })

    it('will be empty if there are none in the store', () => {
      storeWell.libraries = []
      expect(well.libraryBarcodes).toEqual('')
    })

  })

  describe('tooltip', () => {

    let title

    it('will be visible if there are some libraries', () => {
      title = wrapper.find('title')
      expect(title.text()).toEqual(well.libraryBarcodes)
    })

    it('will be absent if there are no libraries', () => {
      storeWell.libraries = []
      title = wrapper.find('title')
      expect(title.text()).toEqual('')
    })

  })

})