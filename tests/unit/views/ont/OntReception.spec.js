import Reception from '@/views/pacbio/OntReception'
import { mount, localVue } from '../../testHelper'
import Alert from '@/components/Alert'

describe('Reception', () => {

  let wrapper, reception

  beforeEach(() => {
    wrapper = mount(Reception, {
      localVue,
      stubs: {
        Alert: Alert
      }
    })
    reception = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Reception')
  })

  it('will have some barcodes', () => {
    expect(reception.barcodes.length).toEqual(0)
  })

})
