import LabelPrinting from '@/views/LabelPrinting'
import { mount } from '@support/testHelper'

describe('LabelPrinting.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(LabelPrinting, {
      stubs: {
        LabelPrintingForm: true,
      },
    })
  })

  describe('components', () => {
    it.skip('has a LabelPrintingForm component', () => {
      expect(wrapper.findComponent({ ref: 'LabelPrintingForm' })).toBeTruthy()
    })
  })
})
