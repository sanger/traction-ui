import PacbioWellItem from '@/components/pacbio/PacbioWellItem.vue'
import { mount, createTestingPinia } from '@support/testHelper.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'

const requests = {
  1: {
    sample_name: 'Sample1',
    cost_code: '12345',
    source_identifier: 'DN1:A1',
    external_study_id: '1',
  },
}

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * state - initial state of the store
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 */
function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(PacbioWellItem, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioPoolCreate: state,
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
  })
  const storeObj = usePacbioPoolCreateStore()
  return { wrapperObj, storeObj }
}

describe('Well.vue', () => {
  let well, wrapper, props

  beforeEach(() => {
    props = {
      row: 'A',
      column: '1',
      cx: '60.440327',
      cy: '75.818642',
      rx: '10.906492',
      ry: '11.032985',
      requests: ['1'],
    }

    const { wrapperObj } = mountWithStore({
      state: {
        resources: {
          requests,
        },
      },
      props,
    })
    wrapper = wrapperObj
    well = wrapper.vm
  })

  describe('props', () => {
    it('must have a row', () => {
      expect(well.row).toEqual(props.row)
    })

    it('must have a column', () => {
      expect(well.column).toEqual(props.column)
    })

    it('must have a cx', () => {
      expect(well.cx).toEqual(props.cx)
    })

    it('must have a cy', () => {
      expect(well.cy).toEqual(props.cy)
    })

    it('must have a rx', () => {
      expect(well.rx).toEqual(props.rx)
    })

    it('must have a ry', () => {
      expect(well.ry).toEqual(props.ry)
    })

    it('will have requests', () => {
      expect(well.requests).toEqual(props.requests)
    })
  })

  it('will have an ellipse with the correct attributes', () => {
    const ellipse = wrapper.find('ellipse')
    expect(ellipse.exists()).toBeTruthy()
    expect(ellipse.attributes('cx')).toEqual(well.cx)
    expect(ellipse.attributes('cy')).toEqual(well.cy)
    expect(ellipse.attributes('rx')).toEqual(well.rx)
    expect(ellipse.attributes('ry')).toEqual(well.ry)
  })

  describe('#status', () => {
    it('will be filled if the well has a request', () => {
      const ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toContain('filled')
    })

    it('will be empty when the well does not have a request', () => {
      props['requests'] = []
      const { wrapperObj } = mountWithStore({
        state: {
          resources: {
            requests,
          },
        },
        props,
      })
      wrapper = wrapperObj
      well = wrapper.vm

      const ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toContain('empty')
    })
  })

  describe('#tooltip', () => {
    it('will display the materials requests name', () => {
      const title = wrapper.find('title')
      const expected = 'Sample1'
      expect(title.text()).toEqual(expected)
    })
  })

  describe('@click', () => {
    it('emits a click event', async () => {
      const ellipse = wrapper.find('ellipse')
      await ellipse.trigger('click')
      expect(wrapper.emitted().click).toBeTruthy()
    })
  })
})
