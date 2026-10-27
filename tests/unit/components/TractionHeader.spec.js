import TractionHeader from '@/components/TractionHeader'
import { mount } from '@support/testHelper'
import.meta.env.VITE_ENVIRONMENT = 'production'

describe('TractionHeader.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(TractionHeader)
  })

  it('has headerClasses', () => {
    expect(wrapper.vm.headerClasses).toEqual(['relative', 'bg-linear-to-r from-sdb to-sdb-400'])
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
})
