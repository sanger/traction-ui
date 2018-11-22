import { mount, createLocalVue } from '@vue/test-utils'
import Reception from '@/views/Reception'
import SampleList from '@/components/SampleList'
import Samples from '../data/samples.json'
import flushPromises from 'flush-promises'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
jest.mock('axios')

describe('Reception.vue', () => {

  let wrapper, reception, response, samples

  beforeEach(() => {
    samples = Samples
    response = { data: { data: { attributes: samples } } }
    axios.get.mockResolvedValue(response)
  })

  it('will have some samples',  async() => {
    wrapper = mount(Reception, { localVue })
    reception = wrapper.vm
    await flushPromises()
    expect(reception.samples.length).toEqual(samples.requests.length)
  })

  it('will have a sample list', async () => {
    wrapper = mount(Reception, { localVue })
    expect(wrapper.contains(SampleList)).toBe(true)
  })

  it('will get a list of selected samples on importSamples()', async () => {
    wrapper = mount(Reception, { localVue })
    reception = wrapper.vm
    await flushPromises()
    console.log(wrapper.find(SampleList).html()) //findAll('input').at(0).setChecked()
    wrapper.findAll('input').at(0).setChecked()
    wrapper.findAll('input').at(1).setChecked()
    expect(reception.importSamples().length).toEqual(2)
  })

  it('importSamples()', async () => {
    response = { data: { status: 201 } }
    axios.post.mockResolvedValue(response)

    cmp = mount(Reception, { localVue })
    reception = cmp.vm

    await flushPromises()
    await flushPromises()
    console.log(reception.importSamples())
    expect(reception.importSamples()).toEqual(response)
  })
})
