import { mount } from '@support/testHelper.js'
import PacbioTubeWell from '@/components/labware/PacbioTubeWell.vue'
import { beforeEach, describe } from 'vitest'

describe('PacbioTubeWell', () => {
  let wrapper

  describe('when the component is mounted with no requests', () => {
    beforeEach(() => {
      const props = {
        requests: [],
      }
      wrapper = mount(PacbioTubeWell, {
        props,
      })
    })
    it('should display the well', () => {
      expect(wrapper.find('[data-attribute="traction-well"]')).toBeDefined()
    })
    it('should display the well color empty', () => {
      expect(wrapper.find('[data-attribute="traction-well"]').classes()).toContain('bg-gray-500')
    })
  })
  describe('when the component is mounted with requests', () => {
    beforeEach(() => {
      const props = {
        requests: [
          {
            id: 1,
          },
        ],
      }
      wrapper = mount(PacbioTubeWell, {
        props,
      })
    })

    it('should display the well', () => {
      expect(wrapper.find('[data-attribute="traction-well"]')).toBeDefined()
    })
    it('should display the well color', () => {
      const classes = wrapper.find('[data-attribute="traction-well"]').classes()
      const expectedClasses = ['bg-green-600', 'border-solid', 'border-gray-500']
      expect(expectedClasses.every((expectedClass) => classes.includes(expectedClass))).toBe(true)
    })
  })

  describe('when the component is mounted with a request that is not selected', () => {
    beforeEach(() => {
      const props = {
        requests: [
          {
            id: 1,
            selected: false,
          },
        ],
      }
      wrapper = mount(PacbioTubeWell, {
        props,
      })
    })
    it('should display the well color and well border as not selected', () => {
      const classes = wrapper.find('[data-attribute="traction-well"]').classes()
      const expectedClasses = ['bg-green-600', 'border-solid', 'border-1', 'border-gray-500']
      expect(expectedClasses.every((expectedClass) => classes.includes(expectedClass))).toBe(true)
    })
  })

  describe('when the component is mounted with a request that is selected', () => {
    beforeEach(() => {
      const props = {
        requests: [
          {
            id: 1,
            selected: true,
          },
        ],
      }
      wrapper = mount(PacbioTubeWell, {
        props,
      })
    })
    it('should display the well color and well border as seleced', () => {
      const classes = wrapper.find('[data-attribute="traction-well"]').classes()
      const expectedClasses = ['bg-green-600', 'border-solid', 'border-yellow-400', 'border-2']
      expect(expectedClasses.every((expectedClass) => classes.includes(expectedClass))).toBe(true)
    })
  })

  describe('when the well is clicked', () => {
    beforeEach(() => {
      const props = {
        requests: [],
      }
      wrapper = mount(PacbioTubeWell, {
        props,
      })
      wrapper.find('[data-attribute="traction-well"]').trigger('click')
    })
    it('should emit the wellClicked event', () => {
      expect(wrapper.emitted('click')).toBeDefined()
    })
  })
})
