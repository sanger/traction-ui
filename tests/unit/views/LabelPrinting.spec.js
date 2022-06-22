import LabelPrinting from '@/views/LabelPrinting'
import { localVue, mount } from '@support/testHelper'

describe('LabelPrinting.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(LabelPrinting, {
      localVue,
      stubs: {
        LabelPrintingForm: true,
      },
    })
  })

  describe('components', () => {
    it('has a LabelPrintingForm component', () => {
      expect(wrapper.findComponent({ ref: 'LabelPrintingForm' })).toBeTruthy()
    })
  })
})
