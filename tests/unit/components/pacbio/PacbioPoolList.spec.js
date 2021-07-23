import { mount, localVue, store } from 'testHelper'
import pacbioPoolList from '@/components/pacbio/PacbioPoolList'
import storePools from '@tests/data/StorePools'

describe('pacbioPoolList', () => {
  let wrapper

  beforeEach(() => {
    store.state.traction.pacbio.pools = storePools

    wrapper = mount(pacbioPoolList, {
      localVue,
      store,
    })
  })

  it('will have a table', () => {
    expect(wrapper.find('.pools')).toBeDefined()
  })

  it('contains the correct data', () => {
    expect(wrapper.find('.list-group').findAll('.list-group-item').length).toEqual(2)
  })

  describe('when there is an error', () => {
    beforeEach(() => {
      wrapper.vm.showAlert('Bad stuff happened', 'danger')
    })

    it('should show an appropriate message', () => {
      const errorMessage = wrapper.find('[data-type=error-message]')
      expect(errorMessage.text()).toMatch('Bad stuff happened')
    })
  })
})
