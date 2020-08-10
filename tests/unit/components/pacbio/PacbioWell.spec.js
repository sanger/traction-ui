import { mount, localVue, store } from '../../testHelper'
import Well from '@/components/pacbio/PacbioWell'
import * as Run from '@/api/PacbioRun'

describe('Well.vue', () => {

  let well, wrapper, props, storeWell, run

  beforeEach(() => {
    props = { row: 'A', column: '1',   cx: "60.440327", cy: "75.818642", rx: "10.906492", ry: "11.032985" }

    storeWell = Run.buildWell(props.row, props.column)
    storeWell.libraries = [{ id: 1, barcode: 'TRAC-1' }, { id: 2, barcode: 'TRAC-2' }]
    storeWell.movie_time = "15"
    storeWell.insert_size = 123
    storeWell.on_plate_loading_concentration = 234
    storeWell.sequencing_mode = "CCS"
    storeWell.pre_extension_time = "2"

    run = Run.build()
    run.plate.wells[0] = storeWell

    store.commit('traction/pacbio/runs/setCurrentRun', run)

    wrapper = mount(Well, { 
      localVue, 
      store, 
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
    expect(ellipse.attributes('cx')).toEqual(well.cx)
    expect(ellipse.attributes('cy')).toEqual(well.cy)
    expect(ellipse.attributes('rx')).toEqual(well.rx)
    expect(ellipse.attributes('ry')).toEqual(well.ry)
  })

  describe('status', () => {

    it('will be valid if it is complete', () => {
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toContain("complete")
    })

    it('will be invalid if there is any missing meta data', () => {
      storeWell.movie_time = ""
      wrapper = mount(Well, { 
        localVue, 
        store, 
        propsData: props,
        stubs: {
          WellModal: true
        }
      })
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toEqual("filled")
    })

    it('will be invalid if there are no libraries in the store', () => {
      storeWell.libraries = []
      wrapper = mount(Well, { 
        localVue, 
        store, 
        propsData: props,
        stubs: {
          WellModal: true
        }
      })
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toEqual("filled")
    })

    it('will be invalid if there is one or more libraries without a barcode', () => {
      storeWell.libraries[0].barcode = ''
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toEqual("complete")
    })

    it('will be valid if sequencing mode is CCS and extension time is present', () => {
      storeWell.pre_extension_time = '2'
      wrapper = mount(Well, {
        localVue,
        store,
        propsData: props,
        stubs: {
          WellModal: true
        }
      })
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toEqual("complete")
    })

    it('will be valid if sequencing mode is CLR and extension time is empty', () => {
      storeWell.sequencing_mode = 'CLR'
      storeWell.pre_extension_time = ''
      wrapper = mount(Well, {
        localVue,
        store,
        propsData: props,
        stubs: {
          WellModal: true
        }
      })
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toEqual("complete")
    })

    it('will be empty if there are no libraries or metadata', () => {
      storeWell.libraries = []
      storeWell.movie_time = ""
      storeWell.sequencing_mode = ""
      storeWell.on_plate_loading_concentration = ""
      storeWell.insert_size = ""
      storeWell.pre_extension_time = ""

      wrapper = mount(Well, { 
        localVue, 
        store, 
        propsData: props,
        stubs: {
          WellModal: true
        }
      })
  
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toEqual("empty")
    })

  })

  // TODO: same as well modal - refactor baby!
  describe('updateLibraryBarcode', () => {
    let newBarcode, library

    beforeEach(() => {
      newBarcode = 'TRAC-1'
      well.addLibraryToWell = jest.fn()
      library = { id: 1, barcode: newBarcode }
      store.commit('traction/pacbio/libraries/setLibraries', [library])
    })

    it('adds the library to the well', async () => {
      await well.updateLibraryBarcode(newBarcode)
      expect(well.addLibraryToWell).toBeCalledWith({ position: well.position, with: { id: library.id, barcode: library.barcode } })
    })
  })

  describe('tooltip', () => {
    it('will only be visible if there are some libraries', () => {
      let title = wrapper.find('title')
      let expected = storeWell.libraries.map(l => l.barcode).join(',')
      expect(title.text()).toEqual(expected)
    })
  })

  describe('drag and drop', () => {

    let mockEvent, newBarcode

    beforeEach(() => {
      newBarcode = 'TRAC-1'
      mockEvent = { dataTransfer: { getData () { return newBarcode } }, preventDefault: jest.fn() }
      well.updateLibraryBarcode = jest.fn()
    })

    it('will update the barcode', async () => {
      well.drop(mockEvent)
      expect(well.updateLibraryBarcode).toBeCalledWith(newBarcode)
    })

  })
})