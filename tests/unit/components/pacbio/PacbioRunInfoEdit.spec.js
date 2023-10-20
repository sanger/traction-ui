import PacbioRunInfoEdit from '@/components/pacbio/PacbioRunInfoEdit'
import { mount, createTestingPinia } from '@support/testHelper'
import { beforeEach, describe, expect } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate'

// required as suggestion to remove the deprecated function
// https://vue-test-utils.vuejs.org/api/options.html#attachtodocument
const elem = document.createElement('div')
if (document.body) {
  document.body.appendChild(elem)
}

const smrtLinkVersions = {
  1: {
    id: '1',
    name: 'v1',
    default: true,
    active: true,
  },
  2: {
    id: '2',
    name: 'v12_revio',
    default: false,
    active: true,
  },
  3: {
    id: '3',
    name: 'v12_sequel_iie',
    default: false,
    active: true,
  },
  4: {
    id: '4',
    name: 'v10',
    default: false,
    active: false,
  },
}

/**
 * Helper method for mounting a component with given 'props as well as with a mock instance of pinia,
 *  with the given 'options.
 * 'options' allows to define initial state of store while instantiating the component.
 *
 * @param {*} options - options to be passed to the createTestingPinia method for creating a mock instance of pinia
 * options type is
 * {state :{},stubActions: boolean, plugins:[]}
 *
 * @param {*} props - props to be passed to the component while mounting
 *
 */
function mountWithStore(options, props) {
  const state = options?.state ? options.state : {}
  const stubActions = options?.stubActions ?? false
  const plugins = options?.plugins ?? []

  const wrapperObj = mount(PacbioRunInfoEdit, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioRunCreate: { ...state },
          },
          stubActions,
          plugins,
        }),
      ],
    },
    sync: false,
    attachTo: elem,
    props,
  })
  const storeObj = usePacbioRunCreateStore()
  return { wrapperObj, storeObj }
}

let runInfo, wrapper, store

describe('PacbioRunInfoEdit', () => {
  beforeEach(() => {
    const { wrapperObj, storeObj } = mountWithStore(
      {
        state: {
          run: {
            id: 'new',
            name: 'TRACTION-RUN-3',
            system_name: 'Sequel IIe',
            dna_control_complex_box_barcode: null,
            comments: null,
          },
          smrtLinkVersion: smrtLinkVersions[1],
          resources: { smrtLinkVersions },
          instrumentTypeList: PacbioInstrumentTypes,
          instrumentType: PacbioInstrumentTypes.SequelIIe,
        },
      },
      {
        newRecord: true,
      },
    )
    wrapper = wrapperObj
    store = storeObj
    runInfo = wrapper.vm
  })

  it('on mount, will set the instrument type', () => {
    expect(store.instrumentType).toEqual(PacbioInstrumentTypes.SequelIIe)
  })

  it('will update the instrument type', async () => {
    const input = wrapper.find('[data-attribute=system_name]')
    await input.setValue(PacbioInstrumentTypes.Revio.key)
    expect(store.instrumentType).toEqual(PacbioInstrumentTypes.Revio)

    await input.setValue(PacbioInstrumentTypes.SequelIIe.key)
    expect(store.instrumentType).toEqual(PacbioInstrumentTypes.SequelIIe)
  })

  it('will only show the instrument type options that are active', () => {
    const options = wrapper.find('[data-attribute=system_name]').findAll('option')
    expect(options.length).toEqual(2)
  })

  describe('#computed', () => {
    describe('#smrtLinkVersionSelectOptions', () => {
      it('returns only the active versions', () => {
        expect(runInfo.smrtLinkVersionSelectOptions.length).toEqual(3)
      })

      it('returns smrt link version select options', () => {
        const options = Object.values(runInfo.smrtLinkVersionList)
          .slice(0, 3)
          .map(({ id, name }) => ({
            value: id,
            text: name,
          }))

        expect(runInfo.smrtLinkVersionSelectOptions).toEqual(options)
      })
    })

    describe('#smrtLinkVersionv12', () => {
      it('returns false when the SMRT Link version is not v12', () => {
        expect(runInfo.smrtLinkVersionv12).toBe(false)
      })

      it('returns true when the SMRT Link version is v12 Revio', async () => {
        const options = wrapper.find('[data-attribute=smrt_link_version]').findAll('option')
        await options[1].setSelected()
        expect(runInfo.smrtLinkVersionv12).toBe(true)
      })

      it('returns true when the SMRT Link version is v12 Sequel IIe', async () => {
        const options = wrapper.find('[data-attribute=smrt_link_version]').findAll('option')
        await options[2].setSelected()
        expect(runInfo.smrtLinkVersionv12).toBe(true)
      })
    })
  })

  describe('input', () => {
    it('has a run name on run edit', async () => {
      expect(store.run.name).toEqual('TRACTION-RUN-3')
    })

    it('shows dna_control_complex_box_barcode when SMRT Link version is not v12 Sequel IIe', async () => {
      const input = wrapper.find('[data-attribute=dna_control_complex_box_barcode]')
      await input.setValue('DCCB1')
      expect(store.run.dna_control_complex_box_barcode).toEqual('DCCB1')
      expect(wrapper.text()).toContain('DNA Control Complex Box Barcode')
    })
    it('does not show dna_control_complex_box_barcode when SMRT Link version is v12 Revio', async () => {
      const options = wrapper.find('[data-attribute=smrt_link_version]').findAll('option')
      await options[1].setSelected()
      expect(runInfo.smrtLinkVersion.id).toEqual(smrtLinkVersions[2].id)
      expect(wrapper.text()).not.toContain('DNA Control Complex Box Barcode')
    })
    it('does not show dna_control_complex_box_barcode when SMRT Link version is v12 Sequel IIe', async () => {
      const options = wrapper.find('[data-attribute=smrt_link_version]').findAll('option')
      await options[2].setSelected()
      expect(runInfo.smrtLinkVersion.id).toEqual(smrtLinkVersions[3].id)
      expect(wrapper.text()).not.toContain('DNA Control Complex Box Barcode')
    })
    it('system name', async () => {
      expect(store.run.system_name).toEqual('Sequel IIe')
    })
    it('smrt_link_version_id', async () => {
      const options = wrapper.find('[data-attribute=smrt_link_version]').findAll('option')
      await options[1].setSelected()
      expect(runInfo.smrtLinkVersion.id).toEqual(smrtLinkVersions[2].id)
    })
    it('comments', async () => {
      const input = wrapper.find('[data-attribute=comments]')
      await input.setValue('example comment')
      expect(store.run.comments).toEqual('example comment')
    })
  })
})

describe('PacbioRunInfoEdit old run', () => {
  beforeEach(() => {
    const { wrapperObj } = mountWithStore(
      {
        state: {
          run: {
            id: 'new',
            name: 'TRACTION-RUN-4',
            system_name: 'Sequel I',
            dna_control_complex_box_barcode: null,
            comments: null,
          },
          smrtLinkVersion: smrtLinkVersions[4],
          resources: { smrtLinkVersions },
          instrumentTypeList: PacbioInstrumentTypes,
        },
      },
      {
        newRecord: false,
      },
    )
    runInfo = wrapperObj.vm
  })
  describe('#computed', () => {
    describe('#smrtLinkVersionSelectOptions', () => {
      it('includes an inactive version if the record has that value', () => {
        expect(runInfo.smrtLinkVersionSelectOptions.length).toEqual(4)
      })
    })
  })
})
