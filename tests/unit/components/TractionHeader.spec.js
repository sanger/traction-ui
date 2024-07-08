import TractionHeader from '@/components/TractionHeader'
import { mount } from '@support/testHelper'
import.meta.env.VITE_ENVIRONMENT = 'production'

describe('TractionHeader.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(TractionHeader)
  })

  it('has headerClasses', () => {
    expect(wrapper.vm.headerClasses).toEqual(['bg-gradient-to-tr from-sdb to-sdb-400'])
  })
})
