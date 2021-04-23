import * as Run from '@/api/PacbioRun'
import PacbioRunInfo from '@/components/pacbio/PacbioRunInfo'
import { localVue, mount, store } from '../../testHelper'

describe('PacbioRunInfo', () => {
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
    wrapper = mount(PacbioRunInfo, { localVue, store, sync: false, attachTo: elem })
    runInfo = wrapper.vm
  })

  it('can have mapState', () => {
    expect(runInfo.bindingKitBoxBarcode).toBeDefined()
    expect(runInfo.sequencingKitBoxBarcode).toBeDefined()
    expect(runInfo.dnaControlComplexBoxBarcode).toBeDefined()
    expect(runInfo.comments).toBeDefined()
    expect(runInfo.systemName).toBeDefined()
  })

  it('can have getters', () => {
    expect(runInfo.currentRun).toBeDefined()
  })

  it('must have systemName data', () => {
    expect(runInfo.systemNameOptions).toEqual([
      { text: 'System Name', value: '' },
      'Sequel I',
      'Sequel II',
      'Sequel IIe'
    ])
  })

  describe('form inputs', () => {
    it('Run name should be read only', () => {
      let input = wrapper.find('#run_name')
      expect(input.attributes('readonly')).toBeTruthy()
    })
    it('has a Binding Kit Box Barcode input', () => {
      expect(wrapper.find('#binding_kit_box_barcode')).toBeDefined()
    })
    it('has a Sequencing Kit Box Barcode input', () => {
      expect(wrapper.find('#sequencing_kit_box_barcode')).toBeDefined()
    })
    it('has a DNA Control Complex Box Barcode input', () => {
      expect(wrapper.find('#dna_control_complex_box_barcode')).toBeDefined()
    })
    it('has a System Name input', () => {
      expect(wrapper.find('#system_name')).toBeDefined()
    })
    it('has a Comments input', () => {
      expect(wrapper.find('#comments')).toBeDefined()
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
