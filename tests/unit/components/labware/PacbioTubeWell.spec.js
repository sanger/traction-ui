import { mount } from '@support/testHelper.js'
import PacbioTubeWell from '@/components/labware/PacbioTubeWell.vue'
import { beforeEach, describe } from 'vitest'

describe('PacbioTubeWell', () => {
  let vm, wrapper

  describe('when the component is mounted with no requests', () => {
    beforeEach(() => {
      const props = {
        requests: [],
        position: 'A1',
      }
      wrapper = mount(PacbioTubeWell, {
        props,
      })
      vm = wrapper.vm
    })
    it('should display the well', () => {
      expect(wrapper.find('[data-attribute="traction-well"]')).toBeDefined()
    })
    it('dhould display the well color empty', () => {
      expect(wrapper.find('[data-attribute="traction-well"]').classes()).toContain('bg-black')
    })
    it('should display the well position', () => {
      expect(wrapper.find('[data-attribute="traction-well-position"]').text()).toEqual('A1')
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
        position: 'A1',
      }
      wrapper = mount(PacbioTubeWell, {
        props,
      })
      vm = wrapper.vm
    })

    it('should display the well', () => {
      expect(wrapper.find('[data-attribute="traction-well"]')).toBeDefined()
    })
    it('should display the well color', () => {
      expect(wrapper.find('[data-attribute="traction-well"]').classes()).toContain('bg-green-600')
    })
    it('should display ')
  })
  describe('when the component is mounted with no position', () => {
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
      vm = wrapper.vm
    })
    it('should display the well', () => {
      expect(wrapper.find('[data-attribute="traction-well"]')).toBeDefined()
    })
    it('should not display the well position', () => {
      expect(wrapper.find('[data-attribute="traction-well-position"]').exists()).toBe(false)
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
        position: 'A1',
      }
      wrapper = mount(PacbioTubeWell, {
        props,
      })
      vm = wrapper.vm
    })
     it('should display the well border as selected', () => {
      expect(wrapper.find('[data-attribute="traction-well"]').classes()).toContain(
        'border-solid border-yellow-400',
      )
    })
  })
})
