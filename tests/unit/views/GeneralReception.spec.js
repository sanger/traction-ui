import { mountWithStore } from '@support/testHelper.js'
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

describe('GeneralReception', () => {
  let wrapper
  beforeEach(() => {
    ;({ wrapper } = mountWithStore(GeneralReception, {
      props: { receptions: Receptions },
      initialState: { printing: { resources: { printers: printerFactory.storeData } } },
    }))
  })

  describe('Workflow Selector', () => {
    it('has a workflow selector', () => {
      const workflowSelect = wrapper.find('#workflowSelect')
      expect(workflowSelect.findAll('option').map((element) => element.text())).toEqual([
        '',
        'Extractions -80 samples',
        'Pacbio -20 samples',
        'Pacbio Fridge samples',
      ])
    })

    it('defaults to an empty option', async () => {
      const workflowSelect = wrapper.find('#workflowSelect')
      expect(workflowSelect.element.value).toEqual('')
    })

    it('displays user swipecard when a workflow is selected', async () => {
      const workflowSelect = wrapper.find('#workflowSelect')
      await workflowSelect.setValue('lw-shelf-1-30451')
      const userCodeInput = wrapper.find('[data-attribute=user-code-input]')
      expect(userCodeInput.exists()).toBe(true)
      expect(userCodeInput.isVisible()).toBe(true)
      expect(userCodeInput.attributes('type')).toBe('password')
    })

    it('hides user swipecard when a workflow is not selected', async () => {
      const workflowSelect = wrapper.find('#workflowSelect')
      await workflowSelect.setValue('')
      expect(wrapper.find('[data-attribute=user-code-input]').isVisible()).toBe(false)
    })

    it('errors user code fields if not set', async () => {
      const workflowSelect = wrapper.find('#workflowSelect')
      await workflowSelect.setValue('lw-shelf-1-30451')
      expect(wrapper.find('[data-attribute=user-code-error]').text()).toContain(
        'User code is required to scan in the imported labware',
      )
    })

    it('updates the summary section accordingly on user select', async () => {
      const workflowSelect = wrapper.find('#workflowSelect')
      await workflowSelect.setValue('lw-shelf-1-30451')
      expect(wrapper.find('[data-testid=workflow-location-text]').text()).toContain(
        'The imported labware will be scanned into LRT007 – Shelf 1',
      )
    })
  })

  it('has a source selector', () => {
    expect(
      wrapper
        .find('[data-type=source-list]')
        .findAll('option')
        .map((element) => element.text()),
    ).toEqual([
      'Sequencescape',
      'Sequencescape Tubes',
      'Sequencescape Multiplexed Libraries',
      'Mocked plates',
      'Mocked tubes',
    ])
    // It defaults to Sequencescape
    expect(wrapper.find('[data-type=source-list]').element.value).toEqual('Sequencescape')
  })

  describe('pipeline selector', () => {
    it('has a pipeline selector', () => {
      expect(wrapper.find('[data-type=pipeline-list]').findAll('option')[0].text()).toBe('PacBio')
      expect(wrapper.find('[data-type=pipeline-list]').findAll('option')[1].text()).toBe('ONT')
      // It defaults to PacBio
      expect(wrapper.find('[data-type=pipeline-list]').element.value).toEqual('PacBio')
    })

    it('only shows ONT for SequencescapeMultiplexedLibraries', async () => {
      await wrapper.find('[data-type=source-list]').findAll('option')[2].setSelected()
      expect(wrapper.find('[data-type=pipeline-list]').findAll('option').length).toBe(1)
      expect(wrapper.find('[data-type=pipeline-list]').findAll('option')[0].text()).toBe('ONT')
    })

    it('sets pipeline to the first available pipeline if the source changes and the pipeline is no longer valid', async () => {
      // This example sets source to SequencescapeMultiplexedLibraries which only has ONT as a pipeline
      expect(wrapper.vm.pipeline).toEqual('PacBio')
      await wrapper.find('[data-type=source-list]').findAll('option')[2].setSelected()
      expect(wrapper.vm.pipeline).toEqual('ONT')
    })
  })

  describe('request options', () => {
    it('has the a cost code input field', () => {
      expect(wrapper.find('[data-attribute=cost-code-input]')).toBeTruthy()
    })

    it('shows ONT options when ONT is selected', async () => {
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
      const message = 'show modal message'
      wrapper.vm.showModal(message)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-type=loading-full-screen-modal]').exists()).toBe(true)
      expect(wrapper.find('[data-type=loading-full-screen-modal]').text()).toBe(message)
    })

    it('hides the modal when clearModal is called', async () => {
      wrapper.vm.showModal('show modal message')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-type=loading-full-screen-modal]').exists()).toBe(true)
      wrapper.vm.clearModal()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-type=loading-full-screen-modal]').exists()).toBe(false)
    })

    it('shows the correct data when importStarted is called', async () => {
      wrapper.vm.importStarted({ barcode_count: 1 })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-type=loading-full-screen-modal]').exists()).toBe(true)
      expect(wrapper.find('[data-type=loading-full-screen-modal]').text()).toBe(
        'Creating 1 labware(s) for Sequencescape',
      )
    })
  })
})
