import * as Run from '@/api/PacbioRun'
import PacbioRunInfoEdit from '@/components/pacbio/PacbioRunInfoEdit'
import { localVue, mount, store } from '@support/testHelper'
import { expect, it } from 'vitest'

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

  describe('smrt link versions', () => {
    it('returns the correct versions', () => {
      expect(runInfo.smrtLinkVersionList.length).toEqual(2)
    })

    it('returns the default version', () => {
      const default_version = runInfo.smrtLinkVersionList.find((version) => version.default)
      expect(runInfo.defaultSmrtLinkVersion).toEqual(default_version)
    })

    it('can return the default version', () => {
      runInfo.setSmrtLinkVersion(null)
      expect(runInfo.selectedSmrtLinkVersion).toEqual(runInfo.defaultSmrtLinkVersion)
    })

    it('can return the selected version', () => {
      runInfo.smrtLinkVersionList.forEach(function (version) {
        runInfo.setSmrtLinkVersion(version)
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
