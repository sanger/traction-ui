import { mount, localVue, store } from 'testHelper'
import PacbioLibraryList from '@/components/pacbio/PacbioLibraryList'
import storeLibraries from '../../../data/StoreLibraries'

describe('PacbioLibraryList', () => {
  let wrapper, libraries

  beforeEach(() => {
    libraries = storeLibraries

    store.commit('traction/pacbio/libraries/setLibraries', libraries)

    wrapper = mount(PacbioLibraryList, {
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
