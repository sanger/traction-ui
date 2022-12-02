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
    it('has a form with a test', () => {
      wrapper.setData({ form: { test: 'atest' } })
      expect(extractionQcForm.form.test).toBe('atest')
    })
  })
})
