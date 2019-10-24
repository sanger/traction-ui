import { mount, localVue } from '../testHelper'
import Row from '@/components/Row'
import Well from '@/components/Well'

describe('Row.vue', () => {

  let row, wrapper, props

  beforeEach(() => {
    props = { id: 'A', columns: ['1','2','3','4','5','6','7','8','9','10','11','12'] }
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
    expect(wrapper.findAll(Well).length).toEqual(row.columns.length)
  })

})