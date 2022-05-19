import * as Run from '@/api/PacbioRun'
import PacbioRunWellDefaultEdit from '@/components/pacbio/PacbioRunWellDefaultEdit'
import { localVue, mount, store } from 'testHelper'

describe('PacbioRunWellDefaultEdit', () => {
  let wrapper, runInfo, run

  beforeEach(() => {
    run = Run.build()

    store.commit('traction/pacbio/runs/setCurrentRun', run)

    // required as suggestion to remove the deprecated function
    // https://vue-test-utils.vuejs.org/api/options.html#attachtodocument
    const elem = document.createElement('div')
    if (document.body) {
      document.body.appendChild(elem)
    }
    wrapper = mount(PacbioRunWellDefaultEdit, { localVue, store, sync: false, attachTo: elem })
    runInfo = wrapper.vm
  })

  it('can have getters', () => {
    expect(runInfo.currentRun).toBeDefined()
  })

  describe('form inputs', () => {
    it('has a Default Movie time input', () => {
      expect(wrapper.find('#default-movie-time')).toBeDefined()
    })
    it('has a Default Generate Hifi input', () => {
      expect(wrapper.find('#default-generate-hifi')).toBeDefined()
    })
    it('has a Default Ccs Analysis Output', () => {
      expect(wrapper.find('#default-ccs-analysis-output')).toBeDefined()
    })
    it('has a Default Pre extension time input', () => {
      expect(wrapper.find('#default-pre-extension-time')).toBeDefined()
    })
    it('has a Default Loading Target input', () => {
      expect(wrapper.find('#default-loading-target')).toBeDefined()
    })
    it('has a Default Binding Kit Box Barcode input', () => {
      expect(wrapper.find('#default-binding-kit-box-barcode')).toBeDefined()
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
