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

  it('will have an upload button', () => {
    expect(wrapper.find('#upload-button').exists()).toBeTruthy()
  })

  describe('#data', () => {
    it('has usedByOptions', () => {
      expect(extractionQcForm.usedByOptions.length).toEqual(2)
    })
    it('has file', () => {
      expect(extractionQcForm.file).toEqual(null)
    })
    it('has usedBySelected', () => {
      expect(extractionQcForm.usedBySelected).toEqual(null)
    })
    it('has busy', () => {
      expect(extractionQcForm.busy).toEqual(null)
    })
    describe('file', () => {
      // In the test, this gives a warning suggesting that the
      // BFormFile `multiple` property is true
      // As it expects `v-model` to be an array
      it('gets the file', () => {
        const mockFile = {
          async text() {},
        }

        wrapper.setData({ file: mockFile })
        expect(extractionQcForm.file).toEqual(mockFile)
      })
    })
    describe('usedBySelected', () => {
      it('gets the usedBySelected', () => {
        wrapper.setData({ usedBySelected: 'extraction' })
        expect(extractionQcForm.usedBySelected).toEqual('extraction')
      })
    })
    describe('busy', () => {
      it('gets the busy', () => {
        wrapper.setData({ busy: true })
        expect(extractionQcForm.busy).toEqual(true)
      })
    })
  })
})
