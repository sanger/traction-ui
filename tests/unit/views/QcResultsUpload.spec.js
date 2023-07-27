import QcResultsUpload from '@/views/QcResultsUpload'
import { mount } from '@support/testHelper'

describe('QcResultsUpload.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(QcResultsUpload)
  })

  describe('components', () => {
    it('has a QcResultsUploadForm component', () => {
      expect(wrapper.findComponent({ name: 'QcResultsUploadForm' }).exists()).toBe(true)
    })
  })
})
