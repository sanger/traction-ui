import { mount, localVue, store } from 'testHelper'
import pacbioPoolList from '@/components/pacbio/PacbioPoolList'
import storePools from '../../../data/StorePools'

describe('pacbioPoolList', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(pacbioPoolList, {
      localVue,
      store: {
        ...store,
        state: storePools,
      },
    })
  })

  it('will have a table', () => {
    expect(wrapper.find('.pools')).toBeDefined()
  })

  it('contains the correct data', () => {
    expect(wrapper.find('.list-group').findAll('.list-group-item').length).toEqual(2)
  })
})
