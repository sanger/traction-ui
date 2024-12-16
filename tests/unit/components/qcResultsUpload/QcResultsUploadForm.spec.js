import QcResultsUploadForm from '@/components/qcResultsUpload/QcResultsUploadForm'
import { mount, store } from '@support/testHelper'
import { describe } from 'vitest'
import * as QcResultsUpload from '@/services/traction/QcResultsUpload'

// TODO: stderr | tests/unit/components/qcResultsUpload/QcResultsUploadForm.spec.js > QcResultsUploadForm.vue > #postCSV > handles a failed import
// [Vue warn]: Invalid prop: type check failed for prop "value". Expected Array, , got Object

// found in

// ---> <BFormFile>
//        <QcResultsUploadForm> at /Users/si5/webapps/traction-ui/src/components/qcResultsUpload/QcResultsUploadForm.vue
//          <Root>
// [Vue warn]: Invalid prop: type check failed for prop "value". Expected Array, , got Object
const evt = {
  preventDefault: () => {
    return {}
  },
}

describe('QcResultsUploadForm.vue', () => {
  let wrapper, form

  beforeEach(() => {
    wrapper = mount(QcResultsUploadForm, {
      store,
      props: {},
    })
    form = wrapper.vm
  })

  describe('#data', () => {
    it('has usedByOptions', () => {
      expect(form.usedByOptions.length).toEqual(2)
    })

    describe('usedBySelected', () => {
      it('gets the usedBySelected', () => {
        wrapper.setData({ usedBySelected: 'extraction' })
        expect(form.usedBySelected).toEqual('extraction')
      })
    })
    describe('busy', () => {
      it('gets the busy status', () => {
        expect(form.busy).toEqual(null)
        wrapper.setData({ busy: true })
        expect(form.busy).toEqual(true)
      })
    })

    describe('disableUpload', () => {
      it('gets the disableUpload status', () => {
        expect(form.disableUpload).toEqual(null)
        wrapper.setData({ disableUpload: true })
        expect(form.disableUpload).toEqual(true)
      })
    })

    describe('uploadSuccessful', () => {
      it('gets the uploadSuccessful status', () => {
        expect(form.uploadSuccessful).toEqual(null)
        wrapper.setData({ uploadSuccessful: true })
        expect(form.uploadSuccessful).toEqual(true)
      })
    })
  })

  describe('#computed', () => {
    it('gets the api request', () => {
      expect(form.qcResultUploadsRequest).toEqual(
        store.getters.api.traction.qc_results_uploads.create,
      )
    })

    it('returns the correct border colour', () => {
      expect(form.border).toEqual('border-0')
      wrapper.setData({ uploadSuccessful: true })
      expect(form.border).toEqual('rounded border border-success')
      wrapper.setData({ uploadSuccessful: false })
      expect(form.border).toEqual('rounded border border-failure')
    })
  })

  describe('#onSubmit', () => {
    it('calls postCSV', () => {
      form.postCSV = vi.fn()
      form.onSubmit(evt)
      expect(form.postCSV).toBeCalled()
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
      form.showAlert = vi.fn()

      create = store.getters.api.traction.qc_results_uploads.create
    })

    it('handles a successful import', async () => {
      const createQcResultsUploadResource = vi
        .spyOn(QcResultsUpload, 'createQcResultsUploadResource')
        .mockReturnValue({ success: true, errors: [] })

      await form.postCSV()

      expect(createQcResultsUploadResource).toBeCalledWith(create, {
        csv: 'xxx',
        usedBySelected: 'extraction',
      })
      expect(form.showAlert).toBeCalledWith('Successfully imported: fileName', 'success')
      expect(form.busy).toEqual(false)
      expect(form.disableUpload).toEqual(true)
      expect(form.uploadSuccessful).toEqual(true)
    })

    it('handles a failed import', async () => {
      const createQcResultsUploadResource = vi
        .spyOn(QcResultsUpload, 'createQcResultsUploadResource')
        .mockReturnValue({ success: false, errors: 'This is an error msg' })

      await form.postCSV()

      expect(createQcResultsUploadResource).toBeCalledWith(create, {
        csv: 'xxx',
        usedBySelected: 'extraction',
      })
      expect(form.showAlert).toBeCalledWith('This is an error msg', 'danger')
      expect(form.busy).toEqual(false)
      expect(form.disableUpload).toEqual(true)
      expect(form.uploadSuccessful).toEqual(false)
    })

    describe('#reEnable', () => {
      it('resets the file input and other data values', async () => {
        vi.spyOn(QcResultsUpload, 'createQcResultsUploadResource').mockReturnValue({
          success: true,
          errors: [],
        })

        await form.postCSV()

        expect(form.disableUpload).toEqual(true)
        expect(form.uploadSuccessful).toEqual(true)

        form.reEnable()

        expect(form.disableUpload).toEqual(false)
        expect(form.uploadSuccessful).toEqual(null)
        const fileInput = wrapper.find('#qcResultsUploadFile')
        expect(fileInput.element.value).toEqual('')
        expect(form.file).toEqual(null)
      })
    })
  })
})
