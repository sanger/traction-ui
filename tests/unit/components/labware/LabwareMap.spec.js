import { mount, localVue, store } from '@support/testHelper'
import LabwareMap from '@/components/labware/LabwareMap'
import { it } from 'vitest'

describe('LabwareMap.vue', () => {
  let labware, wrapper, props

  beforeEach(() => {
    props = {
      name: 'Example labware',
      numRows: 8,
      numColumns: 12,
      interactive: true,
    }

    wrapper = mount(LabwareMap, {
      localVue,
      store,
      propsData: props,
    })
    labware = wrapper.vm
  })

  it('will be defined', () => {
    expect(labware).toBeDefined()
  })

  it('can have a name', () => {
    expect(labware.name).toEqual(props.name)
    expect(wrapper.find('[data-attribute="labware-name"]').text()).toEqual(props.name)
  })

  it('can have an interactive prop', () => {
    expect(labware.interactive).toEqual(props.interactive)
  })

  it('can have an numRows prop', () => {
    expect(labware.numRows).toEqual(props.numRows)
  })

  it('can have an numColumns prop', () => {
    expect(labware.numColumns).toEqual(props.numColumns)
  })

  describe('createPosition', () => {
    it('returns the correct position', () => {
      const position = labware.createPosition(1, 1)
      expect(position).toEqual('A1')
    })

    it('returns the postion as a coordinate if the row count is greater than 26', () => {
      const position = labware.createPosition(27, 5)
      expect(position).toEqual('27,5')
    })
  })
})
