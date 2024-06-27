import { mount, createTestingPinia } from '@support/testHelper.js'
import GeneralReception from '@/views/GeneralReception.vue'
import Receptions from '@/lib/receptions'
import { expect, it } from 'vitest'
import PrinterFactory from '@tests/factories/PrinterFactory.js'

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

const printerFactory = PrinterFactory()

function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(GeneralReception, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            printing: state,
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
  })
  return { wrapperObj }
}

describe('GeneralReception', () => {
  const buildWrapper = () => {
    return mountWithStore({
      props: { receptions: Receptions },
      state: { resources: { printers: printerFactory.storeData } },
    })
  }

  it('has a source selector', () => {
    const { wrapperObj: wrapper } = buildWrapper()

    expect(
      wrapper
        .find('[data-type=source-list]')
        .findAll('option')
        .map((element) => element.text()),
    ).toEqual([
      'Sequencescape',
      'Samples Extraction',
      'Sequencescape Tubes',
      'Sequencescape Multiplexed Libraries',
    ])
    // It defaults to Sequencescape
    expect(wrapper.find('[data-type=source-list]').element.value).toEqual('Sequencescape')
  })

  describe('pipeline selector', () => {
    it('has a pipeline selector', () => {
      const { wrapperObj: wrapper } = buildWrapper()
      expect(wrapper.find('[data-type=pipeline-list]').findAll('option')[0].text()).toBe('PacBio')
      expect(wrapper.find('[data-type=pipeline-list]').findAll('option')[1].text()).toBe('ONT')
      // It defaults to PacBio
      expect(wrapper.find('[data-type=pipeline-list]').element.value).toEqual('PacBio')
    })

    it('only shows ONT for SequencescapeMultiplexedLibraries', async () => {
      const { wrapperObj: wrapper } = buildWrapper()
      await wrapper.find('[data-type=source-list]').findAll('option')[3].setSelected()
      expect(wrapper.find('[data-type=pipeline-list]').findAll('option').length).toBe(1)
      expect(wrapper.find('[data-type=pipeline-list]').findAll('option')[0].text()).toBe('ONT')
    })

    it('sets pipeline to the first available pipeline if the source changes and the pipeline is no longer valid', async () => {
      // This example sets source to SequencescapeMultiplexedLibraries which only has ONT as a pipeline
      const { wrapperObj: wrapper } = buildWrapper()
      expect(wrapper.vm.pipeline).toEqual('PacBio')
      await wrapper.find('[data-type=source-list]').findAll('option')[3].setSelected()
      expect(wrapper.vm.pipeline).toEqual('ONT')
    })
  })

  describe('request options', () => {
    it('has the a cost code input field', () => {
      const { wrapperObj: wrapper } = buildWrapper()
      expect(wrapper.find('[data-attribute=cost-code-input]')).toBeTruthy()
    })

    it('shows ONT options when ONT is selected', async () => {
      const { wrapperObj: wrapper } = buildWrapper()
      // Select ONT pipeline
      await wrapper.find('[data-type=pipeline-list]').findAll('option')[1].setSelected()

      // Library type
      const libraryType = wrapper.find('[data-attribute=library-type-list]')
      expect(libraryType.find('option[value="ONT_GridIon"]').exists()).toBe(true)
      expect(libraryType.find('option[value="_undefined"]').exists()).toBe(true)
      // It should not have any ONT options when Pacbio is the selected pipeline
      expect(libraryType.find('option[value="Pacbio_HiFi"]').exists()).toBe(false)

      expect(wrapper.find('[data-attribute=data-type-list]')).toBeTruthy()
      expect(wrapper.find('[data-attribute=number-of-flowcells-input]')).toBeTruthy()
      // Does not show PacBio options
      expect(wrapper.find('[data-attribute=smrt-cells-input]').exists()).toBe(false)
      expect(wrapper.find('[data-attribute=estimate_of_gb_required]').exists()).toBe(false)
    })

    it('shows PacBio options when PacBio is selected', async () => {
      const { wrapperObj: wrapper } = buildWrapper()
      // Select PacBio pipeline
      await wrapper.find('[data-type=pipeline-list]').findAll('option')[0].setSelected()

      // Library type
      const libraryType = wrapper.find('[data-attribute=library-type-list]')
      expect(libraryType.find('option[value="Pacbio_HiFi"]').exists()).toBe(true)
      expect(libraryType.find('option[value="Pacbio_IsoSeq"]').exists()).toBe(true)
      expect(libraryType.find('option[value="_undefined"]').exists()).toBe(true)
      // It should not have any ONT options when Pacbio is the selected pipeline
      expect(libraryType.find('option[value="ONT_GridIon"]').exists()).toBe(false)

      expect(wrapper.find('[data-attribute=smrt-cells-input]')).toBeTruthy()
      expect(wrapper.find('[data-attribute=estimate_of_gb_required]')).toBeTruthy()
      // Does not show ONT options
      expect(wrapper.find('[data-attribute=data-type-list]').exists()).toBe(false)
      expect(wrapper.find('[data-attribute=number-of-flowcells-input]').exists()).toBe(false)
    })
  })

  describe('loading modal', () => {
    it('shows the modal when showModal is called', async () => {
      const { wrapperObj: wrapper } = buildWrapper()
      const message = 'show modal message'
      wrapper.vm.showModal(message)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-type=loading-full-screen-modal]').exists()).toBe(true)
      expect(wrapper.find('[data-type=loading-full-screen-modal]').text()).toBe(message)
    })

    it('hides the modal when clearModal is called', async () => {
      const { wrapperObj: wrapper } = buildWrapper()
      wrapper.vm.showModal('show modal message')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-type=loading-full-screen-modal]').exists()).toBe(true)
      wrapper.vm.clearModal()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-type=loading-full-screen-modal]').exists()).toBe(false)
    })

    it('shows the correct data when importStarted is called', async () => {
      const { wrapperObj: wrapper } = buildWrapper()
      wrapper.vm.importStarted({ barcode_count: 1 })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-type=loading-full-screen-modal]').exists()).toBe(true)
      expect(wrapper.find('[data-type=loading-full-screen-modal]').text()).toBe(
        'Creating 1 labware(s) for Sequencescape',
      )
    })
  })
})
