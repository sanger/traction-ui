import { mount } from '@vue/test-utils'
import { router } from '@support/testHelper'
import TractionButton from '@/components/shared/TractionButton'
import { expect } from 'vitest'

describe('TractionButton.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionButton, {
      props,
      slots: {
        default: 'Section Content',
      },
      router,
    })
  }

  it('displays the content', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.text()).toContain('Section Content')
  })

  it('uses the default theme by default', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.attributes('class')).toContain('bg-sdb-400')
  })

  it('supports a create theme', () => {
    const wrapper = buildWrapper({ theme: 'create' })
    expect(wrapper.attributes('class')).toContain('bg-green')
  })

  it('supports a size', () => {
    const wrapper = buildWrapper({ size: 'sm' })
    expect(wrapper.attributes('class')).toContain('text-sm')
  })

  it('can have a text prop', () => {
    const wrapper = mount(TractionButton, {
      props: {
        text: 'Button text',
      },
      slots: {},
    })
    expect(wrapper.text()).toContain('Button text')
  })

  it('can be full width', () => {
    const wrapper = buildWrapper({ fullWidth: true })
    expect(wrapper.attributes('class')).toContain('w-full')
  })

  it('can provide a link', async () => {
    router.push = vi.fn()
    const to = { name: 'PacbioPoolCreate', params: { id: 1 } }
    const wrapper = buildWrapper({ to })
    await wrapper.find('button').trigger('click')
    expect(router.push).toHaveBeenCalledTimes(1)
    expect(router.push).toHaveBeenCalledWith(to)
  })
})
