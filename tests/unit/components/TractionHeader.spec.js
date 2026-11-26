import TractionHeader from '@/components/TractionHeader'
import { flushPromises, mount, router } from '@support/testHelper'
import.meta.env.VITE_ENVIRONMENT = 'production'

describe('TractionHeader.vue', () => {
  let wrapper

  beforeEach(async () => {
    await router.push('/')
    wrapper = mount(TractionHeader, { attachTo: document.body })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('has headerClasses', () => {
    expect(wrapper.vm.headerClasses).toEqual(['relative', 'bg-sdb-400'])
  })

  it('groups non-pipeline navigation under Tools', async () => {
    expect(wrapper.find('[data-attribute="tools-dropdown"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('PacBio')
    expect(wrapper.text()).toContain('ONT')

    await wrapper.find('[data-attribute="tools-menu"]').trigger('click')

    const tools = wrapper.findAll('[data-attribute="tools-dropdown"] a')
    expect(tools).toHaveLength(6)
    expect(tools.map((tool) => tool.text())).toEqual([
      'ReceptionReceive samples and libraries into Traction',
      'LabWhere ReceptionUpdate labware locations in LabWhere',
      'Label PrintingPrint labels for labware',
      'QC Results UploadUpload quality control results',
      'Sample ReportView and download sample reports',
      'Flexible PoolingCreate multiple pools at the same time',
    ])
  })

  it('keeps the Tools and pipeline dropdowns mutually exclusive', async () => {
    await wrapper.find('[data-attribute="pacbio-menu"]').trigger('click')
    expect(wrapper.find('[data-attribute="pipeline-dropdown"]').exists()).toBe(true)

    await wrapper.find('[data-attribute="tools-menu"]').trigger('click')
    expect(wrapper.find('[data-attribute="tools-dropdown"]').exists()).toBe(true)
    expect(wrapper.find('[data-attribute="pipeline-dropdown"]').exists()).toBe(false)

    await wrapper.find('[data-attribute="ont-menu"]').trigger('click')
    expect(wrapper.find('[data-attribute="tools-dropdown"]').exists()).toBe(false)
    expect(wrapper.find('[data-attribute="pipeline-dropdown"]').exists()).toBe(true)
  })

  it('restores the current pipeline and page when clicking outside a preview', async () => {
    await router.push('/pacbio/plates')
    await flushPromises()

    await wrapper.find('[data-attribute="ont-menu"]').trigger('click')
    expect(wrapper.find('[data-route="/ont/pools"]').exists()).toBe(true)

    document.body.click()
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/pacbio/plates')
    expect(wrapper.find('[data-attribute="pacbio-menu"]').classes()).toContain('text-white')
    expect(wrapper.find('[data-route="/pacbio/plates"]').classes()).toContain('text-white')
    expect(wrapper.find('[data-attribute="pipeline-underline"]').exists()).toBe(true)
    expect(wrapper.find('[data-route="/ont/pools"]').exists()).toBe(false)
  })

  it('restores the current pipeline when clicking outside Tools', async () => {
    await router.push('/pacbio/plates')
    await flushPromises()
    await wrapper.find('[data-attribute="tools-menu"]').trigger('click')

    document.body.click()
    await flushPromises()

    expect(wrapper.find('[data-attribute="tools-dropdown"]').exists()).toBe(false)
    expect(wrapper.find('[data-route="/pacbio/plates"]').classes()).toContain('text-white')
  })

  it('keeps a preview open for clicks inside the navbar and allows navigation', async () => {
    await router.push('/pacbio/plates')
    await flushPromises()
    await wrapper.find('[data-attribute="ont-menu"]').trigger('click')

    await wrapper.find('[data-attribute="pipeline-dropdown"]').trigger('click')
    expect(wrapper.find('[data-route="/ont/pools"]').exists()).toBe(true)

    await wrapper.find('[data-route="/ont/pools"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/ont/pools')
    expect(wrapper.find('[data-route="/ont/pools"]').classes()).toContain('text-white')
  })
})
