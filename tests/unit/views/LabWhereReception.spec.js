import { mount } from '@vue/test-utils'
import LabwhereReception from '@/views/LabwhereReception.vue'
import { expect, it, describe, vi } from 'vitest'
import { scanBarcodesInLabwhereLocation } from '@/services/labwhere/client.js'

vi.mock('@/services/labwhere/client.js')

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

describe('LabWhereReception', () => {
  const buildWrapper = () => {
    return mount(LabwhereReception)
  }

  it('has a user code input field', () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('#userCode').exists()).toBe(true)
  })

  it('has a location barcode input field', () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('#locationBarcode').exists()).toBe(true)
  })

  it('has a start position input field', () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('#startPosition').exists()).toBe(true)
  })

  it('has a labware barcodes textarea', () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('#labware_barcodes').exists()).toBe(true)
  })

  it('shows error messages for empty required fields on submit', async () => {
    const wrapper = buildWrapper()
    await wrapper.find('#submit-button').trigger('submit')

    expect(wrapper.find('[data-attribute="user-code-error"]').text()).toBe('User code is required')
    expect(wrapper.find('[data-attribute="barcodes-error"]').text()).toBe(
      'Labware barcodes are required',
    )
  })

  it('only scans unique barcodes when duplicate barcodes are given', async () => {
    const wrapper = buildWrapper()
    wrapper.vm.user_code = 'user1'
    wrapper.vm.location_barcode = 'location1'
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode1'
    await wrapper.find('#submit-button').trigger('submit')
    expect(scanBarcodesInLabwhereLocation).toBeCalledWith('user1', 'location1', 'barcode1', null)
  })

  it('validates when user types in fields', async () => {
    const wrapper = buildWrapper()
    await wrapper.find('#submit-button').trigger('submit')
    expect(wrapper.vm.errors).toEqual({
      user_code: 'User code is required',
      labware_barcodes: 'Labware barcodes are required',
    })

    const barcodeInput = wrapper.find('#labware_barcodes')
    await barcodeInput.setValue('barcode1')

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.errors).toEqual({
      user_code: 'User code is required',
    })

    const [userInput] = wrapper.findAll('input')
    await userInput.setValue('user1')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.errors).not.toHaveProperty('user_code')
  })

  it('validates and submits the form successfully', async () => {
    const wrapper = buildWrapper()
    wrapper.vm.user_code = 'user123'
    wrapper.vm.location_barcode = 'location123'
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'
    scanBarcodesInLabwhereLocation.mockResolvedValue({ success: true })

    await wrapper.find('#submit-button').trigger('submit')
    expect(scanBarcodesInLabwhereLocation).toHaveBeenCalledWith(
      'user123',
      'location123',
      'barcode1\nbarcode2',
      null,
    )
    expect(mockShowAlert).toBeCalledWith('Barcodes stored successfully', 'success')
  })

  it('displays preview message when user enters values in the form', async () => {
    const wrapper = buildWrapper()
    expect(wrapper.find('[data-attribute="preview-message"]').text()).toBe(
      'No barcodes to scan to location',
    )

    wrapper.vm.location_barcode = 'location123'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-attribute="preview-message"]').text()).toBe(
      'No barcodes to scan to location location123',
    )

    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-attribute="preview-message"]').text()).toBe(
      'Scan in 2 barcode(s) to location location123',
    )

    wrapper.vm.location_barcode = ''
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-attribute="preview-message"]').text()).toBe(
      'Scan out 2 barcode(s) from their current locations',
    )
  })

  it('shows an error alert if the form submission fails', async () => {
    const wrapper = buildWrapper()

    wrapper.vm.user_code = 'user123'
    wrapper.vm.location_barcode = 'location123'
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'

    scanBarcodesInLabwhereLocation.mockResolvedValue({
      success: false,
      errors: ['Error storing barcodes'],
    })

    await wrapper.find('#submit-button').trigger('submit')

    expect(mockShowAlert).toBeCalledWith('Error storing barcodes', 'danger')
  })
})
