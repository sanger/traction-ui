import ByBarcode from '@/components/receptions/ByBarcode.vue'
import { mount, localVue, store, router } from '@support/testHelper'
import { expect } from 'vitest'

describe('ByBarcode', () => {
  let wrapper, reception, barcodes, barcode, input, importFunction

  // Returned by the importFunction, and passed back to the Reception
  const requestAttributes = ['a', 'b', 'c']
  // Identifies the import source. The reception will prepend this with
  // traction-ui
  const source = 'sequencescape'

  beforeEach(() => {
    barcodes = 'DN1\nDN2\nDN3\nDN4\nDN5'
    importFunction = vi.fn()
    let propsData = {
      importFunction,
      source,
      title: 'Sequencescape',
    }
    wrapper = mount(ByBarcode, { localVue, router, store, propsData })
    reception = wrapper.vm
  })

  describe('libraryType', () => {
    it('lists the expected options', () => {
      const select = wrapper.find('select')
      expect(select.find('option[value="Pacbio_HiFi"]').exists()).toBe(true)
      expect(select.find('option[value="Pacbio_IsoSeq"]').exists()).toBe(true)
      expect(select.find('option[value=""]').exists()).toBe(true)
      expect(select.find('option[value="_undefined"]').exists()).toBe(true)
    })
  })

  describe('scanning in barcodes', () => {
    it('single barcode', async () => {
      barcode = 'DN1\n'
      input = wrapper.find('textarea')
      await input.setValue(barcode)
      expect(reception.barcodes).toEqual(barcode)
      expect(wrapper.find('#createTractionPlates').text()).toEqual(
        'Import 1 labware from Sequencescape',
      )
    })

    it('multiple barcodes', async () => {
      input = wrapper.find('textarea')
      await input.setValue(barcodes)
      expect(reception.barcodes).toEqual(barcodes)
      expect(wrapper.find('#createTractionPlates').text()).toEqual(
        'Import 5 labware from Sequencescape',
      )
    })
  })

  describe('createTractionPlates button', () => {
    it('calls the import function', async () => {
      await wrapper.setData({
        barcodes,
        libraryType: 'Pacbio_HiFi',
        costCode: '235',
      })
      await wrapper.get('#createTractionPlates').trigger('click')
      expect(importFunction).toBeCalledWith({
        barcodes: ['DN1', 'DN2', 'DN3', 'DN4', 'DN5'],
        libraryType: 'Pacbio_HiFi',
        costCode: '235',
      })
    })

    it('emits the formatted output', async () => {
      const importResultion = importFunction.mockResolvedValue({ requestAttributes })
      await wrapper.setData({
        barcodes,
        libraryType: 'Pacbio_HiFi',
        costCode: '235',
      })
      await wrapper.get('#createTractionPlates').trigger('click')
      const { importStarted } = wrapper.emitted()
      expect(importStarted.length).toEqual(1)
      expect(importStarted[0][0]).toEqual({ message: 'Fetching 5 items from Sequencescape' })
      await importResultion
      const { importLoaded } = wrapper.emitted()
      expect(importLoaded.length).toEqual(1)
      expect(importLoaded[0][0]).toEqual({ requestAttributes, source })
    })

    it('emits an error if the import fails', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})
      const message = 'Async error message'
      const importResultion = importFunction.mockRejectedValue(new Error(message))

      await wrapper.setData({
        barcodes,
        libraryType: 'Pacbio_HiFi',
        costCode: '235',
      })
      await wrapper.get('#createTractionPlates').trigger('click')
      const { importStarted } = wrapper.emitted()
      expect(importStarted.length).toEqual(1)
      expect(importStarted[0][0]).toEqual({ message: 'Fetching 5 items from Sequencescape' })
      await importResultion
      const { importFailed } = wrapper.emitted()
      expect(importFailed.length).toEqual(1)
      expect(importFailed[0][0]).toEqual({ message: `Error: ${message}` })
    })
  })

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      reception.showAlert('show this message', 'danger')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
    })
  })
})
