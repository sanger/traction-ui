import ExtractionQcForm from '@/components/extractionQc/ExtractionQcForm'
import { localVue, mount, store } from '@support/testHelper'

describe('ExtractionQcForm.vue', () => {
  let wrapper, extractionQcForm

  beforeEach(() => {
    wrapper = mount(ExtractionQcForm, {
      localVue,
      store,
      propsData: {},
    })
    extractionQcForm = wrapper.vm
  })

  describe('data', () => {
    it('has used_by options', () => {
      expect(extractionQcForm.used_by_options.count).toEqual(2)
    })
  })
})
