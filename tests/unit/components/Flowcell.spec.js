import { mount, localVue, store } from '../testHelper'
import Flowcell from '@/components/Flowcell'

describe('Flowcell', () => {

  let wrapper, flowcell, props, library

  beforeEach(() => {
    props = { id: 1, position: 1 }
    wrapper = mount(Flowcell, { localVue, store, propsData: props } )
    flowcell = wrapper.vm
    library =  {id: 2, type: 'libraries', state: 'pending', barcode: "TRAC-3", sample_name: "sample_d", enzyme_name: "Nb.BbvCI", created_at: "02/27/2019 04:05"}
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Flowcell')
  })

  it('can have an id', () => {
    expect(flowcell.id).toEqual(props.id)
  })

  it('must have a position', () => {
    expect(flowcell.position).toEqual(props.position)
  })

  it('will display the position', () => {
    expect(wrapper.find('.position').text()).toMatch(new RegExp(props.position))
  })

  it('will have a request', () => {
    expect(flowcell.flowcellRequest).toBeDefined()
  })

  it('can have a library', () => {
    expect(flowcell.library).toBeDefined()
    expect(wrapper.contains('.library')).toBeTruthy()
  })

  it('can have a payload', () => {
    expect(flowcell.payload(library)).toEqual({ data: { type: 'flowcells', id: flowcell.id, attributes: { library_id: library.id }} })
  })

  describe('update the library', () => {

    beforeEach(() => {
      flowcell.flowcellRequest.update = jest.fn()
    })

    it('successfully', async () => {
      let successfulResponse = [{ 'data': {}, 'status': 200, 'statusText': 'Success'}]
      flowcell.flowcellRequest.update.mockResolvedValue(successfulResponse)
      await flowcell.updateFlowcell(library)
      expect(flowcell.flowcellRequest.update).toBeCalledWith(flowcell.payload(library))
      expect(flowcell.message).toEqual('Library added to flowcell')
    })

    it('unsuccessfully', async () => {
      let failedResponse = { 'data': { }, 'status': 500, 'statusText': 'Internal Server Error' }
      flowcell.flowcellRequest.update.mockReturnValue([failedResponse])
      await flowcell.updateFlowcell(library)
      expect(flowcell.message).toEqual('There was an error')
    })
  })

})
