import ExtractionQcForm from '@/components/extractionQc/ExtractionQcForm'
import { localVue, mount, store } from '@support/testHelper'
import { describe } from 'vitest'
import * as QcResultsUpload from '@/services/traction/QcResultsUpload'

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

  describe('#computed', () => {
    it('gets the api request', () => {
      expect(extractionQcForm.qcResultUploadsRequest).toEqual(
        store.getters.api.traction.qc_results_uploads.create,
      )
    })
  })

  describe('#onSubmit', () => {
    it('calls postCSV', () => {
      extractionQcForm.postCSV = vi.fn()
      extractionQcForm.onSubmit()
      expect(extractionQcForm.postCSV).toBeCalled()
    })
  })

  describe('#postCSV', () => {
    let create, mockFile

    beforeEach(() => {
      mockFile = {
        name: 'fileName',
        async text() {
          return 'xxx'
        },
      }

      wrapper.setData({
        usedBySelected: 'extraction',
        file: mockFile,
      })
      extractionQcForm.showAlert = vi.fn()

      create = store.getters.api.traction.qc_results_uploads.create
    })

    it('handles a successful import', async () => {
      const createQcResultsUploadResource = vi
        .spyOn(QcResultsUpload, 'createQcResultsUploadResource')
        .mockImplementation(() => {})

      await extractionQcForm.postCSV()

      expect(createQcResultsUploadResource).toBeCalledWith(create, {
        csv: 'xxx',
        usedBySelected: 'extraction',
      })
      expect(extractionQcForm.showAlert).toBeCalledWith(
        'Successfully imported: fileName',
        'success',
      )
      expect(extractionQcForm.busy).toEqual(false)
    })

    it('handles a failed import', async () => {
      const createQcResultsUploadResource = vi
        .spyOn(QcResultsUpload, 'createQcResultsUploadResource')
        .mockRejectedValue('This is an error msg')

      await extractionQcForm.postCSV()

      expect(createQcResultsUploadResource).toBeCalledWith(create, {
        csv: 'xxx',
        usedBySelected: 'extraction',
      })
      expect(extractionQcForm.showAlert).toBeCalledWith('This is an error msg', 'danger')
      expect(extractionQcForm.busy).toEqual(false)
    })
  })
})
