import * as Run from '@/api/PacbioRun'
import PacbioRunInfoEdit from '@/components/pacbio/PacbioRunInfoEdit'
import { localVue, mount, store } from '@support/testHelper'

describe('PacbioRunInfoEdit', () => {
  let wrapper, runInfo, run

  beforeEach(() => {
    run = Run.build()

    const smrtLinkVersions = [
      {
        id: '1',
        name: 'v1',
        default: true,
      },
      {
        id: '2',
        name: 'v2',
        default: false,
      },
    ]

    store.commit('traction/pacbio/runs/setCurrentRun', run)
    store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions

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
    it('has a Run Name input', () => {
      const name = 'run-name'
      expect(wrapper.find('label[for="' + name + '"]').exists()).toBe(true)
      expect(wrapper.find('input[id="' + name + '"]').exists()).toBe(true)
    })
    it('has a Sequencing Kit Box Barcode input', () => {
      const name = 'sequencing-kit-box-barcode'
      expect(wrapper.find('label[for="' + name + '"]').exists()).toBe(true)
      expect(wrapper.find('input[id="' + name + '"]').exists()).toBe(true)
    })
    it('has a DNA Control Complex Box Barcode input', () => {
      const name = 'dna-control-complex-box-barcode'
      expect(wrapper.find('label[for="' + name + '"]').exists()).toBe(true)
      expect(wrapper.find('input[id="' + name + '"]').exists()).toBe(true)
    })
    it('has a System Name select', () => {
      const name = 'system-name'
      expect(wrapper.find('label[for="' + name + '"]').exists()).toBe(true)
      expect(wrapper.find('select[id="' + name + '"]').exists()).toBe(true)
    })
    it('has a SMRT Link Version select', () => {
      const name = 'smrt-link-version'
      expect(wrapper.find('label[for="' + name + '"]').exists()).toBe(true)
      expect(wrapper.find('select[id="' + name + '"]').exists()).toBe(true)
    })
    it('has a Comments input', () => {
      const name = 'comments'
      expect(wrapper.find('label[for="' + name + '"]').exists()).toBe(true)
      expect(wrapper.find('input[id="' + name + '"]').exists()).toBe(true)
    })
  })

  describe('smrt link versions', () => {
    it('returns the correct versions', () => {
      expect(runInfo.smrtLinkVersionList.length).toEqual(2)
    })

    it('can return the selected version', () => {
      runInfo.smrtLinkVersionList.forEach(function (version) {
        runInfo.setSmrtLinkVersionId(version.id)
        expect(runInfo.selectedSmrtLinkVersion).toEqual(version)
      })
    })

    it('returns smrt link version select options', () => {
      const options = runInfo.smrtLinkVersionList.map(({ id, name }) => ({ value: id, text: name }))
      expect(runInfo.smrtLinkVersionSelectOptions).toEqual(options)
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
