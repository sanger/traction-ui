import PacbioRunInfoEdit from '@/components/pacbio/PacbioRunInfoEdit.vue'
import { mount, createTestingPinia } from '@support/testHelper.js'
import { beforeEach, describe, expect } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreateV1.js'

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
    default: false,
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
  5: {
    id: '5',
    name: 'v13_revio',
    default: true,
    active: true,
  },
  6: {
    id: '6',
    name: 'v13_sequel_iie',
    default: false,
    active: true,
  },
}

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * state - initial state of the store.
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 *
 * @param {*} props - props to be passed to the component while mounting
 */
function mountWithStore({ state = {}, stubActions = false, plugins = [] } = {}, props) {
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
            system_name: 'Revio',
            dna_control_complex_box_barcode: null,
            comments: null,
          },
          smrtLinkVersion: smrtLinkVersions[5],
          resources: { smrtLinkVersions },
          instrumentTypeList: PacbioInstrumentTypes,
          instrumentType: PacbioInstrumentTypes.Revio,
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
    expect(store.instrumentType).toEqual(PacbioInstrumentTypes.Revio)
  })

  it('will update the instrument type', async () => {
    expect(store.instrumentType).toEqual(PacbioInstrumentTypes.Revio)

    const input = wrapper.find('[data-attribute=system_name]')
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
        expect(runInfo.smrtLinkVersionSelectOptions.length).toEqual(5)
      })

      it('returns smrt link version select options', () => {
        const options = Object.values(runInfo.smrtLinkVersionList)
          .filter(({ active }) => active)
          .map(({ id, name }) => ({
            value: id,
            text: name,
          }))

        expect(runInfo.smrtLinkVersionSelectOptions).toEqual(options)
      })
    })

    describe('#isRevio', () => {
      it('returns false when the System Name is not Revio', async () => {
        const input = wrapper.find('[data-attribute=system_name]')
        await input.setValue(PacbioInstrumentTypes.SequelIIe.key)
        expect(runInfo.isRevio).toBe(false)
      })

      it('returns true when the System Name is Revio', async () => {
        expect(runInfo.isRevio).toBe(true)
      })
    })
  })

  describe('input', () => {
    it('has a run name on run edit', async () => {
      expect(store.run.name).toEqual('TRACTION-RUN-3')
    })

    it('shows dna_control_complex_box_barcode when Instrument type is Sequel IIe', async () => {
      const system_name_input = wrapper.find('[data-attribute="system_name"]')
      await system_name_input.setValue(PacbioInstrumentTypes.SequelIIe.key)
      const dccbb_input = wrapper.find('[data-attribute=dna_control_complex_box_barcode]')
      await dccbb_input.setValue('DCCB1')

      expect(store.run.dna_control_complex_box_barcode).toEqual('DCCB1')
      expect(wrapper.text()).toContain('DNA Control Complex Box Barcode')
    })

    it('does not show dna_control_complex_box_barcode when Instrument type is v13 Revio', async () => {
      const system_name_input = wrapper.find('[data-attribute="system_name"]')
      await system_name_input.setValue(PacbioInstrumentTypes.Revio.key)

      expect(runInfo.instrumentType).toEqual(PacbioInstrumentTypes.Revio)
      expect(wrapper.text()).not.toContain('DNA Control Complex Box Barcode')
    })

    it('system name', async () => {
      expect(store.run.system_name).toEqual('Revio')
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
    const { wrapperObj } = mountWithStore({
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
    })
    runInfo = wrapperObj.vm
  })
  describe('#computed', () => {
    describe('#smrtLinkVersionSelectOptions', () => {
      it('includes an inactive version if the record has that value', () => {
        expect(runInfo.smrtLinkVersionSelectOptions.length).toEqual(6)
      })
    })
  })
})
