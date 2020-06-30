import { mount, localVue, Vuex, Data } from '../../testHelper'
import Flowcell from '@/components/saphyr/SaphyrFlowcell'
import * as Run from '@/api/SaphyrRun'
import Response from '@/api/Response'

describe('Flowcell', () => {

  let wrapper, flowcell, props, run

  beforeEach(() => {
    run = Run.build()

    let store = new Vuex.Store({
      modules: {
        traction: {
          namespaced: true,
          modules: {
            saphyr: {
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

    props = { index: 0, position: 1}

    wrapper = mount(Flowcell, { localVue, store, propsData: props })
    flowcell = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('SaphyrFlowcell')
  })

  it('can have an index', () => {
    expect(flowcell.index).toEqual(props.index)
  })

  it('must have a position', () => {
    expect(flowcell.position).toEqual(props.position)
  })

  it('can have state with a current run', () => {
    expect(flowcell.currentRun).toEqual(run)
  })

  it('will display the position', () => {
    expect(wrapper.find('.position').text()).toMatch(new RegExp(props.position))
  })

  it('can have a library', () => {
    expect(wrapper.contains('#libraryBarcode')).toBeTruthy()
  })

  describe('setBarcode', () => {
    let newBarcode

    beforeEach(() => {
      newBarcode = 'TRAC-1'
      flowcell.alert = jest.fn()
      flowcell.isLibraryBarcodeValid = jest.fn()
      flowcell.getTubeForBarcode = jest.fn()
      flowcell.setLibraryBarcode = jest.fn()
    })

    //TODO: this test is not testing the implementation.
    it('successful when barcode is valid', async () => {
      let libraryTube = Data.TubeWithLibrary
      let successfulResponse = new Response(libraryTube)
      let tube = successfulResponse.deserialize.tubes[0]

      flowcell.isLibraryBarcodeValid.mockReturnValue(true)
      flowcell.getTubeForBarcode.mockReturnValue(tube)

      await flowcell.setBarcode(newBarcode)
      let expected = {
        flowcellIndex: 0,
        library:  {
          barcode: "TRAC-2-21",
          id: "1",
        }
      }
      expect(flowcell.setLibraryBarcode).toBeCalledWith(expected)
      expect(flowcell.alert).not.toBeCalled()
    })

    it('is unsuccessful when chip is not valid', async () => {
      flowcell.isLibraryBarcodeValid.mockReturnValue(false)

      await flowcell.setBarcode(newBarcode)
      expect(flowcell.setLibraryBarcode).not.toBeCalled()
      expect(flowcell.alert).toBeCalled()
    })
  })

  describe('alert', () => {
    it('emits an event with the message', () => {
      flowcell.alert('emit this message', 'success')
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0][0]).toEqual('emit this message')
      expect(wrapper.emitted().alert[0][1]).toEqual('success')
    })
  })

})
