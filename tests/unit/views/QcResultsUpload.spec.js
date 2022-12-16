import QcResultsUpload from '@/views/QcResultsUpload'
import { localVue, mount } from '@support/testHelper'

describe('QcResultsUpload.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(QcResultsUpload, {
      localVue,
    })
  })

  describe('components', () => {
    it('has a QcResultsUploadForm component', () => {
      expect(wrapper.findComponent({ name: 'QcResultsUploadForm' }).exists()).toBe(true)
    })
  })
})
