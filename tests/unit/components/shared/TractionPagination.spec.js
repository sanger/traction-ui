import { localVue, mount } from '@support/testHelper'

import TractionPagination from '@/components/shared/TractionPagination'
import TPagination from 'vue-tailwind/dist/t-pagination'
describe('TractionPagination.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionPagination, {
      components: {
        TPagination,
      },
      localVue,
      propsData: { ...props },
      slots: {
        default: 'Section Content',
      },
    })
  }

  it('displays the default classes', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.attributes('class')).toEqual(
      'table border-collapse text-center bg-white mx-auto shadow-sm',
    )
  })
  it('displays a single page button', () => {
    const wrapper = buildWrapper({ totalItems: 4, itemsPerPage: 4 })
    expect(wrapper.find('button').exists()).toBeTruthy()
    expect(wrapper.text()).toContain('1')
  })
  it('fires change event on button click', async () => {
    const wrapper = buildWrapper({ totalItems: 4, itemsPerPage: 4 })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(1)
  }),
    it('displays two page buttona', () => {
      const wrapper = buildWrapper({ totalItems: 8, itemsPerPage: 4 })
      expect(wrapper.find('button').exists()).toBeTruthy()
      expect(wrapper.text()).toContain('1')
      expect(wrapper.text()).toContain('2')
    })
})