import { mount, localVue, Vuex } from '../testHelper'
import libraryTube from '../../data/pacbioTubeWithLibrary'
import Well from '@/components/Well'
import * as Run from '@/api/PacbioRun'
import Response from '@/api/Response'

describe('Well.vue', () => {

  let well, wrapper, props, run

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

    props = { position: 'A1' }
    wrapper = mount(Well, { localVue, store, propsData: props })
    well = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Well')
  })

  it('will have a position', () => {
    expect(well.position).toEqual('A1')
  })

  describe('entering data', () => {
    it('movie time', () => {
      let select = wrapper.find({ref: 'movieTime'}).element
      select.value = 20
      select.dispatchEvent(new Event('change'))
      expect(well.movieTime).toEqual(20)
    })

    it('insert size', () => {
      let input = wrapper.find({ref: 'insertSize'})
      input.setValue(20)
      expect(well.insertSize).toEqual('20')
    })

    it('on plate loading concentration', () => {
      let input = wrapper.find({ref: 'onPlateLoadingConc'})
      input.setValue(20)
      expect(well.onPlateLoadingConc).toEqual('20')
    })

    it('library barcode', () => {
      let input = wrapper.find({ref: 'libraryBarcode'})
      input.setValue('DN1234567')
      expect(well.libraryBarcode).toEqual('DN1234567')
    })

  })

  describe('setBarcode', () => {
    let newBarcode

    beforeEach(() => {
      newBarcode = 'TRAC-1'
      well.alert = jest.fn()
      well.isLibraryBarcodeValid = jest.fn()
      well.getTubeForBarcode = jest.fn()
      well.setLibraryBarcode = jest.fn()
    })

    it('successful when barcode is valid', async () => {
      let successfulResponse = new Response(libraryTube)
      let tube = successfulResponse.deserialize.tubes[0]

      well.isLibraryBarcodeValid.mockReturnValue(true)
      well.getTubeForBarcode.mockReturnValue(tube)

      await well.setBarcode(newBarcode)

      expect(well.setLibraryBarcode).toBeCalled()
      expect(well.alert).not.toBeCalled()
    })

    it('is unsuccessful when barcode is not valid', async () => {
      well.isLibraryBarcodeValid.mockReturnValue(false)

      await well.setBarcode(newBarcode)
      expect(well.setLibraryBarcode).not.toBeCalled()
      expect(well.alert).toBeCalled()
    })

  })

   describe('alert', () => {
    it('emits an event with the message', () => {
      well.alert('emit this message', 'success')
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0][0]).toEqual('emit this message')
      expect(wrapper.emitted().alert[0][1]).toEqual('success')
    })
  })

})