import ExtractionQc from '@/views/ExtractionQc'
import { localVue, mount } from '@support/testHelper'

describe('ExtractionQc.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ExtractionQc, {
      localVue,
    })
  })

  describe('components', () => {
    it('has a ExtractionQcForm component', () => {
      expect(wrapper.findComponent({ name: 'ExtractionQcForm' }).exists()).toBe(true)
    })
  })
})
