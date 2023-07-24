import PacbioRunInfoEdit from '@/components/pacbio/PacbioRunInfoEdit'
import { localVue, mount, store } from '@support/testHelper'
import { beforeEach, describe, expect } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'

// required as suggestion to remove the deprecated function
// https://vue-test-utils.vuejs.org/api/options.html#attachtodocument
const elem = document.createElement('div')
if (document.body) {
  document.body.appendChild(elem)
}

const props = {
  newRecord: true,
}

const buildWrapper = () =>
  mount(PacbioRunInfoEdit, {
    localVue,
    store,
    sync: false,
    attachTo: elem,
    propsData: props,
  })

describe('PacbioRunInfoEdit', () => {
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

  const run = {
    id: 'new',
    name: 'TRACTION-RUN-3',
    system_name: 'Sequel IIe',
    dna_control_complex_box_barcode: null,
    comments: null,
    smrt_link_version_id: 1,
  }

  let runInfo, wrapper

  beforeEach(() => {
    wrapper = buildWrapper()
    runInfo = wrapper.vm
    store.state.traction.pacbio.runCreate.run = { ...run }
    store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions
    store.state.traction.pacbio.runCreate.instrumentTypeList = PacbioInstrumentTypes
    store.state.traction.pacbio.runCreate.instrumentType = PacbioInstrumentTypes.SequelIIe
  })

  it('on mount, will set the instrument type', () => {
    expect(store.state.traction.pacbio.runCreate.instrumentType).toEqual(
      PacbioInstrumentTypes.SequelIIe,
    )
  })

  it('will update the instrument type', async () => {
    let input
    input = wrapper.find('[data-attribute=system_name]')
    await input.setValue('Revio')
    expect(store.state.traction.pacbio.runCreate.instrumentType).toEqual(
      PacbioInstrumentTypes.Revio,
    )

    input = wrapper.find('[data-attribute=system_name]')
    await input.setValue('SequelIIe')
    expect(store.state.traction.pacbio.runCreate.instrumentType).toEqual(
      PacbioInstrumentTypes.SequelIIe,
    )
  })

  describe('smrt link versions', () => {
    it('returns the correct versions', () => {
      expect(runInfo.smrtLinkVersionList.length).toEqual(2)
    })

    it('returns smrt link version select options', () => {
      const options = runInfo.smrtLinkVersionList.map(({ id, name }) => ({ value: id, text: name }))
      expect(runInfo.smrtLinkVersionSelectOptions).toEqual(options)
    })
  })

  describe('input', () => {
    it('has a run name on run edit', async () => {
      expect(store.state.traction.pacbio.runCreate.run.name).toEqual('TRACTION-RUN-3')
    })

    it('dna control complex box barcode', async () => {
      const input = wrapper.find('[data-attribute=dna_control_complex_box_barcode]')
      await input.setValue('DCCB1')
      expect(store.state.traction.pacbio.runCreate.run.dna_control_complex_box_barcode).toEqual(
        'DCCB1',
      )
    })
    it('system name', async () => {
      expect(store.state.traction.pacbio.runCreate.run.system_name).toEqual('Sequel IIe')
    })
    it('smrt_link_version_id', async () => {
      const options = wrapper.find('[data-attribute=smrt_link_version]').findAll('option')
      await options.at(1).setSelected()
      expect(store.state.traction.pacbio.runCreate.run.smrt_link_version_id).toEqual(1)
    })
    it('comments', async () => {
      const input = wrapper.find('[data-attribute=comments]')
      await input.setValue('example comment')
      expect(store.state.traction.pacbio.runCreate.run.comments).toEqual('example comment')
    })
  })
})
