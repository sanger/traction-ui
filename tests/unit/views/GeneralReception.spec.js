import { mount, localVue, store } from '@support/testHelper'
import GeneralReception from '@/views/GeneralReception.vue'
import * as Reception from '@/services/traction/Reception'
import { expect, it } from 'vitest'

const tractionReceptionsCreate = store.getters.api.traction.receptions.create

const Receptions = [
  {
    name: 'Sequencescape',
    text: 'Sequencescape',
    value: 'Sequencescape',
    props: {
      title: 'Sequencescape',
    },
  },
  {
    name: 'Samples Extraction',
    text: 'Samples Extraction',
    value: 'Samples Extraction',
    props: {
      title: 'Samples Extraction',
    },
  },
]

describe('GeneralReception', () => {
  const buildWrapper = (props = { receptions: Receptions }) => {
    return mount(GeneralReception, {
      localVue,
      propsData: props,
      store,
    })
  }

  it('generates a wrapper', () => {
    const wrapper = buildWrapper()
    expect(wrapper).toBeTruthy()
  })

  it('has a source selector', () => {
    const wrapper = buildWrapper()

    expect(wrapper.find('[data-type=source-list]').findAll('option').at(0).text()).toBe(
      'Sequencescape',
    )
    expect(wrapper.find('[data-type=source-list]').findAll('option').at(1).text()).toBe(
      'Samples Extraction',
    )
    // It defaults to Sequencescape
    expect(wrapper.find('[data-type=source-list]').element.value).toEqual('Sequencescape')
  })

  it('has a pipeline selector', () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('[data-type=pipeline-list]').findAll('option').at(0).text()).toBe('PacBio')
    expect(wrapper.find('[data-type=pipeline-list]').findAll('option').at(1).text()).toBe('ONT')
    // It defaults to PacBio
    expect(wrapper.find('[data-type=pipeline-list]').element.value).toEqual('PacBio')
  })

  it('has request options', () => {
    /* 
      We test this more thoroughly in the e2e tests since request options are dynamic
      Here we just test they exist
    */
    const wrapper = buildWrapper()

    const libraryType = wrapper.find('[data-type=library-type-list]')
    expect(libraryType.find('option[value="Pacbio_HiFi"]').exists()).toBe(true)
    expect(libraryType.find('option[value="Pacbio_IsoSeq"]').exists()).toBe(true)
    expect(libraryType.find('option[value="ONT_GridIon"]').exists()).toBe(true)
    expect(libraryType.find('option[value="_undefined"]').exists()).toBe(true)

    expect(wrapper.find('[data-type=smrt-cells-input]')).toBeTruthy()
  })

  describe('barcode text area', () => {
    it('single barcode', async () => {
      const wrapper = buildWrapper()
      await wrapper.find('#barcodes').setValue('DN1\n')
      expect(wrapper.vm.barcodes).toEqual('DN1\n')
      expect(wrapper.find('#importText').text()).toEqual(
        'Import 1 labware into PacBio from Sequencescape',
      )
    })
    it('multiple barcodes', async () => {
      const wrapper = buildWrapper()
      await wrapper.find('#barcodes').setValue('DN1\nDN2\nDN3\nDN4\nDN5')
      expect(wrapper.vm.barcodes).toEqual('DN1\nDN2\nDN3\nDN4\nDN5')
      expect(wrapper.find('#importText').text()).toEqual(
        'Import 5 labware into PacBio from Sequencescape',
      )
    })
  })

  it('has a summary area', () => {
    const wrapper = buildWrapper()
    expect(wrapper.text()).toContain('Summary')
    expect(wrapper.find('#importText').text()).toEqual(
      'Import 0 labware into PacBio from Sequencescape',
    )
    expect(wrapper.find('[data-action=reset-form]').text()).toEqual('Reset')
    expect(wrapper.find('[data-action=import-labware]').text()).toEqual('Import')
  })

  it('handles a failed import - load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = buildWrapper()
    // We've begun the import
    await wrapper.vm.importStarted({ message: 'Starting import' })
    // But it fails
    await wrapper.vm.importFailed({ message: 'Failed import' })

    expect(wrapper.text()).not.toContain('Starting import')
    expect(Object.values(store.state.traction.messages)).toContainEqual({
      type: 'danger',
      message: 'Failed import',
    })
  })

  it('handles a successful import', async () => {
    store.state.traction.messages = []
    const mockedcreateReception = vi
      .spyOn(Reception, 'createReceptionResource')
      .mockImplementation(() => {})
    const wrapper = buildWrapper()
    // We've begun the import
    await wrapper.vm.importStarted({ message: 'Starting import' })

    await wrapper.vm.importLoaded({ requestAttributes: [{}], source: 'sequencescape' })

    await mockedcreateReception
    expect(wrapper.text()).not.toContain('Starting import')
    expect(mockedcreateReception).toBeCalledWith(tractionReceptionsCreate, {
      source: 'traction-ui.sequencescape',
      requestAttributes: [{}],
    })

    expect(Object.values(store.state.traction.messages)).toContainEqual({
      type: 'success',
      message: 'Imported 1 request from Sequencescape',
    })
  })

  it('handles a failed import - save', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    store.state.traction.messages = []
    const message = 'The princess is in another castle'

    vi.spyOn(Reception, 'createReceptionResource').mockRejectedValue(new Error(message))
    const wrapper = buildWrapper()
    // We've begun the import
    await wrapper.vm.importStarted({ message: 'Starting import' })

    await wrapper.vm.importLoaded({ requestAttributes: [], source: 'sequencescape' })

    expect(wrapper.text()).not.toContain('Starting import')

    await localVue.nextTick()

    expect(Object.values(store.state.traction.messages)).toContainEqual({
      type: 'danger',
      message: `Error: ${message}`,
    })
  })
})
