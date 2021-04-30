import { mount, localVue } from '../../testHelper'
import PacbioLibrariesList from '@/components/pacbio/PacbioLibrariesList'
import storeLibraries from '../../../data/StoreLibraries'
import store from '@/store'

describe('PacbioLibrariesList', () => {
  let wrapper, libraries

  beforeEach(() => {
    libraries = storeLibraries

    store.commit('traction/pacbio/libraries/setLibraries', libraries)

    wrapper = mount(PacbioLibrariesList, {
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
