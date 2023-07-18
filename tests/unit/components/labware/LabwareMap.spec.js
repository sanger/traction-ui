import { mount } from '@support/testHelper'
import LabwareMap from '@/components/labware/LabwareMap'
import { LabwareTypes } from '@/lib/LabwareTypes'
import { it } from 'vitest'

describe('LabwareMap.vue', () => {
  let labware, wrapper, props

  beforeEach(() => {
    props = {
      name: 'Example labware',
      labwareType: LabwareTypes.Plate96,
    }

    wrapper = mount(LabwareMap, {
      props: props,
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

  it('can have an labwareType prop', () => {
    expect(labware.labwareType).toEqual(props.labwareType)
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
