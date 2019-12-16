import { mount, localVue } from '../testHelper'
import Well from '@/components/Well'
import * as Run from '@/api/PacbioRun'
import store from '@/store'

describe('Well.vue', () => {

  let well, wrapper, props, storeWell, run

  beforeEach(() => {
    props = { row: 'A', column: '1',   cx: "60.440327", cy: "75.818642", rx: "10.906492", ry: "11.032985" }

    storeWell = Run.buildWell(props.row, props.column)
    storeWell.libraries = [{ id: 1, barcode: 'TRAC-1'}]

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
      expect(well.libraryBarcodes).toEqual(storeWell.libraries[0].barcode)
     
    })

    it('will be empty if there are none in the store', () => {
      storeWell.libraries = []
      expect(well.libraryBarcodes).toEqual('')
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
      well.mutateWell = jest.fn()
    })

    it('successful when barcode is valid', async () => {
      let successfulResponse = new Response(libraryTube)
      let tube = successfulResponse.deserialize.tubes[0]
      let library = tube.material

      well.isLibraryBarcodeValid.mockReturnValue(true)
      well.getTubeForBarcode.mockReturnValue(tube)

      await well.updateLibraryBarcode(newBarcode)

      expect(well.mutateWell).toBeCalledWith({ position: props.position, property: 'libraries', with: [{ id: library.id, barcode: library.barcode }] })
      expect(well.showAlert).not.toBeCalled()
    })

    it('is unsuccessful when barcode is not valid', async () => {
      well.isLibraryBarcodeValid.mockReturnValue(false)

      await well.updateLibraryBarcode(newBarcode)
      expect(well.mutateWell).not.toBeCalled()
      expect(well.showAlert).toBeCalledWith('Library is not valid', 'danger')
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