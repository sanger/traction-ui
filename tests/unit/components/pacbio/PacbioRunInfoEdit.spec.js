import * as Run from '@/api/PacbioRun'
import PacbioRunInfoEdit from '@/components/pacbio/PacbioRunInfoEdit'
import { localVue, mount, store } from 'testHelper'

describe('PacbioRunInfoEdit', () => {
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
    wrapper = mount(PacbioRunInfoEdit, { localVue, store, sync: false, attachTo: elem })
    runInfo = wrapper.vm
  })

  it('can have mapState', () => {
    expect(runInfo.sequencingKitBoxBarcode).toBeDefined()
    expect(runInfo.dnaControlComplexBoxBarcode).toBeDefined()
    expect(runInfo.comments).toBeDefined()
    expect(runInfo.systemName).toBeDefined()
  })

  it('can have getters', () => {
    expect(runInfo.currentRun).toBeDefined()
  })

  it('must have systemName data', () => {
    expect(runInfo.systemNameOptions).toEqual(['Sequel I', 'Sequel II', 'Sequel IIe'])
  })

  describe('form inputs', () => {
    it('has a Sequencing Kit Box Barcode input', () => {
      expect(wrapper.find('#sequencing-kit-box-barcode')).toBeDefined()
    })
    it('has a DNA Control Complex Box Barcode input', () => {
      expect(wrapper.find('#dna-control-complex-box-barcode')).toBeDefined()
    })
    it('has a System Name input', () => {
      expect(wrapper.find('#system-name')).toBeDefined()
    })
    it('has a Comments input', () => {
      expect(wrapper.find('#comments')).toBeDefined()
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
