import { mount, localVue, store } from '@support/testHelper'
import pacbioPoolList from '@/components/pacbio/PacbioPoolList'
import storePools from '@tests/data/StorePools'

describe('pacbioPoolList', () => {
  let wrapper

  beforeEach(() => {
    const setPoolsAction = vi.spyOn(store.getters.api.traction.pacbio.libraries, 'get')
    setPoolsAction.mockImplementation(() => {})
    store.state.traction.pacbio.pools = storePools

    wrapper = mount(pacbioPoolList, {
      localVue,
      store,
    })
  })

  it('will have a table', () => {
    expect(wrapper.find('.pools')).toBeDefined()
  })

  describe('when there is an error', () => {
    beforeEach(() => {
      wrapper.vm.showAlert('Bad stuff happened', 'danger')
    })

    it('should show an appropriate message', () => {
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'Bad stuff happened',
      })
    })
  })
})
