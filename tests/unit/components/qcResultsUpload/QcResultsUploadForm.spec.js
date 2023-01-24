import QcResultsUploadForm from '@/components/qcResultsUpload/QcResultsUploadForm'
import { localVue, mount, store } from '@support/testHelper'
import { describe } from 'vitest'
import * as QcResultsUpload from '@/services/traction/QcResultsUpload'

const evt = {
  preventDefault: () => {
    return {}
  },
}

describe('QcResultsUploadForm.vue', () => {
  let wrapper, form

  beforeEach(() => {
    wrapper = mount(QcResultsUploadForm, {
      localVue,
      store,
      propsData: {},
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
  })

  describe('#computed', () => {
    it('gets the api request', () => {
      expect(form.qcResultUploadsRequest).toEqual(
        store.getters.api.traction.qc_results_uploads.create,
      )
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
        .mockImplementation(() => { })

      await form.postCSV()

      expect(createQcResultsUploadResource).toBeCalledWith(create, {
        csv: 'xxx',
        usedBySelected: 'extraction',
      })
      expect(form.showAlert).toBeCalledWith('Successfully imported: fileName', 'success')
      expect(form.busy).toEqual(false)
      expect(form.disableUpload).toEqual(true)
    })

    it('handles a failed import', async () => {
      const createQcResultsUploadResource = vi
        .spyOn(QcResultsUpload, 'createQcResultsUploadResource')
        .mockRejectedValue('This is an error msg')

      await form.postCSV()

      expect(createQcResultsUploadResource).toBeCalledWith(create, {
        csv: 'xxx',
        usedBySelected: 'extraction',
      })
      expect(form.showAlert).toBeCalledWith('This is an error msg', 'danger')
      expect(form.busy).toEqual(false)
      expect(form.disableUpload).toEqual(true)
    })
  })
})
