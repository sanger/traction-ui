import { mount } from '@vue/test-utils'
import LabWhereReception from '@/views/LabWhereReception.vue'
import { expect, it, describe, vi } from 'vitest'
import { storeBarcodesIntoLabwhereLocation } from '@/services/labwhere/client.js'
import { nextTick } from 'vue'

vi.mock('@/services/labwhere/client.js')

const mockShowAlert = vi.fn()
vi.mock('@/composables/useAlert', () => ({
  default: () => ({
    showAlert: mockShowAlert,
  }),
}))

describe('LabWhereReception', () => {
  const buildWrapper = () => {
    return mount(LabWhereReception)
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
    expect(wrapper.find('[data-attribute="location-barcode-error"]').text()).toBe(
      'Location barcode is required',
    )
    expect(wrapper.find('[data-attribute="barcodes-error"]').text()).toBe(
      'Labware barcodes are required',
    )
  })

  it('validates for duplicate labware barcodes', async () => {
    const wrapper = buildWrapper()
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode1'
    await wrapper.find('#submit-button').trigger('submit')

    expect(wrapper.find('[data-attribute="barcodes-error"]').text()).toBe(
      'Labware barcodes must be unique',
    )
  })

  it('validates when user types in fields', async () => {
    const wrapper = buildWrapper()
    await wrapper.find('#submit-button').trigger('submit')
    expect(wrapper.vm.errors).toEqual({
      user_code: 'User code is required',
      location_barcode: 'Location barcode is required',
      labware_barcodes: 'Labware barcodes are required',
    })

    const barcodeInput = wrapper.find('#labware_barcodes')
    await barcodeInput.setValue('barcode1')

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.errors).toEqual({
      user_code: 'User code is required',
      location_barcode: 'Location barcode is required',
    })

    const [userInput, locationInput] = wrapper.findAll('input')
    await userInput.setValue('user1')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.errors).not.toHaveProperty('user_code')
    expect(wrapper.vm.errors).toEqual({
      location_barcode: 'Location barcode is required',
    })

    await locationInput.setValue('location1')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.errors).toEqual({})
  })

  it('validates and submits the form successfully', async () => {
    const wrapper = buildWrapper()
    wrapper.vm.user_code = 'user123'
    wrapper.vm.location_barcode = 'location123'
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'
    storeBarcodesIntoLabwhereLocation.mockResolvedValue({ success: true })

    await wrapper.find('#submit-button').trigger('submit')
    expect(storeBarcodesIntoLabwhereLocation).toHaveBeenCalledWith(
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
      'No barcodes to store to location',
    )

    wrapper.vm.location_barcode = 'location123'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-attribute="preview-message"]').text()).toBe(
      'No barcodes to store to location location123',
    )

    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-attribute="preview-message"]').text()).toBe(
      'Store 2 barcode(s) to location location123',
    )
  })

  it('shows an error alert if the form submission fails', async () => {
    const wrapper = buildWrapper()

    wrapper.vm.user_code = 'user123'
    wrapper.vm.location_barcode = 'location123'
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'

    storeBarcodesIntoLabwhereLocation.mockResolvedValue({
      success: false,
      errors: ['Error storing barcodes'],
    })

    await wrapper.find('#submit-button').trigger('submit')

    expect(mockShowAlert).toBeCalledWith('Error storing barcodes', 'danger')
  })

  it('resets the form fields and errors on reset', async () => {
    const wrapper = buildWrapper()
    wrapper.vm.user_code = 'user123'
    wrapper.vm.location_barcode = 'location123'
    wrapper.vm.labware_barcodes = 'barcode1\nbarcode2'

    await wrapper.find('#reset-button').trigger('reset')
    await nextTick()

    expect(wrapper.find('#userCode').element.value).toBe('')
    expect(wrapper.find('#locationBarcode').element.value).toBe('')
    expect(wrapper.find('#labware_barcodes').element.value).toBe('')
    expect(wrapper.vm.errors).toStrictEqual({})
  })
})
