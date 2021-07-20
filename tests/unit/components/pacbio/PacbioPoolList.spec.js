import { mount, localVue, store } from 'testHelper'
import pacbioPoolList from '@/components/pacbio/PacbioPoolList'
import storeLibraries from '../../../data/StoreLibraries'

describe('pacbioPoolList', () => {
  let wrapper, libraries

  beforeEach(() => {
    libraries = storeLibraries

    store.commit('traction/pacbio/libraries/setLibraries', libraries)

    wrapper = mount(pacbioPoolList, {
      localVue,
      store,
    })
  })

  it('will have a table', () => {
    expect(wrapper.find('.libraries')).toBeDefined()
  })

  it('contains the correct data', () => {
    expect(wrapper.find('.list-group').findAll('.list-group-item').length).toEqual(5)
  })
})
