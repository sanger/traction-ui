import TractionHeader from '@/components/TractionHeader'
import { mount } from '@support/testHelper'
import.meta.env.VITE_ENVIRONMENT = 'uat'

describe('TractionHeader.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(TractionHeader)
  })

  it('has headerClasses', () => {
    expect(wrapper.vm.headerClasses).toStrictEqual([
      'relative from-sdb to-sdb-400',
      'bg-purple-600',
    ])
  })
})
