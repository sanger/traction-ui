import { mount, localVue, Vuex } from '../testHelper'
import Flowcell from '@/components/Flowcell'
import * as Run from '@/api/Run'
import Response from '@/api/Response'

describe('Flowcell', () => {

  let wrapper, flowcell, props, run, actions

  beforeEach(() => {
    run = Run.build()

    actions = {
      updateLibraryBarcode: jest.fn()
    }

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
                  },
                  actions
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

    // library =  {id: 2, type: 'libraries', state: 'pending', barcode: "TRAC-3", sample_name: "sample_d", enzyme_name: "Nb.BbvCI", created_at: "02/27/2019 04:05", libraryId: 2}
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Flowcell')
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

  describe('#updateBarcode', () => {

    beforeEach(() => {
      flowcell.alert = jest.fn()
    })

    it('successful', async () => {
      let newBarcode = "TRAC-1"
      let successfulResponse = { 'data': {}, 'status': 200, 'statusText': 'Success' }
      let expectedResponse = new Response(successfulResponse)
      actions.updateLibraryBarcode.mockReturnValue(expectedResponse)

      await flowcell.updateBarcode(newBarcode)
      expect(flowcell.alert).toBeCalledWith('Library updated', 'success')
    })

    it('fails when the barcode is not valid', async () => {
      await flowcell.updateBarcode('')
      expect(flowcell.alert).toBeCalledWith('Please enter a barcode', 'danger')
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
