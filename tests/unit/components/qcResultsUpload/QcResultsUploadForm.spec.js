import QcResultsUploadForm from '@/components/qcResultsUpload/QcResultsUploadForm'
import { mountWithStore } from '@support/testHelper'
import { describe } from 'vitest'
import * as QcResultsUpload from '@/services/traction/QcResultsUpload'
import useRootStore from '@/stores'

// TODO: stderr | tests/unit/components/qcResultsUpload/QcResultsUploadForm.spec.js > QcResultsUploadForm.vue > #postCSV > handles a failed import
// [Vue warn]: Invalid prop: type check failed for prop "value". Expected Array, , got Object

// found in

// ---> <BFormFile>
//        <QcResultsUploadForm> at /Users/si5/webapps/traction-ui/src/components/qcResultsUpload/QcResultsUploadForm.vue
//          <Root>
// [Vue warn]: Invalid prop: type check failed for prop "value". Expected Array, , got Object

const mountComponent = () => {
  const { wrapper, store } = mountWithStore(QcResultsUploadForm, {
    createStore: () => useRootStore(),
  })
  return { wrapper, store }
}

describe('QcResultsUploadForm.vue', () => {
  let wrapper, form, store

  beforeEach(() => {
    ;({ wrapper, store } = mountComponent())
    form = wrapper.vm
  })

  describe('#data', () => {
    it('has usedByOptions', () => {
      expect(form.usedByOptions.length).toEqual(2)
    })
  })

  describe('#computed', () => {
    it('returns the correct border colour', () => {
      expect(form.border).toEqual('border-0')
      form.uploadSuccessful = true
      expect(form.border).toEqual('rounded border border-success')
      form.uploadSuccessful = false
      expect(form.border).toEqual('rounded border border-failure')
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

      wrapper.vm.file = mockFile
      wrapper.vm.usedBySelected = 'extraction'

      create = store.api.traction.qc_results_uploads.create
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
