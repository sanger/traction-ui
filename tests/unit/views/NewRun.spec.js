import NewRun from '@/views/NewRun'
import Flowcell from '@/components/Flowcell'
import { mount, localVue } from '../testHelper'
import VueRouter from 'vue-router'
import Runs from '@/views/Runs'
import Vuetify from 'vuetify'
import Response from '@/api/Response'
import RunJson from '../../data/run'
import LibrariesJson from '../../data/libraries'

describe('NewRun.vue', () => {

  let wrapper, data, newRun

  beforeEach(() => {
    const router = new VueRouter({ routes:
      [{ path: '/runs', name: 'Runs', component: Runs }]
    })
    localVue.use(Vuetify)

    wrapper = mount(NewRun, {
      localVue,
      router,
      propsData: {
        runId: 123
      }
    })
    newRun = wrapper.vm
  })

  it('creates suitable props', () => {
    expect(newRun.runId).toEqual(123)
  })

  it('contains a back to runs button', () => {
    expect(wrapper.contains('button')).toBe(true)
  })

  it('can have run data', () => {
    wrapper.setData({ id: 1, state: 'pending', chipBarcode: 'TRAC123', flowcell1: [{id: 1}], flowcell2: [{id: 2}], libraries: [] })
    expect(wrapper.vm.id).toEqual(1)
    expect(wrapper.vm.state).toEqual('pending')
    expect(wrapper.vm.chipBarcode).toEqual('TRAC123')
    expect(wrapper.vm.flowcell1).toEqual([{id: 1}])
    expect(wrapper.vm.flowcell2).toEqual([{id: 2}])
    expect(wrapper.vm.libraries).toEqual([])
  })

  it('#getRun will get the run', async () => {
    newRun.runRequest.execute = jest.fn()
    newRun.runRequest.execute.mockResolvedValue(RunJson)

    let id = 1
    await newRun.getRun(id)

    let expectedRun = new Response(RunJson).deserialize.runs[0]

    expect(newRun.id).toEqual(expectedRun.id)
    expect(newRun.state).toEqual(expectedRun.state)
    expect(newRun.chipBarcode).toEqual(expectedRun.chip.barcode)
    expect(newRun.flowcell1).toEqual([expectedRun.chip.flowcells[0]])
    expect(newRun.flowcell2).toEqual([expectedRun.chip.flowcells[1]])
  })

  it('#getLibraries will get a list of libraries', async () => {
    newRun.librariesRequest.execute = jest.fn()
    newRun.librariesRequest.execute.mockResolvedValue(LibrariesJson)

    await newRun.getLibraries()

    let libraries = new Response(LibrariesJson).deserialize.libraries
    expect(newRun.libraries).toEqual(libraries)
  })

})
