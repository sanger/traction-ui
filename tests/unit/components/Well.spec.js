import { mount, localVue } from '../testHelper'
import Well from '@/components/Well'
import * as Run from '@/api/PacbioRun'
import store from '@/store'
import Response from '@/api/Response'
import libraryTube from '../../data/pacbioTubeWithLibrary'

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

  describe('hasLibraries', () => {

    it('will be present if there are some in the store', () => {
      expect(well.hasLibraries).toBeTruthy()
    })

    it('will be empty if there are none in the store', () => {
      storeWell.libraries = []
      expect(well.hasLibraries).toBeFalsy()
    })

  })
  // TODO: same as well modal - refactor baby!
  describe('updateLibraryBarcode', () => {
    let newBarcode

    beforeEach(() => {
      newBarcode = 'TRAC-1'
      well.showAlert = jest.fn()
      well.isLibraryBarcodeValid = jest.fn()
      well.getTubeForBarcode = jest.fn()
      well.addLibraryToWell = jest.fn()
    })

    it('successful when barcode is valid', async () => {
      let successfulResponse = new Response(libraryTube)
      let tube = successfulResponse.deserialize.tubes[0]
      let library = tube.material

      well.isLibraryBarcodeValid.mockReturnValue(true)
      well.getTubeForBarcode.mockReturnValue(tube)

      await well.updateLibraryBarcode(newBarcode)
      expect(well.addLibraryToWell).toBeCalledWith({ position: well.position, with: { id: library.id, barcode: library.barcode } })

      expect(well.showAlert).not.toBeCalled()
    })

    it('is unsuccessful when barcode is not valid', async () => {
      well.isLibraryBarcodeValid.mockReturnValue(false)

      await well.updateLibraryBarcode(newBarcode)
      expect(well.addLibraryToWell).not.toBeCalled()
      expect(well.showAlert).toBeCalledWith('Library is not valid', 'danger')
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