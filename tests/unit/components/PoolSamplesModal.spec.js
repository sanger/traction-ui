import PoolSamplesModal from '@/components/ont/PoolSamplesModal'
import { localVue, mount } from '../testHelper'

describe('PoolSamplesModal.vue', () => {
  let wrapper, modal

  beforeEach(() => {
    wrapper = mount(PoolSamplesModal, {
      localVue,
      propsData: { plate_id: 1 },
      data() {
        return {
          modalShow: false,
          selectedTagSet: null,
          options: [{ value: null, text: 'Please select a tag set' }, 24, 96]
        }
      }
    })

    modal = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('PoolSamplesModal')
  })

  it('will be passed a plate id as a prop', () => {
    expect(modal.plate_id).toBeDefined()
  })

  describe('Pool Samples button', () => {
    it('is shows button', () => {
      let button = wrapper.find('#pool-btn-1')
      expect(button.text()).toEqual('Pool Samples')
    })
  })

  describe('#computed', () => {
    describe('modalTitle', () => {
      it('returns the correct title when selectedTagSet is 24', () => {
        wrapper.setData({ selectedTagSet: 24})
        expect(modal.modalTitle).toEqual('Pool Samples into 4 libraries')
      })

      it('returns the correct title when selectedTagSet is 96', () => {
        wrapper.setData({ selectedTagSet: 96 })
        expect(modal.modalTitle).toEqual('Pool Samples into 1 library')
      })
    })
  })

})