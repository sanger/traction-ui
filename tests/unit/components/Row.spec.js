import { mount, localVue } from '../testHelper'
import Row from '@/components/Row'
import Well from '@/components/Well'
import wells from '../../data/row'

describe('Row.vue', () => {

  let row, wrapper, props

  beforeEach(() => {
    props = { id: 'A', wells: wells }
    wrapper = mount(Row, { propsData: props, localVue })
    row = wrapper.vm
  })

  it('will have a row id', () => {
    expect(row.id).toEqual(props.id)
  })

  it('will have some columns', () => {
    expect(row.columns).toEqual(props.columns)
  })

  it('will have some cells', () => {
    expect(wrapper.findAll(Well).length).toEqual(wells.length)
  })

})